import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useCollectible, useCurrency } from '../../../../hooks';
import { useOrders } from '../../../../hooks/data/orders/useOrders';
import { isMarketProps, useBuyModalProps } from '../store';

export const useBuyModalData = () => {
	const buyModalProps = useBuyModalProps();
	const chainId = buyModalProps.chainId;
	const collectionAddress = buyModalProps.collectionAddress;

	const isMarket = isMarketProps(buyModalProps);
	const orderId = isMarket ? buyModalProps.orderId : undefined;
	const marketplace = isMarket ? buyModalProps.marketplace : undefined;
	const collectibleId = isMarket ? buyModalProps.collectibleId : undefined;

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
		currency,
		order: orders?.orders[0] ?? undefined,
		address,
		isLoading:
			collectableLoading ||
			(isMarket && ordersLoading) ||
			walletIsLoading ||
			currencyLoading,
		isError: collectableError || ordersError || currencyError,
	};
};
