'use client';

import type { TokenMetadata } from '@0xsequence/api-client';
import { Image, NetworkImage, Skeleton, Text } from '@0xsequence/design-system';
import { type Address, formatUnits } from 'viem';
import type { Price } from '../../../../../../types';
import { useCollectionDetail } from '../../../../../hooks';
import ChessTileImage from '../../../../images/chess-tile.png';
import TimeAgo from '../timeAgo';
import { useTransactionType } from '../transactionStatusModal/store';
import { useTransactionPreviewTitle } from './useTransactionPreviewTitle';

type TransactionPreviewProps = {
	orderId?: string;
	price?: Price;
	collectionAddress: Address;
	chainId: number;
	collectible: TokenMetadata | undefined;
	collectibleLoading: boolean;
	currencyImageUrl?: string;
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
	isTimeout: boolean;
};

const TransactionPreview = ({
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
	const transactionType = useTransactionType();
	const title = useTransactionPreviewTitle(
		orderId,
		{ isConfirmed, isConfirming, isFailed, isTimeout },
		transactionType,
	);
	const { data: collection, isLoading: collectionLoading } =
		useCollectionDetail({
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
			className="rounded-xl bg-background-secondary p-3"
			data-testid="transaction-preview"
		>
			<div className="flex items-center">
				<Text
					className="mr-1 font-body text-xs"
					color="text80"
					fontWeight="medium"
					data-testid="transaction-preview-title"
				>
					{title}
				</Text>

				<NetworkImage chainId={Number(chainId)} size="xs" />

				{isConfirming && <TimeAgo date={new Date()} />}
			</div>
			<div className="mt-2 flex items-center">
				<Image
					className="mr-3 h-9 w-9 rounded-sm"
					src={collectibleImage || ChessTileImage}
					alt={collectibleName}
					style={{ objectFit: 'cover' }}
					data-testid="transaction-preview-image"
				/>

				<div className="flex flex-col items-start gap-0.5">
					<Text
						className="font-body text-xs"
						color="text80"
						fontWeight="medium"
						data-testid="transaction-preview-collection-name"
					>
						{collectionName}
					</Text>

					<Text
						className="font-body text-xs"
						color="text100"
						fontWeight="bold"
						data-testid="transaction-preview-collectible-name"
					>
						{collectibleName}
					</Text>
				</div>

				{price && (
					<div
						className="flex grow items-center justify-end gap-1"
						data-testid="transaction-preview-price"
					>
						<Image className="h-3 w-3" src={currencyImageUrl} />

						<Text
							className="font-body text-xs"
							color="text100"
							fontWeight="bold"
						>
							{priceFormatted} {price?.currency.symbol}
						</Text>
					</div>
				)}
			</div>
		</div>
	);
};

export default TransactionPreview;
