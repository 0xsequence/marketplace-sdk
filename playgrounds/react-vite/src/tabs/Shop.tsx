import { Text } from '@0xsequence/design-system';
import {
	ShopCollectibleCard,
	useCollectionDetails,
	useListTokenMetadata,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { ERC1155_SALES_CONTRACT_ABI } from '../../../../sdk/src';
import { useList1155SaleSupplies } from '../../../../sdk/src/react/hooks/useList1155SaleSupplies';

// Helper function to extract cost from token sale details with type safety
const getSaleCost = (
	result:
		| `0x${string}`
		| {
				cost: bigint;
				supplyCap: bigint;
				startTime: bigint;
				endTime: bigint;
				merkleRoot: `0x${string}`;
		  }
		| undefined,
) => {
	if (!result || typeof result !== 'object' || !('cost' in result)) {
		return undefined;
	}
	return result.cost.toString();
};

export function Shop() {
	const tokenIds = ['1', '2', '3', '10'];
	const chainId = 80002;
	const contractAddress: Address = '0xbb92fdb23b41c1f47f01691a0aa6e747fab36847';
	const salesContractAddress: Address =
		'0xddc7029ce8390cdd6b6c1ff58d4bf4c3f1f88bed';
	const { data: collectionDetails, isLoading: collectionDetailsIsLoading } =
		useCollectionDetails({
			chainId,
			collectionAddress: contractAddress,
		});

	const { data: tokenMetadataList, isLoading: tokenMetadataListLoading } =
		useListTokenMetadata({
			chainId,
			contractAddress,
			tokenIds,
		});

	const { extendedSupplyData, getSupply, supplyDataLoading } =
		useList1155SaleSupplies({
			tokenIds,
			salesContractAddress,
		});

	const { data: paymentCurrencyAddress, isLoading: paymentCurrencyIsLoading } =
		useReadContract({
			address: salesContractAddress,
			abi: ERC1155_SALES_CONTRACT_ABI,
			functionName: 'paymentToken',
		});

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">1155 Shop</Text>
			</div>

			<div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-3 lg:grid-cols-4">
				{tokenIds.map((tokenId) => {
					const tokenMetadata = tokenMetadataList?.find(
						(token) => token.tokenId === tokenId,
					);
					const cardLoading =
						tokenMetadataListLoading ||
						collectionDetailsIsLoading ||
						paymentCurrencyIsLoading;
					const tokenSaleDetails = extendedSupplyData?.find(
						(data) => data.tokenId === tokenId,
					)?.result;
					const salePriceAmount = getSaleCost(tokenSaleDetails);

					if (
						(!supplyDataLoading && salePriceAmount === undefined) ||
						(!paymentCurrencyIsLoading && paymentCurrencyAddress === undefined)
					) {
						console.error(
							'Sale price amount or payment currency address is undefined',
							{
								salePriceAmount,
								paymentCurrencyAddress,
							},
						);
						return null;
					}

					return (
						<ShopCollectibleCard
							chainId={chainId}
							key={tokenId}
							collectionAddress={contractAddress}
							collectibleId={tokenId}
							//@ts-ignore this should probably accept undefined
							tokenMetadata={tokenMetadata}
							salePrice={
								salePriceAmount && paymentCurrencyAddress
									? {
											amount: salePriceAmount,
											currencyAddress: paymentCurrencyAddress as Address,
										}
									: undefined
							}
							cardLoading={cardLoading}
							supply={getSupply(tokenId) ?? 0}
							salesContractAddress={salesContractAddress}
							collectionType={collectionDetails?.contractType}
							quantityDecimals={collectionDetails?.tokenQuantityDecimals}
							quantityRemaining={getSupply(tokenId)?.toString()}
						/>
					);
				})}
			</div>
		</div>
	);
}
