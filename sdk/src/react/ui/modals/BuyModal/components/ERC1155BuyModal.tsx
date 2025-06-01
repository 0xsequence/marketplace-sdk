'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';
import { useEffect } from 'react';
import type { CheckoutOptions, Order } from '../../../../_internal';
import type { WalletInstance } from '../../../../_internal/wallet/wallet';
import { ERC1155QuantityModal } from '../ERC1155QuantityModal';
import { usePaymentModalParams } from '../hooks/usePaymentModalParams';
import { usePriceCalculation } from '../hooks/usePriceCalculation';
import {
	buyModalStore,
	useBuyModalProps,
	usePaymentModalState,
	useQuantity,
} from '../store';
import { PriceDisplay } from './PriceDisplay';

interface ERC1155BuyModalProps {
	collection: ContractInfo;
	collectable: TokenMetadata;
	order: Order;
	wallet: WalletInstance | null | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	chainId: number;
}

/**
 * Specialized modal for ERC1155 marketplace purchases
 * Handles multi-quantity NFT transactions with price calculations
 */
export const ERC1155BuyModal = ({
	collectable,
	order,
	wallet,
	checkoutOptions,
	chainId,
}: ERC1155BuyModalProps) => {
	const quantity = useQuantity();
	const { marketplaceType, quantityDecimals, quantityRemaining } =
		useBuyModalProps();

	// Show quantity selection if no quantity is set
	if (!quantity) {
		return (
			<ERC1155QuantityModal
				order={order}
				marketplaceType={marketplaceType}
				quantityDecimals={quantityDecimals}
				quantityRemaining={quantityRemaining}
				chainId={chainId}
			/>
		);
	}

	// Helper to get currency symbol from address
	const getCurrencySymbol = (address: string) => {
		// ETH address is typically 0x0000... or empty
		if (!address || address === '0x0000000000000000000000000000000000000000') {
			return 'ETH';
		}
		// For now, return a generic name - in a real app, you'd look this up
		return 'Token';
	};

	const currencySymbol = getCurrencySymbol(order.priceCurrencyAddress);

	// Calculate price with dnum for precision
	const priceCalculation = usePriceCalculation({
		unitPrice: order.priceAmount,
		quantity,
		decimals: 18, // ETH decimals - TODO: get from currency
		fees: [], // Marketplace fees are typically handled by the payment processor
	});

	const {
		data: paymentModalParams,
		isLoading: isPaymentModalParamsLoading,
		isError: isPaymentModalParamsError,
	} = usePaymentModalParams({
		wallet,
		quantity,
		marketplace: order?.marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true,
	});

	// Handle loading or error states
	if (isPaymentModalParamsLoading || !paymentModalParams) {
		return null;
	}

	if (isPaymentModalParamsError) {
		throw new Error(
			'Failed to load payment parameters for ERC1155 marketplace purchase',
		);
	}

	return (
		<div className="erc1155-buy-modal">
			{/* Price Display */}
			<div className="price-section">
				<PriceDisplay
					amount={priceCalculation.grandTotal}
					currency={currencySymbol}
					variant="large"
					showCurrencyIcon={true}
				/>
				<div className="price-breakdown">
					<span className="quantity">Quantity: {quantity}</span>
					<span className="unit-price">
						Unit Price: {priceCalculation.display.subtotal} {currencySymbol}
					</span>
				</div>
			</div>

			<PaymentModalOpener paymentModalParams={paymentModalParams} />
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
