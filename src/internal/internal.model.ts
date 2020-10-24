export interface Dictionary<T> {
	[key: string]: T;
}

export type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>;
};
