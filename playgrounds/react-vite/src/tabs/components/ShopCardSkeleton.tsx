import { Box, Card, Skeleton } from '@0xsequence/design-system';

export function ShopCardSkeleton() {
	return (
		<Card className="group relative overflow-hidden">
			{/* Image skeleton */}
			<Box className="aspect-square w-full overflow-hidden">
				<Skeleton width="100%" height="100%" />
			</Box>

			{/* Content skeleton */}
			<Box padding="4" className="space-y-3">
				{/* Title skeleton */}
				<Skeleton width="80%" height="20px" />

				{/* Collection name skeleton */}
				<Skeleton width="60%" height="16px" />

				{/* Price skeleton */}
				<Box className="flex items-center justify-between">
					<Skeleton width="40%" height="24px" />
					<Skeleton width="80px" height="32px" rounded /> {/* Buy button */}
				</Box>
			</Box>
		</Card>
	);
}
