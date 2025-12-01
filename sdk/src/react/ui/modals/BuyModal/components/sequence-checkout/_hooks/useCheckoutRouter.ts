import { MarketplaceKind } from '@0xsequence/api-client';
import { useAccount } from 'wagmi';
import { useOrders } from '../../../../../../hooks/data/orders/useOrders';
import {
	useCollectible,
	useCollection,
	useCurrency,
} from '../../../../../hooks';
import { useBuyModalContext } from '../../../internal/buyModalContext';
import { isMarketProps, isShopProps, useBuyModalProps } from '../../../store';

export const useCheckoutRouter = () => {
	const props = useBuyModalProps();
	const { chainId, collectionAddress } = props;
	const { checkoutMode } = useBuyModalContext();
	const sequenceCheckoutOptions =
		typeof checkoutMode === 'object' ? checkoutMode.options : undefined;

	const isMarket = isMarketProps(props);
	const isShop = isShopProps(props);
	const tokenId = isMarket ? props.tokenId : undefined;

	const { address, isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;
	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: collectable,
		isLoading: collectableLoading,
		isError: collectableError,
	} = useCollectible({
		chainId,
		collectionAddress,
		tokenId,
		query: {
			enabled: !!tokenId,
		},
	});

	const {
		data: currency,
		isLoading: currencyLoading,
		isError: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress: isShop ? props.salePrice?.currencyAddress : undefined,
		query: {
			enabled: isShop,
		},
	});

	const {
		data: marketOrders,
		isLoading: marketOrdersLoading,
		isError: marketOrdersError,
	} = useOrders({
		chainId,
		input: [
			{
				contractAddress: collectionAddress,
				orderId: isMarketProps(props) ? props.orderId : '',
				marketplace: isMarketProps(props)
					? props.marketplace
					: MarketplaceKind.sequence_marketplace_v2,
			},
		],
		query: {
			enabled: isMarketProps(props) && !!props.orderId,
		},
	});
	const marketOrder = marketOrders?.orders[0];

	const shopData = isShop
		? {
				salesContractAddress: props.salesContractAddress,
				items: props.items,
				salePrice: props.salePrice,
				checkoutOptions: sequenceCheckoutOptions,
			}
		: undefined;

	return {
		collection,
		collectable,
		currency,
		marketOrder,
		address,
		shopData,
		isLoading:
			collectionLoading ||
			collectableLoading ||
			walletIsLoading ||
			marketOrdersLoading ||
			currencyLoading,
		isError:
			collectionError || collectableError || currencyError || marketOrdersError,
	};
};
