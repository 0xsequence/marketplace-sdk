'use client';

import type { CheckoutOptions } from '@0xsequence/api-client';
import { useEffect } from 'react';
import { type Address, zeroAddress } from 'viem';
import {
	buyModalStore,
	type CheckoutOptionsSalesContractProps,
	isShopProps,
	useBuyModalProps,
	useCheckoutModalState,
	useQuantity,
} from '../../store';
import type { ShopData } from '../types';
//import { LoadingModal } from '../../../../_internal/components/actionModal/LoadingModal';
import { useERC1155ShopModalData } from './_hooks/useERC1155ShopModalData';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { LoadingModal } from './SequenceCheckoutRouter';

interface ERC1155ShopModalProps {
	collectionAddress: Address;
	shopData: ShopData;
	chainId: number;
}

export const ERC1155ShopModal = ({
	collectionAddress,
	shopData,
	chainId,
}: ERC1155ShopModalProps) => {
	const quantity = useQuantity();
	const modalProps = useBuyModalProps();
	const isShop = isShopProps(modalProps);
	const quantityDecimals =
		isShop && modalProps.quantityDecimals ? modalProps.quantityDecimals : 0;
	const quantityRemaining =
		isShop && modalProps.quantityRemaining ? modalProps.quantityRemaining : 0n;
	const unlimitedSupply =
		isShop && modalProps.unlimitedSupply ? modalProps.unlimitedSupply : false;

	if (!quantity) {
		return (
			<ERC1155QuantityModal
				salePrice={{
					amount: shopData.salePrice?.amount ?? 0n,
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
			collectionAddress={collectionAddress}
			items={shopData.items.map((item) => ({
				...item,
				tokenId: item.tokenId ?? 0n,
				quantity: BigInt(quantity) ?? 1n,
			}))}
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
}: ERC1155SaleContractCheckoutModalOpenerProps) => {
	const checkoutModalState = useCheckoutModalState();
	const { openCheckoutModal, isLoading, isError, isEnabled } =
		useERC1155ShopModalData({
			chainId,
			salesContractAddress,
			collectionAddress,
			items,
			checkoutOptions,
			enabled,
		});

	useEffect(() => {
		if (checkoutModalState === 'idle' && isEnabled && !isLoading && !isError) {
			console.log('opening checkout modal');
			buyModalStore.send({ type: 'openCheckoutModal' });
			openCheckoutModal();
			buyModalStore.send({ type: 'checkoutModalOpened' });
		}
	}, [checkoutModalState, isLoading, isError, isEnabled, openCheckoutModal]);

	if (isLoading) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading payment options"
			/>
		);
	}

	return null;
};
