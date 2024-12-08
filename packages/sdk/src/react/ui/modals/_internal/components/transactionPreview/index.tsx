import { Box, Image, NetworkImage, Text } from '@0xsequence/design-system';
import type { TokenMetadata } from '@0xsequence/metadata';
import { observer } from '@legendapp/state/react';
import { type Hex, formatUnits } from 'viem';
import type { Price } from '../../../../../../types';
import { useCollection } from '../../../../../hooks';
import ChessTileImage from '../../../../images/chess-tile.png';
import TimeAgo from '../timeAgo';
import { transactionStatusModal$ } from '../transactionStatusModal/store';
import { useTransactionPreviewTitle } from './useTransactionPreviewTitle';

type TransactionPreviewProps = {
	price?: Price;
	collectionAddress: Hex;
	chainId: string;
	collectible: TokenMetadata;
	currencyImageUrl?: string;
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
};

const TransactionPreview = observer(
	({
		price,
		collectionAddress,
		chainId,
		collectible,
		currencyImageUrl,
		isConfirming,
		isConfirmed,
		isFailed,
	}: TransactionPreviewProps) => {
		const { type } = transactionStatusModal$.state.get();
		const title = useTransactionPreviewTitle(
			{ isConfirmed, isConfirming, isFailed },
			type,
		);
		const { data: collection } = useCollection({
			collectionAddress,
			chainId,
		});

		const collectibleImage = collectible.image;
		const collectibleName = collectible.name;
		const collectionName = collection?.name;
		const priceFormatted = price
			? formatUnits(BigInt(price!.amountRaw), price!.currency.decimals)
			: undefined;

		return (
			<Box padding="3" background="backgroundSecondary" borderRadius="md">
				<Box display="flex" alignItems="center">
					<Text
						color="text50"
						fontSize="small"
						fontWeight="medium"
						marginRight="1"
						fontFamily="body"
					>
						{title}
					</Text>

					<NetworkImage chainId={Number(chainId)} size="xs" />

					{isConfirming && <TimeAgo date={new Date()} />}
				</Box>

				<Box display="flex" alignItems="center" marginTop="2">
					<Image
						src={collectibleImage || ChessTileImage}
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
						<Text
							color="text80"
							fontSize="small"
							fontWeight="medium"
							fontFamily="body"
						>
							{collectibleName}
						</Text>

						<Text color="text100" fontSize="small" fontFamily="body">
							{collectionName}
						</Text>
					</Box>

					{price && (
						<Box
							flexGrow="1"
							display="flex"
							alignItems="center"
							justifyContent="flex-end"
							gap="1"
						>
							<Image src={currencyImageUrl} width="3" height="3" />

							<Text
								color="text80"
								fontSize="small"
								fontWeight="medium"
								fontFamily="body"
							>
								{priceFormatted} {price!.currency.symbol}
							</Text>
						</Box>
					)}
				</Box>
			</Box>
		);
	},
);

export default TransactionPreview;
