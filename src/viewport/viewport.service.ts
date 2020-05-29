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

import { Dictionary } from "../internal/internal.model";
import { UxOptions, UX_CONFIG } from "../config";
import { ViewportSizeTypeInfo, ViewportSize, ViewportSizeType } from "./viewport.model";
import { WindowRef } from "../platform/window";
import { ViewportServerSizeService } from "./viewport-server-size.service";
import { UX_VIEWPORT_DEFAULT_CONFIG } from "./viewport.const";

// todo: make this configurable
/** Viewport sizes config, by upper bound. e.g. given width '1000' and `medium` is set to '992' => `large`. */
const viewportSizesConfig = {
	xsmall: 450,
	small: 767,
	medium: 992,
	large: 1200,
	xlarge: 1500,
	xxlarge: 1920,
	xxlarge1: 2100
};

// todo: autogenereate
const viewportSizeRefs: Dictionary<Readonly<ViewportSizeTypeInfo>> = {
	[ViewportSizeType.xsmall]: Object.freeze({
		name: "xsmall",
		type: ViewportSizeType.xsmall,
		widthThreshold: viewportSizesConfig.xsmall,
	} as ViewportSizeTypeInfo),
	[ViewportSizeType.small]: Object.freeze({
		name: "small",
		type: ViewportSizeType.small,
		widthThreshold: viewportSizesConfig.small,
	} as ViewportSizeTypeInfo),
	[ViewportSizeType.medium]: Object.freeze({
		name: "medium",
		type: ViewportSizeType.medium,
		widthThreshold: viewportSizesConfig.medium,
	} as ViewportSizeTypeInfo),
	[ViewportSizeType.large]: Object.freeze({
		name: "large",
		type: ViewportSizeType.large,
		widthThreshold: viewportSizesConfig.large,
	} as ViewportSizeTypeInfo),
	[ViewportSizeType.xlarge]: Object.freeze({
		name: "xlarge",
		type: ViewportSizeType.xlarge,
		widthThreshold: viewportSizesConfig.xlarge,
	} as ViewportSizeTypeInfo),
	[ViewportSizeType.xxlarge]: Object.freeze({
		name: "xxlarge",
		type: ViewportSizeType.xxlarge,
		widthThreshold: viewportSizesConfig.xxlarge,
	} as ViewportSizeTypeInfo),
	[ViewportSizeType.xxlarge1]: Object.freeze({
		name: "xxlarge1",
		type: ViewportSizeType.xxlarge1,
		widthThreshold: viewportSizesConfig.xxlarge1,
	} as ViewportSizeTypeInfo)
};

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
		@Inject(UX_CONFIG) config: UxOptions,
		@Inject(DOCUMENT) private document: any,
		private windowRef: WindowRef,
		private viewportServerSize: ViewportServerSizeService,
	) {
		if (windowRef.hasNative) {
			this.resize$ = fromEvent<Event>(window, "resize").pipe(
				map(() => this.getViewportSize()),
				auditTime(config.viewport.resizePollingSpeed || UX_VIEWPORT_DEFAULT_CONFIG.resizePollingSpeed),
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
		if (width === this.lastWidthCheck && this.lastWidthSizeInfo) {
			return this.lastWidthSizeInfo;
		}
		this.lastWidthCheck = width;

		// todo: make this more dynamic + decouple from lodash
		if (_.inRange(width, viewportSizesConfig.xsmall)) {
			this.lastWidthSizeInfo = viewportSizeRefs[ViewportSizeType.xsmall];
		} else if (_.inRange(width, viewportSizesConfig.xsmall, viewportSizesConfig.small)) {
			this.lastWidthSizeInfo = viewportSizeRefs[ViewportSizeType.small];
		} else if (_.inRange(width, viewportSizesConfig.small, viewportSizesConfig.medium)) {
			this.lastWidthSizeInfo = viewportSizeRefs[ViewportSizeType.medium];
		} else if (_.inRange(width, viewportSizesConfig.medium, viewportSizesConfig.large)) {
			this.lastWidthSizeInfo = viewportSizeRefs[ViewportSizeType.large];
		} else if (_.inRange(width, viewportSizesConfig.large, viewportSizesConfig.xlarge)) {
			this.lastWidthSizeInfo = viewportSizeRefs[ViewportSizeType.xlarge];
		} else if (_.inRange(width, viewportSizesConfig.xlarge, viewportSizesConfig.xxlarge)) {
			this.lastWidthSizeInfo = viewportSizeRefs[ViewportSizeType.xxlarge];
		} else {
			this.lastWidthSizeInfo = viewportSizeRefs[ViewportSizeType.xxlarge1];
		}
		return this.lastWidthSizeInfo;
	}
}
