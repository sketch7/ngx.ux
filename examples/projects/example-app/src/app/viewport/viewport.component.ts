import {
	Component,
	ChangeDetectionStrategy,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { ViewportSizeTypeInfo, ViewportService, ViewportSize } from "@ssv/ngx.ux";

@Component({
	selector: "app-viewport",
	templateUrl: "./viewport.component.html",
	styleUrls: ["./viewport.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewportComponent implements OnInit, OnDestroy {

	sizeInfo: ViewportSizeTypeInfo | undefined;
	size: ViewportSize | undefined;
	isVisible = true;

	private readonly _destroy$ = new Subject<void>();

	constructor(
		private viewport: ViewportService,
		private cdr: ChangeDetectorRef,
	) { }

	ngOnInit(): void {
		const sizeType$ = this.viewport.sizeType$.pipe(
			tap(x => console.log("Viewport - size info changed", x)),
			tap(x => this.sizeInfo = x),
			tap(() => this.cdr.markForCheck()),
		);
		const size$ = this.viewport.size$.pipe(
			tap(x => console.log("Viewport - size changed", x)),
			tap(x => this.size = x),
			tap(() => this.cdr.markForCheck()),
		);

		[sizeType$, size$]
			.forEach((x: Observable<unknown>) => x.subscribe());
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

}
