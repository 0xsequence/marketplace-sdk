import type { Address } from 'viem';
import { useCollectible, useCollection, useCurrency } from '../../../..';
import { useSellModalProps } from '../store';

export const useLoadData = () => {
	const { chainId, collectionAddress, tokenId, order } = useSellModalProps();

	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: collectible,
		isLoading: collectibleLoading,
		isError: collectibleError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId: tokenId,
	});

	const currencyAddress = order?.priceCurrencyAddress as Address | undefined;

	const {
		data: currency,
		isLoading: currencyLoading,
		isError: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress,
	});

	return {
		collection,
		collectible,
		currency,
		isError: Boolean(collectionError || collectibleError || currencyError),
		isLoading: Boolean(
			collectionLoading || collectibleLoading || currencyLoading,
		),
	};
};
