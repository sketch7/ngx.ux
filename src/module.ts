import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";

import { CommandDirective } from "./command.directive";
import { CommandRefDirective } from "./command-ref.directive";
import { UxOptions, UX_DEFAULT_CONFIG, UX_CONFIG } from "./config";

/** @internal */
export const _MODULE_CONFIG = new InjectionToken<UxOptions | (() => UxOptions)>(
	"_ux-config"
);

@NgModule({
	declarations: [CommandDirective, CommandRefDirective],
	providers: [{ provide: UX_CONFIG, useValue: UX_DEFAULT_CONFIG }],
	exports: [CommandDirective, CommandRefDirective],
})
export class SsvUxModule {
	static forRoot(config?: UxOptions | (() => UxOptions)): ModuleWithProviders {
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
export function _moduleConfigFactory(config: UxOptions | (() => UxOptions)) {
	return typeof config === "function" ? config() : config;
}
