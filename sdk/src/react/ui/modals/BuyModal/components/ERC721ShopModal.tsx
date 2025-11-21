'use client';

import type { ContractInfo } from '@0xsequence/api-client';
import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect } from 'react';
import { BuyModalErrorFactory } from '../../../../../types/buyModalErrors';
import { useERC721SalePaymentParams } from '../hooks/useERC721SalePaymentParams';
import { buyModalStore, usePaymentModalState } from '../store';
import type { ShopData } from './types';

interface ERC721ShopModalProps {
	collection: ContractInfo;
	shopData: ShopData;
	chainId: number;
}

export const ERC721ShopModal = ({
	collection,
	shopData,
	chainId,
}: ERC721ShopModalProps) => {
	const quantity = Number(shopData.items[0]?.quantity ?? 1);

	const {
		data: erc721SalePaymentParams,
		isLoading: isErc721PaymentParamsLoading,
		isError: isErc721PaymentParamsError,
	} = useERC721SalePaymentParams({
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress: collection.address,
		price: shopData.salePrice?.amount || 0n,
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
