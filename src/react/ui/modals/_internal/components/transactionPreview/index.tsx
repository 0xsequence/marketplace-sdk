import { Box, Image, NetworkImage, Text } from '@0xsequence/design-system';
import { useCollection } from '@react-hooks/useCollection';
import { useCurrencies } from '@react-hooks/useCurrencies';
import { useHighestOffer } from '@react-hooks/useHighestOffer';
import { formatUnits } from 'viem';
import SvgArrowUpIcon from '../../../../icons/ArrowUp';
import { TokenMetadata } from '@internal';

type TransactionPreviewProps = {
	collectionAddress: string;
	chainId: string;
	collectible: TokenMetadata;
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
};

export default function TransactionPreview({
	collectionAddress,
	chainId,
	collectible,
	isConfirming,
	isConfirmed,
	isFailed,
}: TransactionPreviewProps) {
	const title =
		(isConfirming && 'Your sale is processing') ||
		(isConfirmed && 'Your sale has processed') ||
		(isFailed && 'Your sale has failed');
	const { data: collection } = useCollection({
		collectionAddress,
		chainId,
	});
	const { data: highestOffer } = useHighestOffer({
		collectionAddress,
		tokenId: collectible.tokenId,
		chainId,
	});
	const { data: currencies } = useCurrencies({
		chainId,
		collectionAddress,
	});
	const currency = currencies?.find(
		(currency) =>
			currency.contractAddress === highestOffer?.order.priceCurrencyAddress,
	);
	const priceAmount =
		highestOffer?.order && currency
			? formatUnits(BigInt(highestOffer.order.priceAmount), currency.decimals)
			: '';

	const collectibleImage = collectible.image;
	const collectibleName = collectible.name;
	const collectionName = collection?.name;

	return (
		<Box padding="3" background="backgroundSecondary" borderRadius="md">
			<Box display="flex" alignItems="center">
				<SvgArrowUpIcon size="xs" />

				<Text
					color="text50"
					fontSize="small"
					fontWeight="medium"
					marginRight="1"
				>
					{title}
				</Text>

				<NetworkImage chainId={Number(chainId)} size="xs" />

				<Box
					flexGrow="1"
					display="flex"
					alignItems="center"
					justifyContent="flex-end"
				>
					<Text color="text50" fontSize="small">
						{/*
            TODO: Count time since transaction was sent
            */}
						5 seconds ago
					</Text>
				</Box>
			</Box>

			<Box display="flex" alignItems="center" marginTop="2">
				<Image
					src={collectibleImage}
					alt={collectibleName}
					width="9"
					height="9"
					borderRadius="xs"
					marginRight="3"
				/>

				<Box
					display="flex"
					flexDirection="column"
					alignItems="flex-start"
					gap="0.5"
				>
					<Text color="text80" fontSize="small" fontWeight="medium">
						{collectibleName}
					</Text>

					<Text color="text100" fontSize="small">
						{collectionName}
					</Text>
				</Box>

				<Box
					flexGrow="1"
					display="flex"
					alignItems="center"
					justifyContent="flex-end"
					gap="1"
				>
					<NetworkImage chainId={Number(chainId)} size="xs" />

					<Text color="text80" fontSize="small" fontWeight="medium">
						{priceAmount} {currency?.symbol}
					</Text>
				</Box>
			</Box>
		</Box>
	);
}
