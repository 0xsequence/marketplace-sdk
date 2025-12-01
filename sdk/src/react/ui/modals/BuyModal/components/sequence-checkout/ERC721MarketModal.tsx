'use client';

import type { Order, TokenMetadata } from '@0xsequence/api-client';
import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { ActionModal } from '../../../_internal/components/baseModal';
import { buyModalStore, usePaymentModalState, useQuantity } from '../../store';
import { usePaymentModalParams } from './_hooks/usePaymentModalParams';

interface ERC721MarketModalProps {
	collectable: TokenMetadata;
	order: Order;
	address: Address | undefined;
	chainId: number;
}

export const ERC721MarketModal = ({
	collectable,
	order,
	address,
}: ERC721MarketModalProps) => {
	const quantity = useQuantity();

	const paymentModalParams = usePaymentModalParams({
		address,
		quantity,
		marketplace: order?.marketplace,
		collectable,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true,
	});

	return (
		<ActionModal
			chainId={order.chainId}
			type="buy"
			queries={{ paymentModalParams }}
			onErrorDismiss={() => {
				buyModalStore.send({ type: 'close' });
			}}
			onErrorAction={() => {
				buyModalStore.send({ type: 'close' });
			}}
			onClose={() => {
				buyModalStore.send({ type: 'close' });
			}}
			title="Checkout"
		>
			{({ paymentModalParams }) => {
				if (paymentModalParams) {
					return <PaymentModalOpener paymentModalParams={paymentModalParams} />;
				}
				return null;
			}}
		</ActionModal>
	);
};

interface PaymentModalOpenerProps {
	paymentModalParams: SelectPaymentSettings;
}

const PaymentModalOpener = ({
	paymentModalParams,
}: PaymentModalOpenerProps) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const paymentModalState = usePaymentModalState();

	useEffect(() => {
		if (paymentModalState === 'idle') {
			buyModalStore.send({ type: 'openPaymentModal' });
			openSelectPaymentModal(paymentModalParams);
			buyModalStore.send({ type: 'paymentModalOpened' });
		}
	}, [paymentModalState, paymentModalParams, openSelectPaymentModal]);

	return null;
};
