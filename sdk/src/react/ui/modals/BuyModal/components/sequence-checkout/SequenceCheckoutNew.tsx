'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { Spinner, Text } from '@0xsequence/design-system';
import { useEffect } from 'react';
import { ContractType, type Step } from '../../../../../_internal';
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
};

const SequenceCheckout = ({ steps, contractType }: SequenceCheckoutProps) => {
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
		: modalProps.salePrice.currencyAddress;

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
			: modalProps.quantityRemaining;
		const unlimitedSupply =
			isShop && modalProps.unlimitedSupply ? modalProps.unlimitedSupply : false;

		return (
			<ERC1155QuantityModal
				order={marketOrder}
				cardType={isMarket ? 'market' : 'shop'}
				salePrice={isShop ? modalProps.salePrice : undefined}
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
