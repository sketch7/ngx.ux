export interface Dictionary<T> {
	[key: string]: T;
}

export type PartialDeep<T> = {
	[P in keyof T]?: PartialDeep<T[P]>;
};
