import { skipToken } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
	useCheckoutOptionsSalesContract,
	useCollectible,
	useCollection,
	useCurrency,
} from '../../../../hooks';
import { isMarketProps, isShopProps, useBuyModalProps } from '../store';
import { useCheckoutOptions } from './useCheckoutOptions';

export const useLoadData = () => {
	const props = useBuyModalProps();
	const { chainId, collectionAddress } = props;

	const isMarket = isMarketProps(props);
	const isShop = isShopProps(props);
	const collectibleId = isMarket ? props.collectibleId : undefined;

	const { address, isConnecting, isReconnecting } = useAccount();
	const walletIsLoading = isConnecting || isReconnecting;

	const {
		data: collection,
		isLoading: collectionLoading,
		isError: isCollectionError,
		error: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: collectable,
		isLoading: collectableLoading,
		isError: isCollectableError,
		error: collectableError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
		query: {
			enabled: !!collectibleId,
		},
	});

	const {
		data: currency,
		isLoading: currencyLoading,
		isError: isCurrencyError,
		error: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress: isShop ? props.salePrice?.currencyAddress : undefined,
		query: {
			enabled: isShop,
		},
	});

	const {
		data: marketplaceCheckoutOptions,
		isLoading: marketplaceCheckoutOptionsLoading,
		isError: isMarketplaceCheckoutOptionsError,
		error: marketplaceCheckoutOptionsError,
	} = useCheckoutOptions(
		isMarket
			? {
					chainId,
					collectionAddress,
					orderId: props.orderId,
					marketplace: props.marketplace,
				}
			: skipToken,
	);

	const {
		data: salesContractCheckoutOptions,
		isLoading: salesContractCheckoutOptionsLoading,
		isError: isSalesContractCheckoutOptionsError,
		error: salesContractCheckoutOptionsError,
	} = useCheckoutOptionsSalesContract(
		isShop
			? {
					chainId,
					contractAddress: props.salesContractAddress,
					collectionAddress,
					items: props.items.map((item) => ({
						tokenId: item.tokenId ?? '0',
						quantity: item.quantity ?? '1',
					})),
				}
			: skipToken,
	);

	const shopData = isShop
		? {
				salesContractAddress: props.salesContractAddress,
				items: props.items,
				salePrice: props.salePrice,
				checkoutOptions: salesContractCheckoutOptions?.options,
			}
		: undefined;

	return {
		collection,
		collectable,
		currency,
		order: marketplaceCheckoutOptions?.order,
		checkoutOptions: marketplaceCheckoutOptions,
		address,
		shopData,
		isLoading:
			collectionLoading ||
			collectableLoading ||
			(isMarket && marketplaceCheckoutOptionsLoading) ||
			(isShop && (currencyLoading || salesContractCheckoutOptionsLoading)) ||
			walletIsLoading,
		isError:
			isCollectionError ||
			isCollectableError ||
			isCurrencyError ||
			isMarketplaceCheckoutOptionsError ||
			isSalesContractCheckoutOptionsError,
		error:
			collectionError ||
			collectableError ||
			currencyError ||
			marketplaceCheckoutOptionsError ||
			salesContractCheckoutOptionsError,
	};
};
