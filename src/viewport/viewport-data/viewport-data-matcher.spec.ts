import { EnumDictionary } from "../../internal/internal.model";
import { generateViewportSizeTypeInfoList, generateViewportSizeTypeInfoRefs, } from "../viewport.util";
import { ViewportSizeTypeInfo } from "../viewport.model";
import {
	ViewportDataConfig,
	matchViewportData as matchViewportData_,
	ViewportDataMatchStrategy
} from "./viewport-data-matcher";
import { TestViewportSizeType } from "../viewport.util.spec";

type TestViewportDataConfig<T> = ViewportDataConfig<T, Partial<EnumDictionary<keyof typeof TestViewportSizeType, T>>>;

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

const matchViewportData = <T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	strategy: ViewportDataMatchStrategy,
) => matchViewportData_<T>(dataConfig, currentSizeType, strategy, sizeTypes, sizeRefs);

describe("viewportDataMatcher", () => {

	describe("matchViewportData", () => {

		describe("given strategy is exact", () => {
			const strategy = ViewportDataMatchStrategy.exact;
			const dataConfig: TestViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20,
			};

			describe("when type value exists", () => {

				it("should return matching value", () => {
					const result = matchViewportData(dataConfig, sizeRefs.small, strategy);
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when type value does not exists", () => {

				it("should return default", () => {
					const result = matchViewportData(dataConfig, sizeRefs.hd, strategy);
					expect(result).toBe(dataConfig.default);
				});
			});

		});


		describe("given strategy is larger (up)", () => {
			const strategy = ViewportDataMatchStrategy.larger;
			const dataConfig: TestViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20,
				hd: 25,
			};


			describe("when matching is largest", () => {
				it("should return match", () => {
					const result = matchViewportData(dataConfig, sizeRefs.hd, strategy);
					expect(result).toBe(dataConfig.hd);
				});
			});

			describe("when matching not exist but larger exists", () => {
				it("should return first match larger value", () => {
					const result = matchViewportData(dataConfig, sizeRefs.medium, strategy);
					expect(result).toBe(dataConfig.large);
				});
			});

			describe("when type is larger than data defined", () => {
				it("should return default", () => {
					const result = matchViewportData(dataConfig, sizeRefs.fullHd, strategy);
					expect(result).toBe(dataConfig.default);
				});
			});

			describe("when type defined index far apart", () => {
				it("should return largest", () => {
					const result = matchViewportData({ default: dataConfig.default, hd: dataConfig.hd }, sizeRefs.xsmall, strategy);
					expect(result).toBe(25);
				});
			});

		});


		describe("given strategy is smaller (down)", () => {
			const dataConfig: TestViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20,
				hd: 25,
			};
			const strategy = ViewportDataMatchStrategy.smaller;

			describe("when matching is smallest", () => {
				it("should return match", () => {
					const result = matchViewportData(dataConfig, sizeRefs.small, strategy);
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when match not exist but smaller exists", () => {
				it("should return first match larger value", () => {
					const result = matchViewportData(dataConfig, sizeRefs.medium, strategy);
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when type is smaller than data defined", () => {
				it("should return default", () => {
					const result = matchViewportData(dataConfig, sizeRefs.xsmall, strategy);
					expect(result).toBe(dataConfig.default);
				});
			});

			describe("when type defined index far apart", () => {
				it("should return smallest", () => {
					const result = matchViewportData({ default: dataConfig.default, xsmall: 5 }, sizeRefs.fullHd, strategy);
					expect(result).toBe(5);
				});
			});

		});


		describe("given strategy is closestSmallerFirst (down)", () => {
			const dataConfig: TestViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20,
				hd: 25,
			};
			const strategy = ViewportDataMatchStrategy.closestSmallerFirst;

			describe("when closest is smaller", () => {
				it("should return smaller", () => {
					const result = matchViewportData(dataConfig, sizeRefs.medium, strategy);
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when closest is smaller and current not specified", () => {
				it("should return smaller", () => {
					const result = matchViewportData(dataConfig, sizeRefs.fullHd, strategy);
					expect(result).toBe(dataConfig.hd);
				});
			});

			describe("when closest is larger", () => {
				it("should return larger", () => {
					const result = matchViewportData({
						default: 15,
						xsmall: 5, // -3
						small: undefined,
						medium: undefined,
						large: undefined, // <--
						hd: undefined,
						fullHd: 20, // +2
					}, sizeRefs.large, strategy);
					expect(result).toBe(20);
				});
			});

		});


		describe("given strategy is closestLargerFirst (up)", () => {
			const dataConfig: TestViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20,
				hd: 25,
			};
			const strategy = ViewportDataMatchStrategy.closestLargerFirst;

			describe("when closest is larger", () => {
				it("should return larger", () => {
					const result = matchViewportData(dataConfig, sizeRefs.medium, strategy);
					expect(result).toBe(dataConfig.large);
				});
			});

			describe("when closest is larger and current not specified", () => {
				it("should return larger", () => {
					const result = matchViewportData(dataConfig, sizeRefs.xsmall, strategy);
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when closest is smaller", () => {
				it("should return smaller", () => {
					const result = matchViewportData({
						default: 15,
						xsmall: 5, // -2
						small: undefined,
						medium: undefined, // <--
						large: undefined,
						hd: undefined,
						fullHd: 20, // +3
					}, sizeRefs.medium, strategy);
					expect(result).toBe(5);
				});
			});

		});


	});


});
