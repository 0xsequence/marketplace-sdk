'use client';

import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { QuantityInputBase } from './QuantityInputBase';

type QuantityInputProps = {
	$quantity: Observable<string>;
	$invalidQuantity: Observable<boolean>;
	decimals: number;
	maxQuantity: string;
	className?: string;
	disabled?: boolean;
};

// Using observer to ensure re-render on observable changes
export default observer(function QuantityInput({
	$quantity,
	$invalidQuantity,
	decimals,
	maxQuantity,
	className,
	disabled,
}: QuantityInputProps) {
	return (
		<QuantityInputBase
			value={$quantity.get()}
			onChange={(value) => $quantity.set(value)}
			isInvalid={$invalidQuantity.get()}
			onInvalidChange={(isInvalid) => $invalidQuantity.set(isInvalid)}
			decimals={decimals}
			maxQuantity={maxQuantity}
			className={className}
			disabled={disabled}
		/>
	);
});
