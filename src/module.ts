import { NgModule, ModuleWithProviders, InjectionToken, Optional } from "@angular/core";

import { SsvViewportMatcherDirective } from "./viewport/index";
import { UxOptions, UX_DEFAULT_CONFIG, UX_CONFIG } from "./config";
import { WINDOW } from "./platform/window";
import { PartialDeep } from "./internal/internal.model";
import { ViewportDataPipe } from "./viewport/viewport-data/viewport-data.pipe";

/** @internal */
export const MODULE_CONFIG_DATA = new InjectionToken<UxOptions>("@ssv/ngx.ux/configData");

const components = [
	SsvViewportMatcherDirective,
	ViewportDataPipe,
];

// todo: create module for Viewport
@NgModule({
	declarations: [components],
	providers: [
		{ provide: UX_CONFIG, useFactory: _moduleConfigFactory, deps: [[MODULE_CONFIG_DATA, new Optional()]] },
		{ provide: WINDOW, useFactory: _window },
	],
	exports: [...components],
})
export class SsvUxModule {

	static forRoot(config?: PartialDeep<UxOptions> | (() => PartialDeep<UxOptions>)): ModuleWithProviders<SsvUxModule> {
		return {
			ngModule: SsvUxModule,
			providers: [
				{ provide: MODULE_CONFIG_DATA, useValue: config },
			],
		};
	}

}

/** @internal */
export function _moduleConfigFactory(config: UxOptions | (() => UxOptions)): UxOptions {
	const uxOptions = (typeof config === "function" ? config() : config) || UX_DEFAULT_CONFIG;
	const viewport = {
		...UX_DEFAULT_CONFIG.viewport,
		...uxOptions.viewport
	}; // breakpoints shouldn't be merged

	return { viewport };
}

/** @internal */
export function _window(): unknown {
	if (typeof window !== "undefined") {
		return window;
	}
	return {};
}
