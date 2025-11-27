'use client';

import { Image, Skeleton, Text } from '@0xsequence/design-system';
import type { Address } from 'viem';
import { useCollectibleDetail } from '../../../../../hooks';
import ChessTileImage from '../../../../images/chess-tile.png';

type TokenPreviewProps = {
	collectionName?: string;
	collectionAddress: Address;
	tokenId: bigint;
	chainId: number;
};

export default function TokenPreview({
	collectionName,
	collectionAddress,
	tokenId,
	chainId,
}: TokenPreviewProps) {
	const { data: collectable, isLoading: collectibleLoading } =
		useCollectibleDetail({
			chainId,
			collectionAddress,
			tokenId,
		});

	if (collectibleLoading) {
		return (
			<div className="flex w-full items-center gap-3">
				<Skeleton className="h-9 w-9 rounded-sm" />
				<div className="flex grow flex-col gap-1">
					<Skeleton className="h-3 w-1/3" />
					<Skeleton className="h-3 w-1/2" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full items-center">
			<Image
				className="h-9 w-9 rounded-sm"
				src={collectable?.image || ChessTileImage}
				alt={collectable?.name}
				style={{ objectFit: 'cover' }}
			/>
			<div className="ml-3 flex flex-col">
				<Text className="font-body font-medium text-xs" color={'text80'}>
					{collectionName}
				</Text>

				<Text
					className="font-body font-bold text-xs"
					fontWeight={'bold'}
					color={'text100'}
				>
					{collectable?.name}
				</Text>
			</div>
		</div>
	);
}
