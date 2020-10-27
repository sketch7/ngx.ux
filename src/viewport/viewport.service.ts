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
import { generateViewportSizeTypeInfoList, generateViewportSizeTypeInfoRefs } from "./viewport.util";
import { Dictionary } from "../internal/internal.model";

@Injectable({
	providedIn: "root",
})
export class ViewportService {
	/** Observable when window is resized (which is also throttled). */
	resize$: Observable<ViewportSize>;

	/** Observable when viewport size type changes. */
	sizeType$: Observable<ViewportSizeTypeInfo>;

	/** A dictionary of the generated viewport size type info */
	readonly sizeTypeMap: Dictionary<ViewportSizeTypeInfo>;

	/** An ordered list of viewport size type from smallest to largest */
	private readonly orderedSizeTypeList: ViewportSizeTypeInfo[];

	constructor(
		@Inject(UX_CONFIG) config: UxOptions,
		private windowRef: WindowRef,
		private viewportServerSize: ViewportServerSizeService,
	) {
		this.orderedSizeTypeList = generateViewportSizeTypeInfoList(config.viewport.breakpoints);
		this.sizeTypeMap = generateViewportSizeTypeInfoRefs(this.orderedSizeTypeList);

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
			distinctUntilChanged(),
			shareReplay(1),
		);
	}

	/**
	 * Calculates amount of items that fits into container's width.
	 * @param containerWidth
	 * @param itemWidth
	 * @returns
	 */
	calculateItemsPerRow(containerWidth: number, itemWidth: number): number {
		if (containerWidth === 0) {
			return 0;
		}

		if (!containerWidth && !this.windowRef.hasNative) {
			// todo: find a way to get container width for ssr
			containerWidth = this.viewportServerSize.get().width;
		}

		return containerWidth / itemWidth;
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
		const lastEntryIndex = this.orderedSizeTypeList.length - 1;

		for (let idx = 0; idx < lastEntryIndex; idx++) {
			const viewportSizeTypeInfo = this.orderedSizeTypeList[idx];

			if (width <= viewportSizeTypeInfo.widthThreshold) {
				return viewportSizeTypeInfo;
			}
		}

		return this.orderedSizeTypeList[lastEntryIndex];
	}
}
