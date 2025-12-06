'use client';

import {
	AddIcon,
	Field,
	FieldLabel,
	IconButton,
	NumericInput,
	SubtractIcon,
} from '@0xsequence/design-system';
import * as dn from 'dnum';
import { useEffect, useState } from 'react';
import { cn } from '../../../../../../utils';

type QuantityInputProps = {
	quantity: bigint;
	invalidQuantity: boolean;
	onQuantityChange: (quantity: bigint) => void;
	onInvalidQuantityChange: (invalid: boolean) => void;
	decimals?: number;
	maxQuantity: bigint;
	className?: string;
	disabled?: boolean;
};

export default function QuantityInput({
	quantity,
	invalidQuantity,
	onQuantityChange,
	onInvalidQuantityChange,
	decimals = 0,
	maxQuantity,
	className,
	disabled,
}: QuantityInputProps) {
	const dnMaxQuantity = dn.from(maxQuantity, decimals);
	const minIncrement = decimals > 0 ? `0.${'1'.padStart(decimals, '0')}` : '1';
	const dnIncrement = dn.from(minIncrement, decimals);
	const min = decimals > 0 ? minIncrement : '1';
	const dnMin = dn.from(min, decimals);

	const dnQuantityInitial = dn.from(quantity, decimals);
	const [dnQuantity, setDnQuantity] = useState(dnQuantityInitial);
	const [localQuantity, setLocalQuantity] = useState(
		dn.toString(dnQuantityInitial, decimals),
	);

	// Sync internal state with external prop changes and validate initial quantity
	useEffect(() => {
		const dnInitialQuantity = dn.from(quantity, decimals);
		const dnMaxQuantity = dn.from(maxQuantity, decimals);

		// Check if initial quantity exceeds max quantity
		if (dn.greaterThan(dnInitialQuantity, dnMaxQuantity)) {
			// If initial quantity is too high, set it to max quantity
			const validQuantity = dn.toString(dnMaxQuantity, decimals);
			setLocalQuantity(validQuantity);
			setDnQuantity(dnMaxQuantity);
			onQuantityChange(dnMaxQuantity[0]);
			onInvalidQuantityChange(false);
		} else {
			setLocalQuantity(dn.toString(dnInitialQuantity, decimals));
			setDnQuantity(dnInitialQuantity);
		}
	}, [
		quantity,
		decimals,
		maxQuantity,
		onQuantityChange,
		onInvalidQuantityChange,
	]);

	const setValidQuantity = (value: dn.Dnum) => {
		const valueStr = dn.toString(value, decimals);
		setLocalQuantity(valueStr);
		setDnQuantity(value);
		onQuantityChange(value[0]);
		onInvalidQuantityChange(false);
	};

	function handleChangeQuantity(value: string) {
		if (!value || Number.isNaN(Number(value)) || value.endsWith('.')) {
			setLocalQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}
		const dnValue = dn.from(value, decimals);
		const isBiggerThanMax = dn.greaterThan(dnValue, dnMaxQuantity);
		const isLessThanMin = dn.lessThan(dnValue, dnMin);

		if (isLessThanMin) {
			setLocalQuantity(value); // Trying to enter fraction starting with 0
			onInvalidQuantityChange(true);
			return;
		}

		if (isBiggerThanMax) {
			setValidQuantity(dnMaxQuantity); // Value capped at max quantity
			return;
		}

		setValidQuantity(dnValue);
	}

	function handleIncrement() {
		const newValue = dn.add(dnQuantity, dnIncrement);
		if (dn.greaterThanOrEqual(newValue, dnMaxQuantity)) {
			setValidQuantity(dnMaxQuantity);
		} else {
			setValidQuantity(newValue);
		}
	}

	function handleDecrement() {
		const newValue = dn.subtract(dnQuantity, dnIncrement);
		if (dn.lessThanOrEqual(newValue, dnMin)) {
			setValidQuantity(dnMin);
		} else {
			setValidQuantity(newValue);
		}
	}

	return (
		<div
			className={cn(
				'flex w-full flex-col',
				className,
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<Field>
				<FieldLabel htmlFor="quantity" className="text-xs">
					Enter quantity
				</FieldLabel>

				<NumericInput
					aria-label="Enter quantity"
					className="h-9 w-full rounded pr-0 [&>div]:pr-2 [&>input]:text-xs"
					name={'quantity'}
					decimals={decimals || 0}
					controls={
						<div className="flex items-center gap-1">
							<IconButton
								disabled={dn.lessThanOrEqual(dnQuantity, dnMin)}
								onClick={handleDecrement}
								size="xs"
								icon={SubtractIcon}
							/>

							<IconButton
								disabled={dn.greaterThanOrEqual(dnQuantity, dnMaxQuantity)}
								onClick={handleIncrement}
								size="xs"
								icon={AddIcon}
							/>
						</div>
					}
					value={localQuantity}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						handleChangeQuantity(e.target.value)
					}
					width={'full'}
				/>
			</Field>

			{invalidQuantity && (
				<div className="mt-1.5 font-medium text-amber-500 text-xs">
					Invalid quantity
				</div>
			)}
		</div>
	);
}
