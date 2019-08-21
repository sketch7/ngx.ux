export interface ViewportSize {
	width: number;
	height: number;
}

export enum ViewportSizeType {
	xsmall = 0,
	small = 1,
	medium = 2,
	large = 3,
	xlarge = 4,
	xxlarge = 5,
	xxlarge1 = 6
}

export interface ViewportSizeTypeInfo {
	type: ViewportSizeType;
	name: string;
	widthThreshold: number;
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

export interface UxViewportOptions {
	/** Polling speed on resizing (in milliseconds). e.g. the higher the number the longer it takes to recalculate. */
	resizePollingSpeed: number;
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