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
};

const OrdersTableFooter = ({
	page,
	pageSize,
	onPageChange,
	onPageSizeChange,
	ordersCount,
	ordersCountLoading,
}: OrdersTableFooterProps) => {
	const totalItems = Number(ordersCount) || 0;

	// Calculate start and end, ensuring they're valid
	const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
	const end = Math.min(page * pageSize, totalItems);
	const displayText =
		totalItems === 0 ? '0 items' : `${start}-${end} of ${totalItems} items`;
	const totalPages = Math.ceil(totalItems / pageSize) || 1;

	// Reset to page 1 if current page is invalid after page size change
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
							onPageSizeChange={onPageSizeChange}
						/>

						{ordersCountLoading ? (
							<Skeleton size="sm" />
						) : (
							<Text color="text50" fontSize="small" fontWeight="medium">
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
