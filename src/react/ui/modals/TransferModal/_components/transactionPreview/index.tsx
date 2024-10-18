import { transferModal$ } from '../../_store';
import { Box, Image, NetworkImage, Text } from '@0xsequence/design-system';
import { useCollection } from '@react-hooks/useCollection';
import { useCurrencies } from '@react-hooks/useCurrencies';
import { useHighestOffer } from '@react-hooks/useHighestOffer';
import { formatUnits } from 'viem';
import SvgArrowUpIcon from '../../../../icons/ArrowUp';

export default function TransactionPreview() {
	const { data: collection } = useCollection({
		collectionAddress: transferModal$.state.collectionAddress.get(),
		chainId: transferModal$.state.chainId.get(),
	});
	const { data: highestOffer } = useHighestOffer({
		collectionAddress: transferModal$.state.collectionAddress.get(),
		tokenId: String(transferModal$.state.collectibleMetadata.get()?.tokenId),
		chainId: String(transferModal$.state.chainId.get()),
	});
	const { data: currencies } = useCurrencies({
		chainId: transferModal$.state.chainId.get(),
		collectionAddress: transferModal$.state.collectionAddress.get(),
		includeNativeCurrency: true,
	});
	const currency = currencies?.find(
		(currency) =>
			currency.contractAddress === highestOffer?.order.priceCurrencyAddress,
	);
	const priceAmount =
		highestOffer?.order && currency
			? formatUnits(BigInt(highestOffer.order.priceAmount), currency.decimals)
			: '';

	const transactionProcessing =
		transferModal$.state.isTransactionProcessing.get();
	const collectibleImage =
		transferModal$.state.collectibleMetadata.get()?.image;
	const collectibleName = transferModal$.state.collectibleMetadata.get()?.name;
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
					{transactionProcessing ? 'Sending...' : 'Sent'}
				</Text>

				<NetworkImage chainId={transferModal$.state.chainId.get()} size="xs" />

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
					<NetworkImage
						chainId={transferModal$.state.chainId.get()}
						size="xs"
					/>

					<Text color="text80" fontSize="small" fontWeight="medium">
						{priceAmount} {currency?.symbol}
					</Text>
				</Box>
			</Box>
		</Box>
	);
}
