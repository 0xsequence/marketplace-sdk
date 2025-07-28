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
	AlertIcon,
	Badge,
	Box,
	Button,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';

import type { Address } from 'viem';
import type { Collection } from '../types';

export function MarketplaceListingsTable({
	collection,
}: {
	collection: Collection;
}) {
	const toast = useToast();
	const { show: openBuyModal } = useBuyModal({
		onSuccess: ({ hash }) => {
			toast({
				title: 'Purchase successful',
				description: `Transaction: ${hash}`,
				status: 'success',
			});
		},
		onError: (error) => {
			toast({
				title: 'Purchase failed',
				description: error.message,
				status: 'error',
			});
		},
	});

	const collectionAddress = collection.address as Address;
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
			<Alert status="error">
				<AlertIcon />
				Error loading listings: {error.message}
			</Alert>
		);
	}

	if (!collectibles?.pages?.[0]?.collectibles?.length) {
		return (
			<Alert status="info">
				<AlertIcon />
				No listings found for this collection
			</Alert>
		);
	}

	return (
		<Box overflowX="auto">
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>Token ID</Th>
						<Th>Price</Th>
						<Th>Quantity</Th>
						<Th>Seller</Th>
						<Th>Expires</Th>
						<Th>Marketplace</Th>
						<Th>Actions</Th>
					</Tr>
				</Thead>
				<Tbody>
					{collectibles?.pages?.[0]?.collectibles?.map((collectible) => (
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
										collectibleId: collectible.metadata.tokenId,
										orderId: collectible.listing.orderId,
										marketplace: collectible.listing.marketplace,
									});
								}
							}}
						/>
					))}
				</Tbody>
			</Table>
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
		<Tr>
			<Td>{collectible.metadata.tokenId}</Td>
			<Td>
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
			</Td>
			<Td>{collectible.listing?.quantityRemaining || 0}</Td>
			<Td>
				<Badge variant="outline">
					{collectible.listing?.createdBy?.slice(0, 6)}...
					{collectible.listing?.createdBy?.slice(-4)}
				</Badge>
			</Td>
			<Td>{expiresIn}</Td>
			<Td>
				<Badge colorScheme="blue">
					{collectible.listing?.marketplace || 'Unknown'}
				</Badge>
			</Td>
			<Td>
				<Button size="sm" colorScheme="blue" onClick={onBuy}>
					Buy
				</Button>
			</Td>
		</Tr>
	);
}
