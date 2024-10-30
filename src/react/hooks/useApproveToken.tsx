import { ChainId, GenerateListingTransactionArgs, StepType } from '@internal';
import { OrderbookKind, ContractType } from '@types';
import { useGenerateListingTransaction } from './useGenerateListingTransaction';
import { useAccount, useSendTransaction } from 'wagmi';
import { useMount } from '@legendapp/state/react';
import { Address } from 'viem';
import { useToast } from '@0xsequence/design-system';
import marketplaceToastMessages from '../consts/toastMessages';

const PLACEHOLDER_LISTING: GenerateListingTransactionArgs['listing'] = {
	tokenId: '1',
	quantity: '1',
	expiry: Date.now().toString(),
	currencyAddress: '0x',
	pricePerToken: '0',
};

interface UseApproveTokenArgs {
	chainId: ChainId;
	collectionAddress: string;
	tokenId: string;
	collectionType: ContractType;
}

const useApproveToken = ({
	chainId,
	collectionAddress,
	tokenId,
	collectionType,
}: UseApproveTokenArgs) => {
	const { data, generateListingTransactionAsync } =
		useGenerateListingTransaction({ chainId });
	const { address: accountAddress } = useAccount();
	const { sendTransactionAsync, isSuccess, isPending } = useSendTransaction();
	const toast = useToast();

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
			toast({
				title: marketplaceToastMessages.tokenApproval.unkownError.title,
				description:
					marketplaceToastMessages.tokenApproval.unkownError.description,
				variant: 'error',
			});
		}
	};

	useMount(checkApproval);

	const tokenApprovalCall = data?.steps.find(
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
			toast({
				title: marketplaceToastMessages.tokenApproval.unkownError.title,
				description:
					marketplaceToastMessages.tokenApproval.unkownError.description,
				variant: 'error',
			});
		}
	};

	return {
		tokenApprovalNeeded: !!tokenApprovalCall,
		approveToken: handleApproveToken,
		result: { isSuccess, isPending },
	};
};

export { useApproveToken, type UseApproveTokenArgs };
