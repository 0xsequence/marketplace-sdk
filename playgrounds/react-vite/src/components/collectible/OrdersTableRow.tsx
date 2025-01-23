import { Box, Button, Text } from '@0xsequence/design-system';
import { useCurrencies } from '@0xsequence/marketplace-sdk/react';
import { getMarketplaceDetails, Order, truncateMiddle } from '@0xsequence/marketplace-sdk';
import { formatUnits } from 'viem';
import { useMarketplace } from '../../lib/MarketplaceContext';
import { TableCell, TableRow } from '../../lib/Table/Table';
import { ReactNode } from 'react';

export interface OrdersTableRowProps {
	order: Order;
	owned?: boolean;
	getLabel: (order: Order) => 'Buy' | 'Sell' | 'Cancel' | ReactNode | undefined;
	onAction: (order: Order) => void | Promise<void>;
}

export const OrdersTableRow = ({
	order,
	getLabel,
	onAction,
}: OrdersTableRowProps) => {
	const label = getLabel(order);
	const { chainId } = useMarketplace();
	const { data: currencies } = useCurrencies({ chainId });
	const marketplaceDetails = getMarketplaceDetails({
		originName: order.originName,
		kind: order.marketplace,
	});

	const getCurrency = (currencyAddress: string) => {
		return currencies?.find(
			(currency) => currency.contractAddress === currencyAddress,
		);
	};

	return (
		<TableRow key={order.orderId}>
			<TableCell>
				<Text fontFamily="body">
					{formatUnits(
						BigInt(order.priceAmount),
						Number(getCurrency(order.priceCurrencyAddress)?.decimals),
					)}
				</Text>
			</TableCell>
			<TableCell>
				<Text fontFamily="body">
					{getCurrency(order.priceCurrencyAddress)?.symbol}
				</Text>
			</TableCell>
			<TableCell>
				<Text fontFamily="body">{truncateMiddle(order.createdBy, 3, 4)}</Text>
			</TableCell>
			<TableCell>
				<Text fontFamily="body">
					{new Date(order.validUntil).toLocaleDateString()}
				</Text>
			</TableCell>
			<TableCell>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					gap="1"
					background="backgroundMuted"
					paddingX="2"
					paddingY="2"
					borderRadius="xs"
				>	
					{marketplaceDetails?.logo && <marketplaceDetails.logo width='3' height='3' />}

					<Text fontSize="xsmall" fontFamily="body" fontWeight="bold">
						{marketplaceDetails?.displayName}
					</Text>
				</Box>
			</TableCell>
			{label && (
				<TableCell>
					<Button
						size="xs"
						onClick={async () => {
							await onAction(order);
						}}
						label={label}
					/>
				</TableCell>
			)}
		</TableRow>
	);
};
