import type { Address } from 'viem';
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
		isError: collectableError,
	} = useCollectible({
		chainId,
		collectionAddress,
		tokenId,
	});
	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: orders,
		isLoading: ordersLoading,
		isError: ordersError,
	} = useOrders({
		chainId,
		input: [
			{
				contractAddress: collectionAddress,
				orderId: orderId!,
				marketplace: marketplace!,
			},
		],
		query: {
			enabled: !!orderId && !!marketplace,
		},
	});
	const marketOrder = orders?.orders[0];

	// Fetch primary sale item details for shop type
	const {
		data: primarySaleItemData,
		isLoading: primarySaleItemLoading,
		isError: primarySaleItemError,
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
		isError: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress,
	});

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
			collectableError ||
			ordersError ||
			primarySaleItemError ||
			currencyError ||
			collectionError,
	};
};
