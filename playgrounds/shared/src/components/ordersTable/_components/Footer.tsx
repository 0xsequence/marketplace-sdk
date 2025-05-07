'use client';

import { Skeleton, Text } from '@0xsequence/design-system';
import { Table } from '../../Table';
import {
	ItemsPerPageSelect,
	PreviousNextPageControls,
} from '../../Table/controls';
import { PageSelect } from '../../Table/controls';
type OrdersTableFooterProps = {
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	ordersCount: number | undefined;
	ordersCountLoading: boolean;
	hasMore?: boolean;
};

const OrdersTableFooter = ({
	page,
	pageSize,
	onPageChange,
	onPageSizeChange,
	ordersCount,
	ordersCountLoading,
	hasMore = false,
}: OrdersTableFooterProps) => {
	const totalItems =
		ordersCount !== undefined && ordersCount !== null ? Number(ordersCount) : 0;
	const handlePageSizeChange = (size: number) => {
		onPageSizeChange(size);
	};

	const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
	const end = Math.min(page * pageSize, totalItems);
	const displayText =
		totalItems === 0 ? '0 items' : `${start}-${end} of ${totalItems} items`;

	let totalPages = 0;
	if (hasMore) {
		totalPages = Math.max(page + 1, Math.ceil(totalItems / pageSize));
	} else if (totalItems === 0) {
		totalPages = 1;
	} else {
		totalPages = Math.ceil(totalItems / pageSize);
	}

	if (page > totalPages) {
		onPageChange(1);
	}

	return (
		<Table.Footer className="bg-background-secondary">
			<Table.Row>
				<Table.Cell
					className="border-border-base border-t p-0 px-3 pt-2 pb-3"
					colSpan={10}
				>
					<div className="flex items-center justify-between text-xs">
						<ItemsPerPageSelect
							pageSize={pageSize}
							onPageSizeChange={handlePageSizeChange}
						/>

						{ordersCountLoading ? (
							<Skeleton size="sm" />
						) : (
							<Text color="text50" className="text-sm" fontWeight="medium">
								{displayText}
							</Text>
						)}

						<PageSelect
							page={page}
							onPageChange={onPageChange}
							totalPages={totalPages}
							totalPagesLoading={ordersCountLoading}
						/>

						<PreviousNextPageControls
							page={page}
							onPageChange={onPageChange}
							totalPages={totalPages}
						/>
					</div>
				</Table.Cell>
			</Table.Row>
		</Table.Footer>
	);
};

export default OrdersTableFooter;
