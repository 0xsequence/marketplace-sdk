'use client';

import { Button, Spinner, Text } from '@0xsequence/design-system';
import type { ReactNode } from 'react';
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
	render?: (row: T) => ReactNode;
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
	className?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function ControlledTable<T extends { [key: string]: any }>({
	isLoading,
	items,
	columns,
	emptyMessage,
	pagination,
	className,
}: ControlledTableProps<T>) {
	if (isLoading) {
		return (
			<div className="flex justify-center p-4">
				<Spinner size="md" />
			</div>
		);
	}

	return (
		<div className={className}>
			<div className="overflow-x-auto rounded-md border border-white/10 bg-black/80 shadow-md">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={column.key}>
									<Text variant="small" color="text80">
										{column.header}
									</Text>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{!items?.length ? (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									<Text variant="small" color="text80">
										{emptyMessage}
									</Text>
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => (
								<TableRow key={item.orderId || item.id}>
									{columns.map((column) => (
										<TableCell key={column.key}>
											{column.render?.(item)}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{pagination && items && items.length > 0 && (
				<div className="mt-4 flex justify-center gap-2">
					<Button
						size="xs"
						variant="glass"
						onClick={pagination.onPrevPage}
						disabled={pagination.isPrevDisabled}
						label="Previous"
					/>
					<div className="mx-1 flex items-center">
						<Text variant="small" color="text100" fontWeight="bold">
							Page {pagination.currentPage}
						</Text>
					</div>
					<Button
						size="xs"
						variant="glass"
						onClick={pagination.onNextPage}
						disabled={pagination.isNextDisabled}
						label="Next"
					/>
				</div>
			)}
		</div>
	);
}
