import type { QueryClient } from "@tanstack/react-query";
import type { SdkConfig } from "../../../types";
import { highestOfferOptions } from "../../queries/highestOffer";
import type {
  UseHighestOfferArgs,
  BigIntOrder,
} from "../../queries/highestOffer";

/**
 * Fetches highest offer data during server-side rendering
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @param queryClient - The React Query client
 * @returns The fetched data
 */
export const fetchHighestOfferSSR = async (
  args: UseHighestOfferArgs,
  config: SdkConfig,
  queryClient: QueryClient
): Promise<BigIntOrder | null> => {
  const options = highestOfferOptions(args, config);
  return (await queryClient.fetchQuery(options)) as BigIntOrder | null;
};
