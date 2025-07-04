import { Skeleton } from '@0xsequence/design-system';
import { cn } from '../../../../utils';

export default function MediaSkeleton({ className }: { className?: string }) {
	return (
		<Skeleton
			data-testid="media"
			size="lg"
			className={cn(
				'absolute inset-0 h-full w-full animate-shimmer',
				className,
			)}
			style={{
				borderRadius: 0,
			}}
		/>
	);
}
