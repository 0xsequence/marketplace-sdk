import { skipToken, useQuery } from "@tanstack/react-query";
import type { PublicClient } from "viem";

import {
	SequenceMarketplaceV1_ABI,
	SequenceMarketplaceV2_ABI,
} from "../../../utils/abi/marketplace";
import { usePublicClient } from "wagmi";
import {
	getSequenceMarketAddress,
	SequenceMarketplaceKind,
} from "../../_internal/utils";

export type UseValidateSequenceMarketOrderParams = {
	chainId: number;
	marketplace: SequenceMarketplaceKind;
	orderId: string;
	quantity: number;
	enabled?: boolean;
};

function getABI(marketplace: SequenceMarketplaceKind) {
	if (marketplace === "sequence_marketplace_v1") {
		return SequenceMarketplaceV1_ABI;
	}
	if (marketplace === "sequence_marketplace_v2") {
		return SequenceMarketplaceV2_ABI;
	}
	throw new Error(`Unsupported marketplace: ${marketplace}`);
}

const isRequestValid = async ({
	marketplace,
	orderId,
	quantity,
	publicClient,
}: UseValidateSequenceMarketOrderParams & { publicClient: PublicClient }) => {
	const contractAddress = getSequenceMarketAddress(marketplace);
	const abi = getABI(marketplace);

	const [isValid, request] = await publicClient.readContract({
		address: contractAddress,
		abi: abi,
		functionName: "isRequestValid",
		args: [BigInt(orderId), BigInt(quantity)],
	});

	return { isValid, request };
};

export const useValidateSequenceMarketOrder = ({
	chainId,
	marketplace,
	orderId,
	quantity,
	enabled,
}: UseValidateSequenceMarketOrderParams) => {
	const publicClient = usePublicClient({
		chainId,
	});

	return useQuery({
		queryKey: [
			"validateSequenceMarketOrder",
			chainId,
			marketplace,
			orderId,
			quantity,
		],
		queryFn: () =>
			publicClient
				? isRequestValid({
						chainId,
						marketplace,
						orderId,
						quantity,
						publicClient,
					})
				: skipToken,
		enabled: enabled && !!publicClient,
	});
};
