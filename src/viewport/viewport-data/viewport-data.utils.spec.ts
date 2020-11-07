import _ from "lodash";

import { EnumDictionary } from "../../internal/internal.model";
import { generateViewportSizeTypeInfoList, generateViewportSizeTypeInfoRefs, } from "../viewport.util";
import { ViewportSizeTypeInfo } from "../viewport.model";
import {
	generateViewportRulesRangeFromDataMatcher as generateViewportRulesRangeFromDataMatcher_,
} from "./viewport-data.utils";
import { TestViewportSizeType } from "../viewport.util.spec";
import { ViewportDataConfig, ViewportDataMatchStrategy } from "./viewport-data-matcher";

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

const generateViewportRulesRangeFromDataMatcher = <T>(
	dataConfig: ViewportDataConfig<T>,
	strategy: ViewportDataMatchStrategy,
) => generateViewportRulesRangeFromDataMatcher_<T>(dataConfig, strategy, sizeTypes, sizeRefs);

describe("viewportDataUtils", () => {

	describe("generateViewportRulesRangeFromDataMatcher", () => {

		describe("given strategy is exact", () => {
			const strategy = ViewportDataMatchStrategy.exact;
			const dataConfig: TestViewportDataConfig<number> = {
				default: 12,
				xsmall: undefined,
				small: 10,
				medium: undefined,
				large: 20,
				hd: 25,
				fullHd: undefined,
			};
			/**
			 * default: 12
			 * [451-767]=10
			 * [993-1200]=20
			 * [1201-1280]=25
			 * */

			it("should return matching rules", () => {
				const result = generateViewportRulesRangeFromDataMatcher(dataConfig, strategy);
				expect(result).toEqual([
					{ min: undefined, max: undefined, value: dataConfig.default },
					{ min: breakpoints.xsmall + 1, max: breakpoints.small, value: dataConfig.small },
					{ min: breakpoints.medium + 1, max: breakpoints.large, value: dataConfig.large },
					{ min: breakpoints.large + 1, max: breakpoints.hd, value: dataConfig.hd },
				]);
			});

		});

		describe("given strategy is smaller", () => {
			const strategy = ViewportDataMatchStrategy.smaller;
			const dataConfig: TestViewportDataConfig<number> = {
				default: 12,
				medium: 15,
				large: 20,
				hd: 30,
			};
			/**
			 * default: 12
			 * [768-992]=15
			 * [993-1200]=20
			 * [1201-*]=30
			 * */

			it("should return matching rules", () => {
				const result = generateViewportRulesRangeFromDataMatcher(dataConfig, strategy);
				expect(result).toEqual([
					{ min: undefined, max: undefined, value: dataConfig.default }, // default
					{ min: breakpoints.small + 1, max: breakpoints.medium, value: dataConfig.medium }, // medium
					{ min: breakpoints.medium + 1, max: breakpoints.large, value: dataConfig.large }, // large
					{ min: breakpoints.large + 1, max: undefined, value: dataConfig.hd }, // hd
				]);
			});
		});

		describe("given strategy is larger", () => {
			const strategy = ViewportDataMatchStrategy.larger;
			const dataConfig: TestViewportDataConfig<number> = {
				default: 12,
				medium: 15,
				large: 20,
				hd: 30,
			};
			/**
			 * default: 12
			 * [*-992]=15
			 * [993-1200]=20
			 * [1201-1280]=30
			 * */
			it("should return matching rules", () => {
				const result = generateViewportRulesRangeFromDataMatcher(dataConfig, strategy);
				expect(result).toEqual([
					{ min: undefined, max: undefined, value: dataConfig.default }, // default
					{ min: undefined, max: breakpoints.medium, value: dataConfig.medium }, // medium
					{ min: breakpoints.medium + 1, max: breakpoints.large, value: dataConfig.large }, // large
					{ min: breakpoints.large + 1, max: breakpoints.hd, value: dataConfig.hd }, // hd
				]);
			});
		});

		describe("given strategy is closestSmallFirst", () => {
			const strategy = ViewportDataMatchStrategy.closestSmallerFirst;

			// todo: name
			describe("when dataset A", () => {
				const dataConfig: TestViewportDataConfig<number> = {
					default: 12,
					xsmall: 5,
					small: undefined,
					medium: 15,
					large: undefined,
					hd: undefined,
					fullHd: 50,
				};

				it("should return matching rules", () => {
					const result = generateViewportRulesRangeFromDataMatcher(dataConfig, strategy);
					expect(result).toEqual([
						{ min: undefined, max: undefined, value: dataConfig.default },
						{ min: undefined, max: breakpoints.small, value: dataConfig.xsmall },
						{ min: breakpoints.small + 1, max: breakpoints.large, value: dataConfig.medium },
						{ min: breakpoints.large + 1, max: undefined, value: dataConfig.fullHd },
					]);
				});
			});

			// todo: name
			describe("when dataset B", () => {
				const dataConfig: TestViewportDataConfig<number> = {
					default: 12,
					xsmall: undefined,
					small: 10,
					medium: undefined,
					large: 20,
					hd: 25,
					fullHd: undefined,
				};

				it("should return matching rules", () => {
					const result = generateViewportRulesRangeFromDataMatcher(dataConfig, strategy);
					expect(result).toEqual([
						{ min: undefined, max: undefined, value: dataConfig.default },
						{ min: undefined, max: breakpoints.medium, value: dataConfig.small },
						{ min: breakpoints.medium + 1, max: breakpoints.large, value: dataConfig.large },
						{ min: breakpoints.large + 1, max: undefined, value: dataConfig.hd },
					]);
				});
			});

		});

		describe("given strategy is closestLargerFirst", () => {
			const strategy = ViewportDataMatchStrategy.closestLargerFirst;

			// todo: name
			describe("when dataset A", () => {
				const dataConfig: TestViewportDataConfig<number> = {
					default: 12,
					xsmall: 5,
					small: undefined,
					medium: 15,
					large: undefined,
					hd: undefined,
					fullHd: 50,
				};
				/**
				 * [*-450]=5
				 * [451-1200]=10
				 * [1201-*]=50
				 * */

				it("should return matching rules", () => {
					const result = generateViewportRulesRangeFromDataMatcher(dataConfig, strategy);
					expect(result).toEqual([
						{ min: undefined, max: undefined, value: dataConfig.default },
						{ min: undefined, max: breakpoints.xsmall, value: dataConfig.xsmall },
						{ min: breakpoints.xsmall + 1, max: breakpoints.large, value: dataConfig.medium },
						{ min: breakpoints.large + 1, max: undefined, value: dataConfig.fullHd },
					]);
				});
			});

			// todo: name
			describe("when dataset B", () => {
				const dataConfig: TestViewportDataConfig<number> = {
					default: 12,
					xsmall: undefined,
					small: 10,
					medium: undefined,
					large: 20,
					hd: 25,
					fullHd: undefined,
				};
				/**
				 * [*-767]=10
				 * [768-1200]=20
				 * [1201-*]=25
				 * */
				it("should return matching rules", () => {
					const result = generateViewportRulesRangeFromDataMatcher(dataConfig, strategy);
					expect(result).toEqual([
						{ min: undefined, max: undefined, value: dataConfig.default },
						{ min: undefined, max: breakpoints.small, value: dataConfig.small },
						{ min: breakpoints.small + 1, max: breakpoints.large, value: dataConfig.large },
						{ min: breakpoints.large + 1, max: undefined, value: dataConfig.hd },
					]);
				});
			});

		});


	});


});
