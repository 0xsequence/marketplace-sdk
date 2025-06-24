'use client';

import { cn, Text } from '@0xsequence/design-system';
import { observer, use$ } from '@legendapp/state/react';
import { useState } from 'react';
import QuantityInput from '../../../../_internal/components/quantityInput';
import { transferModal$ } from '../../../_store';

const TokenQuantityInput = observer(
	({
		balanceAmount,
		collection,
		isProcessingWithWaaS,
	}: {
		balanceAmount?: bigint;
		collection?: { decimals?: number };
		isProcessingWithWaaS: boolean;
	}) => {
		const $quantity = transferModal$.state.quantity;
		const [invalidQuantity, setInvalidQuantity] = useState(false);

		let insufficientBalance = true;
		if (balanceAmount !== undefined && $quantity.get()) {
			try {
				const quantityBigInt = BigInt($quantity.get());
				insufficientBalance = quantityBigInt > balanceAmount;
			} catch (_e) {
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
					quantity={use$($quantity)}
					invalidQuantity={invalidQuantity}
					onQuantityChange={(quantity) => $quantity.set(quantity)}
					onInvalidQuantityChange={setInvalidQuantity}
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
	},
);

export default TokenQuantityInput;
