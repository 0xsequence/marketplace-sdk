'use client';

import {
	ErrorModal,
	LoadingModal,
} from '../../../_internal/components/baseModal';
import {
	buyModalStore,
	isMarketProps,
	isShopProps,
	useBuyModalProps,
	useOnError,
} from '../../store';
//import { ErrorModal } from '../../_internal/components/actionModal/ErrorModal';
//import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';
import { useCheckoutRouter } from './_hooks/useCheckoutRouter';
import { ERC721MarketModal } from './ERC721MarketModal';
import { ERC721ShopModal } from './ERC721ShopModal';
import { ERC1155MarketModal } from './ERC1155MarketModal';
import { ERC1155ShopModal } from './ERC1155ShopModal';

export const SequenceCheckout = () => {
	const modalProps = useBuyModalProps();
	const chainId = modalProps.chainId;
	const isShop = isShopProps(modalProps);
	const isMarket = isMarketProps(modalProps);
	const onError = useOnError();
	const {
		collection,
		collectable,
		address,
		isLoading,
		marketOrder,
		currency,
		shopData,
		isError,
	} = useCheckoutRouter();

	if (isError) {
		return (
			<ErrorModal
				chainId={chainId}
				error={new Error('Error occurred while loading payment options')}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Error"
			/>
		);
	}

	if (isLoading || !collection) {
		return (
			<LoadingModal
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading payment options"
			/>
		);
	}

	if (isShop) {
		if (collection?.type === 'ERC721') {
			if (!shopData || !currency) {
				return (
					<ErrorModal
						chainId={chainId}
						error={
							new Error(
								shopData
									? 'Currency information not available'
									: 'Shop data is missing',
							)
						}
						onClose={() => buyModalStore.send({ type: 'close' })}
						title="Configuration Error"
					/>
				);
			}
			return (
				<ERC721ShopModal
					collectionAddress={collection?.address}
					shopData={shopData}
					chainId={chainId}
				/>
			);
		}
		if (collection?.type === 'ERC1155') {
			if (!shopData || !currency) {
				return (
					<ErrorModal
						chainId={chainId}
						error={
							new Error(
								shopData
									? 'Currency information not available'
									: 'Shop data is missing',
							)
						}
						onClose={() => buyModalStore.send({ type: 'close' })}
						title="Configuration Error"
					/>
				);
			}
			return (
				<ERC1155ShopModal
					collectionAddress={collection?.address}
					shopData={shopData}
					chainId={chainId}
				/>
			);
		}
	}

	if (isMarket) {
		if (collection?.type === 'ERC721') {
			if (!collectable || !marketOrder || !address) {
				return (
					<ErrorModal
						chainId={chainId}
						error={
							new Error(
								collectable
									? 'Market order information not available'
									: 'Collectable data is missing',
							)
						}
						onClose={() => buyModalStore.send({ type: 'close' })}
						title="Configuration Error"
					/>
				);
			}
			return (
				<ERC721MarketModal
					collectable={collectable}
					order={marketOrder}
					address={address}
					chainId={chainId}
				/>
			);
		}
		if (collection?.type === 'ERC1155') {
			if (!collectable || !marketOrder || !address) {
				return (
					<ErrorModal
						chainId={chainId}
						error={
							new Error(
								collectable
									? 'Market order information not available'
									: 'Collectable data is missing',
							)
						}
						onClose={() => buyModalStore.send({ type: 'close' })}
						title="Configuration Error"
					/>
				);
			}
			return (
				<ERC1155MarketModal
					collectable={collectable}
					order={marketOrder}
					address={address}
					chainId={chainId}
				/>
			);
		}
	}

	onError(
		new Error(
			`Unsupported configuration: ${collection?.type} in ${
				isShop ? 'shop' : 'market'
			} mode`,
		),
	);

	return (
		<ErrorModal
			chainId={chainId}
			error={
				new Error(
					`Unsupported configuration: ${collection?.type} in ${
						isShop ? 'shop' : 'market'
					} mode`,
				)
			}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Unsupported Configuration"
		/>
	);
};
