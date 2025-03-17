import { Text } from '@0xsequence/design-system';
import { Table } from '../Table';
import { PreviousNextPageControls } from '../Table/controls';

type ActivitiesTableFooterProps = {
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	activitiesCount: number | undefined;
	activitiesCountLoading: boolean;
	hasMore: boolean;
};

const ActivitiesTableFooter = ({
	page,
	pageSize,
	onPageChange,
	activitiesCount,
	activitiesCountLoading,
	hasMore,
}: ActivitiesTableFooterProps) => {
	const totalItems = Number(activitiesCount) || 0;

	// Calculate start and end, ensuring they're valid
	const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
	const end = Math.min(page * pageSize, totalItems);

	let displayText = '0 items';
	if (totalItems > 0) {
		if (hasMore) {
			displayText = `${start}-${end}${hasMore ? '+' : ''}`;
		} else {
			displayText = `${start}-${end} of ${totalItems} items`;
		}
	}

	// If hasMore is true, we need at least one more page
	const minimumTotalPages = hasMore ? page + 1 : page;
	// Calculate totalPages, ensuring it's at least minimumTotalPages
	const calculatedTotalPages = Math.ceil(totalItems / pageSize) || 1;
	const totalPages = Math.max(calculatedTotalPages, minimumTotalPages);

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
					<div className="flex items-center justify-end gap-4 text-xs">
						{activitiesCountLoading ? (
							<div className="h-4 w-20 animate-pulse rounded-md bg-background-muted" />
						) : (
							<Text className="font-medium text-sm text-text-50">
								{displayText}
							</Text>
						)}

						<PreviousNextPageControls
							page={page}
							onPageChange={onPageChange}
							totalPages={totalPages}
							hasMore={hasMore}
						/>
					</div>
				</Table.Cell>
			</Table.Row>
		</Table.Footer>
	);
};

export default ActivitiesTableFooter;
