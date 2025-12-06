import {
	ChevronLeftIcon,
	ChevronRightIcon,
	Field,
	FieldLabel,
	IconButton,
	Select,
	Skeleton,
	Text,
} from '@0xsequence/design-system';
import { PAGE_SIZE_OPTIONS } from '../../consts';

type PreviousNextPageControlsProps = {
	page: number;
	onPageChange: (page: number) => void;
	totalPages: number;
	hasMore?: boolean;
};

export function PreviousNextPageControls({
	page,
	onPageChange,
	totalPages,
	hasMore,
}: PreviousNextPageControlsProps) {
	function handlePrevPage() {
		if (page > 1) {
			onPageChange(page - 1);
		}
	}

	function handleNextPage() {
		if (hasMore || page < totalPages) {
			onPageChange(page + 1);
		}
	}

	return (
		<div className="flex items-center gap-2">
			<IconButton
				onClick={handlePrevPage}
				variant="secondary"
				disabled={page <= 1}
				size="xs"
				icon={ChevronLeftIcon}
			/>

			<IconButton
				onClick={handleNextPage}
				variant="secondary"
				disabled={!hasMore && page >= totalPages}
				size="xs"
				icon={ChevronRightIcon}
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

export function PageSelect({
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
		<div className="flex items-center gap-2 sm:flex">
			<Select.Helper
				name="page"
				options={options.map((option) => ({
					label: option.label,
					value: option.value.toString(),
				}))}
				value={page.toString()}
				onValueChange={(value) => onPageChange(Number(value))}
			/>

			{totalPagesLoading ? (
				<Skeleton size="sm" />
			) : (
				<Text color="text50" fontWeight="medium" className="text-sm">
					of {totalPages}
				</Text>
			)}
		</div>
	);
}

type ItemsPerPageSelectProps = {
	pageSize: number;
	onPageSizeChange: (pageSize: number) => void;
};

export function ItemsPerPageSelect({
	pageSize,
	onPageSizeChange,
}: ItemsPerPageSelectProps) {
	return (
		<div className="flex items-center gap-2 sm:flex">
			<Text color="text50">Items per page</Text>

			<Field>
				<FieldLabel>Items per page</FieldLabel>
				<Select.Helper
					name="pageSize"
					value={pageSize.toString()}
					options={Object.entries(PAGE_SIZE_OPTIONS).map(([, value]) => ({
						label: value.label,
						value: value.value.toString(),
					}))}
					onValueChange={(value) => onPageSizeChange(Number(value))}
				/>
			</Field>
		</div>
	);
}
