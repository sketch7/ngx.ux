## [1.2.0](https://github.com/sketch7/ngx.ux/compare/1.1.1...1.2.0) (2020-10-25)

### Features

- **viewport:** add configurable breakpoints

### BREAKING CHANGES

- **viewport:** `ViewportSizeType` is now a dictionary.

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
