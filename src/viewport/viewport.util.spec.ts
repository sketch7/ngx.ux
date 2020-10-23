import { isViewportConditionMatch, generateViewportDictionary } from "./viewport.util";
import { ViewportSizeType, ViewportSizeTypeInfo, ComparisonOperation, } from "./viewport.model";

export const sizeRefs = generateViewportDictionary({
	xsmall: 450,
	small: 767,
	medium: 992,
	large: 1200,
	xlarge: 1500,
	xxlarge: 1920,
	xxlarge1: 2100
});

describe("Viewport utils", () => {

	describe("isViewportConditionMatch", () => {

		describe("given only size include is used", () => {

			describe("when single matching value is passed", () => {
				const result = isViewportConditionMatch(sizeRefs[ViewportSizeType.small], {
					sizeType: "small"
				});

				it("should return true", () => {
					expect(result).toBe(true);
				});
			});

			describe("when single not matching value is passed", () => {
				const result = isViewportConditionMatch(sizeRefs[ViewportSizeType.small], {
					sizeType: "xsmall"
				});

				it("should return false", () => {
					expect(result).toBe(false);
				});
			});

			describe("when multi values are passed with a matching value", () => {
				const result = isViewportConditionMatch(sizeRefs[ViewportSizeType.small], {
					sizeType: ["small", "medium"]
				});
				it("should return true", () => {
					expect(result).toBe(true);
				});
			});

			describe("when multi values are passed with a non matching value", () => {
				const result = isViewportConditionMatch(sizeRefs[ViewportSizeType.large], {
					sizeType: ["small", "medium"]
				});
				it("should return false", () => {
					expect(result).toBe(false);
				});
			});
		});

		describe("given expression tuple is used", () => {
			describe("when different expressions are passed", () => {

				it("should match", () => {
					const dataSet = [
						{
							size: sizeRefs[ViewportSizeType.small],
							expression: { operation: ComparisonOperation.equals, size: "small" },
							expectedResult: true
						},
						{
							size: sizeRefs[ViewportSizeType.xsmall],
							expression: { operation: ComparisonOperation.notEquals, size: "small" },
							expectedResult: true
						},
						{
							size: sizeRefs[ViewportSizeType.small],
							expression: { operation: ComparisonOperation.notEquals, size: "small" },
							expectedResult: false
						},
						{
							size: sizeRefs[ViewportSizeType.small],
							expression: { operation: ComparisonOperation.lessThan, size: "medium" },
							expectedResult: true
						},
						{
							size: sizeRefs[ViewportSizeType.medium],
							expression: { operation: ComparisonOperation.lessThan, size: "medium" },
							expectedResult: false
						},
						{
							size: sizeRefs[ViewportSizeType.medium],
							expression: { operation: ComparisonOperation.lessOrEqualThan, size: "medium" },
							expectedResult: true
						},
					];

					for (const data of dataSet) {
						const result = isViewportConditionMatch(data.size, {
							expresson: data.expression
						});
						expect(result).toBe(data.expectedResult);
					}
				});

			});
		});

	});

});
