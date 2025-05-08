import { Text } from "@0xsequence/design-system";
import {
  ShopCollectibleCard,
  useTokenMetadata,
} from "@0xsequence/marketplace-sdk/react";
import { getUnixTime } from "date-fns";
import { useReadContract, useReadContracts } from "wagmi";
import { ERC1155_SALES_CONTRACT_ABI } from "../../../../sdk/src";

export function Shop() {
  const tokenIds = [1, 2, 3, 10];
  const chainId = 80002;
  const contractAddress = "0x98d2dd98e762492435c731346c799145d4e61e5b";
  const salesContractAddress = "0xddc7029ce8390cdd6b6c1ff58d4bf4c3f1f88bed";

  const { data: tokenMetadata, isLoading: tokenMetadataLoading } =
    useTokenMetadata({
      chainId,
      contractAddress,
      tokenIds,
    });

  const getReadContractsArgs = (tokenIds: number[]) => {
    return tokenIds.map(
      (tokenId) =>
        ({
          address: salesContractAddress,
          abi: ERC1155_SALES_CONTRACT_ABI,
          functionName: "tokenSaleDetails",
          args: [tokenId],
        } as const)
    );
  };

  const {
    data: supplyData,
    isLoading: supplyDataLoading,
    error: supplyDataError,
  } = useReadContracts({
    batchSize: 50_0000, // Node gateway limit
    contracts: getReadContractsArgs(tokenIds),
  });

  type result = {
    cost: bigint;
    endTime: bigint;
    merkleRoot: `0x${string}`;
    startTime: bigint;
    supplyCap: bigint;
  };

  const extendedSupplyData = supplyData
    ?.map((data, index) => {
      const tokenId = tokenIds[index];
      return {
        ...data,
        tokenId,
      };
    })
    .map((data) => {
      const result = data.result as result;
      return {
        ...data,
        result,
      };
    })
    .filter((data) => data.status === "success")
    .filter((data) => {
      const now = getUnixTime(new Date());
      return data.result.endTime > now && data.result.startTime < now;
    });

  const getSupply = (tokenId: number) => {
    const supply = extendedSupplyData?.find((data) => data.tokenId === tokenId)
      ?.result.supplyCap;
    // https://github.com/0xsequence/contracts-library/blob/ead1baf34270c76260d01cfc130bb7cc9d57518e/src/tokens/ERC1155/utility/sale/IERC1155Sale.sol#L8
    if (supply === 0n) {
      return Number.POSITIVE_INFINITY;
    }
    if (supply === undefined) {
      return undefined;
    }
    return Number(supply);
  };

  const { data: paymentToken } = useReadContract({
    address: salesContractAddress,
    abi: ERC1155_SALES_CONTRACT_ABI,
    functionName: "paymentToken",
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
            (token) => token.tokenId === tokenId.toString()
          );

          return (
            <ShopCollectibleCard
              chainId={chainId}
              key={tokenId}
              collectionAddress={contractAddress}
              collectibleId={tokenId.toString()}
              //@ts-ignore this should probably accept undefined
              tokenMetadata={token}
              salePrice={{
                amount: "1000000000000000000",
                currencyAddress: "0x",
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
