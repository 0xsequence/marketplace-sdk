import type { Order } from '../../../../../../packages/sdk/src';
import { Table } from '../../Table';
import OrdersTableRow from './TableRow';
import type { Hex } from 'viem';

const OrdersTableBody = ({
	orders,
}: {
	orders: Order[] | undefined;
	collectionAddress: Hex;
}) => {
	return (
		<Table.Body>
			{orders?.map((order: Order, index: number) => (
				<OrdersTableRow
					key={`order-${order.orderId}`}
					order={order}
					index={index}
				/>
			))}
		</Table.Body>
	);
};

export default OrdersTableBody;
