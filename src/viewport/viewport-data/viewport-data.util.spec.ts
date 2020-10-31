import _ from "lodash";
import { generateViewportSizeTypeInfoList, generateViewportSizeTypeInfoRefs, } from "../viewport.util";
import {
	ViewportDataConfig, resolveViewportData as resolveViewportData_, ViewportDataResolveStrategy
} from "./viewport-data.util";
import { ViewportSizeTypeInfo } from "../viewport.model";

const breakpoints = {
	xsmall: 450,
	small: 767,
	medium: 992,
	large: 1200,
	hd: 1280,
	fullHd: 1920,
};
const sizeTypes = generateViewportSizeTypeInfoList(breakpoints);
const sizeRefs = generateViewportSizeTypeInfoRefs(sizeTypes);

const resolveViewportData = <T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	strategy: ViewportDataResolveStrategy,
) => resolveViewportData_<T>(dataConfig, currentSizeType, strategy);

describe("Viewport utils", () => {

	describe("resolveViewportData", () => {

		describe("given strategy is exact", () => {
			const dataConfig: ViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20
			};

			describe("when type value exists", () => {
				const result = resolveViewportData(dataConfig, sizeRefs.small, ViewportDataResolveStrategy.match);

				it("should return matching value", () => {
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when type value does not exists", () => {
				const result = resolveViewportData(dataConfig, sizeRefs.hd, ViewportDataResolveStrategy.match);

				it("should return default", () => {
					expect(result).toBe(dataConfig.default);
				});
			});

			// 	describe("when different scenarios are set", () => {

			// 		it("should match", () => {
			// 			const dataSet = [
			// 				{
			// 					size: sizeRefs.small,
			// 					data: dataConfig,
			// 					expectedResult: dataConfig.small,
			// 				},
			// 				// {
			// 				// 	size: sizeRefs.xsmall,
			// 				// 	expression: { operation: ComparisonOperation.notEquals, size: "small" },
			// 				// 	expectedResult: true
			// 				// },
			// 				// {
			// 				// 	size: sizeRefs.small,
			// 				// 	expression: { operation: ComparisonOperation.notEquals, size: "small" },
			// 				// 	expectedResult: false
			// 				// },
			// 				// {
			// 				// 	size: sizeRefs.small,
			// 				// 	expression: { operation: ComparisonOperation.lessThan, size: "medium" },
			// 				// 	expectedResult: true
			// 				// },
			// 				// {
			// 				// 	size: sizeRefs.medium,
			// 				// 	expression: { operation: ComparisonOperation.lessThan, size: "medium" },
			// 				// 	expectedResult: false
			// 				// },
			// 				// {
			// 				// 	size: sizeRefs.medium,
			// 				// 	expression: { operation: ComparisonOperation.lessOrEqualThan, size: "medium" },
			// 				// 	expectedResult: true
			// 				// },
			// 			];

			// 			for (const data of dataSet) {
			// 				const result = resolveViewportData(data.data, data.size, ViewportDataResolveStrategy.match);
			// 				expect(result).toBe(data.expectedResult);
			// 			}
			// 		});

			// 	});
			// });
		});


	});


});
