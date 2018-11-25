import { Dictionary } from "../internal/internal.model";
import {
	ComparisonOperation,
	ViewportSizeMatcherExpression,
	ViewportSizeTypeInfo,
	ViewportMatchConditions,
	ViewportSizeType
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