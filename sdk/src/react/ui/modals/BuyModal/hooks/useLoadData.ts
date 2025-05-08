import { skipToken } from '@tanstack/react-query';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useCollectible, useCollection } from '../../../../hooks';
import { isMarketplaceProps, useBuyModalProps } from '../store';
import { useCheckoutOptions } from './useCheckoutOptions';

export const useLoadData = () => {
	const props = useBuyModalProps();
	const { chainId, collectionAddress } = props;

	// Check if we're in marketplace mode
	const isMarketplace = isMarketplaceProps(props);
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

	return {
		collection,
		collectable,
		order: checkoutOptions?.order,
		checkoutOptions,
		wallet,
		isLoading:
			collectionLoading ||
			collectableLoading ||
			(isMarketplace && checkoutOptionsLoading) ||
			walletLoading,
		isError:
			collectionError ||
			collectableError ||
			(isMarketplace && checkoutOptionsError) ||
			walletError,
	};
};
