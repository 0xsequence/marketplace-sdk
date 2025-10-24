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
	quantity: string;
	invalidQuantity: boolean;
	onQuantityChange: (quantity: string) => void;
	onInvalidQuantityChange: (invalid: boolean) => void;
	decimals: number;
	maxQuantity: string;
	className?: string;
	disabled?: boolean;
};

export default function QuantityInput({
	quantity,
	invalidQuantity,
	onQuantityChange,
	onInvalidQuantityChange,
	decimals,
	maxQuantity,
	className,
	disabled,
}: QuantityInputProps) {
	const dnMaxQuantity = dn.from(maxQuantity, decimals);
	const minIncrement = decimals > 0 ? `0.${'1'.padStart(decimals, '0')}` : '1';
	const dnIncrement = dn.from(minIncrement, decimals);
	const min = decimals > 0 ? minIncrement : '0';
	const dnMin = dn.from(min, decimals);

	const [dnQuantity, setDnQuantity] = useState(dn.from(quantity, decimals));
	const [localQuantity, setLocalQuantity] = useState(quantity);

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
			onQuantityChange(validQuantity);
			onInvalidQuantityChange(false);
		} else {
			setLocalQuantity(quantity);
			setDnQuantity(dnInitialQuantity);
		}
	}, [
		quantity,
		decimals,
		maxQuantity,
		onQuantityChange,
		onInvalidQuantityChange,
	]);

	const setQuantity = ({
		value,
		isValid,
	}: {
		value: string;
		isValid: boolean;
	}) => {
		setLocalQuantity(value);
		if (isValid) {
			onQuantityChange(value);
			setDnQuantity(dn.from(value, decimals));
			onInvalidQuantityChange(false);
		} else {
			onInvalidQuantityChange(true);
		}
	};

	function handleChangeQuantity(value: string) {
		if (!value || Number.isNaN(Number(value)) || value.endsWith('.')) {
			setQuantity({
				value: value,
				isValid: false,
			});
			return;
		}
		const dnValue = dn.from(value, decimals);
		const isBiggerThanMax = dn.greaterThan(dnValue, dnMaxQuantity);
		const isLessThanMin = dn.lessThan(dnValue, dnMin);

		if (isLessThanMin) {
			setQuantity({
				value: value, // Trying to enter fraction starting with 0
				isValid: false,
			});
			return;
		}

		if (isBiggerThanMax) {
			setQuantity({
				value: maxQuantity,
				isValid: true, // Is vaid is true because we override the value
			});
			return;
		}

		setQuantity({
			value: dn.toString(dnValue, decimals),
			isValid: true,
		});
	}

	function handleIncrement() {
		const newValue = dn.add(dnQuantity, dnIncrement);
		if (dn.greaterThanOrEqual(newValue, dnMaxQuantity)) {
			setQuantity({
				value: dn.toString(dnMaxQuantity, decimals),
				isValid: true,
			});
		} else {
			setQuantity({
				value: dn.toString(newValue, decimals),
				isValid: true,
			});
		}
	}

	function handleDecrement() {
		const newValue = dn.subtract(dnQuantity, dnIncrement);
		if (dn.lessThanOrEqual(newValue, dnMin)) {
			setQuantity({
				value: dn.toString(dnMin, decimals),
				isValid: true,
			});
		} else {
			setQuantity({
				value: dn.toString(newValue, decimals),
				isValid: true,
			});
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
