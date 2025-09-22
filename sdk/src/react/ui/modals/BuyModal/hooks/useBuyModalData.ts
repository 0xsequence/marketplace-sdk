import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useCollectible, useCollection, useCurrency } from '../../../../hooks';
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
	const collectibleId = isMarket
		? buyModalProps.collectibleId
		: buyModalProps.items?.[0]?.tokenId;
	const salePrice = isShop ? buyModalProps.salePrice : undefined;

	const { address, isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;

	const {
		data: collectible,
		isLoading: collectableLoading,
		isError: collectableError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
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

	const currencyAddress = isMarket
		? (orders?.orders[0]?.priceCurrencyAddress as Address)
		: buyModalProps.salePrice.currencyAddress;

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
		currencyAddress,
		collectionAddress,
		currency,
		order: orders?.orders[0] ?? undefined,
		salePrice,
		address,
		isMarket,
		isShop,
		collection,
		isLoading:
			collectableLoading ||
			(isMarket && ordersLoading) ||
			walletIsLoading ||
			collectionLoading ||
			currencyLoading,
		isError:
			collectableError || ordersError || currencyError || collectionError,
	};
};
