import { Box, Image, Skeleton, Text } from '@0xsequence/design-system';
import { type Hex, formatUnits } from 'viem';
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
	// We use a placeholder price for create listing modal
	showPlaceholderPrice?: boolean;
};

//TODO: Move this
const DEFAULT_MARKETPLACE_FEE_PERCENTAGE = 2.5;

export default function TransactionDetails({
	collectibleId,
	collectionAddress,
	chainId,
	price,
	showPlaceholderPrice,
	currencyImageUrl,
}: TransactionDetailsProps) {
	const { data, isLoading: marketplaceConfigLoading } = useMarketplaceConfig();

	const marketplaceFeePercentage =
		data?.collections.find(
			(collection) => collection.collectionAddress === collectionAddress,
		)?.marketplaceFeePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
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
		<Box
			width="full"
			display={'flex'}
			justifyContent={'space-between'}
			alignItems={'center'}
		>
			<Text fontSize={'small'} color={'text50'} fontFamily="body">
				Total earnings
			</Text>

			<Box display="flex" alignItems="center" gap="2">
				<Image src={currencyImageUrl} width="3" height="3" />

				{priceLoading ? (
					<Skeleton width="16" height={'4'} />
				) : (
					<Text fontSize={'small'} color={'text100'} fontFamily="body">
						{showPlaceholderPrice ? '0' : formattedAmount}{' '}
						{price.currency.symbol}
					</Text>
				)}
			</Box>
		</Box>
	);
}
