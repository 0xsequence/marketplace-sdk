'use client';

import { QuantityInputBase } from './QuantityInputBase';

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
	return (
		<QuantityInputBase
			value={quantity}
			onChange={onQuantityChange}
			isInvalid={invalidQuantity}
			onInvalidChange={onInvalidQuantityChange}
			decimals={decimals}
			maxQuantity={maxQuantity}
			className={className}
			disabled={disabled}
		/>
	);
}
