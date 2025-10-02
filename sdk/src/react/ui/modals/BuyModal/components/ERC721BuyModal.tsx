'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';
import { useEffect } from 'react';
import type { Address } from 'viem';
import type { CheckoutOptions, Order } from '../../../../_internal';
import { ErrorLogBox } from '../../../components/_internals/ErrorLogBox';
import { ActionModal } from '../../_internal/components/actionModal';
import { usePaymentModalParams } from '../hooks/usePaymentModalParams';
import { buyModalStore, usePaymentModalState, useQuantity } from '../store';
import { skipToken } from '@tanstack/react-query';
import { useValidateSequenceMarketOrder } from '../../../../hooks/validation/useValidateSequenceMarketOrder';
import { OrderInvalidModal } from './OrderInvalidModal';
import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';

interface ERC721BuyModalProps {
	collection: ContractInfo;
	collectable: TokenMetadata;
	order: Order;
	address: Address | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	chainId: number;
	collectibleId: string;
	collectionAddress: Address;
}

export const ERC721BuyModal = ({
	collectable,
	order,
	address,
	checkoutOptions,
	chainId,
	collectibleId,
	collectionAddress,
}: ERC721BuyModalProps) => {
	const quantity = useQuantity();

	// Ensure quantity is set to 1 for ERC721
	useEffect(() => {
		if (!quantity) {
			buyModalStore.send({ type: 'setQuantity', quantity: 1 });
		}
	}, [quantity]);

	// Validate Sequence Market orders
	const { data: validation, isLoading: isValidating } =
		useValidateSequenceMarketOrder(
			quantity
				? {
						chainId,
						marketplace: order.marketplace,
						orderId: order.orderId,
						quantity,
						enabled: !!quantity,
					}
				: skipToken,
		);

	const {
		data: paymentModalParams,
		isLoading: isPaymentModalParamsLoading,
		isError: isPaymentModalParamsError,
		failureReason,
	} = usePaymentModalParams({
		address,
		quantity: quantity ?? undefined,
		marketplace: order?.marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true,
	});

	// Show loading while validating
	if (quantity && isValidating) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Validating order"
			/>
		);
	}

	// Show invalid order modal if validation failed
	if (quantity && validation && !validation.isValid) {
		return (
			<OrderInvalidModal
				collectable={collectable}
				chainId={chainId}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				invalidOrder={order}
			/>
		);
	}

	if (failureReason) {
		return (
			<ActionModal
				isOpen={true}
				onClose={() => {
					buyModalStore.send({ type: 'close' });
				}}
				title={'An error occurred while purchasing'}
				children={
					<ErrorLogBox
						title={failureReason.name}
						message={failureReason.message}
						error={failureReason}
					/>
				}
				ctas={[
					{
						label: 'Close',
						onClick: () => {
							buyModalStore.send({ type: 'close' });
						},
					},
				]}
				chainId={order.chainId}
			/>
		);
	}

	// Show loading or error states would be handled by parent router
	if (isPaymentModalParamsLoading || !paymentModalParams) {
		return null;
	}

	if (isPaymentModalParamsError) {
		throw new Error(
			'Failed to load payment parameters for ERC721 marketplace purchase',
		);
	}

	return <PaymentModalOpener paymentModalParams={paymentModalParams} />;
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
