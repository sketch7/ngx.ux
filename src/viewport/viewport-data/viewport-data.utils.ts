import { Dictionary } from "../../internal/internal.model";
import { ViewportSizeTypeInfo } from "../viewport.model";
import { ViewportDataConfig, ViewportDataMatchStrategy } from "./viewport-data-matcher";

export interface ViewportDataRule<T> {
	min?: number;
	max?: number;
	value: T;
}

/**
 * Utility function to generate rules based on strategies.
 *
 * @param dataConfig Data config to generate rules based on.
 * @param strategy Strategy to use when building rules.
 * @param sizeTypes Available size types ordered by index type. (Can be obtained from `ViewportService`)
 * @param sizeTypeMap Available size type map. (Can be obtained from `ViewportService`)
 * @returns Returns a collection of rules (ordered).
 */
export function generateViewportRulesRangeFromDataMatcher<T>(
	dataConfig: ViewportDataConfig<T>,
	strategy: ViewportDataMatchStrategy,
	sizeTypes: ViewportSizeTypeInfo[],
	sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): ViewportDataRule<T>[] {
	const ruleBuilderFn = matchStrategyHandlerMap[strategy];
	if (!ruleBuilderFn) {
		throw Error(`generateViewportRulesRangeFromDataMatcher: Viewport Data strategy not implemented. Strategy: '${strategy}'`);
	}

	let dataSizes: ViewportSizeTypeInfo[] = [];
	for (const key in dataConfig) {
		if (Object.prototype.hasOwnProperty.call(dataConfig, key)) {
			const data = dataConfig[key];
			if (data === undefined) {
				continue;
			}
			const size = sizeTypeMap[key];
			if (size) {
				dataSizes.push(size);
			}
		}
	}
	dataSizes = dataSizes.sort(({ type: typeA }, { type: typeB }) => typeA - typeB);

	const rules: ViewportDataRule<T>[] = [];
	if (dataConfig.default) {
		rules.push({ value: dataConfig.default, min: undefined, max: undefined });
	}

	let prevRule: ViewportDataRule<T> | undefined;
	for (let index = 0; index < dataSizes.length; index++) {
		const prevDataSize = dataSizes[index - 1];
		const nextDataSize = dataSizes[index + 1];
		const dataSize = dataSizes[index];
		const prevSize = sizeTypes[dataSize.type - 1];
		// const nextSize = sizeTypes[dataSize.type + 1];
		const data = dataConfig[dataSize.name];
		const rule: ViewportDataRule<T> = {
			value: data,
			min: undefined,
			max: undefined,
		};

		ruleBuilderFn(rule, dataSize, nextDataSize, prevDataSize, prevSize, prevRule, sizeTypes);

		prevRule = rule;
		rules.push(rule);
	}
	return rules;
}

export interface ViewportRuleRangeBuilder<T = unknown> {
	(
		rule: ViewportDataRule<T>,
		dataSize: ViewportSizeTypeInfo,
		nextDataSize: ViewportSizeTypeInfo | undefined,
		prevDataSize: ViewportSizeTypeInfo | undefined,
		prevSize: ViewportSizeTypeInfo | undefined,
		prevRule: ViewportDataRule<T> | undefined,
		sizeTypes: ViewportSizeTypeInfo[],
	): void;
}

const matchStrategyHandlerMap: Dictionary<ViewportRuleRangeBuilder> = {
	[ViewportDataMatchStrategy.exact]: (rule, dataSize, _nextDataSize, _prevDataSize, prevSize) => {
		rule.max = dataSize.widthThreshold;
		if (prevSize) {
			rule.min = prevSize.widthThreshold + 1;
		}
	},
	[ViewportDataMatchStrategy.smaller]: (rule, dataSize, nextDataSize, _prevDataSize, prevSize) => {
		if (nextDataSize) {
			rule.max = dataSize.widthThreshold;
		}
		if (prevSize) {
			rule.min = prevSize.widthThreshold + 1;
		}
	},
	[ViewportDataMatchStrategy.larger]: (rule, dataSize, _nextDataSize, prevDataSize) => {
		if (dataSize) {
			rule.max = dataSize.widthThreshold;
		}
		if (prevDataSize) {
			rule.min = prevDataSize.widthThreshold + 1;
		}
	},
	[ViewportDataMatchStrategy.closestSmallerFirst]: (rule, dataSize, nextDataSize, _prevDataSize, _prevSize, prevRule, sizeTypes) => {
		if (nextDataSize) {
			rule.max = calculateClosestWidthThreshold(nextDataSize, dataSize, sizeTypes, true);
		}
		if (prevRule?.max) {
			rule.min = prevRule.max + 1;
		}
	},
	[ViewportDataMatchStrategy.closestLargerFirst]: (rule, dataSize, nextDataSize, _prevDataSize, _prevSize, prevRule, sizeTypes) => {
		if (nextDataSize) {
			rule.max = calculateClosestWidthThreshold(nextDataSize, dataSize, sizeTypes, false);
		}
		if (prevRule?.max) {
			rule.min = prevRule.max + 1;
		}
	},
};

function calculateClosestWidthThreshold(
	nextDataSize: ViewportSizeTypeInfo,
	dataSize: ViewportSizeTypeInfo,
	sizeTypes: ViewportSizeTypeInfo[],
	isSmallerPreferred: boolean,
) {
	const fn = isSmallerPreferred ? Math.ceil : Math.floor;
	// get closest between curr and next
	const diffIndex = fn((nextDataSize.type - dataSize.type - 1) / 2);
	const diffNextSize = sizeTypes[dataSize.type + diffIndex];
	return (diffNextSize || dataSize).widthThreshold;
}
