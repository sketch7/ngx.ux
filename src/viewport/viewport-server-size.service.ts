import { Injectable, Inject, InjectionToken, Optional } from "@angular/core";

import { Dictionary } from "../internal/internal.model";
import { DeviceType, ViewportSize } from "./viewport.model";
import { UxOptions } from "../config";

// todo: make this configurable
/** Viewport size for SSR. */
const viewportSizeSSR: Dictionary<ViewportSize> = {
	[DeviceType.desktop]: {
		width: 1366,
		height: 768,
	},
	[DeviceType.tablet]: {
		width: 768,
		height: 1024,
	},
	[DeviceType.mobile]: {
		width: 414,
		height: 736,
	},
};

export const UX_VIEWPORT_SSR_DEVICE = new InjectionToken<UxOptions>("@ssv/ngx.ux-config/viewport/ssr-device");

// todo: change to providedIn
@Injectable()
export class ViewportServerSizeService {

	constructor(
		@Optional() @Inject(UX_VIEWPORT_SSR_DEVICE) private deviceType: DeviceType,
	) {
	}

	get(): ViewportSize {
		let size = viewportSizeSSR[this.deviceType];
		if (!size) {
			size = viewportSizeSSR[DeviceType.desktop];
		}
		return size;
	}
}
