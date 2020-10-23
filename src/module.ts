import * as _ from "lodash";
import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";

import { generateViewportInternalConfig, SsvViewportMatcherDirective } from "./viewport/index";
import { UxOptions, UX_DEFAULT_CONFIG, UX_CONFIG, UxOptionsInternal } from "./config";
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
				{ provide: _MODULE_CONFIG, useValue: config },
			],
		};
	}
}

/** @internal */
export function _moduleConfigFactory(config: UxOptions | (() => UxOptions)): UxOptionsInternal {
	const value = typeof config === "function" ? config() : config;
	const mergedValue = _.merge(UX_DEFAULT_CONFIG, value);
	const viewport = generateViewportInternalConfig(mergedValue.viewport);

	return {
		viewport
	};
}

/** @internal */
export function _window(): any {
	if (typeof window !== "undefined") {
		return window;
	}
	return {};
}