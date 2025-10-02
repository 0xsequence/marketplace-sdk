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
import {
	buyModalStore,
	isShopProps,
	useBuyModalProps,
	usePaymentModalState,
	useQuantity,
} from '../store';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';
import { useValidateSequenceMarketOrder } from '../../../../hooks/validation/useValidateSequenceMarketOrder';
import { OrderInvalidModal } from './OrderInvalidModal';
import { skipToken } from '@tanstack/react-query';

interface ERC1155BuyModalProps {
	collection: ContractInfo;
	collectable: TokenMetadata;
	order: Order;
	address: Address | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	chainId: number;
	collectibleId: string;
	collectionAddress: Address;
}

export const ERC1155BuyModal = ({
	collectable,
	order,
	address,
	checkoutOptions,
	chainId,
	collectibleId,
	collectionAddress,
}: ERC1155BuyModalProps) => {
	const quantity = useQuantity();
	const modalProps = useBuyModalProps();
	const cardType = modalProps.cardType || 'market';
	const isShop = isShopProps(modalProps);
	const quantityDecimals = isShop
		? modalProps.quantityDecimals
		: collectable.decimals || 0;
	const quantityRemaining = isShop
		? modalProps.quantityRemaining?.toString()
		: order?.quantityRemaining;
	const unlimitedSupply = isShop ? modalProps.unlimitedSupply : false;

	// Validate Sequence Market orders after quantity is selected
	const { data: validation, isLoading: isValidating } =
		useValidateSequenceMarketOrder(
			!isShop && quantity
				? {
						chainId,
						marketplace: order.marketplace,
						orderId: order.orderId,
						quantity,
						enabled: !!quantity,
					}
				: skipToken,
		);

	useEffect(() => {
		if (modalProps.hideQuantitySelector && !quantity) {
			const minQuantity = quantityDecimals > 0 ? 10 ** quantityDecimals : 1;

			const autoQuantity = unlimitedSupply
				? minQuantity
				: Math.min(Number(quantityRemaining), minQuantity);

			buyModalStore.send({
				type: 'setQuantity',
				quantity: autoQuantity,
			});
		}
	}, [
		modalProps.hideQuantitySelector,
		quantity,
		quantityDecimals,
		unlimitedSupply,
		quantityRemaining,
	]);

	if (!quantity && !modalProps.hideQuantitySelector) {
		return (
			<ERC1155QuantityModal
				order={order}
				cardType={cardType}
				quantityDecimals={quantityDecimals}
				quantityRemaining={quantityRemaining}
				unlimitedSupply={unlimitedSupply}
				chainId={chainId}
			/>
		);
	}

	// Show loading while validating
	if (quantity && !isShop && isValidating) {
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
	if (quantity && !isShop && validation && !validation.isValid) {
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

	if (!checkoutOptions || !quantity) {
		return null;
	}

	return (
		<Modal
			address={address}
			quantity={quantity}
			order={order}
			collectable={collectable}
			checkoutOptions={checkoutOptions}
		/>
	);
};

interface ModalProps {
	address: Address | undefined;
	quantity: number;
	order: Order;
	collectable: TokenMetadata;
	checkoutOptions: CheckoutOptions;
}

const Modal = ({
	address,
	quantity,
	order,
	collectable,
	checkoutOptions,
}: ModalProps) => {
	const {
		data: paymentModalParams,
		isLoading: isPaymentModalParamsLoading,
		isError: isPaymentModalParamsError,
		failureReason,
	} = usePaymentModalParams({
		address,
		quantity,
		marketplace: order?.marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: true,
	});

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

	if (isPaymentModalParamsLoading || !paymentModalParams) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={order.chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading checkout"
			/>
		);
	}

	if (isPaymentModalParamsError) {
		throw new Error(
			'Failed to load payment parameters for ERC1155 marketplace purchase',
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
