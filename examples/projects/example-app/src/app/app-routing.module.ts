import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ViewportComponent } from "./viewport/viewport.component";

const routes: Routes = [
	{ path: "", component: ViewportComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
