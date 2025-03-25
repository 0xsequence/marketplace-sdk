import { Text } from '@0xsequence/design-system';
import { Table } from '../Table';

const ActivitiesTableHeader = ({
	items,
}: {
	items: string[];
	isLoading: boolean;
}) => {
	return (
		<Table.Header className="table-header-group bg-background-secondary">
			<Table.Row>
				{items.map((item) => (
					<Table.Head key={item}>
						<Text className="font-medium text-text-80 text-xs">{item}</Text>
					</Table.Head>
				))}
			</Table.Row>
		</Table.Header>
	);
};

export default ActivitiesTableHeader;
