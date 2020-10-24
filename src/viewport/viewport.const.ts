import { UxViewportOptions } from "./viewport.model";

export const UX_VIEWPORT_DEFAULT_CONFIG: UxViewportOptions = {
	resizePollingSpeed: 33,
	breakpoints: {
		xsmall: 450,
		small: 767,
		medium: 992,
		large: 1200,
		xlarge: 1500,
		xxlarge: 1920,
		xxlarge1: 2100
	}
};
