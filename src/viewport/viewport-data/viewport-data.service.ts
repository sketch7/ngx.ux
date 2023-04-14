import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { UX_CONFIG, UxOptions } from "../../config";

import { ViewportSizeTypeInfo } from "../viewport.model";
import { ViewportService } from "../viewport.service";
import { matchViewportData, ViewportDataConfig, ViewportDataMatchStrategy } from "./viewport-data-matcher";
import { generateViewportRulesRangeFromDataMatcher, ViewportDataRule } from "./viewport-data.utils";

@Injectable({
	providedIn: "root",
})
export class ViewportDataService {

	constructor(
		private viewport: ViewportService,
		@Inject(UX_CONFIG) private config: UxOptions,
	) {
	}

	/** Get data for match. */
	get<T>(
		dataConfig: ViewportDataConfig<T>,
		strategy: ViewportDataMatchStrategy = this.config.viewport.defaultDataMatchStrategy,
		sizeType: ViewportSizeTypeInfo = this.viewport.sizeTypeSnapshot
	): T | undefined {
		return matchViewportData(dataConfig, sizeType, strategy, this.viewport.sizeTypes, this.viewport.sizeTypeMap);
	}

	/** Get data for match as observable. */
	get$<T>(dataConfig: ViewportDataConfig<T>, strategy?: ViewportDataMatchStrategy, throttle = true): Observable<T | undefined> {
		return (throttle ? this.viewport.sizeType$ : this.viewport.sizeTypeSnap$).pipe(
			map(sizeType => this.get<T>(dataConfig, strategy, sizeType)),
			distinctUntilChanged(),
		);
	}

	/** Generate rules based on strategies for data. */
	generateRules<T>(
		dataConfig: ViewportDataConfig<T>,
		strategy: ViewportDataMatchStrategy = this.config.viewport.defaultDataMatchStrategy,
	): ViewportDataRule<T>[] {
		return generateViewportRulesRangeFromDataMatcher(
			dataConfig,
			strategy,
			this.viewport.sizeTypes,
			this.viewport.sizeTypeMap
		);
	}

}
