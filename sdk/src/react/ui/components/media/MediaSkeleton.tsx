import { Skeleton } from '@0xsequence/design-system';

export default function MediaSkeleton() {
	return (
		<Skeleton
			data-testid="media"
			size="lg"
			className="absolute inset-0 h-full w-full animate-shimmer"
			style={{
				borderRadius: 0,
			}}
		/>
	);
}
