import type { MarketplaceCollection } from '@0xsequence/marketplace-sdk';
import {
	type CollectibleOrder,
	formatPrice,
	OrderSide,
} from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCurrency,
	useListCollectibles,
} from '@0xsequence/marketplace-sdk/react';
import {
	Alert,
	Badge,
	Box,
	Button,
	Spinner,
	Table,
	Text,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import type { Address } from 'viem';

export function MarketplaceListingsTable({
	collection,
}: {
	collection: MarketplaceCollection;
}) {
	const { show: openBuyModal } = useBuyModal();

	const collectionAddress = collection.itemsAddress as Address;
	const chainId = collection.chainId;

	const {
		data: collectibles,
		isLoading,
		error,
	} = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: false,
		},
	});

	if (isLoading) {
		return (
			<Box textAlign="center" py={8}>
				<Spinner size="lg" />
				<Text mt={4}>Loading listings...</Text>
			</Box>
		);
	}

	if (error) {
		return (
			<Alert.Root status="error">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Description>
						Error loading listings: {error.message}
					</Alert.Description>
				</Alert.Content>
			</Alert.Root>
		);
	}

	if (!collectibles?.pages?.[0]?.collectibles?.length) {
		return (
			<Alert.Root status="info">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Description>
						No listings found for this collection
					</Alert.Description>
				</Alert.Content>
			</Alert.Root>
		);
	}

	return (
		<Box overflowX="auto">
			<Table.Root size="sm">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Token ID</Table.ColumnHeader>
						<Table.ColumnHeader>Price</Table.ColumnHeader>
						<Table.ColumnHeader>Quantity</Table.ColumnHeader>
						<Table.ColumnHeader>Seller</Table.ColumnHeader>
						<Table.ColumnHeader>Expires</Table.ColumnHeader>
						<Table.ColumnHeader>Marketplace</Table.ColumnHeader>
						<Table.ColumnHeader>Actions</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{collectibles?.pages?.[0]?.collectibles?.map((collectible: any) => (
						<ListingRow
							key={collectible.metadata.tokenId}
							collectible={collectible}
							onBuy={() => {
								if (
									collectible.listing?.orderId &&
									collectible.listing?.marketplace
								) {
									openBuyModal({
										collectionAddress,
										chainId,
										tokenId: collectible.metadata.tokenId,
										orderId: collectible.listing.orderId,
										marketplace: collectible.listing.marketplace,
									});
								}
							}}
						/>
					))}
				</Table.Body>
			</Table.Root>
		</Box>
	);
}

function ListingRow({
	collectible,
	onBuy,
}: {
	collectible: CollectibleOrder;
	onBuy: () => void;
}) {
	const { data: currency } = useCurrency({
		chainId: collectible.listing?.chainId as number,
		currencyAddress: collectible.listing?.priceCurrencyAddress as Address,
	});

	const expiresIn = formatDistanceToNow(
		new Date(collectible.listing?.validUntil || Date.now()),
		{
			addSuffix: true,
		},
	);

	return (
		<Table.Row>
			<Table.Cell>{collectible.metadata.tokenId}</Table.Cell>
			<Table.Cell>
				{currency && collectible.listing ? (
					<Text fontWeight="bold">
						{formatPrice(
							BigInt(collectible.listing.priceAmount),
							currency.decimals,
						)}{' '}
						{currency.symbol}
					</Text>
				) : (
					<Text color="gray.500">Loading...</Text>
				)}
			</Table.Cell>
			<Table.Cell>{collectible.listing?.quantityRemaining || 0}</Table.Cell>
			<Table.Cell>
				<Badge variant="outline">
					{collectible.listing?.createdBy?.slice(0, 6)}...
					{collectible.listing?.createdBy?.slice(-4)}
				</Badge>
			</Table.Cell>
			<Table.Cell>{expiresIn}</Table.Cell>
			<Table.Cell>
				<Badge colorPalette="blue">
					{collectible.listing?.marketplace || 'Unknown'}
				</Badge>
			</Table.Cell>
			<Table.Cell>
				<Button size="sm" colorPalette="blue" onClick={onBuy}>
					Buy
				</Button>
			</Table.Cell>
		</Table.Row>
	);
}
