import { Injectable, Inject } from "@angular/core";
import { Observable, fromEvent, of } from "rxjs";
import {
	map,
	tap,
	distinctUntilChanged,
	startWith,
	share,
	shareReplay,
	auditTime,
} from "rxjs/operators";

import { UxOptions, UX_CONFIG } from "../config";
import { ViewportSizeTypeInfo, ViewportSize } from "./viewport.model";
import { WindowRef } from "../platform/window";
import { ViewportServerSizeService } from "./viewport-server-size.service";
import { generateViewportSizeTypeInfoList, generateViewportSizeTypeInfoRefs, getSizeTypeInfo } from "./viewport.util";
import { Dictionary } from "../internal/internal.model";

@Injectable({
	providedIn: "root",
})
export class ViewportService {

	/** Window resize observable (which is also throttled). */
	readonly resize$: Observable<ViewportSize>;

	/** Viewport size type observable. */
	readonly sizeType$: Observable<ViewportSizeTypeInfo>;

	/** Viewport size type snapshot of the last value. (Prefer use `sizeType$` observable when possible.) */
	get sizeTypeSnapshot(): ViewportSizeTypeInfo { return this._sizeTypeSnapshot; }

	/** Viewport size observable. */
	readonly size$: Observable<ViewportSize>;

	/** Size types refs of the generated viewport size type info. */
	get sizeTypeMap(): Dictionary<ViewportSizeTypeInfo> { return this._sizeTypeMap; }

	/** Viewport size types list ordered by type, smallest to largest. */
	get sizeTypes(): ViewportSizeTypeInfo[] { return this._sizeTypes; }

	private _sizeTypeMap: Dictionary<ViewportSizeTypeInfo>;
	private _sizeTypes: ViewportSizeTypeInfo[];
	private _sizeTypeSnapshot: ViewportSizeTypeInfo;

	constructor(
		private windowRef: WindowRef,
		private viewportServerSize: ViewportServerSizeService,
		@Inject(UX_CONFIG) config: UxOptions,
	) {
		this._sizeTypes = generateViewportSizeTypeInfoList(config.viewport.breakpoints);
		this._sizeTypeMap = generateViewportSizeTypeInfoRefs(this._sizeTypes);

		if (windowRef.hasNative) {
			this.resize$ = fromEvent<Event>(window, "resize").pipe(
				map(() => this.getViewportSize()),
				auditTime(config.viewport.resizePollingSpeed),
				share(),
			);
		} else {
			this.resize$ = of(viewportServerSize.get());
		}
		const size = this.getViewportSize();
		this._sizeTypeSnapshot = getSizeTypeInfo(size.width, this.sizeTypes);

		this.size$ = this.resize$.pipe(
			startWith(size),
			distinctUntilChanged((a, b) => a.width === b.width && a.height === b.height),
			shareReplay(1),
		);

		this.sizeType$ = this.size$.pipe(
			distinctUntilChanged((a, b) => a.width === b.width),
			map(x => getSizeTypeInfo(x.width, this.sizeTypes)),
			distinctUntilChanged(),
			tap(x => this._sizeTypeSnapshot = x),
			shareReplay(1),
		);
	}

	/** Returns the current viewport size */
	private getViewportSize(): ViewportSize {
		if (!this.windowRef.hasNative) {
			return this.viewportServerSize.get();
		}

		const ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1) { // safari subtracts the scrollbar width
			return {
				width: this.windowRef.native.document.documentElement.clientWidth,
				height: this.windowRef.native.document.documentElement.clientHeight,
			};
		}

		return {
			width: this.windowRef.native.innerWidth,
			height: this.windowRef.native.innerHeight,
		};
	}

}
