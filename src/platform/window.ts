import { InjectionToken, Injectable, Inject } from "@angular/core";

export const WINDOW = new InjectionToken<Window>("Window");

@Injectable({
	providedIn: "root",
})
export class WindowRef {

	constructor(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		@Inject(WINDOW) private window: any
	) {
	}

	/** Window underlying native object. */
	get native(): Window {
		return this.window as Window;
	}

	/** Determines whether native element is supported or not. Generally `false` when executing in SSR. */
	get hasNative(): boolean {
		return !!this.native.window;
	}

}
