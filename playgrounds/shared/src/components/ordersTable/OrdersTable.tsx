import type { Order } from '@0xsequence/marketplace-sdk';
import { Table } from '../Table';
import OrdersTableBody from './_components/Body';
import OrdersTableFooter from './_components/Footer';
import OrdersTableHeader from './_components/Header';
import OrdersTableBodySkeleton from './_components/Skeletons';

type OrdersTableProps = {
	chainId: number;
	tokenId: bigint;
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
		tokenId,
		orders,
		ordersCount,
		ordersCountLoading,
		page,
		pageSize,
		onPageChange,
		onPageSizeChange,
		isLoading,
	} = props;
	const totalItems =
		ordersCount !== undefined && ordersCount !== null
			? Number(ordersCount)
			: orders?.length || 0;
	const hasMore = totalItems > page * pageSize;

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

				{!isLoading && <OrdersTableBody orders={orders} tokenId={tokenId} />}

				<OrdersTableFooter
					page={page}
					pageSize={pageSize}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
					ordersCount={totalItems}
					ordersCountLoading={ordersCountLoading}
					hasMore={hasMore}
				/>
			</Table.Root>
		</div>
	);
};

export default OrdersTable;
