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
	expression?: ViewportSizeMatcherExpression;

}

@Directive({
	selector: "[ssvViewportMatcher]",
	exportAs: "ssvViewportMatcher",
})
export class SsvViewportMatcherDirective implements OnInit, OnDestroy {

	sizeInfo: ViewportSizeTypeInfo | undefined;

	private _context: SsvViewportMatcherContext = new SsvViewportMatcherContext();
	private _thenTemplateRef: TemplateRef<SsvViewportMatcherContext> | null = null;
	private _elseTemplateRef: TemplateRef<SsvViewportMatcherContext> | null = null;
	private _thenViewRef: EmbeddedViewRef<SsvViewportMatcherContext> | null = null;
	private _elseViewRef: EmbeddedViewRef<SsvViewportMatcherContext> | null = null;
	private sizeType$$ = Subscription.EMPTY;
	private cssClass$$ = Subscription.EMPTY;
	private readonly _update$ = new Subject<SsvViewportMatcherContext>();

	@Input() set ssvViewportMatcher(value: string | string[] | ViewportSizeMatcherExpression) {
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

		if (this.sizeInfo) {
			this._update$.next(this._context);
		}
	}

	@Input() set ssvViewportMatcherExclude(value: string | string[]) {
		this._context.sizeTypeExclude = value;

		if (this.sizeInfo) {
			this._update$.next(this._context);
		}
	}

	@Input() set ssvViewportMatcherElse(templateRef: TemplateRef<SsvViewportMatcherContext> | null) {
		this._elseTemplateRef = templateRef;
		this._elseViewRef = null; // clear previous view if any.
		if (this.sizeInfo) {
			this._update$.next(this._context);
		}
	}

	constructor(
		private viewport: ViewportService,
		private renderer: Renderer2,
		private viewContainer: ViewContainerRef,
		private cdr: ChangeDetectorRef,
		templateRef: TemplateRef<SsvViewportMatcherContext>,
	) {
		this._thenTemplateRef = templateRef;
	}

	ngOnInit(): void {
		// console.log("ssvViewportMatcher init");

		this._update$
			.pipe(
				// tap(x => console.log(">>> ssvViewportMatcher - update triggered", x)),
				filter(() => !!this.sizeInfo),
				// tap(x => console.log(">>> ssvViewportMatcher - updating...", x)),
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				tap(() => this._updateView(this.sizeInfo!)),
				tap(() => this.cdr.markForCheck())
			)
			.subscribe();

		this.sizeType$$ = this.viewport.sizeType$
			.pipe(
				// tap(x => console.log("ssvViewportMatcher - sizeType changed", x)),
				tap(x => this.sizeInfo = x),
				tap(() => this._update$.next(this._context)),
			)
			.subscribe();

		this.cssClass$$ = this.viewport.sizeType$
			.pipe(
				startWith<ViewportSizeTypeInfo | undefined>(undefined),
				filter(() => !!(this._thenViewRef || this._elseViewRef)),
				pairwise(),
				tap(([prev, curr]) => {
					const el: Element = this._thenViewRef
						? this._thenViewRef.rootNodes[0]
						: this._elseViewRef?.rootNodes[0];

					if (!el.classList) {
						return;
					}
					if (prev) {
						this.renderer.removeClass(el, `ssv-vp-size--${prev.name}`);
					}
					this.renderer.addClass(el, `ssv-vp-size--${curr?.name}`);
				}),
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.cssClass$$.unsubscribe();
		this.sizeType$$.unsubscribe();
		this._update$.complete();
	}

	private _updateView(sizeInfo: ViewportSizeTypeInfo) {
		if (isViewportConditionMatch(sizeInfo, this._context, this.viewport.sizeTypeMap)) {
			if (!this._thenViewRef) {
				this.viewContainer.clear();
				this._elseViewRef = null;

				if (this._thenTemplateRef) {
					this._thenViewRef = this.viewContainer.createEmbeddedView(
						this._thenTemplateRef,
						this._context,
					);
				}
			}
		} else {
			if (!this._elseViewRef) {
				this.viewContainer.clear();
				this._thenViewRef = null;

				if (this._elseTemplateRef) {
					this._elseViewRef = this.viewContainer.createEmbeddedView(
						this._elseTemplateRef,
						this._context,
					);
				}
			}
		}
	}

}
