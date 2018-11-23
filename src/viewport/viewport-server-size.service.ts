import { Injectable, Inject } from "@angular/core";

import { Dictionary } from "../internal/internal.model";
import { DeviceType, ViewportSize } from "./viewport.model";
import { UX_CONFIG, UxOptions } from "../config";

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

// todo: change to providedIn
@Injectable()
export class ViewportServerSizeService {

	constructor(
		@Inject(UX_CONFIG) private config: UxOptions,
	) {
	}

	get(): ViewportSize {
		return viewportSizeSSR[this.config.viewport.serverDeviceType];
	}
}
