import {
	OnInit,
	OnDestroy,
	Directive,
	Input,
	ChangeDetectorRef,
	TemplateRef,
	ViewContainerRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { tap, map, takeUntil } from "rxjs/operators";

import { ViewportService } from "./viewport.service";
import {
	isViewportSizeMatcherExpression,
	isViewportSizeMatcherTupleExpression,
	isViewportConditionMatch
} from "./viewport.util";
import { ViewportSizeTypeInfo } from "./viewport.model";
import { SsvViewportMatcherContext } from "./viewport-matcher.directive";

@Directive({
	selector: "[ssvViewportMatcherVar]",
	exportAs: "ssvViewportMatcherVar",
})
export class SsvViewportMatcherVarDirective implements OnInit, OnDestroy {

	sizeInfo: ViewportSizeTypeInfo | undefined;

	private _context: SsvViewportMatcherContext = new SsvViewportMatcherContext();
	private readonly _destroy$ = new Subject<void>();

	@Input("ssvViewportMatcherVarWhen") set condition(value: string | string[]) {
		if (isViewportSizeMatcherExpression(value)) {
			this._context.expression = value;
		} else if (isViewportSizeMatcherTupleExpression(value)) {
			const [op, size] = value;
			this._context.expression = {
				operation: op,
				size
			};
		} else {
			this._context.sizeType = value;
		}

		// if (this.sizeInfo) {
		// 	this._update$.next(this._context);
		// }
	}

	constructor(
		private viewport: ViewportService,
		private cdr: ChangeDetectorRef,
		private _viewContainer: ViewContainerRef,
		private templateRef: TemplateRef<any>,
	) {
	}

	ngOnInit(): void {
		// console.log("ssvViewportMatcher init");

		this.viewport.sizeType$.pipe(
			map(x => isViewportConditionMatch(x, this._context, this.viewport.sizeTypeMap)),
			tap(x => console.warn(">>>> isMatch", x)),
			tap(() => this.cdr.markForCheck()),
			tap(x => console.warn(">>>> updateView", x)),
			tap(x => this.updateView(x)),
			takeUntil(this._destroy$),
		).subscribe();
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	updateView(conditionResult: boolean): void {
		this._viewContainer.clear();
		this._viewContainer.createEmbeddedView(this.templateRef, {
			$implicit: conditionResult,
		});
	}

}
