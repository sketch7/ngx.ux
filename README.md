[projectUri]: https://github.com/sketch7/ngx.ux
[changeLog]: ./CHANGELOG.md
[releaseWorkflowWiki]: ./docs/RELEASE-WORKFLOW.md

[npm]: https://www.npmjs.com

# @ssv/ngx.ux
[![CircleCI](https://circleci.com/gh/sketch7/ngx.ux.svg?style=shield)](https://circleci.com/gh/sketch7/ngx.ux)
[![npm version](https://badge.fury.io/js/%40ssv%2Fngx.ux.svg)](https://badge.fury.io/js/%40ssv%2Fngx.ux)

UX essentials for building apps, utilities which enables you writing richer apps easier.

**Quick links**

[Change logs][changeLog] | [Project Repository][projectUri]

## Installation

Get library via [npm]

```bash
npm install @ssv/ngx.ux
```

Choose the version corresponding to your Angular version:

 | Angular | library |
 | ------- | ------- |
 | 10      | 2.x+    |
 | 4 to 9  | 1.x+    |


# Usage

## Register module

```ts
import { SsvUxModule } from "@ssv/ngx.ux";

@NgModule({
  imports: [
    SsvUxModule
  ]
}
export class AppModule {
}
```

## Viewport
Provides utilities to handle responsiveness easier based on the viewport (view size)

### Comparison Operands
| Operand | Description           |
| ------- | --------------------- |
| =       | Equals                |
| <>      | Not equals            |
| <       | Less than             |
| <=      | Less than or equal    |
| >       | Greater than          |
| >=      | Greater Than or equal |

<br>

### Size Types
These are the defaults, but they are configurable.

| Size Type | Size Range |
| --------- | ---------- |
| xsmall    | <=450      |
| small     | 451-767    |
| medium    | 768-992    |
| large     | 993-1280   |
| fhd       | 1281-1920  |
| qhd       | 1921-2560  |
| uhd4k     | 2561-3840  |
| uhd8k     | >=3841     |


### Viewport Matcher Attribute (directive)
Structural directive which loads components based on a viewport sizing condition e.g. show ONLY if viewport is greater than xlarge.


#### Examples

```html
<!-- simple -->
<div *ssvViewportMatcher="'large'">
  show only when large
</div>

<!-- expression based - tuple (shorthand) *recommended usage* -->
<div *ssvViewportMatcher="['>=', 'xlarge']"> (see all operands and sizes)
  show when >= xlarge
</div>

<!-- expression based - object -->
<div *ssvViewportMatcher="{size: 'xlarge', operation: '<='}"> (see all operands and sizes)
  show when >= xlarge
</div>

<!-- includes -->
<div *ssvViewportMatcher="['large', 'xlarge']">
  show only when large, xlarge
</div>

<!-- excludes -->
<div *ssvViewportMatcher="''; exclude ['xsmall', 'small']">
  hide only when xsmall, small
</div>

<!-- match/else -->
<div *ssvViewportMatcher="['>=', 'xlarge']; else otherwise">
  show when >= xlarge
</div>

<ng-template #otherwise>
  show when expression is falsy (< xlarge)
</ng-template>

<!-- non structure syntax -->
<ng-template ssvViewportMatcher [ssvViewportMatcherExclude]="'xsmall'">
    (exclude xsmall)
</ng-template>
```

### Viewport Service

```ts
// get size type
this.viewport.sizeType$.pipe(
    tap(x => console.log("Viewport - sizeType changed", x)), // { type: 4, name: "xlarge", widthThreshold: 1500 }
  ).subscribe();
```

### Viewport for SSR
Since in SSR there is no way to know the client viewport size, we should at least determine device type and handle provide
3 different sizes based on device type e.g. `mobile`, `tablet` or `desktop` so the initial rendering will be closer based on device type.

The basic implementation allows to provide a device type `mobile`, `tablet` or `desktop` and there are static sizes for those.

```ts
import { UX_VIEWPORT_SSR_DEVICE } from "@ssv/ngx.ux";

const deviceType = deviceTypeFromServer;
{ provide: UX_VIEWPORT_SSR_DEVICE, useValue: deviceType },
```

The default implementation can also be replaced by implementing a small class as following:

```ts

export class SuperViewportServerSizeService {
  get(): ViewportSize {
    // do your magic..
    return size;
  }
}

import { ViewportServerSizeService } from "@ssv/ngx.ux";

@NgModule( {
  providers: [
    { provide: ViewportServerSizeService, useClass: SuperViewportServerSizeService }
  ]
}) export class AppModule {
}
```


## Configure
You can configure the existing resize polling speed and as well as provide your custom breakpoints.

### Custom Breakpoints
```ts
import { SsvUxModule, generateViewportSizeType } from "@ssv/ngx.ux";

const breakpoints = { // custom breakpoints - key/width
  smallest: 500,
  small: 700,
  medium: 1000,
  large: 1400,
  extralarge: 1600,
  xxlarge: 1800,
  fhd: 1920,
  uhd: 3840
};

  imports: [
    SsvUxModule.forRoot({
      viewport: {
        resizePollingSpeed: 66, // optional - defaults to 33
        breakpoints // provide the custom breakpoints
      }
    }),
  ],
```

### Override existing Breakpoints
```ts
import { SsvUxModule, UX_VIEWPORT_DEFAULT_BREAKPOINTS } from "@ssv/ngx.ux";

  imports: [
    SsvUxModule.forRoot({
      viewport: {
        breakpoints: {
          ...UX_VIEWPORT_DEFAULT_BREAKPOINTS, // use breakpoints provided with library
          xxlarge1: 2000, // override xxlarge1
          uhd: 3840 // add new breakpoint
        }
      }
    }),
  ],
```


## Getting Started

### Setup Machine for Development
Install/setup the following:

- NodeJS v10+
- Visual Studio Code or similar code editor
- TypeScript 3.1+
- Git + SourceTree, SmartGit or similar (optional)
- Ensure to install **global NPM modules** using the following:


```bash
npm install -g git gulp devtool
```


### Project Setup
The following process need to be executed in order to get started.

```bash
npm install
```


### Building the code

```bash
npm run build
```

### Running the tests

```bash
npm test
```

#### Watch
Handles compiling of changes.

```bash
npm start
```


#### Running Continuous Tests
Spawns test runner and keep watching for changes.

```bash
npm run tdd
```


### Preparation for Release

- Update changelogs
- bump version


Check out the [release workflow guide][releaseWorkflowWiki] in order to guide you creating a release and publishing it.