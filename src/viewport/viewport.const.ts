import { Dictionary } from "../internal/internal.model";
import { ViewportDataMatchStrategy } from "./viewport-data/viewport-data-matcher";
import { UxViewportOptions } from "./viewport.model";

/** Default viewport breakpoints. */
export const UX_VIEWPORT_DEFAULT_BREAKPOINTS: Dictionary<number> = {
	xsmall: 450,
	small: 767,
	medium: 992,
	large: 1280,
	fhd: 1920,
	qhd: 2560,
	uhd4k: 3840,
	uhd8k: 7680,
};

export const UX_VIEWPORT_DEFAULT_CONFIG: UxViewportOptions = {
	resizePollingSpeed: 33,
	breakpoints: UX_VIEWPORT_DEFAULT_BREAKPOINTS,
	defaultDataMatchStrategy: ViewportDataMatchStrategy.smaller,
};
