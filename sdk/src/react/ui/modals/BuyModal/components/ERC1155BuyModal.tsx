'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';
import { useEffect } from 'react';
import type { Address } from 'viem';
import type { CheckoutOptions, Order } from '../../../../_internal';
import { usePaymentModalParams } from '../hooks/usePaymentModalParams';
import {
	buyModalStore,
	isShopProps,
	useBuyModalProps,
	usePaymentModalState,
	useQuantity,
} from '../store';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { ActionModal } from '../../_internal/components/actionModal';
import { ErrorLogBox } from '../../../components/_internals/ErrorLogBox';

interface ERC1155BuyModalProps {
	collection: ContractInfo;
	collectable: TokenMetadata;
	order: Order;
	address: Address | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	chainId: number;
}

export const ERC1155BuyModal = ({
	collectable,
	order,
	address,
	checkoutOptions,
	chainId,
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
		return null;
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
