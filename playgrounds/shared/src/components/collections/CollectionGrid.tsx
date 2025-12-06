import type { ContractInfo } from '@0xsequence/marketplace-sdk';
import { CollectionCard } from './CollectionCard';

export interface CollectionGridProps {
	collections: ContractInfo[];
	onCollectionClick: (collection: ContractInfo) => void;
	className?: string;
	columns?: {
		mobile?: number;
		sm?: number;
		lg?: number;
	};
}

export function CollectionGrid({
	collections,
	onCollectionClick,
	className = '',
	columns = {
		mobile: 1,
		sm: 2,
		lg: 3,
	},
}: CollectionGridProps) {
	// Since Tailwind grid classes aren't working, use CSS Grid directly
	const gridStyle: React.CSSProperties = {
		display: 'grid',
		gap: '1rem',
		gridTemplateColumns: `repeat(${columns.lg || 3}, 1fr)`,
		// Default to the large screen layout since we can't easily do responsive CSS-in-JS
		// For mobile, we'll fall back to CSS classes if available
	};

	return (
		<div className={`grid gap-4 ${className}`} style={gridStyle}>
			{collections.map((collection, index) => (
				<CollectionCard
					key={`${collection.chainId}-${collection.address}-${index}`}
					collection={collection}
					onClick={() => onCollectionClick(collection)}
				/>
			))}
		</div>
	);
}
