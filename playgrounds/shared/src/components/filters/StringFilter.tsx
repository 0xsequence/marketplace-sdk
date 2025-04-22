'use client';

import {
	Checkbox,
	Skeleton,
	Text,
	capitalize,
} from '@0xsequence/design-system';
import { useFilterState } from '@0xsequence/marketplace-sdk/react';
import { AccordionContent, AccordionTrigger } from '../accordion';
import { AccordionItem } from '../accordion';
import type { FilterProps } from './PropertyFilters';

export const StringFilter = ({ filter, filterValuesLoading }: FilterProps) => {
	const { name, values } = filter;

	const { toggleStringFilterValue, isStringValueSelected } = useFilterState();

	const onCheckChange = (value: string) => {
		toggleStringFilterValue(name, value);
	};

	return (
		<AccordionItem
			value={name}
			className="&:nth-child(1):bg-red-200! bg-background-secondary py-2.5 pr-2 pl-3 text-primary"
		>
			<AccordionTrigger className="rounded-md p-2 pl-0 text-left font-bold text-primary">
				{capitalize(name)}
			</AccordionTrigger>

			{filterValuesLoading && <StringFilterSkeleton />}

			{!filterValuesLoading && values && (
				<AccordionContent>
					{values.length === 0 && (
						<Text className="text-muted" asChild>
							<span>No Results</span>
						</Text>
					)}

					{values.length > 0 &&
						values.map((option) => (
							<div key={option} className="mb-2 flex items-center gap-2">
								<Checkbox
									checked={isStringValueSelected(name, option)}
									onCheckedChange={() => onCheckChange(option)}
								/>
								<Text className="text-secondary text-xs">{option}</Text>
							</div>
						))}
				</AccordionContent>
			)}
		</AccordionItem>
	);
};

const StringFilterSkeleton = () => {
	return (
		<AccordionContent>
			{Array.from({ length: 3 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<div key={index} className="mb-2 flex items-center gap-2">
					<Checkbox checked={false} disabled />
					<Skeleton className="h-4 w-full" />
				</div>
			))}
		</AccordionContent>
	);
};
