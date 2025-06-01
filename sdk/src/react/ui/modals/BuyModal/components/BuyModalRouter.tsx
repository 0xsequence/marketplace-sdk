'use client';

import { ContractType } from '../../../../_internal';
import { ErrorModal } from '../../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../../_internal/components/actionModal/LoadingModal';
import { useLoadData } from '../hooks/useLoadData';
import {
	type ShopBuyModalProps,
	buyModalStore,
	isMarketProps,
	isShopProps,
	useBuyModalProps,
	useOnError,
} from '../store';
import { ERC721BuyModal } from './ERC721BuyModal';
import { ERC721ShopModal } from './ERC721ShopModal';
import { ERC1155BuyModal } from './ERC1155BuyModal';
import { ERC1155ShopModal } from './ERC1155ShopModal';

/**
 * Router component that determines which specific modal to render
 * based on the contract type and marketplace/shop context
 */
export const BuyModalRouter = () => {
	const props = useBuyModalProps();
	const { chainId } = props;
	const isShop = isShopProps(props);
	const isMarket = isMarketProps(props);
	const onError = useOnError();

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

	// Handle errors
	if (isError) {
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

	// Handle loading state
	if (
		isLoading ||
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

	// Route to appropriate modal based on contract type and context
	if (collection.type === ContractType.ERC721) {
		if (isMarket && collectable && order) {
			return (
				<ERC721BuyModal
					collection={collection}
					collectable={collectable}
					order={order}
					wallet={wallet}
					checkoutOptions={checkoutOptions}
					chainId={chainId}
				/>
			);
		}

		if (isShop && shopData && currency) {
			const saleItems = (props as ShopBuyModalProps).items;
			return (
				<ERC721ShopModal
					collection={collection}
					shopData={shopData}
					currency={currency}
					chainId={chainId}
					saleItems={saleItems}
				/>
			);
		}
	}

	if (collection.type === ContractType.ERC1155) {
		if (isMarket && collectable && order) {
			return (
				<ERC1155BuyModal
					collection={collection}
					collectable={collectable}
					order={order}
					wallet={wallet}
					checkoutOptions={checkoutOptions}
					chainId={chainId}
				/>
			);
		}

		if (isShop && shopData && currency) {
			const saleItems = (props as ShopBuyModalProps).items;
			return (
				<ERC1155ShopModal
					collection={collection}
					shopData={shopData}
					currency={currency}
					chainId={chainId}
					saleItems={saleItems}
				/>
			);
		}
	}

	// Fallback error if no route matches
	onError(new Error(`Unsupported configuration: ${collection.type}`));
	return (
		<ErrorModal
			isOpen={true}
			chainId={chainId}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Unsupported Configuration"
		/>
	);
};
