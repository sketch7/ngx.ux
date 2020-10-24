import { Dictionary } from "../internal/internal.model";
import {
	ComparisonOperation,
	ViewportSizeMatcherExpression,
	ViewportSizeTypeInfo,
	ViewportMatchConditions,
	ViewportSizeType,
	UxViewportBreakpoints,
	ViewportDictionary,
	ViewportSizeTypeLiteral
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
 * Generates the viewport information based on the given key and value. Used to generate the
 *  viewport dictionary
 * @param breakpointKey the breakpoint key e.g small or medium
 * @param breakpoint the breakpoint value e.g 500
 */
function generateViewportSizeInformation(
		breakpointKey: ViewportSizeTypeLiteral,
		breakpoint: number
	): Partial<ViewportDictionary> {

	return {
		[ViewportSizeType[breakpointKey]]: Object.freeze<ViewportSizeTypeInfo>({
			name: breakpointKey,
			type: ViewportSizeType[breakpointKey],
			widthThreshold: breakpoint
		})
	};
}

/**
 * Generate a dictionary with all the information on every viewport available
 * @param breakpoints the breakpoints obtained from the config
 */
export function generateViewportDictionary(breakpoints: UxViewportBreakpoints): Readonly<ViewportDictionary> {
	return Object.freeze<ViewportDictionary>(
		Object.keys(breakpoints)
		.map<Partial<ViewportDictionary>>(
			breakpointKey => generateViewportSizeInformation(
				breakpointKey as ViewportSizeTypeLiteral,
				breakpoints[breakpointKey as keyof UxViewportBreakpoints])
		).reduce<Partial<ViewportDictionary>>(
			(previous, current) => ({ ...previous, ...current }),
			{}
		) as ViewportDictionary
	);
}
