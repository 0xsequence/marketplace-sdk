'use client';

import { Text } from '@0xsequence/design-system';
import { useAccount } from 'wagmi';
import { Table } from '../../Table';

const OrdersTableHeader = ({
	items,
	isLoading,
}: {
	items: string[];
	isLoading: boolean;
}) => {
	const { address } = useAccount();

	return (
		<Table.Header className="table-header-group bg-background-secondary">
			<Table.Row>
				{items.map((item) => (
					<Table.Head key={item}>
						<Text className="font-medium text-text-80 text-xs">{item}</Text>
					</Table.Head>
				))}
				{
					// empty cell for actions
					address && !isLoading && <Table.Head />
				}
			</Table.Row>
		</Table.Header>
	);
};

export default OrdersTableHeader;
