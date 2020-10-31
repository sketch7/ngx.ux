import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { BrowserViewportSizeService, ServerViewportSizeService, SsvUxModule } from "@ssv/ngx.ux";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ViewportComponent } from "./viewport/viewport.component";
import { CustomBrowserViewportSize } from "./override-examples/custom-browser-viewport-size";
import { CustomServerViewportSize } from "./override-examples/custom-server-viewport-size";

const materialModules = [
	MatButtonModule,
	MatProgressSpinnerModule,
	MatIconModule,
	MatCardModule,
];

@NgModule({
	declarations: [
		AppComponent,
		ViewportComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		SsvUxModule.forRoot({
			// viewport: {

			// }
		}),
		materialModules,
	],
	providers: [
		{ provide: ServerViewportSizeService, useClass: CustomServerViewportSize },
		{ provide: BrowserViewportSizeService, useClass: CustomBrowserViewportSize },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
