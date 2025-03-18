import type { Hex } from 'viem';
import type { CheckoutOptions, MarketplaceKind } from '../../../../_internal';
import { useCollectible, useCollection } from '../../../../hooks';

import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';
import { useCheckoutOptions } from './useCheckoutOptions';

export type UseLoadDataProps = {
	chainId: number;
	collectionAddress: Hex;
	collectibleId: string;
	orderId: string;
	marketplace: MarketplaceKind;
};

export type UseLoadDataResult = {
	collection: ContractInfo | undefined;
	collectable: TokenMetadata | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	isLoading: boolean;
	isError: boolean;
};

export const useLoadData = ({
	chainId,
	collectionAddress,
	collectibleId,
	orderId,
	marketplace,
}: UseLoadDataProps): UseLoadDataResult => {
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
		chainId: String(chainId),
		collectionAddress,
		collectibleId,
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
