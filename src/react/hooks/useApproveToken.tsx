import { ApproveTokenMessageCallbacks, ChainId, StepType } from '@internal';
import { OrderbookKind, ContractType } from '@types';
import {
	GenerateListingTransactionProps,
	useGenerateListingTransaction,
} from './useGenerateListingTransaction';
import { useAccount, useSendTransaction } from 'wagmi';
import { useMount } from '@legendapp/state/react';
import { Address } from 'viem';

const PLACEHOLDER_LISTING: GenerateListingTransactionProps['listing'] = {
	tokenId: '1',
	quantity: '1',
	expiry: new Date(),
	currencyAddress: '0x',
	pricePerToken: '0',
};

interface UseApproveTokenArgs {
	chainId: ChainId;
	collectionAddress: string;
	tokenId: string;
	collectionType: ContractType;
	messages: ApproveTokenMessageCallbacks;
}

const useApproveToken = ({
	chainId,
	collectionAddress,
	tokenId,
	collectionType,
	messages,
}: UseApproveTokenArgs) => {
	const { data, generateListingTransactionAsync } =
		useGenerateListingTransaction({ chainId, onSuccess: undefined });
	const { address: accountAddress } = useAccount();
	const { sendTransactionAsync, isSuccess, isPending } = useSendTransaction();

	const checkApproval = async () => {
		try {
			await generateListingTransactionAsync({
				collectionAddress,
				owner: accountAddress!,
				contractType: collectionType,
				orderbook: OrderbookKind.sequence_marketplace_v1,
				listing: PLACEHOLDER_LISTING,
			});
		} catch (error) {
			messages.onUnknownError?.();
		}
	};

	useMount(checkApproval);

	const tokenApprovalCall = data?.find(
		(step) => step.id === StepType.tokenApproval,
	);

	const handleApproveToken = async () => {
		if (!tokenApprovalCall) return;

		const listing = { ...PLACEHOLDER_LISTING, tokenId };

		try {
			await generateListingTransactionAsync({
				collectionAddress,
				owner: accountAddress!,
				contractType: collectionType,
				orderbook: OrderbookKind.sequence_marketplace_v1,
				listing,
			});

			await sendTransactionAsync({
				chainId: Number(chainId),
				to: tokenApprovalCall.to as Address,
				data: tokenApprovalCall.data as Address,
				value: BigInt(tokenApprovalCall.value) || BigInt(0),
			});
		} catch (error) {
			messages.onUnknownError?.();
		}
	};

	return {
		tokenApprovalNeeded: !!tokenApprovalCall,
		approveToken: handleApproveToken,
		result: { isSuccess, isPending },
	};
};

export { useApproveToken, type UseApproveTokenArgs };
