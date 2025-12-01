'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { ActionModal } from '../../../_internal/components/baseModal';
import { buyModalStore, usePaymentModalState } from '../../store';
import type { ShopData } from '../types';
import { useERC721ShopModalData } from './_hooks/useERC721ShopModalData';

interface ERC721ShopModalProps {
	collectionAddress: Address;
	shopData: ShopData;
	chainId: number;
}

export const ERC721ShopModal = ({
	collectionAddress,
	shopData,
	chainId,
}: ERC721ShopModalProps) => {
	const quantity = Number(shopData.items[0]?.quantity ?? 1);

	const erc721ShopModalData = useERC721ShopModalData({
		salesContractAddress: shopData.salesContractAddress,
		collectionAddress: collectionAddress.toString(),
		price: shopData.salePrice?.amount?.toString() || '0',
		currencyAddress: shopData.salePrice?.currencyAddress || '',
		enabled: true,
		chainId,
		quantity,
	});

	return (
		<ActionModal
			type="buy"
			queries={{ erc721ShopModalData }}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Checkout"
			chainId={chainId}
		>
			{({ erc721ShopModalData }) => {
				return <PaymentModalOpener paymentModalParams={erc721ShopModalData} />;
			}}
		</ActionModal>
	);
};

interface PaymentModalOpenerProps {
	paymentModalParams: SelectPaymentSettings;
}

const PaymentModalOpener = ({
	paymentModalParams,
}: PaymentModalOpenerProps) => {
	if (!paymentModalParams) return null;

	const { openSelectPaymentModal } = useSelectPaymentModal();
	const paymentModalState = usePaymentModalState();
	const totalPrice =
		BigInt(paymentModalParams.price) *
		BigInt(paymentModalParams.collectibles[0].quantity);

	useEffect(() => {
		if (paymentModalState === 'idle') {
			buyModalStore.send({ type: 'openPaymentModal' });
			openSelectPaymentModal({
				...paymentModalParams,
				price: String(totalPrice),
			});
			buyModalStore.send({ type: 'paymentModalOpened' });
		}
	}, [
		paymentModalState,
		paymentModalParams,
		openSelectPaymentModal,
		totalPrice,
	]);

	return null;
};
