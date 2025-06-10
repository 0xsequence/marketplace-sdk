import { Button, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';

interface PaginatedViewProps {
	collectibleCards: CollectibleCardProps[];
	renderItemContent: (
		index: number,
		collectibleCard: CollectibleCardProps,
	) => React.ReactNode;
	isLoading?: boolean;
}

export function PaginatedView({
	collectibleCards,
	renderItemContent,
	isLoading,
}: PaginatedViewProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 6;

	// Paginate the results client-side
	const paginatedCards = collectibleCards.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	if (collectibleCards.length === 0 && !isLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collectibles found</Text>
			</div>
		);
	}

	return (
		<>
			<div
				className="grid items-start gap-3 pt-3"
				style={{
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '16px',
				}}
			>
				{isLoading && paginatedCards.length === 0 ? (
					<div className="col-span-3 flex justify-center py-8">
						<Text>Loading collectibles...</Text>
					</div>
				) : (
					paginatedCards.map((collectibleCard, index) =>
						renderItemContent(index, collectibleCard),
					)
				)}
			</div>

			<div className="mt-4 flex justify-center gap-2">
				<Button
					className="bg-gray-900 text-gray-300"
					onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
					disabled={currentPage <= 1}
				>
					Previous
				</Button>
				<Text className="mx-2 flex items-center font-bold text-gray-300 text-sm">
					Page {currentPage}
				</Text>
				<Button
					className="bg-gray-900 text-gray-300"
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage * pageSize >= collectibleCards.length}
				>
					Next
				</Button>
			</div>
		</>
	);
}
