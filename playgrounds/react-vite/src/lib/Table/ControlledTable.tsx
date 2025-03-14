import { Button, Skeleton, Text } from '@0xsequence/design-system2';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
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
			<div className="rounded-xl bg-background-muted">
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
							// biome-ignore lint/suspicious/noArrayIndexKey: TODO
							<TableRow key={rowIndex}>
								{columns.map((_, colIndex) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: TODO
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
			<div className="flex items-center justify-center rounded-xl bg-background-muted p-8">
				<Text className="font-body" variant="medium">
					{emptyMessage}
				</Text>
			</div>
		);
	}

	return (
		<div className="rounded-xl bg-background-muted">
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
						// biome-ignore lint/suspicious/noArrayIndexKey: TODO
						<TableRow key={index}>
							{columns.map((column: Column<T>) => (
								<TableCell key={column.key}>
									{column.render ? (
										column.render(item)
									) : (
										<Text className="font-body" color="text100">
											{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
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
				<div className="flex items-center justify-start gap-4 p-4">
					<div className="rounded-lg bg-background-primary p-2">
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
