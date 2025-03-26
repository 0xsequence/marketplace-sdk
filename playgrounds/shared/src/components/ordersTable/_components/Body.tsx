import type { Order } from '../../../../../../sdk/src';
import { Table } from '../../Table';
import OrdersTableRow from './TableRow';

const OrdersTableBody = ({
	orders,
	tokenId,
}: {
	orders: Order[] | undefined;
	tokenId: string;
}) => {
	return (
		<Table.Body>
			{orders?.map((order: Order, index: number) => (
				<OrdersTableRow
					key={`order-${order.orderId}`}
					order={order}
					index={index}
					tokenId={tokenId}
				/>
			))}
		</Table.Body>
	);
};

export default OrdersTableBody;
