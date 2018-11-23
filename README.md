[projecturi]: https://github.com/sketch7/ngx.ux
[projectgit]: https://github.com/sketch7/ngx.ux.git
[changelog]: ./CHANGELOG.md
[releaseworkflowwiki]: ./docs/RELEASE-WORKFLOW.md

[npm]: https://www.npmjs.com

# @ssv/ngx.ux
[![CircleCI](https://circleci.com/gh/sketch7/ngx.ux.svg?style=shield)](https://circleci.com/gh/sketch7/ngx.ux)
[![npm version](https://badge.fury.io/js/%40ssv%2Fngx.ux.svg)](https://badge.fury.io/js/%40ssv%2Fngx.ux)

UX essentials for building apps, utilities which enables you writing richer apps easier.

**Quick links**

[Change logs][changeLog] | [Project Repository][projectUri]

# Installation

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
|---------|-----------------------|
| =       | Equals                |
| <>      | Not equals            |
| <       | Less than             |
| <=      | Less than or equal    |
| >       | Greater than          |
| >=      | Greater Than or equal |

<br>

### Size Types
| Size Type | Size Range |
|-----------|------------|
| xsmall    | <=450      |
| small     | 450-767    |
| medium    | 767-992    |
| large     | 992-1200   |
| xlarge    | 1200-1500  |
| xxlarge   | 1500-2000  |


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
// todo


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

* NodeJS v10+
* Visual Studio Code or similar code editor
* TypeScript 3.1+
* Git + SourceTree, SmartGit or similar (optional)
* Ensure to install **global NPM modules** using the following:

```bash
npm install -g git gulp yarn devtool
```

#### Cloning Repo

* Run `git clone https://github.com/sketch7/ngx.ux.git`

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

### Development utils

#### Watch

Builds on changes.

```bash
npm start
```

#### Running Continuous Tests

Spawns test runner and keep watching for changes.

```bash
npm run tdd
```

### Preparation for Release

```bash
npm run prepare-release -- --bump major|minor|patch|prerelease (default: patch)
```

Check out the [release workflow guide][releaseworkflowwiki] in order to guide you creating a release and publishing it.
