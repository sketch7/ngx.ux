import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";

import { Dictionary } from "../internal/internal.model";
import { UxOptions } from "../config";
import { WindowRef } from "../platform/window";
import { ViewportSizeService } from "./viewport-size.service";
import { DeviceType, ViewportSize } from "./viewport.model";

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

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class ServerViewportSizeService extends ViewportSizeService {

	constructor(
		window: WindowRef,
		@Optional() @Inject(UX_VIEWPORT_SSR_DEVICE) private deviceType: DeviceType,
	) {
		super(window);
	}

	get(): ViewportSize {
		return this.window
			? super.get()
			: this.getServerViewportSize();
	}

	private getServerViewportSize(): ViewportSize {
		return viewportSizeSSR[this.deviceType] || viewportSizeSSR[DeviceType.desktop];
	}

}
