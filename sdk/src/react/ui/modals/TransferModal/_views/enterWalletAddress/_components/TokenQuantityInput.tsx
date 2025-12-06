'use client';

import { cn, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import QuantityInput from '../../../../_internal/components/quantityInput';
import { transferModalStore, useModalState } from '../../../store';

const TokenQuantityInput = ({
	balanceAmount,
	isProcessingWithWaaS,
}: {
	balanceAmount?: bigint;
	isProcessingWithWaaS: boolean;
}) => {
	const modalState = useModalState();
	const [invalidQuantity, setInvalidQuantity] = useState(false);

	let insufficientBalance = true;
	if (balanceAmount !== undefined && modalState.quantity !== undefined) {
		insufficientBalance = modalState.quantity > balanceAmount;
	}

	return (
		<div
			className={cn(
				'flex flex-col gap-3',
				isProcessingWithWaaS && 'pointer-events-none opacity-50',
			)}
		>
			<QuantityInput
				quantity={modalState.quantity}
				invalidQuantity={invalidQuantity}
				onQuantityChange={(quantity) =>
					transferModalStore.send({ type: 'updateTransferDetails', quantity })
				}
				onInvalidQuantityChange={setInvalidQuantity}
				maxQuantity={balanceAmount ? balanceAmount : 0n}
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
