import { skipToken } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
	useCheckoutOptionsSalesContract,
	useCollectibleDetail,
	useCollectionDetail,
	useCurrencyDetail,
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
		isError: collectionError,
	} = useCollectionDetail({
		chainId,
		collectionAddress,
	});

	const {
		data: collectable,
		isLoading: collectableLoading,
		isError: collectableError,
	} = useCollectibleDetail({
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
		isError: currencyError,
	} = useCurrencyDetail({
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
						tokenId: item.tokenId ?? 0n,
						quantity: item.quantity ?? 1n,
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
			collectionError ||
			collectableError ||
			currencyError ||
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
