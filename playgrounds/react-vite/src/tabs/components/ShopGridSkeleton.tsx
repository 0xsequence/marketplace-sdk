import { ShopCardSkeleton } from './ShopCardSkeleton';

interface ShopGridSkeletonProps {
	count?: number;
}

export function ShopGridSkeleton({ count = 12 }: ShopGridSkeletonProps) {
	// Generate unique IDs for each skeleton to avoid using index as key
	const skeletonIds = Array.from(
		{ length: count },
		(_, i) => `skeleton-${Date.now()}-${i}`,
	);

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{skeletonIds.map((id) => (
				<ShopCardSkeleton key={id} />
			))}
		</div>
	);
}
