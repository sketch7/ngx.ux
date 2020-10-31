import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from "@angular/core";

import { ViewportDataConfig, ViewportDataMatchStrategy, ViewportDataMatchStrategyLiteral } from "./viewport-data-matcher";
import { ViewportDataService } from "./viewport-data.service";

/* eslint-disable @angular-eslint/no-pipe-impure */
@Pipe({
	name: "ssvViewportData",
	pure: false
})
export class ViewportDataPipe implements PipeTransform, OnDestroy {

	private markForTransform = true;
	private value: unknown;
	private data: ViewportDataConfig | undefined;
	private strategy: ViewportDataMatchStrategyLiteral | undefined;
	private data$$ = Subscription.EMPTY;

	constructor(
		private viewportData: ViewportDataService,
		private cdr: ChangeDetectorRef
	) {
	}

	transform(data: ViewportDataConfig, strategy: ViewportDataMatchStrategyLiteral): unknown {
		if (!this.markForTransform && data === this.data && strategy === this.strategy) {
			return this.value;
		}
		this.data = data;
		this.strategy = strategy;

		this.data$$.unsubscribe();
		this.data$$ = this.viewportData.get$(data, ViewportDataMatchStrategy[strategy]).pipe(
			tap(value => {
				this.markForTransform = true;
				this.value = value;
				this.cdr.markForCheck();
			}),
		).subscribe();

		this.markForTransform = false;
		return this.value;
	}

	ngOnDestroy(): void {
		this.data$$.unsubscribe();
	}

}
