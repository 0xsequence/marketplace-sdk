'use client';

import {
	AddIcon,
	Field,
	FieldLabel,
	IconButton,
	NumericInput,
	SubtractIcon,
} from '@0xsequence/design-system';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../../../../../utils';

type QuantityInputProps = {
	quantity: bigint;
	invalidQuantity: boolean;
	onQuantityChange: (quantity: bigint) => void;
	onInvalidQuantityChange: (invalid: boolean) => void;
	maxQuantity: string;
	className?: string;
	disabled?: boolean;
};

export default function QuantityInput({
	quantity,
	invalidQuantity,
	onQuantityChange,
	onInvalidQuantityChange,
	maxQuantity,
	className,
	disabled,
}: QuantityInputProps) {
	const maxQuantityBigInt = useMemo(() => BigInt(maxQuantity), [maxQuantity]);
	const minQuantity = 1n;

	const [currentQuantity, setCurrentQuantity] = useState(quantity);
	const [localQuantity, setLocalQuantity] = useState(quantity.toString());

	// Sync internal state with external prop changes and validate initial quantity
	useEffect(() => {
		// Check if initial quantity exceeds max quantity
		if (quantity > maxQuantityBigInt) {
			// If initial quantity is too high, set it to max quantity
			setLocalQuantity(maxQuantity);
			setCurrentQuantity(maxQuantityBigInt);
			onQuantityChange(maxQuantityBigInt);
			onInvalidQuantityChange(false);
		} else {
			setLocalQuantity(quantity.toString());
			setCurrentQuantity(quantity);
		}
	}, [
		quantity,
		maxQuantity,
		maxQuantityBigInt,
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
			const bigIntValue = BigInt(value);
			onQuantityChange(bigIntValue);
			setCurrentQuantity(bigIntValue);
			onInvalidQuantityChange(false);
		} else {
			onInvalidQuantityChange(true);
		}
	};

	function handleChangeQuantity(value: string) {
		if (!value) {
			setLocalQuantity('');
			return;
		}

		if (value.includes('.')) {
			setQuantity({
				value,
				isValid: false,
			});
			return;
		}

		try {
			const bigIntValue = BigInt(value);
			const isBiggerThanMax = bigIntValue > maxQuantityBigInt;
			const isLessThanMin = bigIntValue < minQuantity;

			if (isLessThanMin) {
				setQuantity({
					value, // Trying to enter value less than 1
					isValid: false,
				});
				return;
			}

			if (isBiggerThanMax) {
				setQuantity({
					value: maxQuantity,
					isValid: true, // Is valid is true because we override the value
				});
				return;
			}

			setQuantity({
				value,
				isValid: true,
			});
		} catch {
			// Invalid BigInt value
			setQuantity({
				value,
				isValid: false,
			});
		}
	}

	function handleIncrement() {
		const newValue = currentQuantity + 1n;
		if (newValue >= maxQuantityBigInt) {
			setQuantity({
				value: maxQuantity,
				isValid: true,
			});
		} else {
			setQuantity({
				value: newValue.toString(),
				isValid: true,
			});
		}
	}

	function handleDecrement() {
		const newValue = currentQuantity - 1n;
		if (newValue < minQuantity) {
			setQuantity({
				value: minQuantity.toString(),
				isValid: true,
			});
		} else {
			setQuantity({
				value: newValue.toString(),
				isValid: true,
			});
		}
	}

	function handleBlur() {
		if (!localQuantity) {
			setQuantity({
				value: minQuantity.toString(),
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
					decimals={0}
					controls={
						<div className="flex items-center gap-1">
							<IconButton
								disabled={currentQuantity <= minQuantity}
								onClick={handleDecrement}
								size="xs"
								icon={SubtractIcon}
							/>

							<IconButton
								disabled={currentQuantity >= maxQuantityBigInt}
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
					onBlur={handleBlur}
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
