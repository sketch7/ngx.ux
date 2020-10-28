## [2.0.0](https://github.com/sketch7/ngx.ux/compare/1.2.1...2.0.0) (2020-xx-xx)

### Features

- **deps:** update dependencies to support Angular v10
- **deps:** add dependency on `tslib: ^2.0.0`

### BREAKING CHANGES

- **viewport:** make several utils/models internal only
- **viewport:** change `ViewportSizeType` TODO

## [1.2.1](https://github.com/sketch7/ngx.ux/compare/1.1.2...1.2.0) (2020-10-28)

### Bug Fixes

- **build:** down version several dependencies packages in order to support angular 8 (and possibly less)
- **deps:** revert dependency on tslib `^1.10.0`

## [1.2.0](https://github.com/sketch7/ngx.ux/compare/1.1.1...1.2.0) (2020-10-27)

### Features

- **viewport:** implement configurable breakpoints (thanks to contrib [@joseph118](https://github.com/joseph118))
- **viewport:** add util method `generateViewportSizeType` to generate a representation of `ViewportSizeType`
- **deps:** now depends on tslib `^1.10.0`

### Refactor

- **all:** minor refactoring

### Chore

- **deps:** update dev dependencies
- **ci:** update node version
- **lint:** migrate from tslint to eslint

## [1.1.1](https://github.com/sketch7/ngx.ux/compare/1.1.0...1.1.1) (2020-05-29)

### Bug Fixes

- **viewport:** use `documentElement.clientWidth` to check viewport width on Safari only
- **viewport:** `getViewportSize` not being called on SSR

## [1.1.0](https://github.com/sketch7/ngx.ux/compare/1.0.0...1.1.0) (2019-08-22)

### Features

- **viewport:** add additional viewport breakpoint size `xxlarge1 >=1920`

## [1.0.0](https://github.com/sketch7/ngx.ux/compare/0.2.0...1.0.0) (2019-06-11)

### Chore

*No new fixes/features in this release*

- **deps:** update dev dependencies
- **ci:** update node version

## [0.2.0](https://github.com/sketch7/ngx.ux/compare/0.1.5...0.2.0) (2019-05-20)

- **viewport:** width now includes scrollbar to be more inline with css media queries e.g. `window.innerWidth` instead of `documentElement.clientWidth` (same for height)
- **viewport:** resize now emits more frequently, not only after stopping resizing for a duration of time e.g. use `auditTime` instead of `debounceTime`


### BREAKING CHANGES

- **viewport:** viewport size matching (including viewport matcher) size ranges now change according to the viewport size instead of the viewport container (e.g. scrollbar size is included)


## [0.1.5](https://github.com/sketch7/ngx.ux/compare/0.1.4...0.1.5) (2018-02-26)

### Features

- **viewport:** implemented `calculateItemsPerRow` in service


## [0.1.4](https://github.com/sketch7/ngx.ux/compare/0.1.3...0.1.4) (2018-02-21)

### Chore

update tooling


## [0.1.3](https://github.com/sketch7/ngx.ux/compare/0.1.2...0.1.3) (2018-01-31)

### Bug Fixes

- **viewport:** fix `sizeType$` was returning the initial `sizeType` on subscribe until resizing instead of the last value


## [0.1.2](https://github.com/sketch7/ngx.ux/compare/0.1.1...0.1.2) (2018-11-27)

### Bug Fixes

- **viewport:** fix `ssvViewportMatcher` when used on `ng-container` was trying to add cssClass and throwing an error


## [0.1.1](https://github.com/sketch7/ngx.ux/compare/0.1.0...0.1.1) (2018-11-26)

### Bug Fixes

- **viewport:** fix when using OnPush with `ssvViewportMatcher`


## [0.1.0](https://github.com/sketch7/ngx.ux) (2018-11-23)

Initial release

### Features

- **viewport:** viewport service implementation
- **viewport:** viewport size matcher implementation
