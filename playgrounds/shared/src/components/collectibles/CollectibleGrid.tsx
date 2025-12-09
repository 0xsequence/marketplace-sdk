import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import { useLink } from '../ui/LinkProvider';

interface CollectibleGridProps {
	collectibles: CollectibleCardProps[];
	isLoading?: boolean;
	createCollectibleRoute?: (collectible: CollectibleCardProps) => string;
	validateSale?: (collectible: CollectibleCardProps) => boolean;
	className?: string;
}

export function CollectibleGrid({
	collectibles,
	isLoading = false,
	createCollectibleRoute,
	validateSale,
	className = '',
}: CollectibleGridProps) {
	const AppLink = useLink();

	const filteredCollectibles = collectibles.filter((collectible) => {
		if (!validateSale) return true;
		return validateSale(collectible);
	});

	if (filteredCollectibles.length === 0 && !isLoading) {
		return (
			<div className="flex justify-center p-8">
				<p className="text-gray-500">No collectibles found</p>
			</div>
		);
	}

	return (
		<div
			className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${className}`}
		>
			{filteredCollectibles.map((collectible) => {
				const content = (
					<div className="flex w-full min-w-[175px] items-stretch justify-center">
						<CollectibleCard
							{...collectible}
							cardLoading={collectible.cardLoading || isLoading}
						/>
					</div>
				);

				if (createCollectibleRoute) {
					return (
						<AppLink
							key={collectible.tokenId}
							href={createCollectibleRoute(collectible)}
						>
							{content}
						</AppLink>
					);
				}

				return <div key={collectible.tokenId}>{content}</div>;
			})}
		</div>
	);
}
