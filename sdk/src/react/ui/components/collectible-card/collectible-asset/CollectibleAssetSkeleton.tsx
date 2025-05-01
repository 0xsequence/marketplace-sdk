import { Skeleton } from '@0xsequence/design-system';

export default function CollectibleAssetSkeleton() {
	return (
		<Skeleton
			data-testid="collectible-asset-skeleton"
			size="lg"
			className="absolute inset-0 h-full w-full animate-shimmer"
			style={{
				borderRadius: 0,
			}}
		/>
	);
}
