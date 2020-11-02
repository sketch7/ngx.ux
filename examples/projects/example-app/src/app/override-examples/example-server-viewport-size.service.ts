import { DOCUMENT, isPlatformServer } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { ViewportSize, IViewportSize } from "@ssv/ngx.ux";

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class ExampleServerViewportSizeService implements IViewportSize {

	constructor(
		@Inject(DOCUMENT) private document: Document,
		// eslint-disable-next-line @typescript-eslint/ban-types
		@Inject(PLATFORM_ID) private platformId: Object,
	) {
	}

	/** Returns the current viewport size */
	get(): ViewportSize {
		const viewportSize = this.getViewportSize();

		console.warn("[Custom] - get: ViewportSize", viewportSize, `is SSR ${this.isSsr}`);

		return viewportSize;
	}

	private getViewportSize(): ViewportSize {
		return this.isSsr ?
			{
				width: 1920, // do your SSR logic
				height: 1080
			} :
			{
				width: this.document.defaultView.innerWidth,
				height: this.document.defaultView.innerHeight,
			};
	}

	private get isSsr(): boolean { return isPlatformServer(this.platformId); }

}
