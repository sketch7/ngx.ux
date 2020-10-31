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

type StrictViewportDataConfig<T> = ViewportDataConfig<T> & Partial<typeof breakpoints>;

const resolveViewportData = <T>(
	dataConfig: ViewportDataConfig<T>,
	currentSizeType: ViewportSizeTypeInfo,
	strategy: ViewportDataResolveStrategy,
) => resolveViewportData_<T>(dataConfig, currentSizeType, strategy, sizeTypes, sizeRefs);

describe("Viewport utils", () => {

	describe("resolveViewportData", () => {

		describe("given strategy is exact", () => {
			const strategy = ViewportDataResolveStrategy.match;
			const dataConfig: StrictViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20
			};

			describe("when type value exists", () => {

				it("should return matching value", () => {
					const result = resolveViewportData(dataConfig, sizeRefs.small, strategy);
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when type value does not exists", () => {

				it("should return default", () => {
					const result = resolveViewportData(dataConfig, sizeRefs.hd, strategy);
					expect(result).toBe(dataConfig.default);
				});
			});

		});

		describe("given strategy is larger (up)", () => {
			const strategy = ViewportDataResolveStrategy.larger;
			const dataConfig: StrictViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20,
				hd: 25,
			};


			describe("when matching is largest", () => {
				it("should return match", () => {
					const result = resolveViewportData(dataConfig, sizeRefs.hd, strategy);
					expect(result).toBe(dataConfig.hd);
				});
			});

			describe("when matching not exist but larger exists", () => {
				it("should return first match larger value", () => {
					const result = resolveViewportData(dataConfig, sizeRefs.medium, strategy);
					expect(result).toBe(dataConfig.large);
				});
			});

			describe("when type is larger than data defined", () => {
				it("should return default", () => {
					const result = resolveViewportData(dataConfig, sizeRefs.fullHd, strategy);
					expect(result).toBe(dataConfig.default);
				});
			});

			describe("when type defined index far apart", () => {
				it("should return largest", () => {
					const result = resolveViewportData({ default: dataConfig.default, hd: dataConfig.hd }, sizeRefs.xsmall, strategy);
					expect(result).toBe(25);
				});
			});

		});

		describe("given strategy is smaller (down)", () => {
			const dataConfig: StrictViewportDataConfig<number> = {
				default: 15,
				small: 10,
				large: 20,
				hd: 25,
			};
			const strategy = ViewportDataResolveStrategy.smaller;

			describe("when matching is smallest", () => {
				it("should return match", () => {
					const result = resolveViewportData(dataConfig, sizeRefs.small, strategy);
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when match not exist but smaller exists", () => {
				it("should return first match larger value", () => {
					const result = resolveViewportData(dataConfig, sizeRefs.medium, strategy);
					expect(result).toBe(dataConfig.small);
				});
			});

			describe("when type is smaller than data defined", () => {
				it("should return default", () => {
					const result = resolveViewportData(dataConfig, sizeRefs.xsmall, strategy);
					expect(result).toBe(dataConfig.default);
				});
			});

			describe("when type defined index far apart", () => {
				it("should return smallest", () => {
					const result = resolveViewportData({ default: dataConfig.default, xsmall: 5 }, sizeRefs.fullHd, strategy);
					expect(result).toBe(5);
				});
			});

		});


	});


});
