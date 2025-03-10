import { Image, NetworkImage, Skeleton, Text } from '@0xsequence/design-system';
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
	orderId?: string;
	price?: Price;
	collectionAddress: Hex;
	chainId: string;
	collectible: TokenMetadata | undefined;
	collectibleLoading: boolean;
	currencyImageUrl?: string;
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
	isTimeout: boolean;
};

const TransactionPreview = observer(
	({
		orderId,
		price,
		collectionAddress,
		chainId,
		collectible,
		collectibleLoading,
		currencyImageUrl,
		isConfirming,
		isConfirmed,
		isFailed,
		isTimeout,
	}: TransactionPreviewProps) => {
		const { type } = transactionStatusModal$.state.get();
		const title = useTransactionPreviewTitle(
			orderId,
			{ isConfirmed, isConfirming, isFailed, isTimeout },
			type,
		);
		const { data: collection, isLoading: collectionLoading } = useCollection({
			collectionAddress,
			chainId,
		});

		const collectibleImage = collectible?.image;
		const collectibleName = collectible?.name;
		const collectionName = collection?.name;
		const priceFormatted = price
			? formatUnits(BigInt(price?.amountRaw), price?.currency.decimals)
			: undefined;

		if (collectibleLoading || collectionLoading) {
			return (
				<div className="w-full rounded-xl" style={{ height: 83 }}>
					<Skeleton style={{ width: '100%', height: '100%' }} />
				</div>
			);
		}

		return (
			<div
				className="p-3 bg-background-secondary rounded-xl"
				data-testid="transaction-preview"
			>
				<div className="flex items-center">
					<Text
						className="text-sm mr-1 font-body"
						color="text50"
						fontWeight="medium"
						data-testid="transaction-preview-title"
					>
						{title}
					</Text>

					<NetworkImage chainId={Number(chainId)} size="xs" />

					{isConfirming && <TimeAgo date={new Date()} />}
				</div>
				<div className="flex items-center mt-2">
					<Image
						className="w-9 h-9 rounded-sm mr-3"
						src={collectibleImage || ChessTileImage}
						alt={collectibleName}
						style={{ objectFit: 'cover' }}
						data-testid="transaction-preview-image"
					/>

					<div className="flex flex-col items-start gap-0.5">
						<Text
							className="text-sm font-body"
							color="text80"
							fontWeight="medium"
							data-testid="transaction-preview-collectible-name"
						>
							{collectibleName}
						</Text>

						<Text
							className="text-sm font-body"
							color="text100"
							data-testid="transaction-preview-collection-name"
						>
							{collectionName}
						</Text>
					</div>

					{price && (
						<div
							className="flex grow items-center justify-end gap-1"
							data-testid="transaction-preview-price"
						>
							<Image className="w-3 h-3" src={currencyImageUrl} />

							<Text
								className="text-sm font-body"
								color="text80"
								fontWeight="medium"
							>
								{priceFormatted} {price?.currency.symbol}
							</Text>
						</div>
					)}
				</div>
			</div>
		);
	},
);

export default TransactionPreview;
