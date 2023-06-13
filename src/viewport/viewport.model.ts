import { Dictionary } from "../internal/internal.model";
import { ViewportDataMatchStrategy } from "./viewport-data";

/**
 * The indices of each breakpoint provided based on the `UX_VIEWPORT_DEFAULT_BREAKPOINTS`.
 * @see UX_VIEWPORT_DEFAULT_BREAKPOINTS
 */
export enum ViewportSizeType {
	xsmall = 0,
	small = 1,
	medium = 2,
	large = 3,
	xlarge = 4,
	xxlarge = 5,
	xxlarge1 = 6,
}

export enum ComparisonOperation {
	equals = "=",
	notEquals = "<>",
	lessThan = "<",
	lessOrEqualThan = "<=",
	greaterThan = ">",
	greaterOrEqualThan = ">=",
}

export type ComparisonOperationKeyType = keyof typeof ComparisonOperation;
export type ComparisonOperationValueType = "=" | "<>" | "<" | "<=" | ">" | ">="; // todo: find a better way to do this
export type ComparisonOperationLiteral = ComparisonOperationKeyType | ComparisonOperationValueType;

export enum DeviceType {
	desktop = "desktop",
	mobile = "mobile",
	tablet = "tablet"
}

export interface UxViewportOptions {
	/** Polling speed on resizing (in milliseconds). e.g. the higher the number the longer it takes to recalculate. */
	resizePollingSpeed: number;

	/** Breakpoints to use. Key needs to match the size type and the value the width threshold.
	 * e.g. given width '1000' and `medium` is set to '992' => `large`.
	 */
	breakpoints: Dictionary<number>;

	/** Default data match strategy to use. */
	defaultDataMatchStrategy: ViewportDataMatchStrategy;
}

export interface ViewportSize {
	width: number;
	height: number;
}

export interface ViewportSizeTypeInfo {
	type: number;
	name: string;
	widthThreshold: number;
}

export interface ViewportMatchConditions {
	sizeType?: string | string[] | null;
	sizeTypeExclude?: string | string[] | null;
	expression?: ViewportSizeMatcherExpression;
}

export interface ViewportSizeMatcherExpression {
	size: string;
	operation: ComparisonOperationLiteral;
}
