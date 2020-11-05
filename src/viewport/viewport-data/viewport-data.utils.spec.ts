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

		describe("given strategy is smaller", () => {
			const strategy = ViewportDataMatchStrategy.smaller;
			const dataConfig: TestViewportDataConfig<number> = {
				default: 12,
				medium: 15,
				large: 20,
				hd: 30,
			};

			it("should return matching rules", () => {
				const result = generateViewportRulesRangeFromDataMatcher(dataConfig, strategy);
				expect(result).toBe([
					{ min: undefined, max: undefined, value: dataConfig.default }, // default
					{ min: undefined, max: breakpoints.medium, value: dataConfig.medium }, // medium
					{ min: breakpoints.medium + 1, max: breakpoints.large, value: dataConfig.large }, // large
					{ min: breakpoints.large + 1, max: undefined, value: dataConfig.hd }, // hd
				]);
			});
		});


	});


});
