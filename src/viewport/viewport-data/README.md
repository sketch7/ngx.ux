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