import { Text } from '@0xsequence/design-system';
import { Table } from '../Table';
import {
	ItemsPerPageSelect,
	PageSelect,
	PreviousNextPageControls,
} from '../Table/controls';

type ActivitiesTableFooterProps = {
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	activitiesCount: number | undefined;
	activitiesCountLoading: boolean;
	hasMore: boolean;
};

const ActivitiesTableFooter = ({
	page,
	pageSize,
	onPageChange,
	onPageSizeChange,
	activitiesCount,
	activitiesCountLoading,
}: ActivitiesTableFooterProps) => {
	const totalItems = Number(activitiesCount) || 0;

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

						{activitiesCountLoading ? (
							<div className="h-4 w-20 animate-pulse rounded-md bg-background-muted" />
						) : (
							<Text className="font-medium text-sm text-text-50">
								{displayText}
							</Text>
						)}

						<PageSelect
							page={page}
							onPageChange={onPageChange}
							totalPages={totalPages}
							totalPagesLoading={activitiesCountLoading}
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

export default ActivitiesTableFooter;
