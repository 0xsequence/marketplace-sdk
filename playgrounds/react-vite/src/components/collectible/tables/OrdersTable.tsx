import { GradientAvatar, Text } from '@0xsequence/design-system';
import { type Order } from '@0xsequence/marketplace-sdk';
import {
	ControlledTable,
	type Column,
} from '../../../lib/Table/ControlledTable';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import { ActionCell } from './ActionCell';
import { Box } from '@0xsequence/design-system';
import toTitleCaseFromSnakeCase from '../../../lib/util/toTitleCaseFromSnakeCase';
import { CurrencyCell } from './CurrencyCell';

export interface OrdersTableProps {
	isLoading: boolean;
	owned?: boolean;
	items?: Order[];
	emptyMessage: string;
	getLabel: (
		order: Order,
	) => 'Buy' | 'Sell' | 'Cancel' | 'Cancelling...' | undefined;
	onAction: (order: Order) => void | Promise<void>;
	disableOnAction?: (order: Order) => boolean;
	type: 'listings' | 'offers';
	nextPage: () => void;
	prevPage: () => void;
	isPrevDisabled: boolean;
	isNextDisabled: boolean;
	currentPage: number;
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
	currentPage,
}: OrdersTableProps) => {
	const columns: Column<Order>[] = [
		{
			header: 'Price',
			key: 'priceAmountFormatted',
			render: (order) => (
				<Text fontFamily="body" color="text100">
					{order.priceAmountFormatted}
				</Text>
			),
		},
		{
			header: 'Currency',
			key: 'priceCurrencyAddress',
			render: (order) => (
				<CurrencyCell currencyAddress={order.priceCurrencyAddress} />
			),
		},
		{
			header: type === 'listings' ? 'Seller' : 'Buyer',
			key: 'createdBy',
			render: (order) => (
				<Box display="flex" alignItems="center" gap="1">
					<GradientAvatar address={order.createdBy} size="xs" />

					<Text fontFamily="body" color="text100">
						{truncateMiddle(order.createdBy, 3, 4)}
					</Text>
				</Box>
			),
		},
		{
			header: 'Expiration',
			key: 'validUntil',
			render: (order) => (
				<Text fontFamily="body" color="text100">
					{new Date(order.validUntil).toLocaleDateString()}
				</Text>
			),
		},
		{
			header: 'Orderbook',
			key: 'marketplace',
			render: (order) => (
				<Box
					background="backgroundMuted"
					paddingX="2"
					paddingY="1"
					display="inline-block"
					borderRadius="xs"
				>
					<Text fontSize="xsmall" fontFamily="body" fontWeight="bold">
						{toTitleCaseFromSnakeCase(order.marketplace)}
					</Text>
				</Box>
			),
		},
		{
			header: 'Actions',
			key: 'actions',
			render: (order) => (
				<ActionCell order={order} getLabel={getLabel} onAction={onAction} />
			),
		},
	];

	return (
		<ControlledTable<Order>
			isLoading={isLoading}
			items={items}
			columns={columns}
			emptyMessage={emptyMessage}
			pagination={{
				onNextPage: nextPage,
				onPrevPage: prevPage,
				isPrevDisabled,
				isNextDisabled,
				currentPage,
			}}
		/>
	);
};
