import { Text } from '@0xsequence/design-system';
import {
	ShopCollectibleCard,
	useCollection,
	useListTokenMetadata,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	type ContractType,
	ERC1155_SALES_CONTRACT_ABI,
} from '../../../../sdk/src';
import { useList1155SaleSupplies } from '../../../../sdk/src/react/hooks/useList1155SaleSupplies';

export function Shop() {
	const tokenIds = ['1', '2', '3', '10'];
	const chainId = 80002;
	const contractAddress: Address = '0x6838956422070bd85aa0c422b0ae33e4fde0f5dc';
	const salesContractAddress: Address =
		'0x078839fabe130418ea6bc4c0f915ff6800994888';

	const { data: tokenMetadata, isLoading: tokenMetadataLoading } =
		useListTokenMetadata({
			chainId,
			contractAddress,
			tokenIds,
		});
	const { data: collection } = useCollection({
		chainId,
		collectionAddress: contractAddress,
	});

	const { extendedSupplyData, getSupply } = useList1155SaleSupplies({
		tokenIds,
		salesContractAddress,
	});

	const { data: paymentToken } = useReadContract({
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'paymentToken',
	});

	console.log(paymentToken);

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">1155 Shop</Text>
			</div>

			<div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-3 lg:grid-cols-4">
				{tokenIds.map((tokenId) => {
					const token = tokenMetadata?.find(
						(token) => token.tokenId === tokenId,
					);

					return (
						<ShopCollectibleCard
							chainId={chainId}
							key={tokenId}
							collectionAddress={contractAddress}
							collectibleId={tokenId}
							//@ts-ignore this should probably accept undefined
							tokenMetadata={token}
							salePrice={{
								amount: extendedSupplyData?.find(
									(data) => data.tokenId === tokenId,
								)?.result.cost,
								currencyAddress: paymentToken ?? '0x',
							}}
							cardLoading={tokenMetadataLoading}
							supply={getSupply(tokenId) ?? undefined}
							salesContractAddress={salesContractAddress}
							collectionType={collection?.type as ContractType}
						/>
					);
				})}
			</div>
		</div>
	);
}
