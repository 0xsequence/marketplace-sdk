'use client';

import { PAGE_SIZE_OPTIONS } from '../OrdersTable';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	IconButton,
	Select,
	Skeleton,
	Text,
} from '@0xsequence/design-system';
import { Table } from '../Table';

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
		<Table.Footer className="bg-inherit">
			<Table.Row>
				<Table.Cell
					className="border-foreground/10 border-t p-0 px-3 pt-2 pb-3"
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

type ItemsPerPageSelectProps = {
	pageSize: number;
	onPageSizeChange: (pageSize: number) => void;
};

function ItemsPerPageSelect({
	pageSize,
	onPageSizeChange,
}: ItemsPerPageSelectProps) {
	return (
		<div className="flex hidden items-center gap-2 sm:flex">
			<Text color="text50">Items per page</Text>

			<Select
				name="pageSize"
				options={Object.entries(PAGE_SIZE_OPTIONS).map(([, value]) => ({
					label: value.label,
					value: value.value.toString(),
				}))}
				value={pageSize.toString()}
				onChange={(value: string) => onPageSizeChange(Number(value))}
			/>
		</div>
	);
}

type PageSelectProps = {
	page: number;
	onPageChange: (page: number) => void;
	totalPages: number;
	totalPagesLoading: boolean;
};

function PageSelect({
	page,
	onPageChange,
	totalPages,
	totalPagesLoading,
}: PageSelectProps) {
	const options = totalPagesLoading
		? []
		: Array.from({ length: totalPages }, (_, i) => ({
				value: i + 1,
				label: (i + 1).toString(),
			}));

	return (
		<div className="flex hidden items-center gap-2 sm:flex">
			<Select
				name="page"
				options={options.map((option) => ({
					label: option.label,
					value: option.value.toString(),
				}))}
				value={page.toString()}
				onChange={(value: string) => onPageChange(Number(value))}
			/>

			{totalPagesLoading ? (
				<Skeleton size="sm" />
			) : (
				<Text color="text50" fontWeight="medium" fontSize="small">
					of {totalPages}
				</Text>
			)}
		</div>
	);
}

type PreviousNextPageControlsProps = {
	page: number;
	onPageChange: (page: number) => void;
	totalPages: number;
};

function PreviousNextPageControls({
	page,
	onPageChange,
	totalPages,
}: PreviousNextPageControlsProps) {
	function handlePrevPage() {
		if (page > 1) {
			onPageChange(page - 1);
		}
	}

	function handleNextPage() {
		if (page < totalPages) {
			onPageChange(page + 1);
		}
	}

	return (
		<div className="flex items-center gap-2">
			<IconButton
				onClick={handlePrevPage}
				variant="raised"
				disabled={page <= 1}
				size="xs"
				icon={ChevronLeftIcon}
			/>

			<IconButton
				onClick={handleNextPage}
				variant="raised"
				disabled={page >= totalPages}
				size="xs"
				icon={ChevronRightIcon}
			/>
		</div>
	);
}

export default OrdersTableFooter;
