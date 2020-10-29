import { Dictionary } from "../internal/internal.model";
import { DeviceType, UxViewportOptions, ViewportSsrSizes } from "./viewport.model";

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

/** Default viewport SSR sizes. */
export const UX_VIEWPORT_DEFAULT_SSR_SIZES: ViewportSsrSizes = {
	[DeviceType.mobile]: {
		width: 414,
		height: 736,
	},
	[DeviceType.tablet]: {
		width: 768,
		height: 1024,
	},
	[DeviceType.desktop]: {
		width: 1366,
		height: 768,
	},
};

export const UX_VIEWPORT_DEFAULT_CONFIG: UxViewportOptions = {
	resizePollingSpeed: 33,
	breakpoints: UX_VIEWPORT_DEFAULT_BREAKPOINTS,
	viewportSsrSizes: UX_VIEWPORT_DEFAULT_SSR_SIZES,
};
