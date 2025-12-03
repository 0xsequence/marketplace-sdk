'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import type { ContractInfo } from '@0xsequence/metadata';
import { useEffect } from 'react';
import { type Address, zeroAddress } from 'viem';
import { BuyModalErrorFactory } from '../../../../../types/buyModalErrors';
import { useERC1155SalePaymentParams } from '../hooks/useERC1155SalePaymentParams';
import {
	buyModalStore,
	isShopProps,
	useBuyModalProps,
	usePaymentModalState,
	useQuantity,
} from '../store';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import type { ShopData } from './types';

interface ERC1155ShopModalProps {
	collection: ContractInfo;
	shopData: ShopData;
	chainId: number;
}

export const ERC1155ShopModal = ({
	collection,
	shopData,
	chainId,
}: ERC1155ShopModalProps) => {
	const quantity = useQuantity();
	const modalProps = useBuyModalProps();
	const isShop = isShopProps(modalProps);
	const quantityDecimals =
		isShop && modalProps.quantityDecimals ? modalProps.quantityDecimals : 0;
	const quantityRemaining =
		isShop && modalProps.quantityRemaining
			? modalProps.quantityRemaining.toString()
			: '0';
	const unlimitedSupply =
		isShop && modalProps.unlimitedSupply ? modalProps.unlimitedSupply : false;

	const tokenId = shopData.items[0]?.tokenId ?? '0';
	const checkoutProvider = shopData.checkoutOptions?.nftCheckout?.[0]
		? String(shopData.checkoutOptions.nftCheckout[0])
		: undefined;

	const {
		data: erc1155SalePaymentParams,
		isLoading: isErc1155PaymentParamsLoading,
		isError: isErc1155PaymentParamsError,
	} = useERC1155SalePaymentParams({
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress: collection.address,
		tokenId,
		price: shopData.salePrice?.amount || '0',
		currencyAddress: shopData.salePrice?.currencyAddress || '',
		enabled: !!quantity,
		chainId,
		checkoutProvider,
	});

	if (!quantity) {
		return (
			<ERC1155QuantityModal
				salePrice={{
					amount: shopData.salePrice?.amount ?? '0',
					currencyAddress:
						(shopData.salePrice?.currencyAddress as Address) ?? zeroAddress,
				}}
				cardType="shop"
				quantityDecimals={quantityDecimals}
				quantityRemaining={quantityRemaining}
				unlimitedSupply={unlimitedSupply}
				chainId={chainId}
			/>
		);
	}

	// Handle loading or error states
	if (isErc1155PaymentParamsLoading || !erc1155SalePaymentParams) {
		return null;
	}

	if (isErc1155PaymentParamsError) {
		throw BuyModalErrorFactory.contractError(
			shopData.salesContractAddress,
			'Failed to load ERC1155 sale parameters',
		);
	}

	return <PaymentModalOpener paymentModalParams={erc1155SalePaymentParams} />;
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
