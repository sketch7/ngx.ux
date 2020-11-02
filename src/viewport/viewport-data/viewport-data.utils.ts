import { Dictionary } from "../../internal/internal.model";
import { ViewportSizeTypeInfo } from "../viewport.model";
import { ViewportDataConfig, ViewportDataMatchStrategy } from "./viewport-data-matcher";

export interface ViewportDataRule<T> {
	min?: number;
	max?: number;
	value: T;
}

export function generateViewportRulesRangeFromDataMatcher<T>(
	_dataConfig: ViewportDataConfig<T>,
	_strategy: ViewportDataMatchStrategy,
	_sizeTypes: ViewportSizeTypeInfo[],
	_sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): ViewportDataRule<T>[] {
	throw Error("Not implemented");

	// convert dataConfig to array (order by size)
	// iterate and generate min/max (per strategy)
}
