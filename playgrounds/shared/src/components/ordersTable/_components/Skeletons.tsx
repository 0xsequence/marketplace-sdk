import { Table } from '../Table';
import { Skeleton } from '@0xsequence/design-system';

const OrdersTableBodySkeleton = ({
	columns,
	pageSize,
}: {
	columns: number;
	pageSize: number;
}) => {
	return (
		<>
			<Table.Body className="text-foreground">
				{Array.from({ length: pageSize }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<OrdersTableRowSkeletonSmallScreen key={index} />
				))}

				{Array.from({ length: pageSize }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<OrdersTableRowSkeletonWideScreen key={index} columns={columns} />
				))}
			</Table.Body>
		</>
	);
};

const OrdersTableRowSkeletonWideScreen = ({ columns }: { columns: number }) => {
	return (
		<Table.Row className="hidden md:table-row">
			{Array.from({ length: columns }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<Table.Cell key={index}>
					<Skeleton size="normal" style={{ width: 60 }} />
				</Table.Cell>
			))}
		</Table.Row>
	);
};

const OrdersTableRowSkeletonSmallScreen = () => {
	return (
		<Table.Row className="table-row md:hidden">
			<Table.Cell>
				<div className="flex flex-col gap-4">
					<div className="flex gap-4">
						<Skeleton size="sm" style={{ width: 60 }} />

						<Skeleton size="sm" style={{ width: 60 }} />
					</div>

					<div className="flex gap-4">
						<Skeleton size="sm" style={{ width: 60 }} />

						<Skeleton size="sm" style={{ width: 60 }} />

						<Skeleton size="sm" style={{ width: 60 }} />
					</div>
				</div>
			</Table.Cell>
		</Table.Row>
	);
};

export default OrdersTableBodySkeleton;
