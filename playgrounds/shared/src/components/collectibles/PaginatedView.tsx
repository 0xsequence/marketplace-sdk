import { Button, Text } from '@0xsequence/design-system';
import type { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

type CollectibleCardProps = ComponentProps<typeof CollectibleCard>;

export interface PaginatedViewProps {
	collectibleCards: CollectibleCardProps[];
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;
	isLoading?: boolean;
	pageSize?: number;
	columns?: {
		mobile?: number;
		sm?: number;
		lg?: number;
	};
}

export function PaginatedView({
	collectibleCards,
	renderItemContent,
	isLoading,
	pageSize = 6,
	columns = {
		mobile: 1,
		sm: 2,
		lg: 3,
	},
}: PaginatedViewProps) {
	const [currentPage, setCurrentPage] = useState(1);

	// Paginate the results client-side
	const paginatedCards = collectibleCards.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const totalPages = Math.ceil(collectibleCards.length / pageSize);

	if (collectibleCards.length === 0 && !isLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	// Build responsive grid classes
	const gridCols: Record<number, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
	};

	const mobileClass = gridCols[columns.mobile || 1];
	const smClass = columns.sm ? `sm:${gridCols[columns.sm]}` : '';
	const lgClass = columns.lg ? `lg:${gridCols[columns.lg]}` : '';

	const gridClasses =
		`grid items-start gap-4 pt-3 ${mobileClass} ${smClass} ${lgClass}`.trim();

	return (
		<>
			<div className={gridClasses}>
				{isLoading && paginatedCards.length === 0 ? (
					<div className="col-span-full flex justify-center py-8">
						<Text>Loading collectibles...</Text>
					</div>
				) : (
					paginatedCards.map((collectibleCard, index) =>
						renderItemContent(
							(currentPage - 1) * pageSize + index,
							collectibleCard,
						),
					)
				)}
			</div>

			{totalPages > 1 && (
				<div className="mt-4 flex justify-center gap-2">
					<Button
						className="bg-gray-900 text-gray-300"
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
						disabled={currentPage <= 1}
					>
						Previous
					</Button>
					<Text className="mx-2 flex items-center font-bold text-gray-300 text-sm">
						Page {currentPage} of {totalPages}
					</Text>
					<Button
						className="bg-gray-900 text-gray-300"
						onClick={() => setCurrentPage(currentPage + 1)}
						disabled={currentPage >= totalPages}
					>
						Next
					</Button>
				</div>
			)}
		</>
	);
}
