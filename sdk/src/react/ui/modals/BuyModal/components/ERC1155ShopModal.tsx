'use client';

import type { ContractInfo } from '@0xsequence/marketplace-api';
import { useEffect } from 'react';
import { type Address, zeroAddress } from 'viem';
import type {
	CheckoutOptions,
	CheckoutOptionsItem,
} from '../../../../_internal';
import { LoadingModal } from '../../_internal/components/baseModal';
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
	const quantityRemaining: bigint =
		isShop && modalProps.quantityRemaining ? modalProps.quantityRemaining : 0n;
	const unlimitedSupply =
		isShop && modalProps.unlimitedSupply ? modalProps.unlimitedSupply : false;

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
			items={shopData.items.map(
				(item) =>
					({
						tokenId: item.tokenId ?? 0n,
						quantity: item.quantity ?? BigInt(quantity ?? 1),
					}) as CheckoutOptionsItem,
			)}
			checkoutOptions={shopData.checkoutOptions}
			enabled={!!shopData.salesContractAddress && !!shopData.items}
		/>
	);
};

interface ERC1155SaleContractCheckoutModalOpenerProps
	extends CheckoutOptionsSalesContractProps {
	enabled: boolean;
	checkoutOptions?: CheckoutOptions;
}

const ERC1155SaleContractCheckoutModalOpener = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	checkoutOptions,
	enabled,
	customProviderCallback,
}: ERC1155SaleContractCheckoutModalOpenerProps) => {
	const checkoutModalState = useCheckoutModalState();

	const { openCheckoutModal, isLoading, isError, isEnabled } =
		useERC1155Checkout({
			chainId,
			salesContractAddress,
			collectionAddress,
			items,
			checkoutOptions,
			customProviderCallback,
			enabled,
		});

	useEffect(() => {
		if (checkoutModalState === 'idle' && isEnabled && !isLoading && !isError) {
			buyModalStore.send({ type: 'openCheckoutModal' });
			openCheckoutModal();
			buyModalStore.send({ type: 'checkoutModalOpened' });
		}
	}, [checkoutModalState, isLoading, isError, isEnabled, openCheckoutModal]);

	if (isLoading) {
		return (
			<LoadingModal
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading payment options"
				message="Please wait while we prepare your checkout"
			/>
		);
	}

	return null;
};
