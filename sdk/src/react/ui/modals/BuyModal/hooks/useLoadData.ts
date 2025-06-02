import { skipToken } from '@tanstack/react-query';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useCollectible, useCollection, useCurrency } from '../../../../hooks';
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

	// Always call the hook, but with conditional parameters
	const {
		data: checkoutOptions,
		isLoading: checkoutOptionsLoading,
		isError: checkoutOptionsError,
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

	// Extract shop-specific data
	const shopData = isShop
		? {
				salesContractAddress: props.salesContractAddress,
				items: props.items,
				salePrice: props.salePrice,
			}
		: undefined;

	return {
		collection,
		collectable,
		currency,
		order: checkoutOptions?.order,
		checkoutOptions,
		wallet,
		shopData,
		isLoading:
			collectionLoading ||
			collectableLoading ||
			(isMarketplace && checkoutOptionsLoading) ||
			(isShop && currencyLoading) ||
			walletLoading,
		isError:
			collectionError ||
			collectableError ||
			(isMarketplace && checkoutOptionsError) ||
			(isShop && currencyError) ||
			walletError,
	};
};
