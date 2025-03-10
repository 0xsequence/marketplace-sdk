import { Image, Skeleton, Text } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import { useCollectible } from '../../../../../hooks';
import ChessTileImage from '../../../../images/chess-tile.png';
import { tokenPreview } from './styles.css';

type TokenPreviewProps = {
	collectionName?: string;
	collectionAddress: Hex;
	collectibleId: string;
	chainId: string;
};

export default function TokenPreview({
	collectionName,
	collectionAddress,
	collectibleId,
	chainId,
}: TokenPreviewProps) {
	const { data: collectable, isLoading: collectibleLoading } = useCollectible({
		chainId: chainId,
		collectionAddress: collectionAddress,
		collectibleId,
	});

	if (collectibleLoading) {
		return (
			<div className="flex items-center gap-3 w-full">
				<Skeleton className="w-9 h-9 rounded-sm" />
				<div className="flex grow gap-1 flex-col">
					<Skeleton className="w-1/3 h-3" />
					<Skeleton className="w-1/2 h-3" />
				</div>
			</div>
		);
	}

	return (
		<div className={tokenPreview}>
			<Image
				className="w-9 h-9 rounded-sm"
				src={collectable?.image || ChessTileImage}
				alt={collectable?.name}
				style={{ objectFit: 'cover' }}
			/>
			<div className="flex flex-col ml-3">
				<Text
					className="text-sm font-body"
					color={'text80'}
					fontWeight={'medium'}
				>
					{collectionName}
				</Text>

				<Text
					className="text-sm font-body"
					fontWeight={'bold'}
					color={'text100'}
				>
					{collectable?.name}
				</Text>
			</div>
		</div>
	);
}
