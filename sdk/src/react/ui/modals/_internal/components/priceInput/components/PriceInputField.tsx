'use client';

import { NumericInput } from '@0xsequence/design-system';
import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import { useCallback, useEffect, useRef } from 'react';

interface PriceInputFieldProps {
	value: string;
	onChange: (value: string) => void;
	decimals: number;
	disabled?: boolean;
	autoFocus?: boolean;
}

interface DnumPriceInputFieldProps {
	dnValue: Dnum;
	onChange: (dnValue: Dnum) => void;
	disabled?: boolean;
	autoFocus?: boolean;
}

export default function PriceInputField({
	value,
	onChange,
	decimals,
	disabled,
	autoFocus = true,
}: PriceInputFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus input on mount if autoFocus is enabled
	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [autoFocus]);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onChange(event.target.value);
		},
		[onChange],
	);

	return (
		<NumericInput
			ref={inputRef}
			className="ml-5 w-full text-xs"
			name="price-input"
			decimals={decimals}
			label="Enter price"
			labelLocation="top"
			value={value}
			onChange={handleChange}
			disabled={disabled}
		/>
	);
}

export function DnumPriceInputField({
	dnValue,
	onChange,
	disabled,
	autoFocus = true,
}: DnumPriceInputFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [, decimals] = dnValue;

	// Convert DNUM to display value
	const displayValue = dn.format(dnValue);

	// Focus input on mount if autoFocus is enabled
	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [autoFocus]);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value;
			const newDnValue = dn.from(newValue, decimals);
			onChange(newDnValue);
		},
		[decimals, onChange],
	);

	return (
		<NumericInput
			ref={inputRef}
			className="ml-5 w-full text-xs"
			name="price-input"
			decimals={decimals}
			label="Enter price"
			labelLocation="top"
			value={displayValue}
			onChange={handleChange}
			disabled={disabled}
		/>
	);
}
