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
	_strategy: ViewportDataMatchStrategy,
	_sizeTypes: ViewportSizeTypeInfo[],
	sizeTypeMap: Dictionary<ViewportSizeTypeInfo>,
): ViewportDataRule<T>[] {
	let dataSizes: ViewportSizeTypeInfo[] = [];
	for (const key in dataConfig) {
		if (Object.prototype.hasOwnProperty.call(dataConfig, key)) {
			const size = sizeTypeMap[key];
			if (size) {
				dataSizes.push(size);
			}
		}
	}
	dataSizes = dataSizes.sort(({ type: typeA }, { type: typeB }) => typeA - typeB);

	const rules: ViewportDataRule<T>[] = [];
	if (dataConfig.default) {
		rules.push({ value: dataConfig.default });
	}
	for (const size of dataSizes) {
		const data = dataConfig[size.name];
		const rule: ViewportDataRule<T> = {
			value: data
		};

		// todo: handle strategies
		// get previous + get next sizes + sizeTypes to calculate min/max

		rules.push(rule);
	}
	return rules;
}
