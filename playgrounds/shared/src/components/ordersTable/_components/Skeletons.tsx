import { Skeleton } from '@0xsequence/design-system';
import { Table } from '../../Table';

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
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders without unique identifiers
					<OrdersTableRowSkeletonSmallScreen key={index} />
				))}

				{Array.from({ length: pageSize }).map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders without unique identifiers
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
				// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells are static placeholders without unique identifiers
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
