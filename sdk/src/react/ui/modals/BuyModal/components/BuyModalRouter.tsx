'use client';

import { ErrorModal } from '../../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';
import { useLoadData } from '../hooks/useLoadData';
import {
	buyModalStore,
	isShopProps,
	useBuyModalProps,
	useOnError,
} from '../store';
import { ERC721BuyModal } from './ERC721BuyModal';
import { ERC721ShopModal } from './ERC721ShopModal';
import { ERC1155BuyModal } from './ERC1155BuyModal';
import { ERC1155ShopModal } from './ERC1155ShopModal';

export const BuyModalRouter = () => {
	const modalProps = useBuyModalProps();
	const chainId = modalProps.chainId;
	const isShop = isShopProps(modalProps);
	const onError = useOnError();
	const {
		collection,
		collectable,
		address,
		isLoading,
		order,
		checkoutOptions,
		currency,
		shopData,
		isError,
	} = useLoadData();

	if (isError) {
		return (
			<ErrorModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Error"
			/>
		);
	}

	if (isLoading || !collection) {
		return (
			<LoadingModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Loading Sequence Pay"
			/>
		);
	}

	if (isShop) {
		if (collection.type === 'ERC721') {
			if (!shopData || !currency) {
				return (
					<LoadingModal
						isOpen={true}
						chainId={chainId}
						onClose={() => buyModalStore.send({ type: 'close' })}
						title="Loading Sequence Pay"
					/>
				);
			}
			return (
				<ERC721ShopModal
					collection={collection}
					shopData={shopData}
					chainId={chainId}
				/>
			);
		}
		if (collection.type === 'ERC1155') {
			if (!shopData || !currency) {
				return (
					<LoadingModal
						isOpen={true}
						chainId={chainId}
						onClose={() => buyModalStore.send({ type: 'close' })}
						title="Loading Sequence Pay"
					/>
				);
			}
			return (
				<ERC1155ShopModal
					collection={collection}
					shopData={shopData}
					chainId={chainId}
				/>
			);
		}
	} else {
		if (collection.type === 'ERC721') {
			if (!collectable || !order || !address || !checkoutOptions) {
				return (
					<LoadingModal
						isOpen={true}
						chainId={chainId}
						onClose={() => buyModalStore.send({ type: 'close' })}
						title="Loading Sequence Pay"
					/>
				);
			}
			return (
				<ERC721BuyModal
					collection={collection}
					collectable={collectable}
					order={order}
					address={address}
					checkoutOptions={checkoutOptions}
					chainId={chainId}
				/>
			);
		}
		if (collection.type === 'ERC1155') {
			if (!collectable || !order || !address || !checkoutOptions) {
				return (
					<LoadingModal
						isOpen={true}
						chainId={chainId}
						onClose={() => buyModalStore.send({ type: 'close' })}
						title="Loading Sequence Pay"
					/>
				);
			}
			return (
				<ERC1155BuyModal
					collection={collection}
					collectable={collectable}
					order={order}
					address={address}
					checkoutOptions={checkoutOptions}
					chainId={chainId}
				/>
			);
		}
	}

	onError(
		new Error(
			`Unsupported configuration: ${collection.type} in ${
				isShop ? 'shop' : 'market'
			} mode`,
		),
	);
	return (
		<ErrorModal
			isOpen={true}
			chainId={chainId}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Unsupported Configuration"
		/>
	);
};
