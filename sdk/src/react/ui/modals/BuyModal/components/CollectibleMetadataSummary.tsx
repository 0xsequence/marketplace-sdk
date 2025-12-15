'use client';

import type {
	ContractInfo,
	Currency,
	TokenMetadata,
} from '@0xsequence/api-client';
import { NetworkImage, Text, Tooltip } from '@0xsequence/design-system';
import type { ReactNode } from 'react';
import type { CheckoutMode } from '../../../../ssr';
import { Media } from '../../../components/media/Media';

export interface CollectibleMetadataSummaryProps {
	checkoutMode: Exclude<CheckoutMode, 'sequence-checkout'>;
	collectible?: TokenMetadata;
	collection?: ContractInfo;
	// Price props for cryptoPayment variant
	chainId?: number;
	currency?: Currency;
	formattedPrice?: string;
	renderCurrencyPrice?: () => ReactNode;
	renderPriceUSD?: () => ReactNode;
	isMarket?: boolean;
}

export const CollectibleMetadataSummary = ({
	checkoutMode,
	collectible,
	collection,
	chainId,
	currency,
	formattedPrice,
	renderCurrencyPrice,
	renderPriceUSD,
	isMarket,
}: CollectibleMetadataSummaryProps) => {
	if (!collectible) return null;

	const isTrails = checkoutMode === 'trails';
	const isCryptoPayment = checkoutMode === 'crypto';

	const imageSize = isTrails ? 'h-12 w-12' : 'h-[84px] w-[84px]';
	const containerClasses = isTrails
		? 'flex w-full items-start gap-4 p-6 pb-0'
		: 'flex items-start gap-4';

	return (
		<div className={containerClasses}>
			<Media
				assets={[
					collectible.video,
					collectible.animation_url,
					collectible.image,
				]}
				name={collectible.name}
				containerClassName={`${imageSize} shrink-0 rounded-lg overflow-hidden object-cover`}
			/>

			<div className={'flex min-w-0 flex-1 flex-col gap-2'}>
				{isTrails ? (
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<Text className={'truncate font-semibold text-sm text-text-100'}>
								{collectible.name || 'Unnamed'}
							</Text>
							{collectible.tokenId !== undefined && (
								<Text className={'shrink-0 font-bold text-text-50 text-xs'}>
									#{collectible.tokenId.toString()}
								</Text>
							)}
						</div>
						{collection && (
							<div className="flex items-center gap-2">
								{collection.logoURI && (
									<img
										src={collection.logoURI}
										alt={collection.name}
										className="h-4 w-4 shrink-0 rounded-full"
									/>
								)}
								<Text className={'truncate font-bold text-text-50 text-xs'}>
									{collection.name}
								</Text>
							</div>
						)}
					</div>
				) : (
					<>
						<div className="flex items-center gap-2">
							<Text className={'truncate font-semibold text-sm text-text-100'}>
								{collectible.name}
							</Text>
							{collectible.tokenId !== undefined && (
								<Text className={'shrink-0 font-bold text-text-50 text-xs'}>
									#{collectible.tokenId.toString()}
								</Text>
							)}
						</div>
						{collection && (
							<Text className={'truncate font-bold text-text-50 text-xs'}>
								{collection.name}
							</Text>
						)}
					</>
				)}

				{/* Price - only shown in cryptoPayment variant */}
				{isCryptoPayment && renderCurrencyPrice && (
					<div className="mt-2 flex flex-col">
						<Tooltip
							message={`${formattedPrice || ''} ${currency?.symbol || ''}`}
							side="right"
						>
							<div className="flex items-center gap-1">
								{currency?.imageUrl ? (
									<img
										src={currency.imageUrl}
										alt={currency.symbol}
										className="h-5 w-5 rounded-full"
									/>
								) : chainId ? (
									<NetworkImage chainId={chainId} size="sm" />
								) : null}

								<Text className="font-bold text-md">
									{renderCurrencyPrice()}
								</Text>
							</div>
						</Tooltip>

						{isMarket && renderPriceUSD && renderPriceUSD() && (
							<Text className="font-bold text-text-50 text-xs">
								{renderPriceUSD()}
							</Text>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
