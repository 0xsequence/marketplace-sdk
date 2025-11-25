import { Skeleton } from '@0xsequence/design-system';

export const CryptoPaymentModalSkeleton = ({
	networkMismatch,
}: {
	networkMismatch: boolean;
}) => {
	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex items-start gap-4">
					{/* Media skeleton */}
					<Skeleton className="h-[84px] w-[84px] rounded-lg" />

					<div className="flex flex-1 flex-col">
						{/* Collectible name and token ID */}
						<div className="flex items-center gap-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-12" />
						</div>

						{/* Collection name */}
						<Skeleton className="mt-1 h-3 w-24" />

						{/* Price section */}
						<div className="mt-2 flex flex-col">
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-4 rounded-full" />
								<Skeleton className="h-5 w-28" />
							</div>
							{/* USD price placeholder */}
							<Skeleton className="mt-1 h-3 w-16" />
						</div>
					</div>
				</div>

				{/* Wrong network warning box skeleton */}
				{networkMismatch && <Skeleton className="h-[98px] w-full rounded-lg" />}

				{/* Switch network button skeleton */}
				{networkMismatch && <Skeleton className="h-12 w-full rounded-full" />}

				{/* Buy button skeleton */}
				<Skeleton className="h-12 w-full rounded-full" />
			</div>
		</div>
	);
};
