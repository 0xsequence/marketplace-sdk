'use client';

import { ContractType } from '@0xsequence/api-client';
import { Skeleton } from '@0xsequence/design-system';

export interface CardSkeletonProps {
	type?: ContractType;
	isShop?: boolean;
}

export function CardSkeleton({
	type = ContractType.ERC721,
	isShop = false,
}: CardSkeletonProps) {
	return (
		<div
			data-testid="collectible-card-skeleton"
			className="w-card-width overflow-hidden rounded-xl border border-border-base focus-visible:border-border-focus focus-visible:shadow-none focus-visible:outline-focus active:border-border-focus active:shadow-none"
		>
			<div className="relative aspect-square overflow-hidden bg-background-secondary">
				<Skeleton
					size="lg"
					className="absolute inset-0 h-full w-full animate-shimmer"
					style={{
						borderRadius: 0,
					}}
				/>
			</div>
			<div className="mt-2 flex flex-col gap-2 px-4 pb-4">
				<Skeleton size="lg" className="animate-shimmer" />
				<Skeleton size="sm" className="h-5 w-16 animate-shimmer" />

				{isShop && type === ContractType.ERC1155 && (
					<Skeleton size="lg" className="h-6 w-20 animate-shimmer" />
				)}
			</div>
		</div>
	);
}
