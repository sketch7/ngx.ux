import { InjectionToken } from "@angular/core";
import { UX_VIEWPORT_DEFAULT_CONFIG } from "./viewport/viewport.const";
import { UxViewportOptions } from "./viewport/viewport.model";

export interface UxOptions {
	viewport: UxViewportOptions;
}

export const UX_DEFAULT_CONFIG: UxOptions = {
	viewport: UX_VIEWPORT_DEFAULT_CONFIG,
};

export const UX_CONFIG = new InjectionToken<UxOptions>("@ssv/ngx.ux-config");
