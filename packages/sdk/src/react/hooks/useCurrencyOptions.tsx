import { Address } from 'viem';
import { useMarketplaceConfig } from './useMarketplaceConfig';

export default function useCurrencyOptions({
	collectionAddress,
}: {
	collectionAddress: Address;
}) {
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const collections = marketplaceConfig?.collections; // array
	const currencyOptions = collections?.find(
		(collection) => collection.collectionAddress === collectionAddress,
	)?.currencyOptions;

	return currencyOptions;
}
