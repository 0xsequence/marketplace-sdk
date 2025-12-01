'use client';

import { Spinner } from '@0xsequence/design-system';
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
//import { LoadingModal } from '../../../../_internal/components/actionModal/LoadingModal';
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
	const { openCheckoutModal, isLoading, isError, isEnabled } =
		useERC1155ShopModalData({
			chainId,
			salesContractAddress: shopData.salesContractAddress as Address,
			collectionAddress,
			items: shopData.items.map((item) => ({
				...item,
				tokenId: item.tokenId ?? 0n,
				quantity: BigInt(quantity ?? 1) ?? 1n,
			})),
			checkoutOptions: shopData.checkoutOptions,
			enabled: !!shopData.salesContractAddress && !!shopData.items,
		});

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
		<ActionModal
			type="buy"
			queries={{}}
			chainId={chainId}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Checkout"
			externalError={
				isError
					? new Error('Checkout failed due to an error. Please try again.')
					: undefined
			}
		>
			{() => {
				if (isLoading) {
					return (
						<div className="flex h-24 items-center justify-center gap-4">
							<Spinner size="lg" />
							Loading checkout
						</div>
					);
				}
				return (
					<ERC1155SaleContractCheckoutModalOpener
						openCheckoutModal={openCheckoutModal}
						isLoading={isLoading}
						isError={isError}
						isEnabled={isEnabled && quantity > 0}
					/>
				);
			}}
		</ActionModal>
	);
};

interface ERC1155SaleContractCheckoutModalOpenerProps {
	openCheckoutModal: () => void;
	isLoading: boolean;
	isError: boolean;
	isEnabled: boolean;
}

const ERC1155SaleContractCheckoutModalOpener = ({
	openCheckoutModal,
	isLoading,
	isError,
	isEnabled,
}: ERC1155SaleContractCheckoutModalOpenerProps) => {
	const checkoutModalState = useCheckoutModalState();

	useEffect(() => {
		if (checkoutModalState === 'idle' && isEnabled && !isLoading && !isError) {
			console.log('opening checkout modal');
			buyModalStore.send({ type: 'openCheckoutModal' });
			openCheckoutModal();
			buyModalStore.send({ type: 'checkoutModalOpened' });
		}
	}, [checkoutModalState, isLoading, isError, isEnabled, openCheckoutModal]);

	return null;
};
