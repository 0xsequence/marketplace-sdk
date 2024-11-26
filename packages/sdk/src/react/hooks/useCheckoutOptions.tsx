import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { SdkConfig } from "../../types";
import {
  AddressSchema,
  ChainIdSchema,
  MarketplaceKind,
  QueryArgSchema,
  getMarketplaceClient,
} from "../_internal";
import { useConfig } from "./useConfig";
import { useAccount } from "wagmi";
import type { Hex } from "viem";

const UseCheckoutOptionsSchema = z.object({
  chainId: ChainIdSchema.pipe(z.coerce.string()),
  orders: z.array(
    z.object({
      collectionAddress: AddressSchema,
      orderId: z.string(),
      marketplace: z.nativeEnum(MarketplaceKind),
    })
  ),
  query: QueryArgSchema,
});

export type UseCheckoutOptionsArgs = z.infer<typeof UseCheckoutOptionsSchema>;

export type UseCheckoutOptionsReturn = Awaited<
  ReturnType<typeof fetchCheckoutOptions>
>;

const fetchCheckoutOptions = async (
  args: UseCheckoutOptionsArgs & { walletAddress: Hex },
  config: SdkConfig
) => {
  const marketplaceClient = getMarketplaceClient(args.chainId, config);
  return marketplaceClient.checkoutOptionsMarketplace({
    wallet: args.walletAddress,
    orders: args.orders.map((order) => ({
      contractAddress: order.collectionAddress,
      orderId: order.orderId,
      marketplace: order.marketplace,
    })),
    additionalFee: 0, //TODO: add additional fee
  });
};

export const checkoutOptionsOptions = (
  args: UseCheckoutOptionsArgs & { walletAddress: Hex },
  config: SdkConfig
) => {
  return queryOptions({
    queryKey: ["checkoutOptions", args],
    queryFn: () => fetchCheckoutOptions(args, config),
  });
};

export const useCheckoutOptions = (args: UseCheckoutOptionsArgs) => {
  const { address } = useAccount();
  const config = useConfig();
  return useQuery(
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    checkoutOptionsOptions({ walletAddress: address!, ...args }, config)
  );
};
