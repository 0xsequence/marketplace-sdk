import type { ContractInfo } from '@0xsequence/metadata';
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
		lg: 3
	}
}: CollectionGridProps) {
	// Default Tailwind classes for responsive grid
	const gridCols: Record<number, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4'
	};

	const mobileClass = gridCols[columns.mobile || 1];
	const smClass = columns.sm ? `sm:${gridCols[columns.sm]}` : '';
	const lgClass = columns.lg ? `lg:${gridCols[columns.lg]}` : '';

	const gridClasses = `grid gap-4 ${mobileClass} ${smClass} ${lgClass} ${className}`.trim();

	return (
		<div className={gridClasses}>
			{collections.map((collection) => (
				<CollectionCard
					key={`${collection.chainId}-${collection.address}`}
					collection={collection}
					onClick={() => onCollectionClick(collection)}
				/>
			))}
		</div>
	);
}