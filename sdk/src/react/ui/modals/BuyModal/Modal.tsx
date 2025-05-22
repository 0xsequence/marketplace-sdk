'use client';

import {
	type SelectPaymentSettings,
	useSelectPaymentModal,
} from '@0xsequence/checkout';
import { useEffect, useRef } from 'react';
import { ContractType } from '../../../_internal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ERC1155QuantityModal } from './ERC1155QuantityModal';
import { useERC721SalePaymentParams } from './hooks/useERC721SalePaymentParams';
import { useERC1155Checkout } from './hooks/useERC1155Checkout';
import { useLoadData } from './hooks/useLoadData';
import { usePaymentModalParams } from './hooks/usePaymentModalParams';
import {
	type CheckoutOptionsSalesContractProps,
	type ShopBuyModalProps,
	buyModalStore,
	isMarketProps,
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
	const {
		chainId,
		marketplaceType,
		collectionAddress,
		quantityDecimals,
		quantityRemaining,
	} = useBuyModalProps();
	const isShop = isShopProps(props);
	// eslint-disable-next-line react/prop-types
	const saleItems = isShop ? (props as ShopBuyModalProps).items : [];
	const isMarket = isMarketProps(props);

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
		enabled: isMarket,
	});
	const {
		data: erc721SalePaymentParams,
		isLoading: isErc721PaymentParamsLoading,
		isError: isErc721PaymentParamsError,
	} = useERC721SalePaymentParams({
		salesContractAddress: shopData?.salesContractAddress,
		collectionAddress,
		price: shopData?.salePrice.amount,
		currencyAddress: shopData?.salePrice.currencyAddress,
		enabled: isShop && collection?.type === ContractType.ERC721,
		chainId,
		quantity: Number(saleItems[0]?.quantity ?? 1),
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
		(isMarket && !collectable) ||
		(isMarket && !order) ||
		(isShop && !currency)
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
								amountRaw: shopData.salePrice.amount,
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

	// ERC721 Sale Payments
	if (erc721SalePaymentParams) {
		const totalPrice =
			BigInt(erc721SalePaymentParams.price) *
			BigInt(saleItems[0]?.quantity ?? 1);

		return (
			<PaymentModalOpener
				paymentModalParams={{
					...erc721SalePaymentParams,
					price: String(totalPrice),
				}}
			/>
		);
	}

	// Primary Sales Contract Checkout for ERC1155
	if (isShop && shopData && collection.type === ContractType.ERC1155) {
		return (
			<ERC1155SaleContractCheckoutModalOpener
				chainId={chainId}
				salesContractAddress={shopData.salesContractAddress}
				collectionAddress={collectionAddress}
				items={shopData.items.map((item) => ({
					...item,
					tokenId: item.tokenId ?? '0',
					quantity: item.quantity ?? '1',
				}))}
				enabled={!!shopData.salesContractAddress && !!shopData.items}
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

const ERC1155SaleContractCheckoutModalOpener = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
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
