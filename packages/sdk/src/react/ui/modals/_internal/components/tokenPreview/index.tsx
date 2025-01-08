import { Box, Image, Skeleton, Text } from '@0xsequence/design-system';
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
			<Box display="flex" alignItems="center" gap="3" width="full">
				<Skeleton width={'9'} height={'9'} borderRadius={'xs'} />

				<Box display="flex" flexGrow="1" gap="1" flexDirection="column">
					<Skeleton width="1/3" height="3" />
					<Skeleton width="1/2" height="3" />
				</Box>
			</Box>
		);
	}

	return (
		<Box className={tokenPreview}>
			<Image
				src={collectable?.image || ChessTileImage}
				alt={collectable?.name}
				width={'9'}
				height={'9'}
				borderRadius={'xs'}
				style={{ objectFit: 'cover' }}
			/>

			<Box display={'flex'} flexDirection={'column'} marginLeft={'3'}>
				<Text
					fontSize={'small'}
					color={'text80'}
					fontWeight={'medium'}
					fontFamily="body"
				>
					{collectionName}
				</Text>

				<Text
					fontSize={'small'}
					fontWeight={'bold'}
					color={'text100'}
					fontFamily="body"
				>
					{collectable?.name}
				</Text>
			</Box>
		</Box>
	);
}
