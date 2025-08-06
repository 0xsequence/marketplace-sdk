'use client';

import {
	AddIcon,
	IconButton,
	NumericInput,
	SubtractIcon,
} from '@0xsequence/design-system';
import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import { useEffect, useState } from 'react';
import { cn } from '../../../../../../utils';

type QuantityInputProps = {
	quantity: Dnum; // User-facing value as Dnum
	invalidQuantity: boolean;
	onQuantityChange: (quantity: Dnum) => void; // Receives user-facing Dnum
	onInvalidQuantityChange: (invalid: boolean) => void;
	maxQuantity: Dnum; // Already contains decimal information
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
	// Extract decimals from maxQuantity since it's in internal representation
	const decimals = maxQuantity[1];

	// Convert maxQuantity from internal representation to user-facing value
	const divisor = dn.from(10n ** BigInt(decimals), 0);
	const maxQuantityUser = dn.divide(maxQuantity, divisor);

	// Minimum user-facing value
	const minUserValue = decimals > 0 ? dn.from(1, decimals) : dn.from(1, 0);

	// Local state for the input value (as string for display)
	const [localQuantity, setLocalQuantity] = useState(() =>
		dn.format(quantity, { digits: decimals, trailingZeros: false }),
	);

	// Sync with external prop changes
	useEffect(() => {
		const formatted = dn.format(quantity, {
			digits: decimals,
			trailingZeros: false,
		});
		setLocalQuantity(formatted);
	}, [quantity, decimals]);

	const setQuantity = ({
		value,
		isValid,
	}: {
		value: Dnum;
		isValid: boolean;
	}) => {
		const formatted = dn.format(value, {
			digits: decimals,
			trailingZeros: false,
		});
		setLocalQuantity(formatted);
		if (isValid) {
			// Always return user-facing values with decimals=0
			const userFacingValue = dn.from(formatted, 0);
			onQuantityChange(userFacingValue);
			onInvalidQuantityChange(false);
		} else {
			onInvalidQuantityChange(true);
		}
	};

	function handleChangeQuantity(value: string) {
		// Allow empty string
		if (!value) {
			setLocalQuantity('');
			onInvalidQuantityChange(true);
			return;
		}

		// Allow decimal point at the end for typing
		if (value.endsWith('.')) {
			setLocalQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}

		// Validate number format (allow numbers and single decimal point)
		const regex = /^\d*\.?\d*$/;
		if (!regex.test(value)) {
			return; // Don't update if invalid format
		}

		// Try to parse as Dnum
		try {
			// Parse as user-facing value
			const dnValue = dn.from(value, 0);

			// Check against max in user terms
			if (dn.greaterThan(dnValue, maxQuantityUser)) {
				setQuantity({
					value: maxQuantityUser,
					isValid: true,
				});
				return;
			}

			// Check against min in user terms
			if (
				dn.greaterThan(minUserValue, dnValue) &&
				!dn.equal(dnValue, dn.from(0, 0))
			) {
				setLocalQuantity(value);
				onInvalidQuantityChange(true);
				return;
			}

			// Check decimal places don't exceed token decimals
			const decimalParts = value.split('.');
			if (decimalParts.length > 1 && decimalParts[1].length > decimals) {
				// Truncate to allowed decimals
				const truncatedValue = `${decimalParts[0]}.${decimalParts[1].slice(0, decimals)}`;
				const truncatedDnum = dn.from(truncatedValue, 0);
				setQuantity({
					value: truncatedDnum,
					isValid: true,
				});
				return;
			}

			// Valid input
			setLocalQuantity(value);
			// Always return user-facing values with decimals=0
			onQuantityChange(dn.from(value, 0));
			onInvalidQuantityChange(false);
		} catch (e) {
			setLocalQuantity(value);
			onInvalidQuantityChange(true);
		}
	}

	function handleIncrement() {
		// Determine increment value based on current quantity and decimals
		let incrementValue: Dnum;

		if (decimals === 0) {
			// For NFTs, always increment by 1
			incrementValue = dn.from('1', 0);
		} else {
			// For tokens with decimals, check if we're dealing with fractional amounts
			const one = dn.from('1', 0);
			if (dn.lessThan(quantity, one)) {
				// If quantity is less than 1, increment by smallest unit
				incrementValue = dn.from(`0.${'0'.repeat(decimals - 1)}1`, 0);
			} else {
				// Otherwise increment by 1
				incrementValue = one;
			}
		}

		const newValue = dn.add(quantity, incrementValue);

		if (dn.greaterThanOrEqual(newValue, maxQuantityUser)) {
			setQuantity({
				value: maxQuantityUser,
				isValid: true,
			});
		} else {
			setQuantity({
				value: newValue,
				isValid: true,
			});
		}
	}

	function handleDecrement() {
		// Determine decrement value based on current quantity and decimals
		let decrementValue: Dnum;

		if (decimals === 0) {
			// For NFTs, always decrement by 1
			decrementValue = dn.from('1', 0);
		} else {
			// For tokens with decimals, check if we're dealing with fractional amounts
			const one = dn.from('1', 0);
			if (dn.lessThanOrEqual(quantity, one)) {
				// If quantity is less than or equal to 1, decrement by smallest unit
				decrementValue = dn.from(`0.${'0'.repeat(decimals - 1)}1`, 0);
			} else {
				// Otherwise decrement by 1
				decrementValue = one;
			}
		}

		const newValue = dn.subtract(quantity, decrementValue);

		if (dn.lessThanOrEqual(newValue, minUserValue)) {
			setQuantity({
				value: minUserValue,
				isValid: true,
			});
		} else {
			setQuantity({
				value: newValue,
				isValid: true,
			});
		}
	}

	// Determine if buttons should be disabled
	const isDecrementDisabled =
		!localQuantity || dn.lessThanOrEqual(quantity, minUserValue);
	const isIncrementDisabled =
		!localQuantity || dn.greaterThanOrEqual(quantity, maxQuantityUser);

	return (
		<div
			className={cn(
				'flex w-full flex-col [&>label>div>div>div:has(:disabled):hover]:opacity-100 [&>label>div>div>div:has(:disabled)]:opacity-100 [&>label>div>div>div>input]:text-xs [&>label>div>div>div]:h-9 [&>label>div>div>div]:rounded [&>label>div>div>div]:pr-0 [&>label>div>div>div]:pl-3 [&>label>div>div>div]:text-xs [&>label]:gap-[2px]',
				className,
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<NumericInput
				className="w-full pl-1"
				name={'quantity'}
				decimals={decimals || 0}
				label={'Enter quantity'}
				labelLocation="top"
				disabled={disabled}
				controls={
					<div className="mr-2 flex items-center gap-1">
						<IconButton
							disabled={isDecrementDisabled || disabled}
							onClick={handleDecrement}
							size="xs"
							icon={SubtractIcon}
						/>

						<IconButton
							disabled={isIncrementDisabled || disabled}
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
			{invalidQuantity && (
				<div className="text-negative text-sm">Invalid quantity</div>
			)}
		</div>
	);
}
