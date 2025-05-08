import { Text } from '@0xsequence/design-system';
import {
	ShopCollectibleCard,
	useTokenMetadata,
} from '@0xsequence/marketplace-sdk/react';
import { useReadContract } from 'wagmi';
import { ERC1155_SALES_CONTRACT_ABI } from '../../../../sdk/src';

export function Shop() {
	const tokenIds = [1, 2, 3];
	const chainId = 80002;
	const contractAddress = '0x98d2dd98e762492435c731346c799145d4e61e5b';
	const salesContractAddress = '0xddc7029ce8390cdd6b6c1ff58d4bf4c3f1f88bed';
	const supply = 100;

	const { data: tokenMetadata, isLoading: tokenMetadataLoading } =
		useTokenMetadata({
			chainId,
			contractAddress,
			tokenIds,
		});

	// const { data: supplyData } = useReadContract({
	//   address: salesContractAddress,
	//   abi: ERC1155_SALES_CONTRACT_ABI,
	//   functionName: "getSupply",
	//   args: tokenIds,
	// });

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">1155 Shop</Text>
			</div>

			<div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-3 lg:grid-cols-4">
				{tokenIds.map((tokenId) => {
					const token = tokenMetadata?.find(
						(token) => token.tokenId === tokenId.toString(),
					);

					return (
						<ShopCollectibleCard
							chainId={chainId}
							key={tokenId}
							collectionAddress={contractAddress}
							collectibleId={tokenId.toString()}
							//@ts-ignore this should probably accept undefined
							tokenMetadata={token}
							cardLoading={tokenMetadataLoading}
							supply={supply}
							salesContractAddress={salesContractAddress}
						/>
					);
				})}
			</div>
		</div>
	);
}
