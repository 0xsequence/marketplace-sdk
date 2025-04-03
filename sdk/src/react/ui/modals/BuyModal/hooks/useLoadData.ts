import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useCollectible, useCollection } from '../../../../hooks';
import { useBuyModalProps } from '../store';
import { useCheckoutOptions } from './useCheckoutOptions';

export const useLoadData = () => {
	const { chainId, collectionAddress, collectibleId, orderId, marketplace } =
		useBuyModalProps();

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
		data: checkoutOptions,
		isLoading: checkoutOptionsLoading,
		isError: checkoutOptionsError,
		// TODO: rename this... its order and checkout options
	} = useCheckoutOptions({
		chainId,
		collectionAddress,
		orderId,
		marketplace,
	});

	return {
		collection,
		collectable,
		order: checkoutOptions?.order,
		checkoutOptions: checkoutOptions,
		wallet,
		isLoading:
			collectionLoading ||
			collectableLoading ||
			checkoutOptionsLoading ||
			walletLoading,
		// TODO: we should have a way to determine what is causing the error
		isError:
			collectionError ||
			collectableError ||
			checkoutOptionsError ||
			walletError,
	};
};
