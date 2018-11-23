import { InjectionToken } from "@angular/core";

export interface UxOptions {
	/**
	 * Css Class which gets added/removed on the Command element's host while Command `isExecuting$`.
	 */
	viewportResizePollingSpeed: number;
}

export const UX_DEFAULT_CONFIG: UxOptions = {
	viewportResizePollingSpeed: 30,
};

export const UX_CONFIG = new InjectionToken<UxOptions>("@ssv/ngx.ux-config");
