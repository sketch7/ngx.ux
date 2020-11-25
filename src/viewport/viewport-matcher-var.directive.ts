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
import { ViewportMatchConditions } from "./viewport.model";

const NAME_CAMEL = "ssvViewportMatcherVar"; // todo: ssvViewportMatchVar?

export class SsvViewportMatcherVarContext {

	constructor(
		public $implicit = false,
	) { }

}

@Directive({
	selector: `[${NAME_CAMEL}]`,
	exportAs: NAME_CAMEL,
})
export class SsvViewportMatcherVarDirective implements OnInit, OnDestroy {

	private _matchConditions: ViewportMatchConditions = {};
	private _context = new SsvViewportMatcherVarContext();
	private readonly _destroy$ = new Subject<void>();

	@Input(`${NAME_CAMEL}When`) set condition(value: string | string[]) {
		if (isViewportSizeMatcherExpression(value)) {
			this._matchConditions.expression = value;
		} else if (isViewportSizeMatcherTupleExpression(value)) {
			const [op, size] = value;
			this._matchConditions.expression = {
				operation: op,
				size
			};
		} else {
			this._matchConditions.sizeType = value;
		}

		// todo: handle condition change + retrigger (combine)
		// 	this._update$.next(this._context);
	}

	constructor(
		private viewport: ViewportService,
		private cdr: ChangeDetectorRef,
		private viewContainer: ViewContainerRef,
		private templateRef: TemplateRef<SsvViewportMatcherVarContext>,
	) {
	}

	ngOnInit(): void {
		this.updateView();
		this.viewport.sizeType$.pipe(
			map(x => isViewportConditionMatch(x, this._matchConditions, this.viewport.sizeTypeMap)),
			tap(x => console.warn(">>>> isMatch", x)),
			tap(x => this._context.$implicit = x),
			tap(() => this.cdr.markForCheck()),
			takeUntil(this._destroy$),
		).subscribe();
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	updateView(): void {
		this.viewContainer.clear();
		// todo: markForCheck view?
		// view.markForCheck
		const view = this.viewContainer.createEmbeddedView(this.templateRef, this._context);
	}

}
