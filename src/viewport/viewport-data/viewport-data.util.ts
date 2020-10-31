import { Dictionary } from "../../internal/internal.model";
import { ViewportSizeTypeInfo } from "../viewport.model";

export interface ViewportDataMatcher<T = unknown> {
	(
		dataConfig: ViewportDataConfig<T>,
		currentSizeType: ViewportSizeTypeInfo,
		sizeTypes: ViewportSizeTypeInfo[],
		sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
	): T | undefined;
}

export interface ViewportDataConfig<T = unknown> extends Dictionary<T> {
	default: T;
}

export enum ViewportDataResolveStrategy {
	/** Indicates that size should match only or default. */
	match,

	/** Indicates that size should match, or larger (up) else default. */
	larger,

	/** Indicates that size should match, or smaller (down) else default. */
	smaller,
}

export function resolveViewportData<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	strategy: ViewportDataResolveStrategy,
	sizeTypes: ViewportSizeTypeInfo[],
	sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): T {
	const resolveFn = resolveStrategyHandlerMap[strategy];
	if (!resolveFn) {
		throw Error(`Viewport Data strategy not implemented. Strategy: '${strategy}'`);
	}
	const data = resolveFn(dataConfig, currentSizeType, sizeTypes, sizeTypeMap) as T;
	if (data !== undefined) {
		return data;
	}
	return dataConfig.default;
}


const resolveStrategyHandlerMap: Dictionary<ViewportDataMatcher> = {
	[ViewportDataResolveStrategy.match]: resolveWithExactMatch,
	[ViewportDataResolveStrategy.larger]: resolveWithLargerMatch,
	[ViewportDataResolveStrategy.smaller]: resolveWithSmallerMatch,
};

function resolveWithExactMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
): T | undefined {
	return dataConfig[currentSizeType.name];
}

function resolveWithLargerMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	sizeTypes: ViewportSizeTypeInfo[],
	sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): T | undefined {
	let data = dataConfig[currentSizeType.name];
	if (data !== undefined) {
		return data;
	}

	const largestTypeIdx = sizeTypes[sizeTypes.length - 1].type;
	if (currentSizeType.type >= largestTypeIdx) {
		return undefined;
	}

	let sizeTypeIdx = currentSizeType.type;
	for (const key in dataConfig) { // iterate only data provided
		if (Object.prototype.hasOwnProperty.call(dataConfig, key)) {
			sizeTypeIdx++;
			const sizeType = sizeTypeMap[sizeTypeIdx];
			if (!sizeType) { // exceeded largest
				return undefined;
			}

			data = dataConfig[sizeType.name];
			if (data !== undefined) { // first match found
				return data;
			}
		}
	}
	return undefined;
}

function resolveWithSmallerMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	_sizeTypes: ViewportSizeTypeInfo[],
	sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): T | undefined {
	let data = dataConfig[currentSizeType.name];
	if (data !== undefined) {
		return data;
	}

	if (currentSizeType.type <= 0) {
		return undefined;
	}

	let sizeTypeIdx = currentSizeType.type;
	for (const key in dataConfig) { // iterate only data provided
		if (Object.prototype.hasOwnProperty.call(dataConfig, key)) {
			sizeTypeIdx--;
			const sizeType = sizeTypeMap[sizeTypeIdx];
			if (!sizeType) { // exceeded largest
				return undefined;
			}

			data = dataConfig[sizeType.name];
			if (data !== undefined) { // first match found
				return data;
			}
		}
	}
	return undefined;
}
