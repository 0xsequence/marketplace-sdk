'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import type { ContractInfo } from '@0xsequence/metadata';
import { useEffect } from 'react';
import { BuyModalErrorFactory } from '../../../../../types/buyModalErrors';
import type { CheckoutOptions, Currency } from '../../../../_internal';
import { useERC721SalePaymentParams } from '../hooks/useERC721SalePaymentParams';
import { usePriceCalculation } from '../hooks/usePriceCalculation';
import { buyModalStore, usePaymentModalState } from '../store';
import { PriceDisplay } from './PriceDisplay';

interface ERC721ShopModalProps {
	collection: ContractInfo;
	shopData: {
		salesContractAddress: string;
		items: Array<{ tokenId?: string; quantity?: string }>;
		salePrice?: { currencyAddress?: string; amount?: string };
		checkoutOptions?: CheckoutOptions;
	};
	currency: Currency;
	chainId: number;
	saleItems: Array<{ quantity?: string | number }>;
}

/**
 * Specialized modal for ERC721 primary sales (shop/minting)
 * Handles price calculations with dnum and safe contract interactions
 */
export const ERC721ShopModal = ({
	collection,
	shopData,
	currency,
	chainId,
	saleItems,
}: ERC721ShopModalProps) => {
	const quantity = Number(saleItems[0]?.quantity ?? 1);

	// Use dnum for price calculations - prevents BigInt overflow
	const priceCalculation = usePriceCalculation({
		unitPrice: shopData.salePrice?.amount || '0',
		quantity,
		decimals: 18, // ETH decimals
		fees: [], // ERC721 sales typically don't have additional fees
	});

	const {
		data: erc721SalePaymentParams,
		isLoading: isErc721PaymentParamsLoading,
		isError: isErc721PaymentParamsError,
	} = useERC721SalePaymentParams({
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress: collection.address,
		price: shopData.salePrice?.amount || '0',
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

	// Create enhanced payment params with dnum-calculated price
	const enhancedPaymentParams: SelectPaymentSettings = {
		...erc721SalePaymentParams,
		price: priceCalculation.contractValue.toString(),
	};

	return (
		<div className="erc721-shop-modal">
			{/* Price Display */}
			<div className="price-section">
				<PriceDisplay
					amount={priceCalculation.grandTotal}
					currency={currency.symbol}
					variant="large"
					showCurrencyIcon={true}
				/>
				<div className="price-breakdown">
					<span className="quantity">Quantity: {quantity}</span>
					<span className="unit-price">
						Unit Price: {priceCalculation.display.subtotal} {currency.symbol}
					</span>
				</div>
			</div>

			<PaymentModalOpener paymentModalParams={enhancedPaymentParams} />
		</div>
	);
};

interface PaymentModalOpenerProps {
	paymentModalParams: SelectPaymentSettings;
}

const PaymentModalOpener = ({
	paymentModalParams,
}: PaymentModalOpenerProps) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const paymentModalState = usePaymentModalState();

	useEffect(() => {
		if (paymentModalState === 'idle') {
			buyModalStore.send({ type: 'openPaymentModal' });
			openSelectPaymentModal(paymentModalParams);
			buyModalStore.send({ type: 'paymentModalOpened' });
		}
	}, [paymentModalState, paymentModalParams, openSelectPaymentModal]);

	return null;
};
