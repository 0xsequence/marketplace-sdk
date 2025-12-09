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
	const tokenId = isMarket
		? buyModalProps.tokenId
		: buyModalProps.item?.tokenId;
	const { address, isConnecting, isReconnecting } = useAccount();
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

	const salePrice = isShop ? buyModalProps.salePrice : undefined;

	const marketPriceAmount = isMarket
		? (orders?.orders[0]?.priceAmount ?? BigInt(0))
		: undefined;

	return {
		collectible,
		currencyAddress,
		collectionAddress,
		currency,
		order: orders?.orders[0] ?? undefined,
		salePrice,
		marketPriceAmount,
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
