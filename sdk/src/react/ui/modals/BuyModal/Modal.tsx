'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect, useRef } from 'react';
import { ContractType, MarketplaceType } from '../../../_internal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { useERC721Checkout } from './hooks/useERC721Checkout';
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
	const { chainId, marketplaceType, collectionAddress } = useBuyModalProps();
	const isShop = isShopProps(props);
	const isMarketplace = isMarketplaceProps(props);

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
		enabled: marketplaceType === MarketplaceType.MARKET,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to set this on collection change
	useEffect(() => {
		if (collection?.type === ContractType.ERC721 && !quantity) {
			buyModalStore.send({ type: 'setQuantity', quantity: 1 });
		}
	}, [collection]);

	if (isError || isPaymentModalParamsError) {
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
		!collection ||
		(marketplaceType === MarketplaceType.MARKET && !collectable) ||
		(marketplaceType === MarketplaceType.MARKET && !order)
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
				// eslint-disable-next-line react/prop-types
				salePrice={isShopProps(props) ? props.salePrice : undefined}
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
		if (collection.type === ContractType.ERC1155) {
			return (
				<ERC1155SaleContractCheckoutModalOpener
					chainId={chainId}
					// eslint-disable-next-line react/prop-types
					salesContractAddress={props.salesContractAddress}
					collectionAddress={collectionAddress}
					// eslint-disable-next-line react/prop-types
					items={props.items}
					// eslint-disable-next-line react/prop-types
					enabled={!!props.salesContractAddress && !!props.items}
					customProviderCallback={props.customProviderCallback}
				/>
			);
		}

		if (collection.type === ContractType.ERC721) {
			return (
				<ERC721SaleContractCheckoutModalOpener
					chainId={chainId}
					// eslint-disable-next-line react/prop-types
					salesContractAddress={props.salesContractAddress}
					collectionAddress={collectionAddress}
					// eslint-disable-next-line react/prop-types
					items={props.items}
					// eslint-disable-next-line react/prop-types
					enabled={!!props.salesContractAddress && !!props.items}
					customProviderCallback={props.customProviderCallback}
				/>
			);
		}
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

const ERC1155SaleContractCheckoutModalOpener = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	accountAddress,
	enabled,
	customProviderCallback,
}: CheckoutOptionsSalesContractProps & { enabled: boolean }) => {
	const hasOpenedRef = useRef(false);

	const { openCheckoutModal, isLoading, isError, isEnabled } =
		useERC1155Checkout({
			chainId,
			salesContractAddress,
			collectionAddress,
			items,
			customProviderCallback,
			enabled,
		});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!hasOpenedRef.current && isEnabled && !isLoading) {
			if (isError) {
				// No need to throw an error here, as the onError callback in the hook will handle it
				return;
			}

			// Open the checkout modal
			hasOpenedRef.current = true;
			openCheckoutModal();
		}
	}, [isLoading, isError, isEnabled]);

	if (isLoading) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Sequence Pay"
			/>
		);
	}

	return null;
};

const ERC721SaleContractCheckoutModalOpener = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	enabled,
	customProviderCallback,
}: CheckoutOptionsSalesContractProps & { enabled: boolean }) => {
	const hasOpenedRef = useRef(false);

	const { openCheckoutModal, isLoading, isError, isEnabled } =
		useERC721Checkout({
			chainId,
			salesContractAddress,
			collectionAddress,
			items,
			customProviderCallback,
			enabled,
		});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!hasOpenedRef.current && isEnabled && !isLoading) {
			hasOpenedRef.current = true;
			openCheckoutModal();
		}
	}, [isLoading, isError, isEnabled]);

	if (isLoading) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Sequence Pay"
			/>
		);
	}

	return null;
};
