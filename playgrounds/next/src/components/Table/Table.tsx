import { Button, Text } from '@0xsequence/design-system';
import type { ReactNode } from 'react';

export interface Column<T> {
	header: string;
	key: string;
	render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
	isLoading?: boolean;
	items?: T[];
	columns: Column<T>[];
	emptyMessage: string;
	onAction?: (item: T) => void;
	actionLabel?: (item: T) => string;
	pagination?: {
		onNextPage: () => void;
		onPrevPage: () => void;
		isPrevDisabled: boolean;
		isNextDisabled: boolean;
		currentPage: number;
	};
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Table<T extends { [key: string]: any }>({
	isLoading,
	items,
	columns,
	emptyMessage,
	pagination,
}: TableProps<T>) {
	if (isLoading) {
		return (
			<div className="flex justify-center p-2">
				<Text variant="small" color="text80">
					Loading...
				</Text>
			</div>
		);
	}

	if (!items?.length) {
		return (
			<div className="flex justify-center p-2">
				<Text variant="small" color="text80">
					{emptyMessage}
				</Text>
			</div>
		);
	}

	return (
		<>
			<div className="overflow-x-auto">
				<table className="w-full table-fixed divide-y divide-black/50">
					<thead>
						<tr>
							{columns.map((column) => (
								<th key={column.key} className="px-2 py-2 text-left">
									<Text variant="small" color="text80">
										{column.header}
									</Text>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-black/50">
						{items.map((item) => (
							<tr key={item.orderId || item.id} className="hover:bg-black/80">
								{columns.map((column) => (
									<td key={column.key} className="px-2 py-2">
										{column.render?.(item)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{pagination && (
				<div className="mt-2 flex justify-center gap-2">
					<Button
						size="xs"
						onClick={pagination.onPrevPage}
						disabled={pagination.isPrevDisabled}
						label="Previous page"
					/>
					<div className="mx-1 flex items-center">
						<Text variant="small" color="text100" fontWeight="bold">
							Page {pagination.currentPage}
						</Text>
					</div>
					<Button
						size="xs"
						onClick={pagination.onNextPage}
						disabled={pagination.isNextDisabled}
						label="Next page"
					/>
				</div>
			)}
		</>
	);
}
