'use client';

import { Skeleton, Text } from '@0xsequence/design-system';
import { cn, formatPrice, type Order } from '@0xsequence/marketplace-sdk';
import { useCurrency } from '@0xsequence/marketplace-sdk/react';
import { formatDistanceToNow } from 'date-fns';
import type { Address, Hex } from 'viem';
import { useAccount } from 'wagmi';
import { Table } from '../../Table';
import OrdersTableAction from './Action';
import AddressPill from './AddressPill';
import MarketplacePill from './MarketplacePill';

const OrdersTableRow = ({
	order,
	index,
	tokenId,
}: {
	order: Order;
	index: number;
	tokenId: bigint;
}) => {
	const { chainId, collectionContractAddress } = order;
	const { address: accountAddress } = useAccount();

	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: order.priceCurrencyAddress as Address | undefined,
	});

	const expiresInDays = formatDistanceToNow(new Date(order.validUntil), {
		addSuffix: true,
	});

	return (
		<Table.Row
			className={cn(
				index % 2 === 0 ? 'bg-background-backdrop' : '',
				'table-row',
			)}
		>
			<Table.Cell>
				{currency ? (
					<Text className="font-bold text-primary text-xs">
						{formatPrice(BigInt(order.priceAmount), currency.decimals)}{' '}
						{currency.symbol}
					</Text>
				) : (
					<Skeleton className="h-4 w-16" />
				)}
			</Table.Cell>

			<Table.Cell className="font-medium text-primary text-xs">
				{order.quantityRemaining}
			</Table.Cell>

			<Table.Cell>
				<AddressPill address={order.createdBy} />
			</Table.Cell>

			<Table.Cell className="font-medium text-primary text-xs">
				{expiresInDays}
			</Table.Cell>

			<Table.Cell>
				<MarketplacePill
					marketplace={order.marketplace}
					originName={order.originName}
				/>
			</Table.Cell>

			{accountAddress && (
				<Table.Cell className="p-0 pr-2">
					<OrdersTableAction
						chainId={chainId}
						collectionAddress={collectionContractAddress as Hex}
						tokenId={tokenId}
						order={order}
					/>
				</Table.Cell>
			)}
		</Table.Row>
	);
};

export default OrdersTableRow;
