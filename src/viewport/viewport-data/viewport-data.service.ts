import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ViewportSizeTypeInfo } from "../viewport.model";
import { ViewportService } from "../viewport.service";
import { matchViewportData, ViewportDataConfig, ViewportDataMatchStrategy } from "./viewport-data-matcher";

@Injectable({
	providedIn: "root",
})
export class ViewportDataService {

	constructor(
		private viewport: ViewportService,
	) {
	}

	/** Get data for match. */
	get<T>(
		dataConfig: ViewportDataConfig<T>,
		strategy: ViewportDataMatchStrategy,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		viewportSizeType: ViewportSizeTypeInfo = this.viewport.sizeTypeSnapshot!
	): T | undefined {
		return matchViewportData(dataConfig, viewportSizeType, strategy, this.viewport.sizeTypes, this.viewport.sizeTypeMap);
	}

	get$<T>(dataConfig: ViewportDataConfig<T>, strategy: ViewportDataMatchStrategy,): Observable<T | undefined> {
		return this.viewport.sizeType$.pipe(
			map(sizeType => this.get<T>(dataConfig, strategy, sizeType)),
		);
	}

}
