import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { SsvUxModule } from "@ssv/ngx.ux";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ViewportComponent } from "./viewport/viewport.component";

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
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
