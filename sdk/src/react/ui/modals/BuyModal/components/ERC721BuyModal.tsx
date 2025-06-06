'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';
import { useEffect } from 'react';
import type { CheckoutOptions, Order } from '../../../../_internal';
import type { WalletInstance } from '../../../../_internal/wallet/wallet';
import { usePaymentModalParams } from '../hooks/usePaymentModalParams';
import { buyModalStore, usePaymentModalState, useQuantity } from '../store';

interface ERC721BuyModalProps {
	collection: ContractInfo;
	collectable: TokenMetadata;
	order: Order;
	wallet: WalletInstance | null | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	chainId: number;
}

export const ERC721BuyModal = ({
	collectable,
	order,
	wallet,
	checkoutOptions,
}: ERC721BuyModalProps) => {
	const quantity = useQuantity();

	// Ensure quantity is set to 1 for ERC721
	useEffect(() => {
		if (!quantity) {
			buyModalStore.send({ type: 'setQuantity', quantity: 1 });
		}
	}, [quantity]);

	const {
		data: paymentModalParams,
		isLoading: isPaymentModalParamsLoading,
		isError: isPaymentModalParamsError,
	} = usePaymentModalParams({
		wallet,
		quantity: quantity ?? undefined,
		marketplace: order?.marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true,
	});

	// Show loading or error states would be handled by parent router
	if (isPaymentModalParamsLoading || !paymentModalParams) {
		return null;
	}

	if (isPaymentModalParamsError) {
		throw new Error(
			'Failed to load payment parameters for ERC721 marketplace purchase',
		);
	}

	return <PaymentModalOpener paymentModalParams={paymentModalParams} />;
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
