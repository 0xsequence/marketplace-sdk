import { useListTokenMetadata } from "@0xsequence/marketplace-sdk/react";
import type { Address, Hex } from "viem";
import { useReadContract } from "wagmi";
import { ERC1155_SALES_CONTRACT_ABI } from "../../../../sdk/src";
import { useList1155SaleSupplies } from "../../../../sdk/src/react/hooks/useList1155SaleSupplies";
import {
  ContractType,
  TokenMetadata,
} from "../../../../sdk/src/react/_internal/api/marketplace.gen";
import { ShopCardProps } from "../../../../sdk/src/react/ui/components/collectible-card/types";

interface UseListShopCardDataProps {
  tokenIds: string[];
  chainId: number;
  contractAddress: Address;
  salesContractAddress: Address;
}

export function useListShopCardData({
  tokenIds,
  chainId,
  contractAddress,
  salesContractAddress,
}: UseListShopCardDataProps) {
  const {
    data: tokenMetadata,
    isLoading: tokenMetadataLoading,
    error: tokenMetadataError,
  } = useListTokenMetadata({
    chainId,
    contractAddress,
    tokenIds,
  });

  const { extendedSupplyData, getSupply, supplyDataLoading, supplyDataError } =
    useList1155SaleSupplies({
      tokenIds,
      salesContractAddress,
    });

  const { data: paymentToken } = useReadContract({
    address: salesContractAddress,
    abi: ERC1155_SALES_CONTRACT_ABI,
    functionName: "paymentToken",
  });

  const collectibleCards = tokenIds.map((tokenId) => {
    const token = tokenMetadata?.find((token) => token.tokenId === tokenId);

    const saleData = extendedSupplyData?.find(
      (data) => data.tokenId === tokenId
    );

    const cost =
      saleData && typeof saleData.result === "object"
        ? saleData.result.cost?.toString() || ""
        : "";

    return {
      collectibleId: tokenId,
      chainId,
      collectionAddress: contractAddress,
      collectionType: ContractType.ERC1155,
      tokenMetadata: token as TokenMetadata,
      cardLoading: supplyDataLoading || tokenMetadataLoading,
      supply: getSupply(tokenId) ?? 0,
      salesContractAddress,
      salePrice: {
        amount: cost,
        currencyAddress: paymentToken ?? "0x",
      },
    } satisfies ShopCardProps;
  });

  return {
    collectibleCards,
    tokenMetadataError,
    supplyDataError,
  };
}
