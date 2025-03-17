'use client';

import { cn } from '../../../../../../packages/sdk/src';
import OrdersTableAction from './Action';
import AddressPill from './AddressPill';
import MarketplacePill from './MarketplacePill';
import { Skeleton, Text } from '@0xsequence/design-system';
import {
	compareAddress,
	formatPrice,
	type Order,
} from '../../../../../../packages/sdk/src';
import { useCurrencies } from '../../../../../../packages/sdk/src/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { Table } from '../Table';
import { formatDistanceToNow } from 'date-fns';

const OrdersTableRow = ({ order, index }: { order: Order; index: number }) => {
	const { chainId, tokenId, collectionContractAddress } = order;
	const { address: accountAddress } = useAccount();
	const { data: currencies } = useCurrencies({
		chainId,
	});
	const currency = currencies?.find((c) =>
		compareAddress(c.contractAddress, order.priceCurrencyAddress),
	);
	const expiresInDays = formatDistanceToNow(new Date(order.validUntil), {
		addSuffix: true,
	});

	return (
		<Table.Row
			className={cn(index % 2 === 0 ? 'bg-muted/60' : '', 'table-row')}
		>
			<Table.Cell>
				{currency ? (
					<Text color="text80" fontSize="small" fontWeight="medium">
						{formatPrice(BigInt(order.priceAmount), currency.decimals)}{' '}
						{currency.symbol}
					</Text>
				) : (
					<Skeleton className="h-4 w-16" />
				)}
			</Table.Cell>

			<Table.Cell>{order.quantityRemaining}</Table.Cell>

			<Table.Cell>
				<AddressPill address={order.createdBy} />
			</Table.Cell>

			<Table.Cell>
				<Text color="text80" fontSize="small" fontWeight="medium">
					{expiresInDays}
				</Text>
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
						chainId={String(chainId)}
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
