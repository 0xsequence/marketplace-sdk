import type { Hex } from 'viem';
import type { MarketplaceKind } from '../../../../_internal';
import { useCollectible, useCollection } from '../../../../hooks';

import { useCheckoutOptions } from './useCheckoutOptions';

export type UseLoadDataProps = {
	chainId: number;
	collectionAddress: Hex;
	collectibleId: string | undefined;
	orderId: string;
	marketplace: MarketplaceKind;
};

export const useLoadData = ({
	chainId,
	collectionAddress,
	collectibleId,
	orderId,
	marketplace,
}: UseLoadDataProps) => {
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
	} = useCheckoutOptions({
		chainId,
		collectionAddress,
		orderId,
		marketplace,
	});

	return {
		collection,
		collectable,
		checkoutOptions,
		isLoading:
			collectionLoading || collectableLoading || checkoutOptionsLoading,
		isError: collectionError || collectableError || checkoutOptionsError,
	};
};
