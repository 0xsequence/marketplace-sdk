import type { Hex } from 'viem';
import type { Order } from '../../../../../../sdk/src';
import { Table } from '../../Table';
import OrdersTableRow from './TableRow';

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
