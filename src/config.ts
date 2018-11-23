import { InjectionToken } from "@angular/core";
import { UxViewportOptions } from "./viewport/viewport.config";
import { DeviceType } from "./viewport/viewport.model";

export interface UxOptions {
	viewport: UxViewportOptions;
}

export const UX_DEFAULT_CONFIG: UxOptions = {
	viewport: {
		resizePollingSpeed: 33,
		serverDeviceType: DeviceType.desktop
	}
};

export const UX_CONFIG = new InjectionToken<UxOptions>("@ssv/ngx.ux-config");
