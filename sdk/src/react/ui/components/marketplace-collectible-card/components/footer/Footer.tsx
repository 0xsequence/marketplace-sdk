'use client';

import { Skeleton, Text } from '@0xsequence/design-system';
import type { Address } from 'viem';
import type { CardType } from '../../../../../../types';
import { cn } from '../../../../../../utils';
import {
	ContractType,
	type Currency,
	type Order,
} from '../../../../../_internal';
import { useCurrency } from '../../../../../hooks';
import {
	FooterName,
	PriceDisplay,
	SaleDetailsPill,
	TokenTypeBalancePill,
} from './components';

type FooterProps = {
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	name: string;
	type?: ContractType;
	decimals?: number;
	onOfferClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	highestOffer?: Order;
	lowestListing?: Order;
	balance?: string;
	quantityInitial?: string | undefined;
	quantityRemaining?: string | undefined;
	unlimitedSupply?: boolean;
	cardType: CardType;
	salePriceAmount?: string;
	salePriceCurrency?: Currency;
};

export const Footer = ({
	chainId,
	name,
	type,
	decimals,
	onOfferClick,
	highestOffer,
	lowestListing,
	balance,
	quantityInitial,
	quantityRemaining,
	unlimitedSupply,
	cardType,
	salePriceAmount,
	salePriceCurrency,
}: FooterProps) => {
	const isShop = cardType === 'shop';
	const isMarket = cardType === 'market';
	const isInventoryNonTradable = cardType === 'inventory-non-tradable';

	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: lowestListing?.priceCurrencyAddress as Address,
		query: {
			enabled: isMarket && !!lowestListing?.priceCurrencyAddress, // Only fetch when we have lowest listing data
		},
	});

	const listed =
		!!lowestListing?.priceAmount && !!lowestListing?.priceCurrencyAddress;

	// Show loading state when listing is loading, or when listing exists but currency is still loading
	const isPriceLoading =
		isMarket && !!lowestListing?.priceCurrencyAddress && isCurrencyLoading;

	return (
		<div className="relative flex flex-col items-start gap-2 whitespace-nowrap bg-background-primary p-4">
			<FooterName
				name={name}
				isShop={isShop}
				highestOffer={highestOffer}
				onOfferClick={onOfferClick}
				quantityInitial={quantityInitial}
				quantityRemaining={quantityRemaining}
				balance={balance}
			/>

			<div
				className={cn(
					'flex items-center gap-1',
					isShop && type === ContractType.ERC721 && 'hidden',
				)}
			>
				{isPriceLoading && (
					<Skeleton size="sm" className="h-5 w-20 animate-shimmer" />
				)}

				{!isPriceLoading && listed && isMarket && lowestListing && currency && (
					<PriceDisplay
						amount={lowestListing.priceAmount}
						currency={currency}
						className="text-text-100"
					/>
				)}

				{!isPriceLoading && !listed && isMarket && (
					<Text className="text-left font-body font-bold text-sm text-text-50">
						Not listed yet
					</Text>
				)}

				{isShop &&
					salePriceAmount &&
					salePriceCurrency &&
					type === ContractType.ERC1155 && (
						<PriceDisplay
							amount={salePriceAmount}
							currency={salePriceCurrency}
							className="text-text-100"
						/>
					)}
			</div>

			{isShop && (
				<SaleDetailsPill
					quantityRemaining={quantityRemaining}
					collectionType={type as ContractType}
					unlimitedSupply={unlimitedSupply}
				/>
			)}

			{isShop && !salePriceAmount && <div className="h-5 w-full" />}

			{(isMarket || isInventoryNonTradable) && (
				<TokenTypeBalancePill
					balance={balance}
					type={type as ContractType}
					decimals={decimals}
				/>
			)}
		</div>
	);
};

export const NonTradableInventoryFooter = ({
	name,
	balance,
	decimals,
	type,
}: {
	name: string;
	balance?: string;
	decimals?: number;
	type: ContractType;
}) => {
	return (
		<div className="relative flex flex-col items-start gap-2 whitespace-nowrap bg-background-primary p-4">
			<FooterName name={name} />

			<div className="flex items-center gap-1">
				<Text className="text-left font-body font-bold text-sm text-text-50">
					Not listed yet
				</Text>
			</div>

			<TokenTypeBalancePill balance={balance} type={type} decimals={decimals} />
		</div>
	);
};
