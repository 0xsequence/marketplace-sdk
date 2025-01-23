import { Box, Button, Text } from '@0xsequence/design-system';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '../../lib/Table/Table';
import { OrdersTableRow } from './OrdersTableRow';
import { Order } from '../../../../../packages/sdk/src';
import { ReactNode } from 'react';

export interface OrdersTableProps {
	isLoading: boolean;
	owned?: boolean;
	items?: Order[];
	emptyMessage: string;
	getLabel: (
		order: Order,
	) => 'Buy' | 'Sell' | 'Cancel' | ReactNode | undefined;
	onAction: (order: Order) => void | Promise<void>;
	disableOnAction?: (order: Order) => boolean;
	type: 'listings' | 'offers';
	nextPage: () => void;
	prevPage: () => void;
	isPrevDisabled: boolean;
	isNextDisabled: boolean;
}

export const OrdersTable = ({
	isLoading,
	items,
	emptyMessage,
	getLabel,
	onAction,
	type,
	nextPage,
	prevPage,
	isPrevDisabled,
	isNextDisabled,
}: OrdersTableProps) => {
	if (isLoading) {
		return <Box>Loading {type}...</Box>;
	}

	if (!items?.length) {
		return <Box>{emptyMessage}</Box>;
	}

	return (
		<Box background="backgroundMuted" borderRadius="md">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Price
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Currency
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								{type === 'listings' ? 'Seller' : 'Buyer'}
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Expiration
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Orderbook
							</Text>
						</TableHead>
						<TableHead>
							<Text fontFamily="body" color="text80" fontSize="small">
								Actions
							</Text>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<OrdersTableRow
							key={item.orderId}
							order={item}
							getLabel={getLabel}
							onAction={onAction}
						/>
					))}
				</TableBody>
			</Table>
			<Box
				style={{
					display: 'flex',
					gap: '1rem',
					alignItems: 'center',
				}}
				paddingBottom="4"
				paddingLeft="4"
			>
				<Button
					size="xs"
					label="Previous page"
					onClick={prevPage}
					disabled={isPrevDisabled}
				/>
				<Button
					size="xs"
					label="Next page"
					onClick={nextPage}
					disabled={isNextDisabled}
				/>
			</Box>
		</Box>
	);
};
