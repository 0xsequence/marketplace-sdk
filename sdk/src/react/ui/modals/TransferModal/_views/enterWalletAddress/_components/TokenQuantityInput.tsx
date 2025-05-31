import { cn } from '@0xsequence/design-system';
import { Text } from '@0xsequence/design-system';
import { useState } from 'react';
import QuantityInput from '../../../../_internal/components/quantityInput';
import { transferModal, useQuantity } from '../../../store';

const TokenQuantityInput = ({
	balanceAmount,
	collection,
	isProcessingWithWaaS,
}: {
	balanceAmount?: bigint;
	collection?: { decimals?: number };
	isProcessingWithWaaS: boolean;
}) => {
	const quantity = useQuantity();
	const [invalidQuantity, setInvalidQuantity] = useState(false);

	let insufficientBalance = true;
	if (balanceAmount !== undefined && quantity) {
		try {
			const quantityBigInt = BigInt(quantity);
			insufficientBalance = quantityBigInt > balanceAmount;
		} catch (e) {
			insufficientBalance = true;
		}
	}

	return (
		<div
			className={cn(
				'flex flex-col gap-3',
				isProcessingWithWaaS && 'pointer-events-none opacity-50',
			)}
		>
			<QuantityInput
				quantity={quantity}
				invalidQuantity={invalidQuantity}
				onQuantityChange={(newQuantity) => {
					transferModal.state.quantity.set(newQuantity);
				}}
				onInvalidQuantityChange={(invalid) => {
					setInvalidQuantity(invalid);
				}}
				decimals={collection?.decimals || 0}
				maxQuantity={balanceAmount ? String(balanceAmount) : '0'}
				className="[&>label>div>div>div>input]:text-sm [&>label>div>div>div]:h-13 [&>label>div>div>div]:rounded-xl [&>label>div>div>span]:text-sm [&>label>div>div>span]:text-text-80 [&>label]:gap-1"
			/>

			<Text
				className="font-body text-xs"
				color={insufficientBalance ? 'negative' : 'text50'}
				fontWeight="medium"
			>
				{`You have ${balanceAmount?.toString() || '0'} of this item`}
			</Text>
		</div>
	);
};

export default TokenQuantityInput;
