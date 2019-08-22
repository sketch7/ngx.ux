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

### Comparsion Operands
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
| Size Type | Size Range |
| --------- | ---------- |
| xsmall    | <=449      |
| small     | 450-766    |
| medium    | 767-991    |
| large     | 992-1199   |
| xlarge    | 1200-1499  |
| xxlarge   | 1500-1919  |
| xxlarge1  | >=1920     |


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
this.viewport.sizeType$
  .pipe(
    tap(x => console.log("Viewport - sizeType changed", x)), // { type: 4, name: "xlarge", widthThreshold: 1500 }
  )
  .subscribe();
```

### Viewport for SSR
Since in SSR there is no way to know the client viewport size, we should at least determine device type and handle provide
3 different sizes based on device type e.g. `mobile`, `tablet` or `desktop` so the initial rendering will be closer based on device type.

The basic implemention allows to provide a device type `mobile`, `tablet` or `desktop` and there are static sizes for those.

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
In order to configure globally, you can do so as following:

```ts
import { SsvUxModule } from "@ssv/ngx.ux";

    imports: [
      SsvUxModule.forRoot({
        viewport: { resizePollingSpeed: 66 }
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