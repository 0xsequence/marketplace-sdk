import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import type { SdkConfig } from "../../types";
import {
  type ChainId,
  ChainIdSchema,
  type GenerateBuyTransactionArgs,
  getMarketplaceClient,
} from "../_internal";
import { stepSchema } from "../_internal/api/zod-schema";
import { useConfig } from "./useConfig";

const UserGeneratBuyTransactionArgsSchema = z.object({
  chainId: ChainIdSchema.pipe(z.coerce.string()),
  onSuccess: z.function().args(stepSchema.array().optional()).optional(),
});

type UseGenerateBuyTransactionArgs = z.infer<
  typeof UserGeneratBuyTransactionArgsSchema
>;

export const generateBuyTransaction = async (
  args: GenerateBuyTransactionArgs,
  config: SdkConfig,
  chainId: ChainId
) => {
  const parsedChainId = ChainIdSchema.pipe(z.coerce.string()).parse(chainId);
  const marketplaceClient = getMarketplaceClient(parsedChainId, config);
  return marketplaceClient
    .generateBuyTransaction(args)
    .then((data) => data.steps);
};

export const useGenerateBuyTransaction = (
  params: UseGenerateBuyTransactionArgs
) => {
  const config = useConfig();

  const { mutate, mutateAsync, ...result } = useMutation({
    onSuccess: params.onSuccess,
    mutationFn: (args: GenerateBuyTransactionArgs) =>
      generateBuyTransaction(args, config, params.chainId),
  });

  return {
    ...result,
    generateBuyTransaction: mutate,
    generateBuyTransactionAsync: mutateAsync,
  };
};
