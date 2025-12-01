'use client';

import { useERC1155SaleContractCheckout } from '@0xsequence/checkout';
import { Spinner, Text, WarningIcon } from '@0xsequence/design-system';
import { useEffect } from 'react';
import { type Address, zeroAddress } from 'viem';
import { ActionModal } from '../../../_internal/components/baseModal';
import {
	buyModalStore,
	isShopProps,
	useBuyModalProps,
	useCheckoutModalState,
	useQuantity,
} from '../../store';
import type { ShopData } from '../types';
import { useERC1155ShopModalData } from './_hooks/useERC1155ShopModalData';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';

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

	const erc1155ShopModalData = useERC1155ShopModalData({
		chainId,
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress,
		items: shopData.items.map((item) => ({
			...item,
			tokenId: item.tokenId!,
			quantity: BigInt(quantity),
		})),
		checkoutOptions: shopData.checkoutOptions,
		enabled: !!quantity && !!shopData.salesContractAddress && !!shopData.items,
	});

	if (!modalProps.hideQuantitySelector) {
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
		<ActionModal
			type="buy"
			queries={{ erc1155ShopModalData }}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Checkout"
			chainId={chainId}
		>
			{({ erc1155ShopModalData }) => {
				return <CheckoutModalOpener checkoutParams={erc1155ShopModalData} />;
			}}
		</ActionModal>
	);
};

interface CheckoutModalOpenerProps {
	checkoutParams: ReturnType<typeof useERC1155ShopModalData>['data'];
}

const CheckoutModalOpener = ({ checkoutParams }: CheckoutModalOpenerProps) => {
	if (!checkoutParams) return null;

	const { openCheckoutModal, isLoading, isError } =
		useERC1155SaleContractCheckout(checkoutParams);
	const checkoutModalState = useCheckoutModalState();

	useEffect(() => {
		if (checkoutModalState === 'idle' && !isLoading && !isError) {
			buyModalStore.send({ type: 'openCheckoutModal' });
			openCheckoutModal();
			buyModalStore.send({ type: 'checkoutModalOpened' });
		}
	}, [checkoutModalState, openCheckoutModal]);

	if (isLoading) {
		return (
			<div className="flex h-24 items-center justify-center gap-4">
				<Spinner size="lg" />
				<Text className="text-text-80">Loading checkout modal...</Text>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-24 items-center justify-center gap-4">
				<WarningIcon size="lg" className="text-amber-600" />
				<Text className="text-amber-600">
					An error occurred while opening the checkout modal. Try again later.
				</Text>
			</div>
		);
	}

	return null;
};
