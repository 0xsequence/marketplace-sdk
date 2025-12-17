'use client';

import { type PropertyFilter, PropertyType } from '@0xsequence/marketplace-sdk';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../accordion';
import { IntFilter } from './IntFilter';
import { StringFilter } from './StringFilter';

export type FilterProps = {
	filter: PropertyFilter;
	filterValuesLoading?: boolean;
};

type PropertyFiltersProps = {
	filters?: PropertyFilter[];
	filterNamesLoading?: boolean;
	filterValuesLoading?: boolean;
};

export const PropertyFilters = ({
	filters,
	filterNamesLoading,
	filterValuesLoading,
}: PropertyFiltersProps) => {
	if (filterNamesLoading) {
		return (
			<Accordion type="single" collapsible>
				<AccordionItem value="a" disabled className="loading">
					<AccordionTrigger />
					<AccordionContent />
				</AccordionItem>

				<AccordionItem value="b" disabled className="loading">
					<AccordionTrigger />
					<AccordionContent />
				</AccordionItem>

				<AccordionItem value="c" disabled className="loading">
					<AccordionTrigger />
					<AccordionContent />
				</AccordionItem>
			</Accordion>
		);
	}

	if (!filters || filters.length === 0) {
		return null;
	}

	return (
		<Accordion type="single" collapsible>
			{filters.map((filter) => {
				switch (filter.type) {
					case PropertyType.STRING:
					case PropertyType.ARRAY:
						return (
							<StringFilter
								key={filter.name}
								filter={filter}
								filterValuesLoading={filterValuesLoading}
							/>
						);
					case PropertyType.INT:
						return (
							<IntFilter
								key={filter.name}
								filter={filter}
								filterValuesLoading={filterValuesLoading}
							/>
						);
					default:
						return null;
				}
			})}
		</Accordion>
	);
};
