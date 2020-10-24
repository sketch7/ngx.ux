import { Dictionary } from "../internal/internal.model";
import {
	ComparisonOperation,
	ViewportSizeMatcherExpression,
	ViewportSizeTypeInfo,
	ViewportMatchConditions,
	ViewportSizeType,
	UxViewportBreakpoints,
	ViewportDictionary
} from "./viewport.model";

export function isViewportSizeMatcherExpression(value: unknown): value is ViewportSizeMatcherExpression {
	if (typeof value !== "object" || !value) {
		return false;
	}
	const args: Partial<ViewportSizeMatcherExpression> = value;
	if (args.size && args.operation) {
		return true;
	}
	return false;
}

export function isViewportSizeMatcherTupleExpression(arg: unknown): arg is [ComparisonOperation, string] {
	if (!arg) {
		return false;
	}
	if (Array.isArray(arg)) {
		if (arg.length === 2) {
			const [op] = arg;
			return operations.includes(op);
		}
	}
	return false;
}


const operations = Object.values(ComparisonOperation);

export const COMPARISON_OPERATION_FUNC_MAPPING: Dictionary<(a: number, b: number) => boolean> = {
	[ComparisonOperation.equals]: (a: number, b: number) => a === b,
	[ComparisonOperation.notEquals]: (a: number, b: number) => a !== b,
	[ComparisonOperation.lessThan]: (a: number, b: number) => a < b,
	[ComparisonOperation.lessOrEqualThan]: (a: number, b: number) => a <= b,
	[ComparisonOperation.greaterThan]: (a: number, b: number) => a > b,
	[ComparisonOperation.greaterOrEqualThan]: (a: number, b: number) => a >= b,
};

export function isViewportConditionMatch(evaluteSize: ViewportSizeTypeInfo, conditions: ViewportMatchConditions) {
	const isExcluded = match(conditions.sizeTypeExclude, evaluteSize.name, false);
	let isIncluded;
	let isExpressionTruthy;

	if (!isExcluded && conditions.expresson) {
		const expressionSizeTypeValue: number = ViewportSizeType[
			conditions.expresson.size as any
		] as any;
		const expMatcher = COMPARISON_OPERATION_FUNC_MAPPING[conditions.expresson.operation];

		isExpressionTruthy = expMatcher(evaluteSize.type, expressionSizeTypeValue);
	} else {
		isIncluded = match(conditions.sizeType, evaluteSize.name, true);
	}

	const shouldRender = (isExpressionTruthy || isIncluded) && !isExcluded;
	// console.warn(">>> shouldRender", { evaluteSize, conditions, shouldRender });
	return !!shouldRender;
}

function match(value: string | string[] | null | undefined, targetValue: string, defaultValue: boolean) {
	if (!value) {
		return defaultValue;
	}

	return Array.isArray(value)
		? value.includes(targetValue)
		: value === targetValue;
}

/**
 * Generate a dictionary with all the information on every viewport available
 * @param breakpoints the breakpoints obtained from the config
 */
export function generateViewportDictionary(breakpoints: UxViewportBreakpoints): Readonly<ViewportDictionary> {
	return Object.freeze<ViewportDictionary>({
		[ViewportSizeType.xsmall]: Object.freeze<ViewportSizeTypeInfo>({
			name: "xsmall",
			type: ViewportSizeType.xsmall,
			widthThreshold: breakpoints.xsmall,
		}),
		[ViewportSizeType.small]: Object.freeze<ViewportSizeTypeInfo>({
			name: "small",
			type: ViewportSizeType.small,
			widthThreshold: breakpoints.small,
		}),
		[ViewportSizeType.medium]: Object.freeze<ViewportSizeTypeInfo>({
			name: "medium",
			type: ViewportSizeType.medium,
			widthThreshold: breakpoints.medium,
		}),
		[ViewportSizeType.large]: Object.freeze<ViewportSizeTypeInfo>({
			name: "large",
			type: ViewportSizeType.large,
			widthThreshold: breakpoints.large,
		}),
		[ViewportSizeType.xlarge]: Object.freeze<ViewportSizeTypeInfo>({
			name: "xlarge",
			type: ViewportSizeType.xlarge,
			widthThreshold: breakpoints.xlarge,
		}),
		[ViewportSizeType.xxlarge]: Object.freeze<ViewportSizeTypeInfo>({
			name: "xxlarge",
			type: ViewportSizeType.xxlarge,
			widthThreshold: breakpoints.xxlarge,
		}),
		[ViewportSizeType.xxlarge1]: Object.freeze<ViewportSizeTypeInfo>({
			name: "xxlarge1",
			type: ViewportSizeType.xxlarge1,
			widthThreshold: breakpoints.xxlarge1,
		}),
	});
}
