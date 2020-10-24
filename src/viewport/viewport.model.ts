export enum ViewportSizeType {
	xsmall = 0,
	small = 1,
	medium = 2,
	large = 3,
	xlarge = 4,
	xxlarge = 5,
	xxlarge1 = 6
}

export enum ComparisonOperation {
	equals = "=",
	notEquals = "<>",
	lessThan = "<",
	lessOrEqualThan = "<=",
	greaterThan = ">",
	greaterOrEqualThan = ">=",
}

export enum DeviceType {
	desktop = "desktop",
	mobile = "mobile",
	tablet = "tablet"
}

export interface UxViewportBreakpoints {
	xsmall: number;
	small: number;
	medium: number;
	large: number;
	xlarge: number;
	xxlarge: number;
	xxlarge1: number;
}

export interface UxViewportOptions {
	breakpoints: UxViewportBreakpoints;
	resizePollingSpeed: number; // Polling speed on resizing (in milliseconds). e.g. the higher the number the longer it takes to recalculate.
}

export interface ViewportSize {
	width: number;
	height: number;
}

export interface ViewportSizeTypeInfo {
	type: ViewportSizeType;
	name: string;
	widthThreshold: number;
}

export interface ViewportMatchConditions {
	sizeType?: string | string[] | null;
	sizeTypeExclude?: string | string[] | null;
	expresson?: ViewportSizeMatcherExpression;
}

export interface ViewportSizeMatcherExpression {
	size: string;
	operation: ComparisonOperation;
}

export type ViewportDictionary = {
	[key in ViewportSizeType]: ViewportSizeTypeInfo;
};
