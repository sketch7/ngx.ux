import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";

import { SsvViewportMatcherDirective } from "./viewport/index";
import { UxOptions, UX_DEFAULT_CONFIG, UX_CONFIG } from "./config";
import { WINDOW } from "./platform/window";

/** @internal */
export const _MODULE_CONFIG = new InjectionToken<UxOptions | (() => UxOptions)>(
	"_ux-config"
);

@NgModule({
	declarations: [SsvViewportMatcherDirective],
	providers: [
		{ provide: UX_CONFIG, useValue: UX_DEFAULT_CONFIG },

		{ provide: WINDOW, useFactory: _window },
	],
	exports: [SsvViewportMatcherDirective],
})
export class SsvUxModule {
	static forRoot(config?: Partial<UxOptions> | (() => Partial<UxOptions>)): ModuleWithProviders {
		return {
			ngModule: SsvUxModule,
			providers: [
				{
					provide: UX_CONFIG,
					useFactory: _moduleConfigFactory,
					deps: [_MODULE_CONFIG],
				},
				{ provide: _MODULE_CONFIG, useValue: config || UX_DEFAULT_CONFIG },
			],
		};
	}
}

/** @internal */
export function _moduleConfigFactory(config: UxOptions | (() => UxOptions)) {
	return typeof config === "function" ? config() : config;
}

/** @internal */
export function _window(): any {
	if (typeof window !== "undefined") {
		return window;
	}
	return {};
}