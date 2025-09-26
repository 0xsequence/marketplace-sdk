import { skipToken, useQuery } from '@tanstack/react-query';
import { getSequenceApiClient } from '../../../../_internal';
import { useConfig } from '../../../../hooks';

interface UseTransakContractIdParams {
	chainId: number;
	contractAddress: string;
	enabled?: boolean;
}

export const useTransakContractId = ({
	chainId,
	contractAddress,
	enabled = true,
}: UseTransakContractIdParams) => {
	const config = useConfig();

	return useQuery({
		queryKey: ['transakContractId', chainId, contractAddress],
		queryFn: enabled
			? async () => {
					const sequenceApiClient = getSequenceApiClient(config);
					const response =
						await sequenceApiClient.checkoutOptionsGetTransakContractID({
							chainId,
							contractAddress,
						});

					return response.contractId !== '' ? response.contractId : undefined;
				}
			: skipToken,
		enabled,
	});
};
