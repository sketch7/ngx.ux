import { Dictionary } from "../../internal/internal.model";
import { ViewportSizeTypeInfo } from "../viewport.model";

export interface ViewportDataConfig<T = unknown> extends Dictionary<T> {
	default: T;
}

export enum ViewportDataResolveStrategy {
	match,
}

export function resolveViewportData<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	strategy: ViewportDataResolveStrategy,
): T {
	const resolveFn = resolveStrategyHandlerMap[strategy];
	if(!resolveFn) {
		throw Error(`Viewport Data strategy not implemented. Strategy: '${strategy}'`);
	}
	return resolveFn(dataConfig, currentSizeType);
}

const resolveStrategyHandlerMap = {
	[ViewportDataResolveStrategy.match]: resolveWithExactMatch,
};

function resolveWithExactMatch<T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
): T {
	const data = dataConfig[currentSizeType.name];
	if (data !== undefined) {
		return data;
	}
	return dataConfig.default;
}
