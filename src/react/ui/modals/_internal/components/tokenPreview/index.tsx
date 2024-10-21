import { Box, Image, Text } from '@0xsequence/design-system';
import { useCollectible } from '@react-hooks/useCollectible';
import { tokenPreview } from './styles.css';

type TokenPreviewProps = {
	collectionName?: string;
	collectionAddress: string;
	collectibleId: string;
	chainId: string;
};

export default function TokenPreview({
	collectionName,
	collectionAddress,
	collectibleId,
	chainId,
}: TokenPreviewProps) {
	const { data: collectable, isLoading } = useCollectible({
		chainId: chainId,
		collectionAddress: collectionAddress,
		collectibleId,
	});

	// TODO: Add loading and error states
	if (isLoading) {
		return null;
	}

	return (
		<Box className={tokenPreview}>
			<Image
				src={collectable?.image}
				alt={collectable?.name}
				width={'9'}
				height={'9'}
				borderRadius={'xs'}
			/>

			<Box display={'flex'} flexDirection={'column'} marginLeft={'3'}>
				<Text fontSize={'small'} color={'text80'} fontWeight={'medium'}>
					{collectionName}
				</Text>

				<Text fontSize={'small'} fontWeight={'bold'} color={'text100'}>
					{collectable?.name}
				</Text>
			</Box>
		</Box>
	);
}
