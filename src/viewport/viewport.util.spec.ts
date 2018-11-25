import { isViewportConditionMatch } from "./viewport.util";
import { ViewportSizeType, ViewportSizeTypeInfo, ComparisonOperation, } from "./viewport.model";

export const sizeRefs = {
	xsmall: Object.freeze({
		name: "xsmall",
		type: ViewportSizeType.xsmall,
		widthThreshold: 450,
	} as ViewportSizeTypeInfo),
	small: Object.freeze({
		name: "small",
		type: ViewportSizeType.small,
		widthThreshold: 767,
	} as ViewportSizeTypeInfo),
	medium: Object.freeze({
		name: "medium",
		type: ViewportSizeType.medium,
		widthThreshold: 992,
	} as ViewportSizeTypeInfo),
	large: Object.freeze({
		name: "large",
		type: ViewportSizeType.large,
		widthThreshold: 1200,
	} as ViewportSizeTypeInfo),
};


describe("Viewport utils", () => {

	describe("isViewportConditionMatch", () => {

		describe("given only size include is used", () => {

			describe("when single matching value is passed", () => {
				const result = isViewportConditionMatch(sizeRefs.small, {
					sizeType: "small"
				});

				it("should return true", () => {
					expect(result).toBe(true);
				});
			});

			describe("when single not matching value is passed", () => {
				const result = isViewportConditionMatch(sizeRefs.small, {
					sizeType: "xsmall"
				});

				it("should return false", () => {
					expect(result).toBe(false);
				});
			});

			describe("when multi values are passed with a matching value", () => {
				const result = isViewportConditionMatch(sizeRefs.small, {
					sizeType: ["small", "medium"]
				});
				it("should return true", () => {
					expect(result).toBe(true);
				});
			});

			describe("when multi values are passed with a non matching value", () => {
				const result = isViewportConditionMatch(sizeRefs.large, {
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
							size: sizeRefs.small,
							expression: { operation: ComparisonOperation.equals, size: "small" },
							expectedResult: true
						},
						{
							size: sizeRefs.xsmall,
							expression: { operation: ComparisonOperation.notEquals, size: "small" },
							expectedResult: true
						},
						{
							size: sizeRefs.small,
							expression: { operation: ComparisonOperation.notEquals, size: "small" },
							expectedResult: false
						},
						{
							size: sizeRefs.small,
							expression: { operation: ComparisonOperation.lessThan, size: "medium" },
							expectedResult: true
						},
						{
							size: sizeRefs.medium,
							expression: { operation: ComparisonOperation.lessThan, size: "medium" },
							expectedResult: false
						},
						{
							size: sizeRefs.medium,
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
