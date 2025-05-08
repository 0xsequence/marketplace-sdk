'use client';

import {
	type SelectPaymentSettings,
	useERC1155SaleContractCheckout,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { ContractType, StoreType } from '../../../_internal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { useERC721SalePaymentParams } from './hooks/useERC721SalePaymentParams';
import { useERC1155Checkout } from './hooks/useERC1155Checkout';
import { useLoadData } from './hooks/useLoadData';
import { usePaymentModalParams } from './hooks/usePaymentModalParams';
import {
	type CheckoutOptionsSalesContractProps,
	buyModalStore,
	isShopProps,
	useBuyModalProps,
	useIsOpen,
	useOnError,
	useQuantity,
} from './store';

export const BuyModal = () => {
	const isOpen = useIsOpen();

	if (!isOpen) {
		return null;
	}

	return <BuyModalContent />;
};

const BuyModalContent = () => {
	const props = useBuyModalProps();
	const { chainId, storeType, collectionAddress } = useBuyModalProps();

	const onError = useOnError();
	const quantity = useQuantity();

	const {
		collection,
		collectable,
		wallet,
		isLoading,
		isError,
		order,
		checkoutOptions,
		currency,
		shopData,
	} = useLoadData();

	const {
		data: paymentModalParams,
		isLoading: isPaymentModalParamsLoading,
		isError: isPaymentModalParamsError,
	} = usePaymentModalParams({
		wallet,
		quantity,
		marketplace: order?.marketplace,
		collectable: collectable,
		checkoutOptions: checkoutOptions,
		priceCurrencyAddress: order?.priceCurrencyAddress,
		enabled: storeType === StoreType.MARKETPLACE,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to set this on collection change
	useEffect(() => {
		if (isMarket && collection?.type === ContractType.ERC721 && !quantity) {
			buyModalStore.send({ type: 'setQuantity', quantity: 1 });
		}
	}, [collection]);

	if (isError || isPaymentModalParamsError || isErc721PaymentParamsError) {
		onError(new Error('Error loading data'));
		return (
			<ErrorModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Error"
			/>
		);
	}

	if (
		isLoading ||
		isPaymentModalParamsLoading ||
		isErc721PaymentParamsLoading ||
		!collection ||
		/**
		(storeType === StoreType.MARKETPLACE && !collectable) ||
		(storeType === StoreType.MARKETPLACE && !order) */
		!order ||
		!collectable
	) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Sequence Pay"
			/>
		);
	}

	const quantityDecimals =
		marketplaceType === MarketplaceType.MARKET ? order?.quantityDecimals : 2;
	const quantityRemaining =
		marketplaceType === MarketplaceType.MARKET
			? Number(order?.quantityRemaining)
			: 4;

	if (collection.type === ContractType.ERC1155 && !quantity) {
		return (
			<ERC1155QuantityModal
				order={order}
				marketplaceType={marketplaceType}
				quantityDecimals={quantityDecimals}
				quantityRemaining={quantityRemaining}
				salePrice={
					isShop && shopData?.salePrice && currency
						? {
								amount: shopData.salePrice.amount,
								currencyAddress: shopData.salePrice.currencyAddress,
								currency,
							}
						: undefined
				}
				chainId={chainId}
			/>
		);
	}

	// Marketplace Payments
	if (paymentModalParams) {
		return <PaymentModalOpener paymentModalParams={paymentModalParams} />;
	}

	// Primary Sales Contract Checkout
	if (isShopProps(props)) {
		return (
			// TODO: Add ERC721SaleContractCheckoutModalOpener once ERC721 sales contracts are implemented
			<ERC1155SaleContractCheckoutModalOpener
				chainId={chainId}
				// eslint-disable-next-line react/prop-types
				salesContractAddress={props.salesContractAddress}
				collectionAddress={collectionAddress}
				// eslint-disable-next-line react/prop-types
				items={props.items}
				// eslint-disable-next-line react/prop-types
				enabled={!!props.salesContractAddress && !!props.items}
			/>
		);
	}

	return null;
};

const PaymentModalOpener = ({
	paymentModalParams,
}: {
	paymentModalParams: SelectPaymentSettings;
}) => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const hasOpenedRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!hasOpenedRef.current) {
			hasOpenedRef.current = true;
			openSelectPaymentModal(paymentModalParams);
		}
	}, []);

	return null;
};

const SaleContractCheckoutModalOpener = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	enabled,
	customProviderCallback,
}: CheckoutOptionsSalesContractProps & { enabled: boolean }) => {
	const { address: accountAddress } = useAccount();
	const { openCheckoutModal } = useERC1155SaleContractCheckout({
		chain: chainId,
		contractAddress: salesContractAddress,
		collectionAddress,
		items,
		// it doesn't open the modal if the wallet is not connected
		wallet: accountAddress ?? '',
		customProviderCallback,
	});
	const hasOpenedRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!hasOpenedRef.current) {
			hasOpenedRef.current = true;
			openCheckoutModal();
		}
	}, []);

	return null;
};
