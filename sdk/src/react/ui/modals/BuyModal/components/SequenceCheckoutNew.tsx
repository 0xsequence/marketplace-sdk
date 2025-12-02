'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { Spinner, Text } from '@0xsequence/design-system';
import { useEffect } from 'react';
import type { Step } from '../../../../_internal';
import { useOrders } from '../../../../hooks/data/orders/useOrders';
import { ActionModal } from '../../_internal/components/baseModal';
import { isMarketProps, useBuyModalProps, useQuantity } from '../store';
import { usePaymentModalParams } from './sequence-checkout/_hooks/usePaymentModalParamsNew';

type SequenceCheckoutNewProps = {
	steps: Step[] | undefined;
};

const SequenceCheckoutNew = ({ steps }: SequenceCheckoutNewProps) => {
	const modalProps = useBuyModalProps();
	const isMarket = isMarketProps(modalProps);

	const { chainId, collectionAddress } = modalProps;
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

	const paymentModalParamsQuery = usePaymentModalParams({
		quantity,
		marketplaceKind,
		priceCurrencyAddress,
		steps,
		marketplaceType: isMarket ? 'market' : 'shop',
	});

	return (
		<ActionModal
			onClose={() => {
				close();
			}}
			type="buy"
			chainId={chainId}
			queries={{ paymentModalParamsQuery }}
			title="Buy"
			onErrorDismiss={() => {
				close();
			}}
			onErrorAction={() => {
				close();
			}}
		>
			{(paymentModalParamsData) => {
				if (!steps)
					return (
						<div className="flex h-24 items-center justify-center gap-4">
							<Spinner size="lg" />
							<Text className="pulse">Loading...</Text>
						</div>
					);

				return (
					<PaymentModalOpener
						paymentModalParams={paymentModalParamsData.paymentModalParamsQuery}
					/>
				);
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
		}
	}, [paymentModalParams, openSelectPaymentModal]);
	return null;
};

export default SequenceCheckoutNew;
