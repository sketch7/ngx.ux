import {
	OnInit,
	OnDestroy,
	Directive,
	Renderer2,
	ViewContainerRef,
	Input,
	EmbeddedViewRef,
	TemplateRef,
	ChangeDetectorRef,
} from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { tap, filter, pairwise, startWith } from "rxjs/operators";

import { ViewportService } from "./viewport.service";
import {
	isViewportSizeMatcherExpression,
	isViewportSizeMatcherTupleExpression,
	isViewportConditionMatch
} from "./viewport.util";
import { ViewportSizeTypeInfo, ViewportMatchConditions, ViewportSizeMatcherExpression } from "./viewport.model";

export class SsvViewportMatcherContext implements ViewportMatchConditions {
	sizeType: string | string[] | null = null;
	sizeTypeExclude: string | string[] | null = null;
	expresson?: ViewportSizeMatcherExpression;
}

@Directive({
	selector: "[ssvViewportMatcher]",
	exportAs: "ssvViewportMatcher",
})
export class SsvViewportMatcherDirective implements OnInit, OnDestroy {

	private _context: SsvViewportMatcherContext = new SsvViewportMatcherContext();
	private _thenTemplateRef: TemplateRef<SsvViewportMatcherContext> | null = null;
	private _elseTemplateRef: TemplateRef<SsvViewportMatcherContext> | null = null;
	private _thenViewRef: EmbeddedViewRef<SsvViewportMatcherContext> | null = null;
	private _elseViewRef: EmbeddedViewRef<SsvViewportMatcherContext> | null = null;
	private sizeType$$: Subscription | undefined;
	private update$$: Subscription | undefined;
	private cssClass$$: Subscription | undefined;
	private update$ = new Subject<SsvViewportMatcherContext>();

	sizeInfo: ViewportSizeTypeInfo | undefined;

	constructor(
		private viewport: ViewportService,
		private renderer: Renderer2,
		private _viewContainer: ViewContainerRef,
		private cdr: ChangeDetectorRef,
		templateRef: TemplateRef<SsvViewportMatcherContext>,
	) {
		this._thenTemplateRef = templateRef;
	}

	ngOnInit() {
		// console.log("ssvViewportMatcher init");

		this.update$$ = this.update$
			.pipe(
				// tap(x => console.log(">>> ssvViewportMatcher - update triggered", x)),
				filter(() => !!this.sizeInfo),
				// tap(x => console.log(">>> ssvViewportMatcher - updating...", x)),
				tap(() => this._updateView(this.sizeInfo!)),
				tap(() => this.cdr.markForCheck())
			)
			.subscribe();

		this.sizeType$$ = this.viewport.sizeType$
			.pipe(
				// tap(x => console.log("ssvViewportMatcher - sizeType changed", x)),
				tap(x => (this.sizeInfo = x)),
				tap(() => this.update$.next(this._context)),
			)
			.subscribe();

		this.cssClass$$ = this.viewport.sizeType$
			.pipe(
				startWith<ViewportSizeTypeInfo | undefined>(undefined),
				filter(() => !!(this._thenViewRef || this._elseViewRef)),
				pairwise(),
				tap(([prev, curr]) => {
					const el = this._thenViewRef
						? this._thenViewRef.rootNodes[0]
						: this._elseViewRef!.rootNodes[0];
					if (prev) {
						this.renderer.removeClass(el, `ssv-vp-size--${prev.name}`);
					}
					this.renderer.addClass(el, `ssv-vp-size--${curr!.name}`);
				}),
			)
			.subscribe();
	}

	ngOnDestroy() {
		if (this.cssClass$$) {
			this.cssClass$$.unsubscribe();
		}
		if (this.sizeType$$) {
			this.sizeType$$.unsubscribe();
		}
		if (this.update$) {
			this.update$.complete();
		}
		if (this.update$$) {
			this.update$.unsubscribe();
		}
	}

	@Input() set ssvViewportMatcher(value: string | string[] | ViewportSizeMatcherExpression) {
		if (isViewportSizeMatcherExpression(value)) {
			this._context.expresson = value;
		} else if (isViewportSizeMatcherTupleExpression(value)) {
			const [op, size] = value;
			this._context.expresson = {
				operation: op,
				size
			};
		} else {
			this._context.sizeType = value;
		}

		if (this.sizeInfo) {
			this.update$.next(this._context);
		}
	}

	@Input() set ssvViewportMatcherExclude(value: string | string[]) {
		this._context.sizeTypeExclude = value;

		if (this.sizeInfo) {
			this.update$.next(this._context);
		}
	}

	@Input() set ssvViewportMatcherElse(templateRef: TemplateRef<SsvViewportMatcherContext> | null) {
		this._elseTemplateRef = templateRef;
		this._elseViewRef = null; // clear previous view if any.
		if (this.sizeInfo) {
			this.update$.next(this._context);
		}
	}

	private _updateView(sizeInfo: ViewportSizeTypeInfo) {
		if (isViewportConditionMatch(sizeInfo, this._context)) {
			if (!this._thenViewRef) {
				this._viewContainer.clear();
				this._elseViewRef = null;

				if (this._thenTemplateRef) {
					this._thenViewRef = this._viewContainer.createEmbeddedView(
						this._thenTemplateRef,
						this._context,
					);
				}
			}
		} else {
			if (!this._elseViewRef) {
				this._viewContainer.clear();
				this._thenViewRef = null;

				if (this._elseTemplateRef) {
					this._elseViewRef = this._viewContainer.createEmbeddedView(
						this._elseTemplateRef,
						this._context,
					);
				}
			}
		}
	}

}

