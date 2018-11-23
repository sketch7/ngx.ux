import { InjectionToken } from "@angular/core";
import { UxViewportOptions } from "./viewport/viewport.model";

export interface UxOptions {
	viewport: Partial<UxViewportOptions>;
}

export const UX_DEFAULT_CONFIG: UxOptions = {
	viewport: {
		resizePollingSpeed: 33,
	}
};

export const UX_CONFIG = new InjectionToken<UxOptions>("@ssv/ngx.ux-config");
