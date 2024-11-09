import {
  type ChainId,
  type GenerateOfferTransactionArgs,
  getMarketplaceClient,
} from "@internal";
import { useMutation } from "@tanstack/react-query";
import type { SdkConfig, Step } from "@types";
import { useConfig } from "./useConfig";

export type UseGenerateOfferTransactionArgs = {
  chainId: ChainId;
  onSuccess?: (data?: Step[]) => void;
};

import type { CreateReq } from "@types";

type CreateReqWithDateExpiry = Omit<CreateReq, "expiry"> & {
  expiry: Date;
};

export type GenerateOfferTransactionProps = Omit<
  GenerateOfferTransactionArgs,
  "offer"
> & {
  offer: CreateReqWithDateExpiry;
};

const dateToUnixTime = (date: Date) =>
  Math.floor(date.getTime() / 1000).toString();

export const generateOfferTransaction = async (
  params: GenerateOfferTransactionProps,
  config: SdkConfig,
  chainId: ChainId
) => {
  const args = {
    ...params,
    offer: { ...params.offer, expiry: dateToUnixTime(params.offer.expiry) },
  } satisfies GenerateOfferTransactionArgs;
  const marketplaceClient = getMarketplaceClient(chainId, config);
  return (await marketplaceClient.generateOfferTransaction(args)).steps;
};

export const useGenerateOfferTransaction = (
  params: UseGenerateOfferTransactionArgs
) => {
  const config = useConfig();

  const { mutate, mutateAsync, ...result } = useMutation({
    onSuccess: params.onSuccess,
    mutationFn: (args: GenerateOfferTransactionProps) =>
      generateOfferTransaction(args, config, params.chainId),
  });

  return {
    ...result,
    generateOfferTransaction: mutate,
    generateOfferTransactionAsync: mutateAsync,
  };
};
