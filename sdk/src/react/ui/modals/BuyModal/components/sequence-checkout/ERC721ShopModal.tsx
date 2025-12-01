'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { BuyModalErrorFactory } from '../../../../../../types/buyModalErrors';
import { buyModalStore, usePaymentModalState } from '../../store';
import type { ShopData } from '../types';
import { useERC721ShopModalData } from './_hooks/useERC721ShopModalData';

interface ERC721ShopModalProps {
	collectionAddress: Address;
	shopData: ShopData;
	chainId: number;
}

export const ERC721ShopModal = ({
	collectionAddress,
	shopData,
	chainId,
}: ERC721ShopModalProps) => {
	const quantity = Number(shopData.items[0]?.quantity ?? 1);

	const {
		data: erc721SalePaymentParams,
		isLoading: isErc721PaymentParamsLoading,
		isError: isErc721PaymentParamsError,
	} = useERC721ShopModalData({
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress: collectionAddress.toString(),
		price: shopData.salePrice?.amount?.toString() || '0',
		currencyAddress: shopData.salePrice?.currencyAddress || '',
		enabled: true,
		chainId,
		quantity,
	});

	// Handle loading or error states
	if (isErc721PaymentParamsLoading || !erc721SalePaymentParams) {
		return null;
	}

	if (isErc721PaymentParamsError) {
		throw BuyModalErrorFactory.contractError(
			shopData.salesContractAddress,
			'Failed to load ERC721 sale parameters',
		);
	}

	return <PaymentModalOpener paymentModalParams={erc721SalePaymentParams} />;
};

interface PaymentModalOpenerProps {
	paymentModalParams: SelectPaymentSettings;
}

const PaymentModalOpener = ({
	paymentModalParams,
}: PaymentModalOpenerProps) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const paymentModalState = usePaymentModalState();
	const totalPrice =
		BigInt(paymentModalParams.price) *
		BigInt(paymentModalParams.collectibles[0].quantity);

	useEffect(() => {
		if (paymentModalState === 'idle') {
			buyModalStore.send({ type: 'openPaymentModal' });
			openSelectPaymentModal({
				...paymentModalParams,
				price: String(totalPrice),
			});
			buyModalStore.send({ type: 'paymentModalOpened' });
		}
	}, [
		paymentModalState,
		paymentModalParams,
		openSelectPaymentModal,
		totalPrice,
	]);

	return null;
};
