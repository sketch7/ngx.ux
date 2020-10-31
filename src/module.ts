import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";

import { SsvViewportMatcherDirective } from "./viewport/index";
import { UxOptions, UX_DEFAULT_CONFIG, UX_CONFIG } from "./config";
import { PartialDeep } from "./internal/internal.model";

/** @internal */
export const _MODULE_CONFIG = new InjectionToken<UxOptions>("_ux-config");

@NgModule({
	declarations: [SsvViewportMatcherDirective],
	providers: [
		{ provide: UX_CONFIG, useValue: UX_DEFAULT_CONFIG },
	],
	exports: [SsvViewportMatcherDirective],
})
export class SsvUxModule {

	static forRoot(config?: PartialDeep<UxOptions> | (() => PartialDeep<UxOptions>)): ModuleWithProviders<SsvUxModule> {
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
	const uxOptions = (typeof config === "function" ? config() : config) || UX_DEFAULT_CONFIG;
	const viewport = {
		...UX_DEFAULT_CONFIG.viewport,
		...uxOptions.viewport
	}; // breakpoints shouldn't be merged

	return { viewport };
}
