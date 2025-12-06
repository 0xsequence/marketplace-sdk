'use client';

import {
	Button,
	capitalize,
	cn,
	Spinner,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import { useFilterState } from '@0xsequence/marketplace-sdk/react';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../accordion';
import type { FilterProps } from './PropertyFilters';

const useIntRangeFilter = (
	name: string,
	filterMin?: number,
	filterMax?: number,
) => {
	const { getIntFilterRange, setIntFilterValue } = useFilterState();
	const range = getIntFilterRange(name);
	const currentMin = range?.[0];
	const currentMax = range?.[1];
	const [localMin, setMin] = useState(
		currentMin !== undefined ? String(currentMin) : '',
	);
	const [localMax, setMax] = useState(
		currentMax !== undefined ? String(currentMax) : '',
	);
	const isEditingRef = useRef(false);

	useEffect(() => {
		if (isEditingRef.current) return;

		if (range === undefined) {
			setMin('');
			setMax('');
		} else {
			setMin(range[0] !== undefined ? String(range[0]) : '');
			setMax(range[1] !== undefined ? String(range[1]) : '');
		}
	}, [range]);

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement>,
		setter: (value: string) => void,
		boundaryValue?: number,
		isMin = true,
	) => {
		isEditingRef.current = true;

		const value = e.target.value;

		if (value === '') {
			setter('');
			return;
		}

		const numValue = Number(value);

		if (
			boundaryValue !== undefined &&
			((isMin && numValue < boundaryValue) ||
				(!isMin && numValue > boundaryValue))
		) {
			setter(String(boundaryValue));
		} else {
			setter(value);
		}
	};

	const isValid = useMemo(() => {
		if (localMin === '' && localMax === '') {
			return false;
		}

		const minValue = localMin === '' ? (filterMin ?? 0) : Number(localMin);
		const maxValue = localMax === '' ? (filterMax ?? 0) : Number(localMax);

		return !(minValue > maxValue && maxValue !== 0);
	}, [localMin, localMax, filterMin, filterMax]);

	const applyFilter = () => {
		if (!isValid) return;

		const minValue = localMin === '' ? (filterMin ?? 0) : Number(localMin);
		const maxValue = localMax === '' ? (filterMax ?? 0) : Number(localMax);

		isEditingRef.current = false;

		setIntFilterValue(name, minValue, maxValue);
	};

	return {
		localMin,
		localMax,
		isValid,
		handleMinChange: (e: ChangeEvent<HTMLInputElement>) =>
			handleInputChange(e, setMin, filterMin, true),
		handleMaxChange: (e: ChangeEvent<HTMLInputElement>) =>
			handleInputChange(e, setMax, filterMax, false),
		applyFilter,
	};
};

export const IntFilter = ({ filter, filterValuesLoading }: FilterProps) => {
	const { name, min: filterMin, max: filterMax } = filter;

	const {
		localMin,
		localMax,
		isValid,
		handleMinChange,
		handleMaxChange,
		applyFilter,
	} = useIntRangeFilter(name, filterMin, filterMax);

	return (
		<AccordionItem
			value={name}
			className="cursor-pointer bg-background-secondary py-2.5 pr-2 pl-3 text-primary"
		>
			<AccordionTrigger className="p-2 pl-0 text-left font-bold text-primary">
				{capitalize(name)}
			</AccordionTrigger>

			<AccordionContent asChild>
				<div className="flex flex-col gap-2 pb-3">
					<div className="mt-3 flex w-full items-center gap-4">
						<div
							className={cn(
								'[&>label>div>div]:h-9 [&>label>div>div]:rounded-lg [&>label>div>div]:px-2',
								'[&>label>div>div>svg]:w-3',
								'[&>label>div>div>input]:h-8 [&>label>div>div>input]:bg-none! [&>label>div>div>input]:py-1 [&>label>div>div>input]:text-xs',
							)}
						>
							<TextInput
								name={`${name}-min`}
								id={`${name}-min`}
								type="number"
								placeholder={filterValuesLoading ? '...' : String(filterMin)}
								value={localMin}
								className="w-full"
								onChange={handleMinChange}
								min={filterMin}
								aria-label={`Minimum ${name}`}
								disabled={filterValuesLoading}
							/>
						</div>

						<Text className="text-secondary text-xs uppercase">to</Text>

						<div
							className={cn(
								'[&>label>div>div]:h-9 [&>label>div>div]:rounded-lg [&>label>div>div]:px-2',
								'[&>label>div>div>svg]:w-3',
								'[&>label>div>div>input]:h-8 [&>label>div>div>input]:bg-none! [&>label>div>div>input]:py-1 [&>label>div>div>input]:text-xs',
							)}
						>
							<TextInput
								name={`${name}-max`}
								id={`${name}-max`}
								type="number"
								placeholder={filterValuesLoading ? '...' : String(filterMax)}
								value={localMax}
								className="w-full"
								onChange={handleMaxChange}
								max={filterMax}
								aria-label={`Maximum ${name}`}
								disabled={filterValuesLoading}
							/>
						</div>
					</div>

					<Button
						size="xs"
						className="mt-2 w-full rounded-sm bg-button-glass text-primary hover:bg-button-glass/80"
						onClick={applyFilter}
						disabled={!isValid || filterValuesLoading}
					>
						{filterValuesLoading ? (
							<div className="flex items-center gap-2">
								<Spinner size="sm" />
								<Text className="text-xs">Apply</Text>
							</div>
						) : (
							<Text>Apply</Text>
						)}
					</Button>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};
