import { useState } from 'react';

import { Box, IconButton, Skeleton } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import type {
	ChainId,
	CollectibleOrder,
	ContractType,
	Order,
	OrderbookKind,
} from '../../../_internal';
import { useCurrencies, useHighestOffer } from '../../../hooks';
import { useCurrencyOptions } from '../../../hooks/useCurrencyOptions';
import SvgDiamondEyeIcon from '../../icons/DiamondEye';
import ChessTileImage from '../../images/chess-tile.png';
import { ActionButton } from '../_internals/action-button/ActionButton';
import { CollectibleCardAction } from '../_internals/action-button/types';
import { Footer } from './Footer';
import {
	actionWrapper,
	collectibleCard,
	collectibleImage,
	collectibleTileWrapper,
} from './styles.css';

function CollectibleSkeleton() {
	return (
		<Box
			className={collectibleCard}
			borderRadius="md"
			overflow="hidden"
			background="backgroundPrimary"
		>
			<Skeleton
				size="lg"
				style={{ width: '100%', height: 164, borderRadius: 0, paddingTop: 16 }}
			/>

			<Box
				display="flex"
				flexDirection="column"
				gap="2"
				paddingX="4"
				paddingBottom="4"
				marginTop="2"
			>
				<Skeleton size="lg" />

				<Skeleton size="sm" />
			</Box>
		</Box>
	);
}

type CollectibleCardProps = {
	collectibleId: string;
	chainId: ChainId;
	collectionAddress: Hex;
	orderbookKind: OrderbookKind;
	collectionType?: ContractType;
	lowestListing: CollectibleOrder | undefined;
	onCollectibleClick?: (tokenId: string) => void;
	onOfferClick?: ({ order }: { order?: Order }) => void;
	balance?: string;
	cardLoading?: boolean;
};

export function CollectibleCard({
	collectibleId,
	chainId,
	collectionAddress,
	orderbookKind,
	collectionType,
	lowestListing,
	onCollectibleClick,
	onOfferClick,
	balance,
	cardLoading,
}: CollectibleCardProps) {
	const { address: accountAddress } = useAccount();
	const collectibleMetadata = lowestListing?.metadata;
	const [imageLoadingError, setImageLoadingError] = useState(false);
	const { data: highestOffer, isLoading: highestOfferLoading } =
		useHighestOffer({
			chainId: String(chainId),
			collectionAddress,
			tokenId: collectibleId,
		});

	const currencyOptions = useCurrencyOptions({ collectionAddress });
	const { data: currencies } = useCurrencies({ chainId, currencyOptions });
	const lowestListingCurrency = currencies?.find(
		(currency) =>
			currency.contractAddress === lowestListing?.order?.priceCurrencyAddress,
	);
	if (highestOfferLoading || cardLoading) {
		return <CollectibleSkeleton />;
	}

	const action = (
		balance
			? (highestOffer?.order && CollectibleCardAction.SELL) ||
				(!lowestListing?.order && CollectibleCardAction.LIST) ||
				CollectibleCardAction.TRANSFER
			: (lowestListing?.order && CollectibleCardAction.BUY) ||
				CollectibleCardAction.OFFER
	) as CollectibleCardAction;

	const name = collectibleMetadata?.name;
	const image = collectibleMetadata?.image;
	const externalUrl = collectibleMetadata?.external_url;

	return (
		<Box
			className={collectibleCard}
			borderRadius="md"
			overflow="hidden"
			background="backgroundPrimary"
		>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				position="relative"
				width="full"
				height="full"
				zIndex="10"
				overflow="hidden"
				onClick={() => onCollectibleClick?.(collectibleId)}
				border="none"
				cursor="pointer"
				padding="0"
				className={collectibleTileWrapper}
			>
				<article style={{ width: '100%' }}>
					{externalUrl && (
						<IconButton
							as="a"
							href={externalUrl}
							size="sm"
							backdropFilter="blur"
							variant="glass"
							onClick={(e) => {
								e.stopPropagation();
							}}
							position="absolute"
							top="2"
							left="2"
							icon={SvgDiamondEyeIcon}
						/>
					)}

					<img
						src={imageLoadingError ? ChessTileImage : image || ChessTileImage}
						alt={name}
						className={collectibleImage}
						onError={() => setImageLoadingError(true)}
					/>

					<Footer
						name={name || ''}
						type={collectionType}
						onOfferClick={() => onOfferClick?.({ order: highestOffer?.order })}
						highestOffer={highestOffer?.order}
						lowestListingPriceAmount={lowestListing?.order?.priceAmount}
						lowestListingCurrency={lowestListingCurrency}
						balance={balance}
						isAnimated={!!action}
					/>

					{accountAddress && (highestOffer || lowestListing) && (
						<Box
							display="flex"
							alignItems="center"
							justifyContent="center"
							padding="2"
							className={actionWrapper}
						>
							<ActionButton
								chainId={String(chainId)}
								collectionAddress={collectionAddress}
								tokenId={collectibleId}
								orderbookKind={orderbookKind}
								action={action}
								highestOffer={highestOffer?.order}
								lowestListing={lowestListing?.order}
								isOwned={!!balance}
							/>
						</Box>
					)}
				</article>
			</Box>
		</Box>
	);
}
