import { Box, Button, Card, Text } from '@0xsequence/design-system';
import { useEnhancedPrimarySaleShopCardData } from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { PrimarySaleErrorBoundary } from '../../../../../sdk/src/react/ui/components/_internals/error-boundary';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';
import type { ShopContentProps } from '../types';
import { CollectibleCardRenderer } from './CollectibleCardRenderer';
import { InfiniteScrollView } from './InfiniteScrollView';
import { PaginatedView } from './PaginatedView';
import { ShopGridSkeleton } from './ShopGridSkeleton';

export function ShopContentWithFallback({
	saleContractAddress,
	collectionAddress,
	chainId,
	paginationMode,
}: ShopContentProps) {
	const [manualRetryCount, setManualRetryCount] = useState(0);

	// Use the enhanced hook with error handling and retry logic
	const { collectibleCards, isLoading, error, retry, retryCount, isRetrying } =
		useEnhancedPrimarySaleShopCardData({
			chainId,
			primarySaleContractAddress: saleContractAddress,
			collectionAddress,
			enabled: true,
		});

	const handleManualRetry = () => {
		setManualRetryCount((prev) => prev + 1);
		retry();
	};

	const renderItemContent = (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => (
		<CollectibleCardRenderer
			index={index}
			collectibleCard={collectibleCard}
			isLoading={isLoading}
		/>
	);

	// No sale contract address
	if (!saleContractAddress) {
		return (
			<Card className="mx-auto my-8 max-w-md">
				<Box padding="6">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="text-4xl">🏪</div>
						<Text variant="large" color="text100" className="font-semibold">
							No Shop Available
						</Text>
						<Text variant="normal" color="text80">
							No sale contract address was provided.
						</Text>
					</div>
				</Box>
			</Card>
		);
	}

	// Loading state
	if (isLoading && !error && collectibleCards.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<ShopGridSkeleton count={paginationMode === 'paginated' ? 12 : 20} />
			</div>
		);
	}

	// Error state with inline fallback (not caught by error boundary)
	if (error && !isRetrying) {
		return (
			<Card className="mx-auto my-8 max-w-md">
				<Box padding="6">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="text-4xl">😕</div>
						<Text variant="large" color="text100" className="font-semibold">
							Unable to Load Items
						</Text>
						<Text variant="normal" color="text80" className="max-w-sm">
							We couldn't load the shop items. This might be temporary.
						</Text>
						{retryCount < 3 && (
							<Button onClick={handleManualRetry} variant="primary" size="sm">
								Try Again (
								{manualRetryCount > 0 ? `${manualRetryCount + 1}` : '1'})
							</Button>
						)}
					</div>
				</Box>
			</Card>
		);
	}

	// Empty state
	if (!isLoading && !error && collectibleCards.length === 0) {
		return (
			<Card className="mx-auto my-8 max-w-md">
				<Box padding="6">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="text-4xl">📦</div>
						<Text variant="large" color="text100" className="font-semibold">
							No Items Available
						</Text>
						<Text variant="normal" color="text80">
							This shop doesn't have any items for sale at the moment.
						</Text>
						<Button
							onClick={() => window.location.reload()}
							variant="secondary"
							size="sm"
						>
							Refresh Page
						</Button>
					</div>
				</Box>
			</Card>
		);
	}

	// Retrying state
	if (isRetrying) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="mx-auto mb-8 max-w-md">
					<Box padding="4">
						<div className="flex items-center justify-center gap-3">
							<div className="animate-spin text-2xl">🔄</div>
							<Text variant="normal" color="text80">
								Retrying... (Attempt {retryCount + 1} of 3)
							</Text>
						</div>
					</Box>
				</Card>
				<ShopGridSkeleton count={8} />
			</div>
		);
	}

	// Success state with data
	return (
		<PrimarySaleErrorBoundary chainId={chainId}>
			{paginationMode === 'paginated' ? (
				<PaginatedView
					collectibleCards={collectibleCards}
					renderItemContent={renderItemContent}
					isLoading={isLoading}
				/>
			) : (
				<InfiniteScrollView
					collectionAddress={collectionAddress}
					chainId={chainId}
					collectibleCards={collectibleCards}
					renderItemContent={renderItemContent}
				/>
			)}
		</PrimarySaleErrorBoundary>
	);
}
