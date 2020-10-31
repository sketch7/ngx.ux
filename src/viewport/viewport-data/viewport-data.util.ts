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

export type ViewportDataConfig<TValue = unknown, TData = Dictionary<TValue>> = TData & {
	default?: TValue
};

export enum ViewportDataResolveStrategy {
	/** Indicates that size should match only or default. */
	match,

	/** Indicates that size matches when exact match, first match larger (up) or default. */
	larger,

	/** Indicates that size matches when exact match, first match smaller (down) or default. */
	smaller,

	/** Indicates that size matches when exact match, or it tries both smaller/larger (smaller is preferred) until match or default. */
	closestSmallerFirst,

	/** Indicates that size matches when exact match, or it tries both larger/smaller (larger is preferred) until match or default. */
	closestLargerFirst,
}

export function resolveViewportData<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	strategy: ViewportDataResolveStrategy,
	sizeTypes: ViewportSizeTypeInfo[],
	sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): T | undefined {
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
	[ViewportDataResolveStrategy.closestSmallerFirst]: resolveWithClosestSmallerFirstMatch,
	[ViewportDataResolveStrategy.closestLargerFirst]: resolveWithClosestLargerFirstMatch,
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

function resolveWithSmallerMatch<T>(
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

function resolveWithClosestSmallerFirstMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	sizeTypes: ViewportSizeTypeInfo[],
): T | undefined {
	return closestMatch(dataConfig, currentSizeType, sizeTypes, true);
}

function resolveWithClosestLargerFirstMatch<T>(
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
