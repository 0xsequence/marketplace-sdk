// Generic transformation utilities for API type normalization

export function transformOptional<T, R>(
	value: T | undefined,
	transformer: (value: T) => R,
): R | undefined {
	return value !== undefined ? transformer(value) : undefined;
}

export function transformArray<T, R>(
	items: T[],
	transformer: (item: T) => R,
): R[] {
	return items.map(transformer);
}

export function transformOptionalArray<T, R>(
	items: T[] | undefined,
	transformer: (item: T) => R,
): R[] | undefined {
	return items !== undefined ? items.map(transformer) : undefined;
}

export function transformRecord<K extends string, V, R>(
	record: Record<K, V>,
	transformer: (value: V, key: K) => R,
): Record<K, R> {
	return Object.fromEntries(
		Object.entries(record).map(([key, value]) => [
			key,
			transformer(value as V, key as K),
		]),
	) as Record<K, R>;
}

export function transformOptionalField<K extends string, T, R>(
	key: K,
	value: T | undefined,
	transformer: (value: T) => R,
): Record<K, R> | Record<string, never> {
	return value !== undefined
		? ({ [key]: transformer(value) } as Record<K, R>)
		: {};
}

export function spreadWith<TObj, TOverrides>(
	obj: TObj,
	overrides: TOverrides,
): Omit<TObj, keyof TOverrides> & TOverrides {
	return {
		...obj,
		...overrides,
	} as Omit<TObj, keyof TOverrides> & TOverrides;
}

export type Page = {
	page: number;
	pageSize: number;
	more?: boolean;
	sort?: Array<SortBy>;
};

export type SortBy = {
	column: string;
	order: 'ASC' | 'DESC';
};

export type BuildPageParams = {
	page?: number;
	pageSize?: number;
	more?: boolean;
	sort?: Array<SortBy>;
};

export function buildPage(params: BuildPageParams): Page | undefined {
	// If no pagination params are provided, return undefined
	if (
		params.page === undefined &&
		params.pageSize === undefined &&
		!params.sort?.length
	) {
		return undefined;
	}

	const page: Page = {
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 30,
	};

	if (params.more !== undefined) {
		page.more = params.more;
	}

	if (params.sort?.length) {
		page.sort = params.sort;
	}

	return page;
}
