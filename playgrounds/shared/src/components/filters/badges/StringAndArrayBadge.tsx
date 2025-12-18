'use client';

import { CloseIcon, Text } from '@0xsequence/design-system';
import type { PropertyFilter } from '@0xsequence/marketplace-sdk';
import { useFilterState } from '@0xsequence/marketplace-sdk/react';

type StringAndArrayBadgeProps = {
	filter: PropertyFilter;
};

export const StringAndArrayBadge = ({ filter }: StringAndArrayBadgeProps) => {
	const { name, values = [] } = filter;
	const { deleteFilter } = useFilterState();

	return (
		<div className="flex h-7 items-center rounded-md border border-border-base px-2 py-1 text-primary capitalize">
			<Text className="mr-1 text-xs" color="text50" fontWeight="bold">
				{name}:
			</Text>

			<Text className="text-xs" color="text100" fontWeight="bold">
				{(values as string[]).join(', ')}
			</Text>

			<CloseIcon
				className="ml-2 h-4 w-4 cursor-pointer"
				onClick={() => deleteFilter(name)}
			/>
		</div>
	);
};
