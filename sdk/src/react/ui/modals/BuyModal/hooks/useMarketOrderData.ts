import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useCollectible, useCurrency } from '../../../../hooks';
import { useOrders } from '../../../../hooks/data/orders/useOrders';
import {
	isMarketProps,
	type MarketplaceBuyModalProps,
	useBuyModalProps,
} from '../store';

type UseMarketOrderDataProps = {
	enabled: boolean;
};

export const useMarketOrderData = (props: UseMarketOrderDataProps) => {
	const buyModalProps = useBuyModalProps() as MarketplaceBuyModalProps;
	const { chainId, collectionAddress, orderId, marketplace } = buyModalProps;

	const isMarket = isMarketProps(buyModalProps);
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
		query: {
			enabled: !!collectibleId && props.enabled,
		},
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
				orderId: orderId,
				marketplace: marketplace,
			},
		],
		query: {
			enabled: props.enabled,
		},
	});

	const {
		data: currency,
		isLoading: currencyLoading,
		isError: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress: orders?.orders[0]?.priceCurrencyAddress as Address,
		query: {
			enabled: props.enabled,
		},
	});

	return {
		collectible,
		currency,
		order: orders?.orders[0] ?? undefined,
		checkoutOptions: orders,
		address,
		isLoading:
			collectableLoading ||
			(isMarket && ordersLoading) ||
			walletIsLoading ||
			currencyLoading,
		isError: collectableError || ordersError || currencyError,
	};
};
