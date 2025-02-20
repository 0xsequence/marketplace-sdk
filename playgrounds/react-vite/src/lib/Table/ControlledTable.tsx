import { Button, Text, Skeleton } from '@0xsequence/design-system2';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	TableCell,
} from './Table';

export interface Column<T> {
	header: string;
	key: string;
	render?: (row: T) => React.ReactNode;
}

export interface ControlledTableProps<T> {
	isLoading?: boolean;
	items?: T[];
	columns: Column<T>[];
	emptyMessage: string;
	pagination?: {
		onNextPage: () => void;
		onPrevPage: () => void;
		isPrevDisabled: boolean;
		isNextDisabled: boolean;
		currentPage: number;
	};
}

export function ControlledTable<T>({
	isLoading,
	items,
	columns,
	emptyMessage,
	pagination,
}: ControlledTableProps<T>) {
	if (isLoading) {
		return (
			<div className="bg-background-muted rounded-xl">
				<Table>
					<TableHeader
						style={{
							position: 'sticky',
							top: 0,
							width: 'full',
							backdropFilter: 'blur(10px)',
						}}
					>
						<TableRow>
							{columns.map((column: Column<T>) => (
								<TableHead key={column.key}>
									<Text className="font-body text-sm" color="text80">
										{column.header}
									</Text>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, rowIndex) => (
							<TableRow key={rowIndex}>
								{columns.map((_, colIndex) => (
									<TableCell key={colIndex}>
										<Skeleton className="h-6 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	if (!items?.length) {
		return (
			<div className="flex items-center justify-center p-8 bg-background-muted rounded-xl">
				<Text className="font-body" variant="medium">
					{emptyMessage}
				</Text>
			</div>
		);
	}

	return (
		<div className="bg-background-muted rounded-xl">
			<Table>
				<TableHeader
					style={{
						position: 'sticky',
						top: 0,
						width: 'full',
						backdropFilter: 'blur(10px)',
					}}
				>
					<TableRow>
						{columns.map((column: Column<T>) => (
							<TableHead key={column.key}>
								<Text className="font-body text-sm" color="text80">
									{column.header}
								</Text>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item, index) => (
						<TableRow key={index}>
							{columns.map((column: Column<T>) => (
								<TableCell key={column.key}>
									{column.render ? (
										column.render(item)
									) : (
										<Text className="font-body" color="text100">
											{(item as any)[column.key]}
										</Text>
									)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
			{pagination && (
				<div className="flex gap-4 p-4 items-center justify-start">
					<div className="bg-background-primary p-2 rounded-lg">
						<Text className="font-body text-sm" color="text100">
							Page {pagination.currentPage}
						</Text>
					</div>

					<Button
						size="xs"
						label="Previous page"
						onClick={pagination.onPrevPage}
						disabled={pagination.isPrevDisabled}
					/>
					<Button
						size="xs"
						label="Next page"
						onClick={pagination.onNextPage}
						disabled={pagination.isNextDisabled}
					/>
				</div>
			)}
		</div>
	);
}
