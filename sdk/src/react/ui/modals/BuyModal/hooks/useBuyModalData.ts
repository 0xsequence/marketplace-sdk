import type { Address } from '@0xsequence/api-client';
import { useAccount } from 'wagmi';
import {
	useCollectible,
	useCollection,
	useCurrency,
	usePrimarySaleItem,
} from '../../../../hooks';
import { useOrders } from '../../../../hooks/data/orders/useOrders';
import { isMarketProps, isShopProps, useBuyModalProps } from '../store';

export const useBuyModalData = () => {
	const buyModalProps = useBuyModalProps();
	const chainId = buyModalProps.chainId;
	const collectionAddress = buyModalProps.collectionAddress;

	const isMarket = isMarketProps(buyModalProps);
	const isShop = isShopProps(buyModalProps);
	const orderId = isMarket ? buyModalProps.orderId : undefined;
	const marketplace = isMarket ? buyModalProps.marketplace : undefined;
	const tokenId = isMarket
		? buyModalProps.tokenId
		: buyModalProps.item?.tokenId;
	const { isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;

	const {
		data: collectible,
		isLoading: collectableLoading,
		isError: isCollectibleError,
		error: collectibleError,
		refetch: refetchCollectible,
	} = useCollectible({
		chainId,
		collectionAddress,
		tokenId,
	});
	const {
		data: collection,
		isLoading: collectionLoading,
		isError: isCollectionError,
		error: collectionError,
		refetch: refetchCollection,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: orders,
		isLoading: ordersLoading,
		isError: isOrdersError,
		error: ordersError,
		refetch: refetchOrders,
	} = useOrders({
		chainId,
		input:
			orderId && marketplace
				? [
						{
							contractAddress: collectionAddress,
							orderId,
							marketplace,
						},
					]
				: [],
		query: {
			enabled: !!orderId && !!marketplace,
		},
	});
	const marketOrder = orders?.orders[0];
	console.log(marketOrder);

	// Fetch primary sale item details for shop type
	const {
		data: primarySaleItemData,
		isLoading: primarySaleItemLoading,
		isError: isPrimarySaleItemError,
		error: primarySaleItemError,
		refetch: refetchPrimarySaleItem,
	} = usePrimarySaleItem({
		chainId,
		primarySaleContractAddress: isShop
			? buyModalProps.salesContractAddress
			: undefined,
		tokenId: isShop ? buyModalProps.item.tokenId : undefined,
		query: {
			enabled: isShop,
		},
	});
	const primarySaleItem = primarySaleItemData?.item?.primarySaleItem;

	const currencyAddress = isMarket
		? (orders?.orders[0]?.priceCurrencyAddress as Address)
		: primarySaleItem?.currencyAddress;

	const {
		data: currency,
		isLoading: currencyLoading,
		isError: isCurrencyError,
		error: currencyError,
		refetch: refetchCurrency,
	} = useCurrency({
		chainId,
		currencyAddress,
	});

	const refetchQueries = async () => {
		const promises = [
			isCollectibleError ? refetchCollectible() : Promise.resolve(),
			collectionError ? refetchCollection() : Promise.resolve(),
			isOrdersError && isMarket ? refetchOrders() : Promise.resolve(),
			isPrimarySaleItemError && isShop
				? refetchPrimarySaleItem()
				: Promise.resolve(),
			currencyError ? refetchCurrency() : Promise.resolve(),
		];
		await Promise.all(promises);
	};

	return {
		collectible,
		collectionAddress,
		currency,
		marketOrder,
		isMarket,
		isShop,
		collection,
		primarySaleItem,
		isLoading:
			collectableLoading ||
			(isMarket && ordersLoading) ||
			(isShop && primarySaleItemLoading) ||
			walletIsLoading ||
			collectionLoading ||
			currencyLoading,
		isError:
			isCollectibleError ||
			isCollectionError ||
			isOrdersError ||
			isPrimarySaleItemError ||
			isCurrencyError,
		error:
			collectibleError ||
			collectionError ||
			ordersError ||
			primarySaleItemError ||
			currencyError,
		refetchQueries,
	};
};
