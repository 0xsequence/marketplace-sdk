import { Button, CloseIcon, IconButton, Text } from '@0xsequence/design-system';
import { PropertyType } from '../../../../../sdk/src';
import { useFilterContext } from './FilterContext';
import { FilterList } from './FilterList';

function FiltersContent() {
	const { filtersModified, clearFilters, applyFilters } = useFilterContext();

	const handleClearFilters = () => {
		clearFilters();
	};

	return (
		<div className="flex flex-col gap-3 pt-3">
			<FilterList />

			<AppliedFilters />

			<div className="mt-2 flex items-center justify-between gap-2">
				<Button
					onClick={handleClearFilters}
					size="sm"
					variant="secondary"
					disabled={!filtersModified}
				>
					Clear Filters
				</Button>

				<Button
					onClick={applyFilters}
					size="sm"
					variant="primary"
					disabled={!filtersModified}
				>
					Apply Filters
				</Button>
			</div>
		</div>
	);
}

function AppliedFilters() {
	const { appliedFilters, removeFilter } = useFilterContext();

	return (
		<div className="flex flex-wrap gap-2">
			{appliedFilters.map((filter) =>
				filter.type === PropertyType.INT ? (
					<div
						key={filter.name}
						className="flex items-center gap-2 rounded-md bg-background-secondary px-2 py-1"
					>
						<Text className="font-bold text-xs">
							{filter.name} : {filter.min} - {filter.max}
						</Text>
						<IconButton
							onClick={() => removeFilter(filter.name)}
							icon={() => <CloseIcon className="h-3 w-3" />}
							size="xs"
							variant="ghost"
						/>
					</div>
				) : (
					filter.values?.map((value) => (
						<div
							key={value}
							className="flex items-center gap-2 rounded-md bg-background-secondary px-2 py-1"
						>
							<Text className="font-bold text-xs">{value}</Text>
							<IconButton
								onClick={() => removeFilter(filter.name, value)}
								icon={() => <CloseIcon className="h-3 w-3" />}
								size="xs"
								variant="ghost"
							/>
						</div>
					))
				),
			)}
		</div>
	);
}

export default function Filters() {
	return <FiltersContent />;
}
