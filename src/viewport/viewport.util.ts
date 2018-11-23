import { Dictionary } from "../internal/internal.model";
import { ComparisonOperation } from "./viewport.model";

export interface ViewportSizeMatcherExpression {
	size: string;
	operation: ComparisonOperation;
}

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

