import * as _ from "lodash";
import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Observable, fromEvent, of } from "rxjs";
import {
	map,
	distinctUntilChanged,
	startWith,
	share,
	shareReplay,
	auditTime,
} from "rxjs/operators";

import { UxOptionsInternal, UX_CONFIG } from "../config";
import { ViewportSizeTypeInfo, ViewportSize, ViewportSizeType } from "./viewport.model";
import { WindowRef } from "../platform/window";
import { ViewportServerSizeService } from "./viewport-server-size.service";

@Injectable({
	providedIn: "root",
})
export class ViewportService {
	/** Observable when window is resized (which is also throttled). */
	resize$: Observable<ViewportSize>;

	/** Observable when viewport size type changes. */
	sizeType$: Observable<ViewportSizeTypeInfo>;

	private lastWidthCheck: number | undefined;
	private lastWidthSizeInfo: ViewportSizeTypeInfo | undefined;

	constructor(
		@Inject(UX_CONFIG) private config: UxOptionsInternal,
		@Inject(DOCUMENT) private document: any,
		private windowRef: WindowRef,
		private viewportServerSize: ViewportServerSizeService,
	) {
		if (windowRef.hasNative) {
			this.resize$ = fromEvent<Event>(window, "resize").pipe(
				map(() => this.getViewportSize()),
				auditTime(this.config.viewport.resizePollingSpeed),
				share(),
			);
		} else {
			this.resize$ = of(viewportServerSize.get());
		}

		this.sizeType$ = this.resize$.pipe(
			startWith(this.getViewportSize()),
			map(x => this.calculateViewportSize(x.width)),
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

	private getViewportSize(): ViewportSize {
		if (!this.windowRef.hasNative) {
			return this.viewportServerSize.get();
		}

		const ua = navigator.userAgent.toLowerCase();
		// safari subtracts the scrollbar width
		if (ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1) {
			return {
				width: this.document.documentElement.clientWidth,
				height: this.document.documentElement.clientHeight,
			};
		}
		return {
			width: this.windowRef.native.innerWidth,
			height: this.windowRef.native.innerHeight,
		};
	}

	private calculateViewportSize(width: number): ViewportSizeTypeInfo {
		if (width !== this.lastWidthCheck) {
			this.lastWidthCheck = width;
			this.lastWidthSizeInfo = this.getWidthSizeInfo(width);
		}

		return this.lastWidthSizeInfo;
	}

	/**
	 * Returns the current viewport information
	 * @param width the viewport width
	 */
	private getWidthSizeInfo(width: number): ViewportSizeTypeInfo {
		// todo: make this more dynamic + decouple from lodash
		if (_.inRange(width, this.config.viewport.breakpoints.small)) {
			return this.config.viewport.viewportDictionary[ViewportSizeType.xsmall];
		} else if (_.inRange(width, this.config.viewport.breakpoints.xsmall, this.config.viewport.breakpoints.small)) {
			return this.config.viewport.viewportDictionary[ViewportSizeType.small];
		} else if (_.inRange(width, this.config.viewport.breakpoints.small, this.config.viewport.breakpoints.medium)) {
			return this.config.viewport.viewportDictionary[ViewportSizeType.medium];
		} else if (_.inRange(width, this.config.viewport.breakpoints.medium, this.config.viewport.breakpoints.large)) {
			return this.config.viewport.viewportDictionary[ViewportSizeType.large];
		} else if (_.inRange(width, this.config.viewport.breakpoints.large, this.config.viewport.breakpoints.xlarge)) {
			return this.config.viewport.viewportDictionary[ViewportSizeType.xlarge];
		} else if (_.inRange(width, this.config.viewport.breakpoints.xlarge, this.config.viewport.breakpoints.xxlarge)) {
			return this.config.viewport.viewportDictionary[ViewportSizeType.xxlarge];
		}

		return this.config.viewport.viewportDictionary[ViewportSizeType.xxlarge1];
	}
}
