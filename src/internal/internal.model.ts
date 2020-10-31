export interface Dictionary<T> {
	[key: string]: T;
}

export type EnumDictionary<TKey extends PropertyKey, TValue> = {
	[K in TKey]: TValue;
};

export type PartialDeep<T> = {
	[P in keyof T]?: PartialDeep<T[P]>;
};
