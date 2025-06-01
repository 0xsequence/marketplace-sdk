import { skipToken } from '@tanstack/react-query';
import { useWallet } from '../../../../_internal/wallet/useWallet';
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

	// Check if we're in marketplace mode
	const isMarketplace = isMarketProps(props);
	const isShop = isShopProps(props);
	const collectibleId = isMarketplace ? props.collectibleId : undefined;

	const {
		wallet,
		isLoading: walletLoading,
		isError: walletError,
	} = useWallet();

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
		collectibleId,
		query: {
			enabled: !!collectibleId,
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

	// Marketplace checkout options
	const {
		data: marketplaceCheckoutOptions,
		isLoading: marketplaceCheckoutOptionsLoading,
		isError: marketplaceCheckoutOptionsError,
	} = useCheckoutOptions(
		isMarketplace
			? {
					chainId,
					collectionAddress,
					orderId: props.orderId,
					marketplace: props.marketplace,
				}
			: skipToken,
	);

	// Sales contract checkout options for primary sales
	const {
		data: salesContractCheckoutOptions,
		isLoading: salesContractCheckoutOptionsLoading,
		isError: salesContractCheckoutOptionsError,
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

	// Extract shop-specific data
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
		wallet,
		shopData,
		isLoading:
			collectionLoading ||
			collectableLoading ||
			(isMarketplace && marketplaceCheckoutOptionsLoading) ||
			(isShop && (currencyLoading || salesContractCheckoutOptionsLoading)) ||
			walletLoading,
		isError:
			collectionError ||
			collectableError ||
			(isMarketplace && marketplaceCheckoutOptionsError) ||
			(isShop && (currencyError || salesContractCheckoutOptionsError)) ||
			walletError,
	};
};
