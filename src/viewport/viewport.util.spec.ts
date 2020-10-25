import {
	isViewportConditionMatch,
	generateViewportSizeTypeInfoList,
	generateViewportSizeTypeInfoRefs
} from "./viewport.util";
import { ComparisonOperation } from "./viewport.model";

const viewportSizeTypeInfoList = generateViewportSizeTypeInfoList({
	xsmall: 450,
	small: 767,
	medium: 992,
	large: 1200,
	xlarge: 1500,
	xxlarge: 1920,
	xxlarge1: 2100
});

const viewportSizeTypeInfoRefs = generateViewportSizeTypeInfoRefs(viewportSizeTypeInfoList);

describe("Viewport utils", () => {

	describe("isViewportConditionMatch", () => {

		describe("given only size include is used", () => {

			describe("when single matching value is passed", () => {
				const sizeType = "small";
				const viewportRef = viewportSizeTypeInfoRefs[sizeType];
				const result = isViewportConditionMatch(viewportRef, { sizeType }, viewportSizeTypeInfoRefs);

				it("should return true", () => {
					expect(result).toBe(true);
				});
			});

			describe("when single not matching value is passed", () => {
				const viewportRef = viewportSizeTypeInfoRefs.small;
				const result = isViewportConditionMatch(viewportRef, { sizeType: "xsmall" }, viewportSizeTypeInfoRefs);

				it("should return false", () => {
					expect(result).toBe(false);
				});
			});

			describe("when multi values are passed with a matching value", () => {
				const viewportRef = viewportSizeTypeInfoRefs.small;
				const result = isViewportConditionMatch(viewportRef, {
					sizeType: ["small", "medium"]
				}, viewportSizeTypeInfoRefs);

				it("should return true", () => {
					expect(result).toBe(true);
				});
			});

			describe("when multi values are passed with a non matching value", () => {
				const viewportRef = viewportSizeTypeInfoRefs.large;
				const result = isViewportConditionMatch(viewportRef, {
					sizeType: ["small", "medium"]
				}, viewportSizeTypeInfoRefs);

				it("should return false", () => {
					expect(result).toBe(false);
				});
			});
		});

		describe("given expression tuple is used", () => {
			describe("when different expressions are passed", () => {
				const viewportRefXSmall = viewportSizeTypeInfoRefs.xsmall;
				const viewportRefSmall = viewportSizeTypeInfoRefs.small;
				const viewportRefMedium = viewportSizeTypeInfoRefs.medium;

				it("should match", () => {
					const dataSet = [
						{
							size: viewportRefSmall,
							expression: { operation: ComparisonOperation.equals, size: "small" },
							expectedResult: true
						},
						{
							size: viewportRefXSmall,
							expression: { operation: ComparisonOperation.notEquals, size: "small" },
							expectedResult: true
						},
						{
							size: viewportRefSmall,
							expression: { operation: ComparisonOperation.notEquals, size: "small" },
							expectedResult: false
						},
						{
							size: viewportRefSmall,
							expression: { operation: ComparisonOperation.lessThan, size: "medium" },
							expectedResult: true
						},
						{
							size: viewportRefMedium,
							expression: { operation: ComparisonOperation.lessThan, size: "medium" },
							expectedResult: false
						},
						{
							size: viewportRefMedium,
							expression: { operation: ComparisonOperation.lessOrEqualThan, size: "medium" },
							expectedResult: true
						},
					];

					for (const data of dataSet) {
						const result = isViewportConditionMatch(data.size, {
							expresson: data.expression
						}, viewportSizeTypeInfoRefs);
						expect(result).toBe(data.expectedResult);
					}
				});

			});
		});

	});

});
