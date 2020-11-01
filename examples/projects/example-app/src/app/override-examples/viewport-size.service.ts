import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { IViewportSize, ViewportSize } from "@ssv/ngx.ux";

@Injectable({
	providedIn: "root"
})
export class ViewportSizeService implements IViewportSize {

	constructor(
		@Inject(DOCUMENT) private document: Document
	) {
	}

	/** Returns the current viewport size */
	get(): ViewportSize {
		const viewportSize = {
			width: this.document.defaultView.innerWidth,
			height: this.document.defaultView.innerHeight,
		};

		console.warn("[Custom] - get: ViewportSize", viewportSize);

		return viewportSize;
	}

}
