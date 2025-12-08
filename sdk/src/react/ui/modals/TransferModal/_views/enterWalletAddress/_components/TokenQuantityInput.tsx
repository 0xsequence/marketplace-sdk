'use client';

import { cn, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import QuantityInput from '../../../../_internal/components/quantityInput';

type TokenQuantityInputProps = {
	value: bigint;
	onChange: (value: bigint) => void;
	maxQuantity: bigint;
	invalid: boolean;
	disabled?: boolean;
	helperText?: string;
	onInvalidChange?: (invalid: boolean) => void;
};

const TokenQuantityInput = ({
	value,
	onChange,
	maxQuantity,
	invalid,
	disabled,
	helperText,
	onInvalidChange,
}: TokenQuantityInputProps) => {
	const [localInvalid, setLocalInvalid] = useState(false);

	const insufficientBalance = value > maxQuantity;
	const invalidQuantity = invalid || localInvalid;

	return (
		<div className={cn('flex flex-col gap-3', disabled && 'opacity-70')}>
			<QuantityInput
				quantity={value}
				invalidQuantity={invalidQuantity}
				onQuantityChange={(quantity) => {
					onChange(quantity);
					setLocalInvalid(false);
					onInvalidChange?.(false);
				}}
				onInvalidQuantityChange={(isInvalid) => {
					setLocalInvalid(isInvalid);
					onInvalidChange?.(isInvalid);
				}}
				maxQuantity={maxQuantity}
				disabled={disabled}
				className="[&>label>div>div>div>input]:text-sm [&>label>div>div>div]:h-13 [&>label>div>div>div]:rounded-xl [&>label>div>div>span]:text-sm [&>label>div>div>span]:text-text-80 [&>label]:gap-1"
			/>

			<Text
				className="font-body text-xs"
				color={insufficientBalance ? 'negative' : 'text50'}
				fontWeight="medium"
			>
				{helperText ?? `You have ${maxQuantity.toString()} of this item`}
			</Text>
		</div>
	);
};

export default TokenQuantityInput;
