import {
	isViewportConditionMatch,
	generateViewportSizeTypeInfoList,
	generateViewportSizeTypeInfoRefs,
	generateViewportSizeType,
} from "./viewport.util";
import { ComparisonOperation } from "./viewport.model";

const breakpoints = {
	xsmall: 450,
	small: 767,
	medium: 992,
	fullhd: 1920,
	large: 1200,
};
const viewportSizeTypeInfoList = generateViewportSizeTypeInfoList(breakpoints);
const viewportSizeTypeInfoRefs = generateViewportSizeTypeInfoRefs(viewportSizeTypeInfoList);

describe("Viewport utils", () => {

	describe("generateViewportSizeType", () => {
		describe("given custom breakpoints are used", () => {
			const result = generateViewportSizeType(breakpoints);

			it("should match the expected key/value pair ", () => {
				expect(result).toEqual(jasmine.objectContaining({
					xsmall: 0,
					small: 1,
					medium: 2,
					large: 3,
					fullhd: 4,
				}));
			});
		});
	});

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

				it("should match", () => {
					const dataSet = [
						{
							size: viewportSizeTypeInfoRefs.small,
							expression: { operation: ComparisonOperation.equals, size: "small" },
							expectedResult: true
						},
						{
							size: viewportSizeTypeInfoRefs.xsmall,
							expression: { operation: ComparisonOperation.notEquals, size: "small" },
							expectedResult: true
						},
						{
							size: viewportSizeTypeInfoRefs.small,
							expression: { operation: ComparisonOperation.notEquals, size: "small" },
							expectedResult: false
						},
						{
							size: viewportSizeTypeInfoRefs.small,
							expression: { operation: ComparisonOperation.lessThan, size: "medium" },
							expectedResult: true
						},
						{
							size: viewportSizeTypeInfoRefs.medium,
							expression: { operation: ComparisonOperation.lessThan, size: "medium" },
							expectedResult: false
						},
						{
							size: viewportSizeTypeInfoRefs.medium,
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
