import type { Order } from '../../../../../packages/sdk/src';
import OrdersTableBody from './_components/Body';
import OrdersTableFooter from './_components/Footer';
import OrdersTableHeader from './_components/Header';
import OrdersTableBodySkeleton from './_components/Skeletons';
import type { Hex } from 'viem';
import { Table } from '../Table';

type OrdersTableProps = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	orders: Order[] | undefined;
	ordersCount: number | undefined;
	ordersCountLoading: boolean;
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	isLoading: boolean;
};

const OrdersTable = (props: OrdersTableProps) => {
	const {
		collectionAddress,
		orders,
		ordersCount,
		ordersCountLoading,
		page,
		pageSize,
		onPageChange,
		onPageSizeChange,
		isLoading,
	} = props;

	const columns = ['Price', 'Quantity', 'By', 'Expires', 'Marketplace'];

	return (
		<div className="overflow-hidden rounded-xl border border-border-base">
			<Table.Root>
				<OrdersTableHeader items={columns} isLoading={isLoading} />

				{isLoading && (
					<OrdersTableBodySkeleton
						columns={columns.length}
						pageSize={pageSize}
					/>
				)}

				{!isLoading && (
					<OrdersTableBody
						orders={orders}
						collectionAddress={collectionAddress}
					/>
				)}

				<OrdersTableFooter
					page={page}
					pageSize={pageSize}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					ordersCount={ordersCount}
					ordersCountLoading={ordersCountLoading}
				/>
			</Table.Root>
		</div>
	);
};

export default OrdersTable;
