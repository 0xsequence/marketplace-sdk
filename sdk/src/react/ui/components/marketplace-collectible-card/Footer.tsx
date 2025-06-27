'use client';

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	cn,
	IconButton,
	Image,
	Text,
} from '@0xsequence/design-system';
import { formatUnits } from 'viem';
import type { MarketplaceType } from '../../../../types';
import { ContractType, type Currency, type Order } from '../../../_internal';
import SvgBellIcon from '../../icons/BellIcon';
import { formatPriceNumber, getSupplyStatusText } from './utils';

const formatPrice = (amount: string, currency: Currency): React.ReactNode => {
	const { formattedNumber, isUnderflow, isOverflow } = formatPriceNumber(
		amount,
		currency.decimals,
	);

	if (isUnderflow) {
		return (
			<div className="flex items-center">
				<ChevronLeftIcon className="h-3 w-3 text-text-100" />
				<Text>{`${formattedNumber} ${currency.symbol}`}</Text>
			</div>
		);
	}

	if (isOverflow) {
		return (
			<div className="flex items-center">
				<ChevronRightIcon className="h-3 w-3 text-text-100" />
				<Text>{`${formattedNumber} ${currency.symbol}`}</Text>
			</div>
		);
	}

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
	quantityInitial: string | undefined;
	quantityRemaining: string | undefined;
	marketplaceType: MarketplaceType;
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
	quantityInitial,
	quantityRemaining,
	marketplaceType,
	salePriceAmount,
	salePriceCurrency,
}: FooterProps) => {
	const listed = !!lowestListingPriceAmount && !!lowestListingCurrency;
	const isShop = marketplaceType === 'shop';
	const isMarketplace = marketplaceType === 'market';

	const displayName = (() => {
		if (name.length > 15 && highestOffer && !isShop) {
			return `${name.substring(0, 13)}...`;
		}
		if (name.length > 17 && !highestOffer && !isShop) {
			return `${name.substring(0, 17)}...`;
		}
		return name;
	})();

	return (
		<div className="relative flex flex-col items-start gap-2 whitespace-nowrap bg-background-primary p-4">
			<div className="relative flex w-full items-center justify-between">
				<Text
					className={cn(
						'overflow-hidden text-ellipsis text-left font-body font-bold text-sm text-text-100',
						isShop &&
							(quantityInitial === undefined ||
								quantityRemaining === undefined) &&
							'text-text-50',
					)}
				>
					{displayName || 'Untitled'}
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
					isShop && type === ContractType.ERC721 && 'hidden',
				)}
			>
				{((isMarketplace && listed && lowestListingCurrency?.imageUrl) ||
					(isShop && salePriceCurrency && salePriceCurrency.imageUrl)) && (
					<Image
						alt={lowestListingCurrency?.symbol || salePriceCurrency?.symbol}
						className="h-3 w-3"
						src={lowestListingCurrency?.imageUrl || salePriceCurrency?.imageUrl}
						onError={(e) => {
							e.currentTarget.style.display = 'none';
						}}
					/>
				)}

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

			{isShop && (
				<SaleDetailsPill
					quantityInitial={quantityInitial}
					quantityRemaining={quantityRemaining}
					collectionType={type as ContractType}
				/>
			)}

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

const SaleDetailsPill = ({
	quantityInitial,
	quantityRemaining,
	collectionType,
}: {
	quantityInitial: string | undefined;
	quantityRemaining: string | undefined;
	collectionType: ContractType;
}) => {
	const supplyText = getSupplyStatusText({
		quantityInitial,
		quantityRemaining,
		collectionType,
	});

	return (
		<Text className="rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs">
			{supplyText}
		</Text>
	);
};
