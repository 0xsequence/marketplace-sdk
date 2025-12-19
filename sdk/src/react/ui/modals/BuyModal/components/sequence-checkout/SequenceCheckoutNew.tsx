'use client';

import { ContractType, type Step } from '@0xsequence/api-client';
import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { Spinner, Text } from '@0xsequence/design-system';
import { useEffect } from 'react';
import type { Address } from 'viem';
import type { PrimarySaleItem } from '../../../../../../../../api/src/adapters/marketplace/marketplace.gen';
import { useOrders } from '../../../../../hooks/data/orders/useOrders';
import { ActionModal } from '../../../_internal/components/baseModal';
import {
	buyModalStore,
	isMarketProps,
	isShopProps,
	useBuyModalProps,
	usePaymentModalState,
	useQuantity,
} from '../../store';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { usePaymentModalParams } from './usePaymentModalParams';

type SequenceCheckoutProps = {
	steps: Step[] | undefined;
	contractType: ContractType;
	primarySaleItem?: PrimarySaleItem;
	quantityRemaining?: bigint;
};

const SequenceCheckout = ({
	steps,
	contractType,
	primarySaleItem,
}: SequenceCheckoutProps) => {
	const modalProps = useBuyModalProps();
	const isMarket = isMarketProps(modalProps);
	const isShop = isShopProps(modalProps);
	const paymentModalState = usePaymentModalState();

	const { chainId, collectionAddress, hideQuantitySelector } = modalProps;
	const orderId = isMarket ? modalProps.orderId : '';
	const marketplaceKind = isMarket ? modalProps.marketplace : undefined;

	const { data: marketOrders } = useOrders({
		chainId,
		input: [
			{
				contractAddress: collectionAddress,
				orderId,
				marketplace: marketplaceKind!,
			},
		],
		query: {
			enabled: isMarket && !!orderId,
		},
	});
	const marketOrder = marketOrders?.orders[0];

	const quantity = useQuantity();
	const priceCurrencyAddress = isMarket
		? marketOrder?.priceCurrencyAddress
		: primarySaleItem?.currencyAddress;

	const paymentModalParams = usePaymentModalParams({
		quantity,
		marketplaceKind,
		priceCurrencyAddress,
		steps,
		marketplaceType: isMarket ? 'market' : 'shop',
	});

	if (
		!hideQuantitySelector &&
		contractType === ContractType.ERC1155 &&
		paymentModalState === 'idle'
	) {
		const quantityRemaining = isMarket
			? marketOrder?.quantityRemaining
			: primarySaleItem?.supply;
		const unlimitedSupply =
			isShop && primarySaleItem?.unlimitedSupply
				? primarySaleItem?.unlimitedSupply
				: false;

		return (
			<ERC1155QuantityModal
				order={marketOrder}
				cardType={isMarket ? 'market' : 'shop'}
				salePrice={
					isShop
						? {
								amount: primarySaleItem?.priceAmount || 0n,
								currencyAddress: primarySaleItem?.currencyAddress as Address,
							}
						: undefined
				}
				quantityRemaining={quantityRemaining ?? 0n}
				unlimitedSupply={unlimitedSupply}
				chainId={chainId}
			/>
		);
	}

	if (paymentModalState === 'closed') {
		return null;
	}

	return (
		<ActionModal
			onClose={() => {
				buyModalStore.send({ type: 'close' });
			}}
			type="buy"
			chainId={chainId}
			queries={{ paymentModalParams }}
			title="Checkout"
			onErrorDismiss={() => {
				buyModalStore.send({ type: 'close' });
			}}
			onErrorAction={() => {
				buyModalStore.send({ type: 'close' });
			}}
		>
			{({ paymentModalParams }) => {
				if (!steps)
					return (
						<div className="flex h-24 items-center justify-center gap-4">
							<Spinner size="lg" />
							<Text className="pulse">Loading checkout</Text>
						</div>
					);

				return <PaymentModalOpener paymentModalParams={paymentModalParams} />;
			}}
		</ActionModal>
	);
};

const PaymentModalOpener = ({
	paymentModalParams,
}: {
	paymentModalParams: SelectPaymentSettings;
}) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();

	useEffect(() => {
		if (paymentModalParams) {
			openSelectPaymentModal(paymentModalParams);
			buyModalStore.send({ type: 'openPaymentModal' });
		}
	}, [paymentModalParams, openSelectPaymentModal]);

	return null;
};

export default SequenceCheckout;
