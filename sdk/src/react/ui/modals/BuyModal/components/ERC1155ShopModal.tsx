'use client';

import type { ContractInfo } from '@0xsequence/metadata';
import { useEffect } from 'react';
import type { Address } from 'viem';
import type { CheckoutOptions, Currency } from '../../../../_internal';
import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';
import { useERC1155Checkout } from '../hooks/useERC1155Checkout';
import {
	type CheckoutOptionsSalesContractProps,
	buyModalStore,
	useCheckoutModalState,
} from '../store';

interface ShopData {
	salesContractAddress: string;
	items: Array<{ tokenId?: string; quantity?: string }>;
	salePrice?: { currencyAddress?: string; amount?: string };
	checkoutOptions?: CheckoutOptions;
}

interface ERC1155ShopModalProps {
	collection: ContractInfo;
	shopData: ShopData;
	currency: Currency;
	chainId: number;
}

export const ERC1155ShopModal = ({
	collection,
	shopData,
	chainId,
}: ERC1155ShopModalProps) => {
	return (
		<ERC1155SaleContractCheckoutModalOpener
			chainId={chainId}
			salesContractAddress={shopData.salesContractAddress as Address}
			collectionAddress={collection.address as Address}
			items={shopData.items.map((item) => ({
				...item,
				tokenId: item.tokenId ?? '0',
				quantity: item.quantity ?? '1',
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
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Sequence Pay"
			/>
		);
	}

	return null;
};
