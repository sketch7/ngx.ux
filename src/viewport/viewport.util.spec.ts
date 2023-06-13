import _ from "lodash";

import { EnumDictionary } from "../internal/internal.model";
import {
	isViewportConditionMatch as isViewportConditionMatch_,
	generateViewportSizeTypeInfoList,
	generateViewportSizeTypeInfoRefs,
	generateViewportSizeType,
	getSizeTypeInfo,
} from "./viewport.util";
import { ComparisonOperation, ViewportMatchConditions, ViewportSizeType, ViewportSizeTypeInfo } from "./viewport.model";
import { UX_VIEWPORT_DEFAULT_BREAKPOINTS } from "./viewport.const";

export enum TestViewportSizeType {
	xsmall = 0,
	small = 1,
	medium = 2,
	large = 3,
	hd = 4,
	fullHd = 5,
}

const breakpoints: EnumDictionary<keyof typeof TestViewportSizeType, number> = {
	xsmall: 450,
	small: 767,
	medium: 992,
	large: 1200,
	hd: 1280,
	fullHd: 1920,
};
const sizeTypes = generateViewportSizeTypeInfoList(breakpoints);
const sizeRefs = generateViewportSizeTypeInfoRefs(sizeTypes) as EnumDictionary<keyof typeof TestViewportSizeType, ViewportSizeTypeInfo>;

const isViewportConditionMatch = (
	evaluateSize: ViewportSizeTypeInfo,
	conditions: ViewportMatchConditions
) => isViewportConditionMatch_(evaluateSize, conditions, sizeRefs);

describe("Viewport utils", () => {

	describe("given default breakpoints", () => {

		it("should match ViewportSizeType definition", () => {
			const result = _.reduce(UX_VIEWPORT_DEFAULT_BREAKPOINTS, (r, _value, key) => {
				const idx = ViewportSizeType[key as unknown as ViewportSizeType];

				expect(idx).not.toBeUndefined();
				r.push(idx);
				return r;
			}, [] as string[]);

			const viewportSizeTypeItems = Object.keys(ViewportSizeType).filter(v => isNaN(+v));
			expect(viewportSizeTypeItems.length).toBe(result.length);
		});

	});


	describe("generateViewportSizeType", () => {

		describe("given custom breakpoints are used", () => {
			const result = generateViewportSizeType(breakpoints);

			it("should match the expected key/value pair", () => {
				expect(result).toEqual(({
					0: "xsmall",
					1: "small",
					2: "medium",
					3: "large",
					4: "hd",
					5: "fullHd",
					xsmall: 0,
					small: 1,
					medium: 2,
					large: 3,
					hd: 4,
					fullHd: 5,
				}));
			});
		});

	});


	describe("generateViewportSizeTypeInfoList", () => {

		describe("given custom breakpoints are used", () => {
			const result = generateViewportSizeTypeInfoList(breakpoints);

			it("should match", () => {
				expect(result).toEqual([
					{ name: "xsmall", type: 0, widthThreshold: 450 },
					{ name: "small", type: 1, widthThreshold: 767 },
					{ name: "medium", type: 2, widthThreshold: 992 },
					{ name: "large", type: 3, widthThreshold: 1200 },
					{ name: "hd", type: 4, widthThreshold: 1280 },
					{ name: "fullHd", type: 5, widthThreshold: 1920 }
				]);
			});
		});

	});


	describe("generateViewportSizeTypeInfoRefs", () => {

		describe("given custom breakpoints are used", () => {
			const sizes = generateViewportSizeTypeInfoList(breakpoints);
			const result = generateViewportSizeTypeInfoRefs(sizes);

			it("should match", () => {
				expect(result).toEqual(
					{
						xsmall: { name: "xsmall", type: 0, widthThreshold: 450 },
						small: { name: "small", type: 1, widthThreshold: 767 },
						medium: { name: "medium", type: 2, widthThreshold: 992 },
						large: { name: "large", type: 3, widthThreshold: 1200 },
						hd: { name: "hd", type: 4, widthThreshold: 1280 },
						fullHd: { name: "fullHd", type: 5, widthThreshold: 1920 },
						0: { name: "xsmall", type: 0, widthThreshold: 450 },
						1: { name: "small", type: 1, widthThreshold: 767 },
						2: { name: "medium", type: 2, widthThreshold: 992 },
						3: { name: "large", type: 3, widthThreshold: 1200 },
						4: { name: "hd", type: 4, widthThreshold: 1280 },
						5: { name: "fullHd", type: 5, widthThreshold: 1920 },
					}
				);
			});
		});

	});

	describe("getSizeTypeInfo", () => {
		describe("when different widths are passed", () => {

			it("should match", () => {
				const dataSet = [
					{ width: 10, expectedSize: "xsmall" },
					{ width: 450, expectedSize: "xsmall" },
					{ width: 992, expectedSize: "medium" },
					{ width: 993, expectedSize: "large" },
					{ width: 1199, expectedSize: "large" },
					{ width: 1200, expectedSize: "large" },
					{ width: 1201, expectedSize: "hd" },
					{ width: 1280, expectedSize: "hd" },
					{ width: 1281, expectedSize: "fullHd" },
					{ width: 1920, expectedSize: "fullHd" },
					{ width: 2000, expectedSize: "fullHd" },
				];

				for (const data of dataSet) {
					const result = getSizeTypeInfo(data.width, sizeTypes);
					expect(result.name).toBe(data.expectedSize);
				}
			});

		});
	});


	describe("isViewportConditionMatch", () => {

		describe("given only size include is used", () => {

			describe("when single matching value is passed", () => {
				const sizeType = "small";
				const viewportRef = sizeRefs[sizeType];
				const result = isViewportConditionMatch(viewportRef, { sizeType });

				it("should return true", () => {
					expect(result).toBe(true);
				});
			});

			describe("when single not matching value is passed", () => {
				const viewportRef = sizeRefs.small;
				const result = isViewportConditionMatch(viewportRef, { sizeType: "xsmall" });

				it("should return false", () => {
					expect(result).toBe(false);
				});
			});

			describe("when multi values are passed with a matching value", () => {
				const viewportRef = sizeRefs.small;
				const result = isViewportConditionMatch(viewportRef, {
					sizeType: ["small", "medium"]
				});

				it("should return true", () => {
					expect(result).toBe(true);
				});
			});

			describe("when multi values are passed with a non matching value", () => {
				const viewportRef = sizeRefs.large;
				const result = isViewportConditionMatch(viewportRef, {
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
							expression: data.expression
						});
						expect(result).toBe(data.expectedResult);
					}
				});

			});
		});

	});

});
