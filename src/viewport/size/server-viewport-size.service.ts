import { Injectable, Inject, InjectionToken, Optional } from "@angular/core";

import { Dictionary } from "../../internal/internal.model";
import { UxOptions } from "../../config";
import { DeviceType, IViewportSize, ViewportSize } from "./viewport-size.model";

/** Viewport size for SSR. */
const viewportSizeSSR: Dictionary<ViewportSize> = {
	[DeviceType.desktop]: {
		width: 1366,
		height: 768
	},
	[DeviceType.tablet]: {
		width: 768,
		height: 1024
	},
	[DeviceType.mobile]: {
		width: 414,
		height: 736
	},
};

export const UX_VIEWPORT_SSR_DEVICE = new InjectionToken<UxOptions>("@ssv/ngx.ux-config/viewport/ssr-device");

@Injectable({
	providedIn: "root"
})
export class ServerViewportSizeService implements IViewportSize {

	constructor(
		@Optional() @Inject(UX_VIEWPORT_SSR_DEVICE) private deviceType: DeviceType,
	) {
	}

	get(): ViewportSize {
		return viewportSizeSSR[this.deviceType] || viewportSizeSSR[DeviceType.desktop];
	}

}
