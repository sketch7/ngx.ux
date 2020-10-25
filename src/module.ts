import * as _ from "lodash";
import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";

import { SsvViewportMatcherDirective } from "./viewport/index";
import { UxOptions, UX_DEFAULT_CONFIG, UX_CONFIG } from "./config";
import { WINDOW } from "./platform/window";
import { PartialDeep } from "./internal/internal.model";

/** @internal */
export const _MODULE_CONFIG = new InjectionToken<UxOptions>("_ux-config");

@NgModule({
	declarations: [SsvViewportMatcherDirective],
	providers: [
		{ provide: UX_CONFIG, useValue: UX_DEFAULT_CONFIG },
		{ provide: WINDOW, useFactory: _window },
	],
	exports: [SsvViewportMatcherDirective],
})
export class SsvUxModule {
	static forRoot(config?: PartialDeep<UxOptions> | (() => PartialDeep<UxOptions>)): ModuleWithProviders {
		return {
			ngModule: SsvUxModule,
			providers: [
				{
					provide: UX_CONFIG,
					useFactory: _moduleConfigFactory,
					deps: [_MODULE_CONFIG],
				},
				{ provide: _MODULE_CONFIG, useValue: config },
			],
		};
	}
}

/** @internal */
export function _moduleConfigFactory(config: UxOptions | (() => UxOptions)): UxOptions {
	const uxOptions = typeof config === "function" ? config() : config;
	return _.merge(UX_DEFAULT_CONFIG, uxOptions || UX_DEFAULT_CONFIG);
}

/** @internal */
export function _window(): any {
	if (typeof window !== "undefined") {
		return window;
	}
	return {};
}
