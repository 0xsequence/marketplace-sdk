'use client';

import {
	AddIcon,
	Button,
	Card,
	SendIcon,
	Text,
	useToast,
} from '@0xsequence/design-system';
import type {
	ContractType,
	Order,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCreateListingModal,
	useMakeOfferModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Address, Hex } from 'viem';
import { useAccount } from 'wagmi';
import SvgCartIcon from '../../../../../../sdk/src/react/ui/icons/CartIcon';
import { useMarketplace } from '../../../store';
import { MarketActionsCard } from './MarketActions';

export interface ActionsProps {
	isOwner: boolean;
	collectionAddress: Hex;
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
		// TODO: implement this
		return null;
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
