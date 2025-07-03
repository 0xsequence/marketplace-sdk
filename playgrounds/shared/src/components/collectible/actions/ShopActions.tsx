import { Button, Skeleton, Text } from '@0xsequence/design-system';
import { ContractType, compareAddress } from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useMarketplaceConfig,
	useShopCollectibleSaleData,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

interface ShopActionsProps {
	contractType: ContractType | undefined;
	chainId: number;
	collectionAddress: Address;
	tokenId: string;
}

export function ShopActions({
	contractType,
	chainId,
	collectionAddress,
	tokenId,
}: ShopActionsProps) {
	const { address: accountAddress } = useAccount();
	const { show: showBuyModal } = useBuyModal();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const saleConfig = marketplaceConfig?.shop?.collections?.find((c) =>
		compareAddress(c.itemsAddress, collectionAddress),
	);
	const saleContractAddress = saleConfig?.saleAddress as Address;

	const {
		salePrice,
		quantityRemaining,
		isLoading: shopDataLoading,
		error: shopDataError,
	} = useShopCollectibleSaleData({
		chainId: Number(chainId),
		salesContractAddress: saleContractAddress as Address,
		itemsContractAddress: collectionAddress as Address,
		tokenId: String(tokenId),
		collectionType:
			contractType === ContractType.ERC1155
				? ContractType.ERC1155
				: ContractType.ERC721,
		enabled: !!collectionAddress && !!saleContractAddress,
	});

	if (shopDataLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-6 w-1/3" />
				<Skeleton className="h-12 w-full rounded-xl" />
			</div>
		);
	}

	if (shopDataError) {
		console.error(shopDataError);
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

	if (Number(quantityRemaining) <= 0) {
		return (
			<div className="flex w-full flex-col gap-6 overflow-hidden rounded-xl bg-background-secondary p-6">
				<Text className="font-bold text-base text-primary">Out of stock</Text>
				<Text className="font-medium text-muted text-sm">
					This item is no longer available in this sale.
				</Text>
			</div>
		);
	}

	if (Number(quantityRemaining) > 0) {
		const copy721 =
			"You can't buy this item directly. Go to the sale page to get the next available item.";

		return (
			<div className="flex w-full flex-col gap-6 overflow-hidden rounded-xl bg-background-secondary p-6">
				<Text className="font-bold text-base text-primary">
					Stock: {quantityRemaining}
				</Text>

				{contractType === ContractType.ERC721 && (
					<Text className="font-medium text-muted text-sm">{copy721}</Text>
				)}

				{contractType === ContractType.ERC1155 && salePrice && (
					<Button
						className="rounded-xl [&>div]:justify-center"
						variant="primary"
						shape="square"
						size="lg"
						label="Buy now"
						onClick={() =>
							showBuyModal({
								chainId,
								collectionAddress,
								salesContractAddress: saleContractAddress,
								items: [
									{
										tokenId,
										quantity: '1',
									},
								],
								marketplaceType: 'shop',
								salePrice: {
									amount: salePrice.amount,
									currencyAddress: salePrice.currencyAddress,
								},
								quantityDecimals: 0,
								quantityRemaining: Number(quantityRemaining),
							})
						}
					/>
				)}
			</div>
		);
	}

	return null;
}
