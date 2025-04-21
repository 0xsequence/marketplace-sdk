'use client';

import { CloseIcon, Text } from '@0xsequence/design-system';
import { useFilterState } from '../../../../../../sdk/src/react';

type IntBadgeProps = {
	name: string;
	min?: number | undefined;
	max?: number | undefined;
};

export const IntBadge = ({ name, min, max }: IntBadgeProps) => {
	const { deleteFilter } = useFilterState();

	const formatValue = (value: number | undefined) => {
		if (value === undefined) return '-';
		return value.toLocaleString();
	};

	const displayValue = `${formatValue(min)} to ${formatValue(max)}`;

	return (
		<div className="flex h-7 items-center rounded-md border border-border-base px-2 py-1 text-primary capitalize">
			<Text className="mr-1 text-xs" color="text50" fontWeight="bold">
				{name}:
			</Text>

			<Text className="text-xs" color="text100" fontWeight="bold">
				{displayValue}
			</Text>
			<CloseIcon
				className="ml-2 h-4 w-4 cursor-pointer"
				onClick={() => deleteFilter(name)}
			/>
		</div>
	);
};
