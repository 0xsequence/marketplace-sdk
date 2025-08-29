'use client';

import { Text } from '@0xsequence/design-system';
import type { Address } from 'viem';
import type { CardType } from '../../../../../../types';
import {
	ContractType,
	type Currency,
	type Order,
} from '../../../../../_internal';
import { useCurrency, useLowestListing } from '../../../../../hooks';
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
	collectionAddress,
	collectibleId,
	name,
	type,
	decimals,
	onOfferClick,
	highestOffer,
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

	const { data: lowestListing } = useLowestListing({
		chainId,
		collectionAddress,
		tokenId: collectibleId,
		query: {
			enabled: isMarket, // Only fetch for market cards
		},
	});

	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: lowestListing?.priceCurrencyAddress as Address,
		query: {
			enabled: isMarket && !!lowestListing?.priceCurrencyAddress, // Only fetch when we have lowest listing data
		},
	});

	const listed =
		!!lowestListing?.priceAmount && !!lowestListing?.priceCurrencyAddress;

	return (
		<div className="relative flex flex-col items-start gap-2 whitespace-nowrap bg-background-primary p-4">
			<FooterName
				name={name}
				isShop={isShop}
				highestOffer={highestOffer}
				onOfferClick={onOfferClick}
				quantityInitial={quantityInitial}
				quantityRemaining={quantityRemaining}
			/>

			<div className="flex items-center gap-1">
				{listed && isMarket && lowestListing && currency && (
					<PriceDisplay
						amount={lowestListing.priceAmount}
						currency={currency}
						className="text-text-100"
					/>
				)}

				{!listed && isMarket && (
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
