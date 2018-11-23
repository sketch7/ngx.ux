import * as _ from "lodash";
import { DOCUMENT } from "@angular/common";
import { Injectable, Inject } from "@angular/core";
import { Observable, fromEvent, of } from "rxjs";
import {
	debounceTime,
	map,
	distinctUntilChanged,
	startWith,
	share,
} from "rxjs/operators";

import { Dictionary } from "../internal/internal.model";
import { UxOptions, UX_CONFIG } from "../config";
import { ViewportSizeTypeInfo, ViewportSize, ViewportSizeType } from "./viewport.model";
import { WindowRef } from "../platform/window";
import { ViewportServerSizeService } from "./viewport-server-size.service";

// todo: make this configurable
/** Viewport sizes config, by upper bound. e.g. given width '1000' and `medium` is set to '992' => `large`. */
const viewportSizesConfig = {
	xsmall: 450,
	small: 767,
	medium: 992,
	large: 1200,
	xlarge: 1500,
	xxlarge: 2000,
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
};


// todo: change to providedIn
@Injectable()
export class ViewportService {
	/** Observable when window is resized (which is also throttled). */
	resize$: Observable<ViewportSize>;

	/** Observable when viewport size type changes. */
	sizeType$: Observable<ViewportSizeTypeInfo>;

	constructor(
		@Inject(UX_CONFIG) config: UxOptions,
		@Inject(DOCUMENT) private document: any,
		windowRef: WindowRef,
		viewportServerSize: ViewportServerSizeService,
	) {
		if (windowRef.hasNative) {
			this.resize$ = fromEvent<Event>(window, "resize").pipe(
				map(() => this.getViewportSize()),
				debounceTime(config.viewport.resizePollingSpeed),
				share(),
			);
		} else {
			this.resize$ = of(viewportServerSize.get());
		}

		this.sizeType$ = this.resize$.pipe(
			startWith(this.getViewportSize()),
			map(x => this.calculateViewportSize(x.width)),
			distinctUntilChanged(),
		);
	}

	private getViewportSize(): ViewportSize {
		return {
			width: this.document.documentElement.clientWidth,
			height: this.document.documentElement.clientHeight,
		};
	}

	private calculateViewportSize(width: number): ViewportSizeTypeInfo {
		if (_.inRange(width, viewportSizesConfig.xsmall)) {
			return viewportSizeRefs[ViewportSizeType.xsmall];
		} else if (_.inRange(width, viewportSizesConfig.xsmall, viewportSizesConfig.small)) {
			return viewportSizeRefs[ViewportSizeType.small];
		} else if (_.inRange(width, viewportSizesConfig.small, viewportSizesConfig.medium)) {
			return viewportSizeRefs[ViewportSizeType.medium];
		} else if (_.inRange(width, viewportSizesConfig.medium, viewportSizesConfig.large)) {
			return viewportSizeRefs[ViewportSizeType.large];
		} else if (_.inRange(width, viewportSizesConfig.large, viewportSizesConfig.xlarge)) {
			return viewportSizeRefs[ViewportSizeType.xlarge];
		} else {
			return viewportSizeRefs[ViewportSizeType.xxlarge];
		}
	}
}
