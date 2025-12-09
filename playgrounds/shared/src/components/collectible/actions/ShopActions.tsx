import { Button, Skeleton, Text } from '@0xsequence/design-system';
import { ContractType, compareAddress } from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useListPrimarySaleItems,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

interface ShopActionsProps {
	contractType: ContractType | undefined;
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
	collectibleName: string;
}

export function ShopActions({
	contractType,
	chainId,
	collectionAddress,
	tokenId,
	collectibleName,
}: ShopActionsProps) {
	const { address: accountAddress } = useAccount();
	const { show: showBuyModal } = useBuyModal();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const saleConfig = marketplaceConfig?.shop?.collections?.find((c) =>
		compareAddress(c.itemsAddress, collectionAddress),
	);
	const saleContractAddress = saleConfig?.saleAddress as Address;
	const {
		data: primarySaleItems,
		isLoading: primarySaleItemsLoading,
		error: primarySaleItemsError,
	} = useListPrimarySaleItems({
		chainId: Number(chainId),
		primarySaleContractAddress: saleContractAddress as Address,
		filter: {
			searchText: collectibleName ?? '',
			includeEmpty: true,
		},
		query: {
			enabled: !!collectibleName,
		},
	});
	const primarySaleItem =
		primarySaleItems?.pages[0]?.primarySaleItems[0]?.primarySaleItem;

	if (primarySaleItemsLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-6 w-1/3" />
				<Skeleton className="h-12 w-full rounded-xl" />
			</div>
		);
	}

	if (primarySaleItemsError) {
		console.error(primarySaleItemsError);
		return (
			<div className="flex flex-col gap-4">
				<Text className="font-bold text-base text-primary">
					Error loading sale data
				</Text>
				<Text className="font-medium text-muted text-sm">
					Unable to load sale information. Please try again later.
				</Text>
			</div>
		);
	}

	if (!accountAddress) {
		return (
			<div className="flex w-full flex-col gap-6 overflow-hidden rounded-xl bg-background-secondary p-6">
				<Text className="text-center font-bold text-base text-muted">
					Connect your wallet to see options
				</Text>
			</div>
		);
	}

	if (
		primarySaleItem?.unlimitedSupply &&
		contractType === ContractType.ERC1155
	) {
		return (
			<div className="flex flex-col gap-4">
				<Text className="font-bold text-base text-primary">
					Unlimited supply
				</Text>

				<Button
					className="rounded-xl [&>div]:justify-center"
					variant="primary"
					shape="square"
					size="lg"
					onClick={() =>
						showBuyModal({
							chainId: Number(chainId),
							// collectionAddress is already an Address type
							collectionAddress,
							salesContractAddress: saleContractAddress as Address,
							item: {
								tokenId: BigInt(tokenId),
								quantity: 1n, // TODO: this is overwritten later, should not be exposed
							},
							cardType: 'shop',
							salePrice: {
								amount: primarySaleItem?.priceAmount ?? 0n,
								currencyAddress:
									(primarySaleItem?.currencyAddress as Address) ?? '0x',
							},
							// TODO: This is 0 for unlimited supply, fix it
							quantityRemaining: primarySaleItem?.supply ?? 0n,
						})
					}
				>
					Buy now
				</Button>
			</div>
		);
	}

	if (
		Number(primarySaleItem?.supply) === 0 ||
		// if 721 token was purchased, primarySaleItem will be undefined
		(contractType === ContractType.ERC721 && primarySaleItem === undefined)
	) {
		return (
			<div className="flex flex-col gap-4">
				<Text className="font-bold text-base text-primary">Out of stock</Text>

				<Text className="font-medium text-muted text-sm">
					This item is no longer available in this sale.
				</Text>
			</div>
		);
	}

	if (Number(primarySaleItem?.supply) > 0) {
		const copy721 =
			"You can't buy this item directly. Go to the sale page to get the next available item.";

		return (
			<div className="flex flex-col gap-4">
				<Text className="font-bold text-base text-primary">
					Available: {primarySaleItem?.supply}
				</Text>

				<Text className="font-medium text-muted text-sm">
					{contractType === ContractType.ERC721 && copy721}
				</Text>

				{contractType === ContractType.ERC1155 && (
					<Button
						className="rounded-xl [&>div]:justify-center"
						variant="primary"
						shape="square"
						size="lg"
						onClick={() =>
							showBuyModal({
								chainId: Number(chainId),
								// collectionAddress is already an Address type
								collectionAddress,
								salesContractAddress: saleContractAddress as Address,
								item: {
									tokenId: BigInt(tokenId),
									quantity: 1n, // TODO: this is overwritten later, should not be exposed
								},
								cardType: 'shop',
								salePrice: {
									amount: primarySaleItem?.priceAmount ?? 0n,
									currencyAddress:
										(primarySaleItem?.currencyAddress as Address) ?? '0x',
								},
								quantityRemaining: primarySaleItem?.supply ?? 0n,
							})
						}
					>
						Buy now
					</Button>
				)}
			</div>
		);
	}

	return null;
}
