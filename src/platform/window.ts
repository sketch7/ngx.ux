import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";

@Injectable({
	providedIn: "root"
})
export class WindowRef {

	constructor(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		@Inject(DOCUMENT) private document: any,
		// eslint-disable-next-line @typescript-eslint/ban-types
		@Inject(PLATFORM_ID) private platformId: Object,
	) {
	}

	/** Window underlying native object. */
	get native(): Window {
		return this.document.defaultView as Window;
	}

	/** Determines whether native element is supported or not. Generally `false` when executing in SSR. */
	get hasNative(): boolean {
		return isPlatformBrowser(this.platformId);
	}

}
