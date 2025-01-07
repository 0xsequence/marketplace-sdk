import type { Address } from 'viem';
import { useMarketplaceConfig } from './useMarketplaceConfig';

export const useCurrencyOptions = ({
	collectionAddress,
}: {
	collectionAddress: Address;
}) => {
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const collections = marketplaceConfig?.collections;
	const currencyOptions = collections?.find(
		(collection) => collection.collectionAddress === collectionAddress,
	)?.currencyOptions;

	return currencyOptions;
};
