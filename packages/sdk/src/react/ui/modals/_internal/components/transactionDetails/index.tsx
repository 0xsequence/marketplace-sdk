import { Image, Skeleton, Text } from '@0xsequence/design-system';
import { type Hex, formatUnits } from 'viem';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../../../consts';
import type { Price } from '../../../../../../types';
import {
	useMarketplaceConfig,
	useRoyaltyPercentage,
} from '../../../../../hooks';

type TransactionDetailsProps = {
	collectibleId: string;
	collectionAddress: Hex;
	chainId: string;
	price?: Price;
	currencyImageUrl?: string;
	includeMarketplaceFee: boolean;
	// We use a placeholder price for create listing modal
	showPlaceholderPrice?: boolean;
};

export default function TransactionDetails({
	collectibleId,
	collectionAddress,
	chainId,
	includeMarketplaceFee,
	price,
	showPlaceholderPrice,
	currencyImageUrl,
}: TransactionDetailsProps) {
	const { data, isLoading: marketplaceConfigLoading } = useMarketplaceConfig();

	const marketplaceFeePercentage = includeMarketplaceFee
		? data?.collections.find(
				(collection) => collection.address === collectionAddress,
			)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE
		: 0;
	const { data: royaltyPercentage, isLoading: royaltyPercentageLoading } =
		useRoyaltyPercentage({
			chainId,
			collectionAddress,
			collectibleId,
		});

	const priceLoading =
		!price || marketplaceConfigLoading || royaltyPercentageLoading;

	let formattedAmount =
		price && formatUnits(BigInt(price.amountRaw), price.currency.decimals);

	if (royaltyPercentage !== undefined && formattedAmount && price) {
		formattedAmount = (
			Number.parseFloat(formattedAmount) -
			(Number.parseFloat(formattedAmount) * Number(royaltyPercentage)) / 100
		).toFixed(price.currency.decimals);
	}

	if (marketplaceFeePercentage !== undefined && formattedAmount && price) {
		formattedAmount = (
			Number.parseFloat(formattedAmount) -
			(Number.parseFloat(formattedAmount) * marketplaceFeePercentage) / 100
		).toFixed(price.currency.decimals);
	}

	return (
		<div className="flex w-full justify-between items-center">
			<Text className="text-sm font-body" color={'text50'}>
				Total earnings
			</Text>
			<div className="flex items-center gap-2">
				<Image className="w-3 h-3" src={currencyImageUrl} />

				{priceLoading ? (
					<Skeleton className="w-16 h-4" />
				) : (
					<Text className="text-sm font-body" color={'text100'}>
						{showPlaceholderPrice ? '0' : formattedAmount}{' '}
						{price.currency.symbol}
					</Text>
				)}
			</div>
		</div>
	);
}
