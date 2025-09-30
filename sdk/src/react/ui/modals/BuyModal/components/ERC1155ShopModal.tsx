'use client';

import { useERC1155SaleContractCheckout } from '@0xsequence/checkout';
import type { ContractInfo } from '@0xsequence/metadata';
import { useEffect } from 'react';
import { type Address, zeroAddress } from 'viem';
import { BuyModalErrorFactory } from '../../../../../types/buyModalErrors';
import type { CheckoutOptions } from '../../../../_internal';
import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';
import type { ActionButton } from '../../_internal/types';
import { useERC1155Checkout } from '../hooks/useERC1155Checkout';
import {
	buyModalStore,
	type CheckoutOptionsSalesContractProps,
	isShopProps,
	useBuyModalProps,
	useCheckoutModalState,
	useQuantity,
} from '../store';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import type {
	ERC1155CheckoutOptionsSalesContractArgs,
	ShopData,
} from './types';

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
	const successActionButtons = modalProps.successActionButtons;

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

	return (
		<ERC1155SaleContractCheckoutModalOpener
			chainId={chainId}
			salesContractAddress={shopData.salesContractAddress as Address}
			collectionAddress={collection.address as Address}
			items={shopData.items.map((item) => ({
				...item,
				tokenId: item.tokenId ?? '0',
				quantity: quantity.toString() ?? '1',
			}))}
			checkoutOptions={shopData.checkoutOptions}
			enabled={!!shopData.salesContractAddress && !!shopData.items}
			successActionButtons={successActionButtons}
		/>
	);
};

interface ERC1155SaleContractCheckoutModalOpenerProps
	extends CheckoutOptionsSalesContractProps {
	enabled: boolean;
	checkoutOptions?: CheckoutOptions;
	successActionButtons: ActionButton[] | undefined;
}

const ERC1155SaleContractCheckoutModalOpener = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	checkoutOptions,
	successActionButtons,
	enabled,
}: ERC1155SaleContractCheckoutModalOpenerProps) => {
	const customCreditCardProviderCallback =
		useBuyModalProps().customCreditCardProviderCallback;

	const { data: checkoutData, isError: isCheckoutError } = useERC1155Checkout({
		chainId,
		salesContractAddress,
		collectionAddress,
		items,
		checkoutOptions,
		customCreditCardProviderCallback,
		enabled,
		callbacks: {
			onSuccess: () => {},
			onError: () => {},
		},
		successActionButtons: successActionButtons ?? [],
	});

	if (!checkoutData) {
		return null;
	}

	return (
		<CheckoutModalOpener
			checkoutData={checkoutData}
			isCheckoutError={isCheckoutError}
			chainId={chainId}
			salesContractAddress={salesContractAddress}
		/>
	);
};

interface CheckoutModalOpenerProps {
	checkoutData: ERC1155CheckoutOptionsSalesContractArgs;
	isCheckoutError: boolean;
	chainId: number;
	salesContractAddress: Address;
}

const CheckoutModalOpener = ({
	checkoutData,
	isCheckoutError,
	chainId,
	salesContractAddress,
}: CheckoutModalOpenerProps) => {
	const { openCheckoutModal, isError, isLoading } =
		useERC1155SaleContractCheckout(checkoutData);
	const checkoutModalState = useCheckoutModalState();

	useEffect(() => {
		if (checkoutModalState === 'idle' && !isLoading && !isError) {
			buyModalStore.send({ type: 'openCheckoutModal' });
			openCheckoutModal();
			buyModalStore.send({ type: 'checkoutModalOpened' });
		}
	}, [checkoutModalState, openCheckoutModal, checkoutData]);

	if (isCheckoutError) {
		throw BuyModalErrorFactory.contractError(
			salesContractAddress,
			'Failed to load ERC1155 checkout data',
		);
	}

	if (isLoading) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={chainId}
				onClose={() => {}}
				title="Loading checkout data"
			/>
		);
	}

	return null;
};
