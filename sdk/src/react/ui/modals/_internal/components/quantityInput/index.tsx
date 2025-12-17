'use client';

import {
	AddIcon,
	Field,
	FieldLabel,
	IconButton,
	NumericInput,
	SubtractIcon,
} from '@0xsequence/design-system';
import { useState } from 'react';
import { cn } from '../../../../../../utils';

type QuantityInputProps = {
	quantity: bigint;
	invalidQuantity: boolean;
	onQuantityChange: (quantity: bigint) => void;
	onInvalidQuantityChange: (invalid: boolean) => void;
	maxQuantity: bigint;
	className?: string;
	disabled?: boolean;
};

const MIN_QUANTITY = 1n;

export default function QuantityInput({
	quantity,
	invalidQuantity,
	onQuantityChange,
	onInvalidQuantityChange,
	maxQuantity,
	className,
	disabled,
}: QuantityInputProps) {
	const maxBelowMin = maxQuantity < MIN_QUANTITY;
	const [draftQuantity, setDraftQuantity] = useState<string | null>(null);

	const displayQuantity = draftQuantity ?? quantity.toString();

	const setValidQuantity = (value: bigint) => {
		setDraftQuantity(null);
		onQuantityChange(value);
		onInvalidQuantityChange(false);
	};

	function handleChangeQuantity(value: string) {
		if (maxBelowMin) {
			setDraftQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}

		let nextQuantity: bigint;
		try {
			nextQuantity = BigInt(value);
		} catch {
			setDraftQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}

		if (nextQuantity < MIN_QUANTITY) {
			setDraftQuantity(value);
			onInvalidQuantityChange(true);
			return;
		}

		if (nextQuantity > maxQuantity) {
			setValidQuantity(maxQuantity); // Value capped at max quantity
			return;
		}

		setValidQuantity(nextQuantity);
	}

	function handleIncrement() {
		if (maxBelowMin) return;
		const newValue = quantity + 1n;
		if (newValue >= maxQuantity) {
			setValidQuantity(maxQuantity);
		} else {
			setValidQuantity(newValue);
		}
	}

	function handleDecrement() {
		if (maxBelowMin) return;
		const newValue = quantity - 1n;
		if (newValue <= MIN_QUANTITY) {
			setValidQuantity(MIN_QUANTITY);
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
					decimals={0}
					controls={
						<div className="flex items-center gap-1">
							<IconButton
								disabled={maxBelowMin || quantity <= MIN_QUANTITY}
								onClick={handleDecrement}
								size="xs"
								icon={SubtractIcon}
							/>

							<IconButton
								disabled={maxBelowMin || quantity >= maxQuantity}
								onClick={handleIncrement}
								size="xs"
								icon={AddIcon}
							/>
						</div>
					}
					value={displayQuantity}
					onChange={(e) => handleChangeQuantity(e.target.value)}
					width={'full'}
				/>
			</Field>

			{invalidQuantity && maxQuantity > 0n && (
				<div className="mt-1.5 font-medium text-amber-500 text-xs">
					Invalid quantity
				</div>
			)}
		</div>
	);
}
