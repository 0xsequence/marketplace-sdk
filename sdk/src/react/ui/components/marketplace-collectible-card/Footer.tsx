'use client';

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	IconButton,
	Image,
	Text,
	cn,
} from '@0xsequence/design-system';
import { formatUnits } from 'viem';
import { ContractType, type Currency, type Order } from '../../../_internal';
import SvgBellIcon from '../../icons/BellIcon';
import { CollectibleCardType } from './types';

const OVERFLOW_PRICE = 100000000;
const UNDERFLOW_PRICE = 0.0001;

const formatPrice = (amount: string, currency: Currency): React.ReactNode => {
	const formattedPrice = formatUnits(BigInt(amount), currency.decimals);
	const numericPrice = Number.parseFloat(formattedPrice);

	if (numericPrice < UNDERFLOW_PRICE) {
		return (
			<div className="flex items-center">
				<ChevronLeftIcon className="h-3 w-3 text-text-100" />
				<Text>{`${UNDERFLOW_PRICE} ${currency.symbol}`}</Text>
			</div>
		);
	}

	if (numericPrice > OVERFLOW_PRICE) {
		return (
			<div className="flex items-center">
				<ChevronRightIcon className="h-3 w-3 text-text-100" />
				<Text>{`${OVERFLOW_PRICE.toLocaleString('en-US', {
					maximumFractionDigits: 2,
				})} ${currency.symbol}`}</Text>
			</div>
		);
	}

	const maxDecimals = numericPrice < 0.01 ? 6 : 4;

	const formattedNumber = numericPrice.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: maxDecimals,
	});

	return (
		<div className="flex items-center gap-1">
			<Text>
				{formattedNumber} {currency.symbol}
			</Text>
		</div>
	);
};

type FooterProps = {
	name: string;
	type?: ContractType;
	decimals?: number;
	onOfferClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	highestOffer?: Order;
	lowestListingPriceAmount?: string;
	lowestListingCurrency?: Currency;
	balance?: string;
	supply: number | undefined;
	cardType: CollectibleCardType;
	salePriceAmount?: string;
	salePriceCurrency?: Currency;
};

export const Footer = ({
	name,
	type,
	decimals,
	onOfferClick,
	highestOffer,
	lowestListingPriceAmount,
	lowestListingCurrency,
	balance,
	supply,
	cardType,
	salePriceAmount,
	salePriceCurrency,
}: FooterProps) => {
	const listed = !!lowestListingPriceAmount && !!lowestListingCurrency;
	const isShop = cardType === CollectibleCardType.SHOP;
	const isMarketplace = cardType === CollectibleCardType.MARKETPLACE;

	if (name.length > 15 && highestOffer && !isShop) {
		name = `${name.substring(0, 13)}...`;
	}
	if (name.length > 17 && !highestOffer && !isShop) {
		name = `${name.substring(0, 17)}...`;
	}

	return (
		<div className="relative flex flex-col items-start gap-2 whitespace-nowrap bg-background-primary p-4">
			<div className="relative flex w-full items-center justify-between">
				<Text
					className={cn(
						'overflow-hidden text-ellipsis text-left font-body font-bold text-sm text-text-100',
						supply === undefined && 'text-text-50',
					)}
				>
					{name || 'Untitled'}
				</Text>

				{highestOffer && onOfferClick && !isShop && (
					<IconButton
						className="absolute top-0 right-0 h-[22px] w-[22px] hover:animate-bell-ring"
						size="xs"
						variant="primary"
						onClick={(e) => {
							onOfferClick?.(e);
						}}
						icon={(props) => <SvgBellIcon {...props} size="xs" />}
					/>
				)}
			</div>

			<div
				className={cn(
					'flex items-center gap-1',
					isShop && !salePriceAmount && 'hidden',
				)}
			>
				{(isMarketplace && listed && lowestListingCurrency?.imageUrl) ||
					(isShop && salePriceAmount && salePriceCurrency?.imageUrl && (
						<Image
							className="h-3 w-3"
							src={
								lowestListingCurrency?.imageUrl || salePriceCurrency?.imageUrl
							}
							onError={(e) => {
								e.currentTarget.style.display = 'none';
							}}
						/>
					))}

				<Text
					className={cn(
						'text-left font-body font-bold text-sm',
						listed && isMarketplace ? 'text-text-100' : 'text-text-50',
						isShop &&
							salePriceAmount &&
							salePriceCurrency &&
							type === ContractType.ERC1155 &&
							'text-text-100',
					)}
				>
					{listed &&
						isMarketplace &&
						formatPrice(lowestListingPriceAmount, lowestListingCurrency)}

					{!listed && isMarketplace && 'Not listed yet'}

					{isShop &&
						salePriceAmount &&
						salePriceCurrency &&
						type === ContractType.ERC1155 &&
						formatPrice(salePriceAmount, salePriceCurrency)}
				</Text>
			</div>

			{isShop && <SupplyPill supply={supply} />}

			{isShop && !salePriceAmount && <div className="h-5 w-full" />}

			{isMarketplace && (
				<TokenTypeBalancePill
					balance={balance}
					type={type as ContractType}
					decimals={decimals}
				/>
			)}
		</div>
	);
};

const TokenTypeBalancePill = ({
	balance,
	type,
	decimals,
}: {
	balance?: string;
	type: ContractType;
	decimals?: number;
}) => {
	const displayText =
		type === ContractType.ERC1155
			? balance
				? `Owned: ${formatUnits(BigInt(balance), decimals ?? 0)}`
				: 'ERC-1155'
			: 'ERC-721';

	return (
		<Text className="rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs">
			{displayText}
		</Text>
	);
};

const SupplyPill = ({ supply }: { supply: number | undefined }) => {
	return (
		<Text className="rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs">
			{supply === 0
				? 'Unlimited'
				: supply && supply > 0
					? `Supply: ${supply}`
					: 'Out of stock'}
		</Text>
	);
};
