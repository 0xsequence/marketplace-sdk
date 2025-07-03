'use client';

import { Card, Text } from '@0xsequence/design-system';
import type {
	ContractType,
	Order,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../../../store';
import { MarketActionsCard } from './MarketActions';
import { ShopActions } from './ShopActions';

export interface ActionsProps {
	isOwner: boolean;
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	orderbookKind: OrderbookKind | undefined;
	lowestListing: Order | undefined | null;
	contractType: ContractType | undefined;
}

export function Actions({
	isOwner,
	collectionAddress,
	chainId,
	collectibleId,
	orderbookKind,
	lowestListing,
	contractType,
}: ActionsProps) {
	const { isConnected } = useAccount();
	const { marketplaceType } = useMarketplace();
	const isShop = marketplaceType === 'shop';

	if (!isConnected) {
		return (
			<Card className="flex items-center justify-center p-6">
				<Text className="text-center font-bold text-large">
					Connect Wallet to see collectable actions
				</Text>
			</Card>
		);
	}

	if (isShop) {
		return (
			<ShopActions
				contractType={contractType}
				chainId={chainId}
				collectionAddress={collectionAddress}
				tokenId={collectibleId}
			/>
		);
	}

	return (
		<MarketActionsCard
			lowestListing={lowestListing}
			orderbookKind={orderbookKind}
			collectionAddress={collectionAddress}
			chainId={chainId}
			collectibleId={collectibleId}
			isOwner={isOwner}
		/>
	);
}
