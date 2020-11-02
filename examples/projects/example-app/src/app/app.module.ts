import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { SsvUxModule, ViewportSizeService } from "@ssv/ngx.ux";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ViewportComponent } from "./viewport/viewport.component";
import { ExampleServerViewportSizeService } from "./override-examples/example-server-viewport-size.service";

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
		BrowserModule.withServerTransition({ appId: "serverApp" }),
		AppRoutingModule,
		BrowserAnimationsModule,
		SsvUxModule.forServer(),
		materialModules,
	],
	providers: [
		{ provide: ViewportSizeService, useClass: ExampleServerViewportSizeService }, // SSR override example
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
