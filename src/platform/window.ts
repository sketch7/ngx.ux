import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Injectable({
	providedIn: "root"
})
export class WindowRef {

	constructor(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		@Inject(DOCUMENT) private document: any
	) {
	}

	/** Window underlying native object. */
	get native(): Window {
		return this.document.defaultView as Window;
	}

	/** Determines whether native element is supported or not. Generally `false` when executing in SSR. */
	get hasNative(): boolean {
		return !!this.native.window;
	}

}
