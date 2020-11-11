import { Dictionary } from "../../internal/internal.model";
import { ViewportSizeTypeInfo } from "../viewport.model";

export type ViewportDataConfig<TValue = unknown, TData = Dictionary<TValue>> = TData & {
	default?: TValue
};

export enum ViewportDataMatchStrategy {
	/** Indicates that size should match exact or default. */
	exact,

	/** Indicates that size matches when exact match, first match smaller (down) or default. */
	smaller,

	/** Indicates that size matches when exact match, first match larger (up) or default. */
	larger,

	/** Indicates that size matches when exact match, or it tries both smaller/larger (smaller is preferred) until match or default. */
	closestSmallerFirst,

	/** Indicates that size matches when exact match, or it tries both larger/smaller (larger is preferred) until match or default. */
	closestLargerFirst,
}
export type ViewportDataMatchStrategyLiteral = keyof typeof ViewportDataMatchStrategy;

export interface ViewportDataMatcher<T = unknown> {
	(
		dataConfig: ViewportDataConfig<T>,
		currentSizeType: ViewportSizeTypeInfo,
		sizeTypes: ViewportSizeTypeInfo[],
		sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
	): T | undefined;
}

/**
 * Utility function to match data based on strategy and size.
 *
 * @param dataConfig Data config to generate rules based on.
 * @param sizeType Size type to get data for.
 * @param strategy Strategy to use when building rules.
 * @param sizeTypes Available size types ordered by index type. (Can be obtained from `ViewportService`)
 * @param sizeTypeMap Available size type map. (Can be obtained from `ViewportService`)
 * @returns Returns the matched data value.
 */
export function matchViewportData<T>(
	dataConfig: ViewportDataConfig<T>,
	sizeType: ViewportSizeTypeInfo,
	strategy: ViewportDataMatchStrategy,
	sizeTypes: ViewportSizeTypeInfo[],
	sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): T | undefined {
	const matchFn = matchStrategyHandlerMap[strategy];
	if (!matchFn) {
		throw Error(`matchViewportData: Viewport Data strategy not implemented. Strategy: '${strategy}'`);
	}
	const data = matchFn(dataConfig, sizeType, sizeTypes, sizeTypeMap) as T;
	if (data !== undefined) {
		return data;
	}
	return dataConfig.default;
}


const matchStrategyHandlerMap: Dictionary<ViewportDataMatcher> = {
	[ViewportDataMatchStrategy.exact]: matchWithExact,
	[ViewportDataMatchStrategy.larger]: matchWithLargerMatch,
	[ViewportDataMatchStrategy.smaller]: matchWithSmallerMatch,
	[ViewportDataMatchStrategy.closestSmallerFirst]: matchWithClosestSmallerFirstMatch,
	[ViewportDataMatchStrategy.closestLargerFirst]: matchWithClosestLargerFirstMatch,
};

function matchWithExact<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
): T | undefined {
	return dataConfig[currentSizeType.name];
}

function matchWithLargerMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	sizeTypes: ViewportSizeTypeInfo[],
): T | undefined {
	let data = dataConfig[currentSizeType.name];
	if (data !== undefined) {
		return data;
	}

	const largestTypeIdx = sizeTypes[sizeTypes.length - 1].type;
	if (currentSizeType.type >= largestTypeIdx) {
		return undefined;
	}

	for (let index = currentSizeType.type; index < sizeTypes.length; index++) {
		const sizeType = sizeTypes[index];
		data = dataConfig[sizeType.name];
		if (data !== undefined) {
			return data;
		}
	}

	return undefined;
}

function matchWithSmallerMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	sizeTypes: ViewportSizeTypeInfo[],
): T | undefined {
	let data = dataConfig[currentSizeType.name];
	if (data !== undefined) {
		return data;
	}

	if (currentSizeType.type <= 0) {
		return undefined;
	}

	// eslint-disable-next-line for-direction
	for (let index = currentSizeType.type; index < sizeTypes.length; index--) {
		const sizeType = sizeTypes[index];
		data = dataConfig[sizeType.name];
		if (data !== undefined) {
			return data;
		}
	}

	return undefined;
}

function matchWithClosestSmallerFirstMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	sizeTypes: ViewportSizeTypeInfo[],
): T | undefined {
	return closestMatch(dataConfig, currentSizeType, sizeTypes, true);
}

function matchWithClosestLargerFirstMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	sizeTypes: ViewportSizeTypeInfo[],
): T | undefined {
	return closestMatch(dataConfig, currentSizeType, sizeTypes, false);
}

function closestMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	sizeTypes: ViewportSizeTypeInfo[],
	isSmallerFirst: boolean
): T | undefined {
	let data = dataConfig[currentSizeType.name];
	if (data !== undefined) {
		return data;
	}

	let downIndex = currentSizeType.type;
	let upIndex = currentSizeType.type;

	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let index = 0; index < sizeTypes.length; index++) {
		for (const idx of isSmallerFirst ? [--downIndex, ++upIndex] : [++upIndex, --downIndex]) {
			const sizeType = sizeTypes[idx];
			if (sizeType) {
				data = dataConfig[sizeType.name];
				if (data !== undefined) {
					return data;
				}
			}
		}
	}

	return undefined;
}
