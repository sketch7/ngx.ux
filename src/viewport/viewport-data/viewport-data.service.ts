import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UX_CONFIG, UxOptions } from "../../config";

import { ViewportSizeTypeInfo } from "../viewport.model";
import { ViewportService } from "../viewport.service";
import { matchViewportData, ViewportDataConfig, ViewportDataMatchStrategy } from "./viewport-data-matcher";

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

	get$<T>(dataConfig: ViewportDataConfig<T>, strategy?: ViewportDataMatchStrategy): Observable<T | undefined> {
		return this.viewport.sizeType$.pipe(
			map(sizeType => this.get<T>(dataConfig, strategy, sizeType)),
		);
	}

}
