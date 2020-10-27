import { Dictionary } from "../internal/internal.model";
import { UxViewportOptions } from "./viewport.model";

/** Default viewport breakpoints. */
export const UX_VIEWPORT_DEFAULT_BREAKPOINTS: Dictionary<number> = {
	xsmall: 450,
	small: 767,
	medium: 992,
	large: 1200,
	xlarge: 1500,
	xxlarge: 1920,
	xxlarge1: 2100,
};

export const UX_VIEWPORT_DEFAULT_CONFIG: UxViewportOptions = {
	resizePollingSpeed: 33,
	breakpoints: UX_VIEWPORT_DEFAULT_BREAKPOINTS
};
