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
import { Dictionary } from "../internal/internal.model";
import { WindowRef } from "../platform/window";
import { ViewportSizeTypeInfo, ViewportSize } from "./viewport.model";
import { generateViewportSizeTypeInfoList, generateViewportSizeTypeInfoRefs, getSizeTypeInfo } from "./viewport.util";
import { ViewportSizeService } from "./viewport-size.service";

@Injectable({
	providedIn: "root"
})
export class ViewportService {

	/** Window resize observable (which is also throttled). */
	readonly resize$: Observable<ViewportSize>;

	/** Viewport size type observable. */
	readonly sizeType$: Observable<ViewportSizeTypeInfo>;

	/** Viewport size observable. */
	readonly size$: Observable<ViewportSize>;

	/** Size types refs of the generated viewport size type info. */
	get sizeTypeMap(): Dictionary<ViewportSizeTypeInfo> { return this._sizeTypeMap; }

	/** Viewport size types list ordered by type, smallest to largest. */
	get sizeTypes(): ViewportSizeTypeInfo[] { return this._sizeTypes; }

	private _sizeTypeMap: Dictionary<ViewportSizeTypeInfo>;
	private _sizeTypes: ViewportSizeTypeInfo[];

	constructor(
		sizeService: ViewportSizeService,
		windowRef: WindowRef,
		@Inject(UX_CONFIG) config: UxOptions,
	) {
		this._sizeTypes = generateViewportSizeTypeInfoList(config.viewport.breakpoints);
		this._sizeTypeMap = generateViewportSizeTypeInfoRefs(this._sizeTypes);

		if (windowRef.hasNative) {
			this.resize$ = fromEvent<Event>(window, "resize").pipe(
				map(() => sizeService.get()),
				auditTime(config.viewport.resizePollingSpeed),
				share(),
			);
		} else {
			this.resize$ = of(sizeService.get());
		}

		this.size$ = this.resize$.pipe(
			startWith(sizeService.get()),
			distinctUntilChanged((a, b) => a.width === b.width && a.height === b.height),
			shareReplay(1),
		);

		this.sizeType$ = this.size$.pipe(
			distinctUntilChanged((a, b) => a.width === b.width),
			map(x => getSizeTypeInfo(x.width, this.sizeTypes)),
			distinctUntilChanged(),
			shareReplay(1),
		);
	}

}
