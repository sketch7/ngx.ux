import { Dictionary } from "../internal/internal.model";
import {
	ComparisonOperation,
	ViewportSizeMatcherExpression,
	ViewportSizeTypeInfo,
	ViewportMatchConditions
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

export function isViewportConditionMatch(
	evaluateSize: ViewportSizeTypeInfo,
	conditions: ViewportMatchConditions,
	viewportSizeTypeInfoRefs: Dictionary<ViewportSizeTypeInfo>
): boolean {
	const isExcluded = match(conditions.sizeTypeExclude, evaluateSize.name, false);
	let isIncluded;
	let isExpressionTruthy;

	if (!isExcluded && conditions.expression) {
		const ref = viewportSizeTypeInfoRefs[conditions.expression.size];
		if(!ref) {
			throw new Error(`Viewport size type is invalid. Size type: '${conditions.expression.size}'`);
		}
		const expMatcher = COMPARISON_OPERATION_FUNC_MAPPING[conditions.expression.operation];

		isExpressionTruthy = expMatcher(evaluateSize.type, ref.type);
	} else {
		isIncluded = match(conditions.sizeType, evaluateSize.name, true);
	}

	const shouldRender = (isExpressionTruthy || isIncluded) && !isExcluded;
	// console.warn(">>> shouldRender", { evaluateSize, conditions, shouldRender });
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

export function getSizeTypeInfo(width: number, sizeTypes: ViewportSizeTypeInfo[]): ViewportSizeTypeInfo {
	const lastEntryIndex = sizeTypes.length - 1;

	for (let idx = 0; idx < lastEntryIndex; idx++) {
		const viewportSizeTypeInfo = sizeTypes[idx];

		if (width <= viewportSizeTypeInfo.widthThreshold) {
			return viewportSizeTypeInfo;
		}
	}

	return sizeTypes[lastEntryIndex];
}

/**
 * Converts the breakpoints into a 2 dimensional array containing the name and width, and sorted from
 *  smallest to largest.
 * @param breakpoints the breakpoints obtained from the config
 * @internal
 */
function getSortedBreakpoints(breakpoints: Dictionary<number>): [string, number][] {
	return Object.entries(breakpoints)
		.sort(([, widthA], [, widthB]) => widthA - widthB);
}

/**
 * A util function which generates the ViewportSizeTypeInfo.type for each breakpoint.
 * @param breakpoints the custom breakpoints
 */
export function generateViewportSizeType<T extends Record<string, number>>(breakpoints: T): T & Record<number, string> {
	return Object.freeze(
		getSortedBreakpoints(breakpoints).reduce<Record<number | string, string | number>>(
			(dictionary, [name], index) => {
				dictionary[name] = index;
				dictionary[index] = name;
				return dictionary;
			}, {}
		)
	) as T & Record<number, string>;
}

/**
 * Pre-processes the given breakpoints into an ordered list from smallest to largest while generating
 *  all the necessary information on the viewport.
 * @param breakpoints the breakpoints obtained from the config
 * @internal
 */
export function generateViewportSizeTypeInfoList(breakpoints: Dictionary<number>): ViewportSizeTypeInfo[] {
	return getSortedBreakpoints(breakpoints)
		.map(([name, width], index) =>
			(Object.freeze({
				name,
				type: index,
				widthThreshold: width
			}))
		);
}

/**
 * Converts the breakpoint list into a dictionary while using the name as key.
 * @param breakpointList the list of breakpoints
 * @internal
 */
export function generateViewportSizeTypeInfoRefs(breakpointList: ViewportSizeTypeInfo[]): Dictionary<ViewportSizeTypeInfo> {
	return Object.freeze(
		breakpointList.reduce<Dictionary<ViewportSizeTypeInfo>>((dictionary, breakpoint) => {
			dictionary[breakpoint.name] = breakpoint;
			return dictionary;
		}, {})
	);
}
