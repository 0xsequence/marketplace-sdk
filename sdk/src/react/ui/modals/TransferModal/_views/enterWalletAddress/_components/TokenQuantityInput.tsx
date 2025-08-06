'use client';

import { cn, Text } from '@0xsequence/design-system';
import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import { useState } from 'react';
import QuantityInput from '../../../../_internal/components/quantityInput';
import { transferModalStore, useModalState } from '../../../store';

const TokenQuantityInput = ({
	balanceAmount,
	collection,
	isProcessingWithWaaS,
}: {
	balanceAmount?: bigint;
	collection?: { decimals?: number };
	isProcessingWithWaaS: boolean;
}) => {
	const modalState = useModalState();
	const [invalidQuantity, setInvalidQuantity] = useState(false);

	let insufficientBalance = true;
	if (balanceAmount !== undefined && modalState.quantity) {
		try {
			// Convert user-facing Dnum to internal representation
			const quantityInternal = dn.multiply(
				modalState.quantity,
				dn.from(10 ** (collection?.decimals || 0), 0),
			);
			const quantityBigInt = BigInt(dn.toString(quantityInternal));
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
				quantity={modalState.quantity}
				invalidQuantity={invalidQuantity}
				onQuantityChange={(quantity: Dnum) =>
					transferModalStore.send({ type: 'updateTransferDetails', quantity })
				}
				onInvalidQuantityChange={setInvalidQuantity}
				maxQuantity={
					balanceAmount
						? dn.from(String(balanceAmount), collection?.decimals || 0)
						: dn.from('0', collection?.decimals || 0)
				}
				className="[&>label>div>div>div>input]:text-sm [&>label>div>div>div]:h-13 [&>label>div>div>div]:rounded-xl [&>label>div>div>span]:text-sm [&>label>div>div>span]:text-text-80 [&>label]:gap-1"
			/>

			<Text
				className="font-body text-xs"
				color={insufficientBalance ? 'negative' : 'text50'}
				fontWeight="medium"
			>
				{`You have ${balanceAmount ? dn.format(dn.from(balanceAmount.toString(), collection?.decimals || 0), { digits: collection?.decimals || 0 }) : '0'} of this item`}
			</Text>
		</div>
	);
};

export default TokenQuantityInput;
