import type { MarketplaceKind } from '../../../../_internal';
import type { Hex } from 'viem';
import { useCollectible, useCollection } from '../../../../hooks';

import { useCheckoutOptions } from './useCheckoutOptions';

export const useLoadData = ({
	chainId,
	collectionAddress,
	collectibleId,
	orderId,
	marketplace,
}: {
	chainId: number;
	collectionAddress: Hex;
	collectibleId: string;
	orderId: string;
	marketplace: MarketplaceKind;
}) => {
	const { data: collection, isLoading: collectionLoading } = useCollection({
		chainId,
		collectionAddress,
	});

	const { data: collectable, isLoading: collectableLoading } = useCollectible({
		chainId: String(chainId),
		collectionAddress,
		collectibleId,
	});

	const { data: checkoutOptions, isLoading: checkoutOptionsLoading } =
		useCheckoutOptions({
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
	};
};