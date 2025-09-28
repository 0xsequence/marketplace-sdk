import { Spinner, Text } from '@0xsequence/design-system';
import type { UseQueryResult } from '@tanstack/react-query';

export interface MultiQueryWrapperProps<
	T extends Record<string, UseQueryResult>,
> {
	queries: T;
	children: (
		data: { [K in keyof T]: NonNullable<T[K]['data']> },
	) => React.ReactNode;
}

export function QueryWrapper<T extends Record<string, UseQueryResult>>({
	queries,
	children,
}: MultiQueryWrapperProps<T>) {
	const isLoading = Object.values(queries).some((q) => q.isLoading);
	const isError = Object.values(queries).some((q) => q.isError);
	const errors = Object.values(queries)
		.filter((q) => q.isError)
		.map((q) => q.error);

	const hasAllData = Object.values(queries).every((q) => q.data !== undefined);

	if (isLoading || !hasAllData) {
		return (
			<div
				className="flex w-full items-center justify-center"
				data-testid="error-loading-wrapper"
			>
				<div data-testid="spinner">
					<Spinner size="lg" />
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div>
				<Text>Error: {errors[0]?.message || 'An error occurred'}</Text>
			</div>
		);
	}

	const data = Object.entries(queries).reduce(
		(acc, [key, query]) => {
			// biome-ignore lint/suspicious/noExplicitAny: Safe to use any since we checked hasAllData
			// biome-ignore lint/style/noNonNullAssertion: Safe to use ! since we checked hasAllData
			(acc as any)[key] = query.data!;
			return acc;
		},
		{} as { [K in keyof T]: NonNullable<T[K]['data']> },
	);

	return <>{children(data)}</>;
}
