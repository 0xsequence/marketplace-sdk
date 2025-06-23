import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import { useDI } from '../../lib/di/context';

interface CollectibleGridProps {
	collectibles: CollectibleCardProps[];
	isLoading?: boolean;
	columns?: Record<number, string>;
	createCollectibleRoute?: (collectible: CollectibleCardProps) => string;
	validateSale?: (collectible: CollectibleCardProps) => boolean;
	className?: string;
}

export function CollectibleGrid({
	collectibles,
	isLoading = false,
	columns = {
		1: 'repeat(2, 1fr)',
		640: 'repeat(3, 1fr)',
		1024: 'repeat(4, 1fr)',
	},
	createCollectibleRoute,
	validateSale,
	className = '',
}: CollectibleGridProps) {
	const { Link } = useDI();

	// Create responsive grid styles
	const gridStyles = Object.entries(columns).reduce(
		(styles, [breakpoint, gridValue]) => {
			const bp = Number(breakpoint);
			if (bp === 1) {
				styles.gridTemplateColumns = gridValue;
			} else {
				styles[`@media (min-width: ${bp}px)`] = {
					gridTemplateColumns: gridValue,
				};
			}
			return styles;
		},
		{} as Record<string, any>,
	);

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
		<div className={`grid gap-4 ${className}`} style={gridStyles}>
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
						<Link
							key={collectible.collectibleId}
							href={createCollectibleRoute(collectible)}
						>
							{content}
						</Link>
					);
				}

				return <div key={collectible.collectibleId}>{content}</div>;
			})}
		</div>
	);
}
