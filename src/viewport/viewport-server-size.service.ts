import { Injectable, Inject, InjectionToken, Optional } from "@angular/core";

import { DeviceType, ViewportSize } from "./viewport.model";
import { UxOptions, UX_CONFIG } from "../config";

export const UX_VIEWPORT_SSR_DEVICE = new InjectionToken<UxOptions>("@ssv/ngx.ux-config/viewport/ssr-device");

@Injectable({
	providedIn: "root",
})
export class ViewportServerSizeService {

	constructor(
		@Inject(UX_CONFIG) private config: UxOptions,
		@Optional() @Inject(UX_VIEWPORT_SSR_DEVICE) private deviceType: DeviceType,
	) {
	}

	get(): ViewportSize {
		return this.config.viewport.viewportSsrSizes[this.deviceType]
			|| this.config.viewport.viewportSsrSizes[DeviceType.desktop];
	}

}
