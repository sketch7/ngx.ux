import { ServerViewportSizeService } from "./server-viewport-size.service";
import { BrowserViewportSizeService } from "./browser-viewport-size.service";
import { Injectable } from "@angular/core";

import { WindowRef } from "../../platform/window";
import { IViewportSize, ViewportSize } from "./viewport-size.model";

@Injectable({
	providedIn: "root"
})
export class ViewportSizeService implements IViewportSize {

	constructor(
		private window: WindowRef,
		private browserService: BrowserViewportSizeService,
		private serverService: ServerViewportSizeService,
	) {
	}

	get(): ViewportSize {
		return this.window.hasNative
			? this.browserService.get()
			: this.serverService.get();
	}

}
