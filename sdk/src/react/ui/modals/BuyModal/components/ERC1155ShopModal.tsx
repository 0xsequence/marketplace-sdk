'use client';

import type { ContractInfo } from '@0xsequence/metadata';
import { useEffect } from 'react';
import type { CheckoutOptions, Currency } from '../../../../_internal';
import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';
import { useERC1155Checkout } from '../hooks/useERC1155Checkout';
import { usePriceCalculation } from '../hooks/usePriceCalculation';
import {
	type CheckoutOptionsSalesContractProps,
	buyModalStore,
	useCheckoutModalState,
} from '../store';
import { PriceDisplay } from './PriceDisplay';

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
	saleItems: Array<{ tokenId?: string; quantity?: string }>;
}

/**
 * Specialized modal for ERC1155 primary sales (shop/minting)
 * Handles multi-token sales with checkout integration
 */
export const ERC1155ShopModal = ({
	collection,
	shopData,
	currency,
	chainId,
	saleItems,
}: ERC1155ShopModalProps) => {
	// Calculate total price across all items with dnum
	const totalPriceCalculation = usePriceCalculation({
		unitPrice: shopData.salePrice?.amount || '0',
		quantity: saleItems.reduce(
			(sum, item) => sum + Number(item.quantity ?? 1),
			0,
		),
		decimals: 18, // ETH decimals
		fees: [], // ERC1155 sales typically don't have additional fees
	});

	return (
		<div className="erc1155-shop-modal">
			{/* Price Display */}
			<div className="price-section">
				<PriceDisplay
					amount={totalPriceCalculation.grandTotal}
					currency={currency.symbol}
					variant="large"
					showCurrencyIcon={true}
				/>
				<div className="price-breakdown">
					<span className="total-items">Items: {saleItems.length}</span>
					<span className="unit-price">
						Unit Price: {totalPriceCalculation.display.subtotal}{' '}
						{currency.symbol}
					</span>
				</div>
			</div>

			<ERC1155SaleContractCheckoutModalOpener
				chainId={chainId}
				salesContractAddress={shopData.salesContractAddress as `0x${string}`}
				collectionAddress={collection.address as `0x${string}`}
				items={shopData.items.map((item) => ({
					...item,
					tokenId: item.tokenId ?? '0',
					quantity: item.quantity ?? '1',
				}))}
				checkoutOptions={shopData.checkoutOptions}
				enabled={!!shopData.salesContractAddress && !!shopData.items}
			/>
		</div>
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
			// Prevent race conditions with proper state management
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
