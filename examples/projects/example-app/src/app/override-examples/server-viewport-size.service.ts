import { Injectable } from "@angular/core";
import { IViewportSize, ViewportSize } from "@ssv/ngx.ux";

@Injectable({
	providedIn: "root"
})
export class ServerViewportSizeService implements IViewportSize {

	get(): ViewportSize {
		const viewportSize = {
			width: 1920,
			height: 1080
		};

		console.warn("[Custom SSR] - get: **hardcoded** ViewportSize", viewportSize);

		return viewportSize;
	}

}
