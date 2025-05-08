import { Text } from '@0xsequence/design-system';
import {
	ShopCollectibleCard,
	useListTokenMetadata,
} from '@0xsequence/marketplace-sdk/react';
import { Abi, type Address, Hex } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';
import { ERC1155_SALES_CONTRACT_ABI } from '../../../../sdk/src';

export function Shop() {
	const tokenIds = ['1', '2', '3', '10'];
	const chainId = 80002;
	const contractAddress: Address = '0x98d2dd98e762492435c731346c799145d4e61e5b';
	const salesContractAddress: Address =
		'0xddc7029ce8390cdd6b6c1ff58d4bf4c3f1f88bed';

	const { data: tokenMetadata, isLoading: tokenMetadataLoading } =
		useListTokenMetadata({
			chainId,
			contractAddress,
			tokenIds,
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
								amount: 
								currencyAddress: paymentToken ?? '0x',
							}}
							cardLoading={tokenMetadataLoading}
							supply={getSupply(tokenId) ?? 0}
							salesContractAddress={salesContractAddress}
						/>
					);
				})}
			</div>
		</div>
	);
}
