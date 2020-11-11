# Viewport Data
Data/config per viewport with fallback strategies

## Usage

```ts
import { ViewportDataConfig } from "@ssv/ngx.ux";

// define data config object
dataConfig: ViewportDataConfig<string> = {
  default: "default",
  small: "small",
  large: "large",
  fhd: "laaarger (fhd)",
};
```

```html
{{ dataConfig | ssvViewportData: "smaller" }}
```

### Using Service
```ts
import { ViewportDataService, ViewportDataConfig } from "@ssv/ngx.ux";

class MyComp {

  constructor(
    viewportDataService: ViewportDataService
  ) {
    viewportDataService.get$(dataConfig, ViewportDataMatchStrategy.smaller).pipe(
      tap(x => console.log("Viewport - data changed", x)),
    ).subscribe(); // handle unsubscribe
  }

}
```

### Viewport Matcher Strategies

| Strategy            | Description                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| exact               | Size should match exact or default.                                                                           |
| smaller             | Size matches when exact, first match smaller (down) or default.                                               |
| larger              | Size matches when exact match, first match larger (up) or default.                                            |
| closestSmallerFirst | size matches when exact match, or it tries both smaller/larger (smaller is preferred) until match or default. |
| closestLargerFirst  | Size matches when exact match, or it tries both larger/smaller (larger is preferred) until match or default.  |
