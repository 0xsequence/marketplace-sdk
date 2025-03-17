'use client';

import { Text } from '@0xsequence/design-system';
import { useAccount } from 'wagmi';
import { Table } from '../Table';

const OrdersTableHeader = ({
	items,
	isLoading,
}: {
	items: string[];
	isLoading: boolean;
}) => {
	const { address } = useAccount();

	return (
		<Table.Header className="bg-foreground/10 hidden md:table-header-group">
			<Table.Row>
				{items.map((item) => (
					<Table.Head key={item}>
						<Text fontSize="small" color="text80">
							{item}
						</Text>
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
