import { Injectable, Inject } from "@angular/core";
import { Observable, fromEvent, of } from "rxjs";
import {
	map,
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
import { generateViewportSizeTypeInfoList } from "./viewport.util";

@Injectable({
	providedIn: "root",
})
export class ViewportService {
	/** Observable when window is resized (which is also throttled). */
	resize$: Observable<ViewportSize>;

	/** Observable when viewport size type changes. */
	sizeType$: Observable<ViewportSizeTypeInfo>;

	/** An ordered list of viewport size type from smallest to largest */
	private readonly viewportList: ViewportSizeTypeInfo[];

	constructor(
		@Inject(UX_CONFIG) config: UxOptions,
		private windowRef: WindowRef,
		private viewportServerSize: ViewportServerSizeService,
	) {
		this.viewportList = generateViewportSizeTypeInfoList(config.viewport.breakpoints);

		if (windowRef.hasNative) {
			this.resize$ = fromEvent<Event>(window, "resize").pipe(
				map(() => this.getViewportSize()),
				auditTime(config.viewport.resizePollingSpeed),
				share(),
			);
		} else {
			this.resize$ = of(viewportServerSize.get());
		}

		this.sizeType$ = this.resize$.pipe(
			startWith(this.getViewportSize()),
			distinctUntilChanged((a, b) => a.width === b.width),
			map(x => this.getWidthSizeInfo(x.width)),
			shareReplay(1),
		);
	}

	/**
	 * Returns the current viewport size
	 */
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

	/**
	 * Returns the current viewport information
	 * @param width the viewport width
	 */
	private getWidthSizeInfo(width: number): ViewportSizeTypeInfo {
		const lastEntryIndex = this.viewportList.length - 1;

		for (let idx = 0; idx < lastEntryIndex; idx++) {
			const viewportSizeTypeInfo = this.viewportList[idx];

			if (width <= viewportSizeTypeInfo.widthThreshold) {
				return viewportSizeTypeInfo;
			}
		}

		return this.viewportList[lastEntryIndex];
	}
}
