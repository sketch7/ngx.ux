import { Dictionary } from "../../internal/internal.model";
import { ViewportSizeTypeInfo } from "../viewport.model";
import { ViewportDataConfig, ViewportDataMatchStrategy } from "./viewport-data-matcher";

export interface ViewportDataRule<T> {
	min?: number;
	max?: number;
	value: T;
}

export function generateViewportRulesRangeFromDataMatcher<T>(
	dataConfig: ViewportDataConfig<T>,
	strategy: ViewportDataMatchStrategy,
	sizeTypes: ViewportSizeTypeInfo[],
	sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): ViewportDataRule<T>[] {
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

		if (strategy === ViewportDataMatchStrategy.smaller) {
			if (nextDataSize) {
				rule.max = dataSize.widthThreshold;
			}
			if (prevDataSize) {
				rule.min = prevDataSize.widthThreshold + 1;
			}
		} else if (strategy === ViewportDataMatchStrategy.larger) {
			if (nextDataSize) {
				rule.max = dataSize.widthThreshold;
			}
			if (prevDataSize) {
				rule.min = prevDataSize.widthThreshold + 1;
			} else if (prevSize) {
				rule.min = prevSize.widthThreshold;
			}
		} else if (strategy === ViewportDataMatchStrategy.closestSmallerFirst) {
			if (nextDataSize) {
				// get closest between curr and next (smaller preferred)
				const diffIndex = Math.ceil((nextDataSize.type - dataSize.type - 1) / 2);
				const diffNextSize = sizeTypes[dataSize.type + diffIndex];
				rule.max = (diffNextSize || dataSize).widthThreshold;
			}
			if (prevRule?.max) {
				rule.min = prevRule.max + 1;
			} else if (prevDataSize) {
				// rule.min = prevDataSize.widthThreshold + 1;
			}
		}
		// todo: handle strategies
		prevRule = rule;
		rules.push(rule);
	}
	return rules;
}
