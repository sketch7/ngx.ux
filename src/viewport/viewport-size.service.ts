import { Injectable } from "@angular/core";

import { WindowRef } from "../platform/window";
import { IViewportSize, ViewportSize } from "./viewport.model";

@Injectable({
	providedIn: "root"
})
export class ViewportSizeService implements IViewportSize {

	constructor(
		protected window: WindowRef,
	) {
	}

	/** Returns the current viewport size */
	get(): ViewportSize {
		const ua = this.window.native.navigator.userAgent.toLowerCase();
		if (ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1) {
			// safari subtracts the scrollbar width
			return {
				width: this.window.native.document.documentElement.clientWidth,
				height: this.window.native.document.documentElement.clientHeight,
			};
		}

		return {
			width: this.window.native.innerWidth,
			height: this.window.native.innerHeight,
		};
	}

}
