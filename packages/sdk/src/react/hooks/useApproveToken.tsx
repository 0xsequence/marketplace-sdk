import { useToast } from '@0xsequence/design-system';
import { type ChainId, StepType } from '@internal';
import { useMount } from '@legendapp/state/react';
import { type ContractType, OrderbookKind } from '@types';
import type { Address } from 'viem';
import { useAccount, useSendTransaction } from 'wagmi';
import marketplaceToastMessages from '../consts/toastMessages';
import {
	type CreateReqWithDateExpiry,
	useGenerateListingTransaction,
} from './useGenerateListingTransaction';

const PLACEHOLDER_LISTING = {
	tokenId: '1',
	quantity: '1',
	expiry: new Date(),
	currencyAddress: '0x',
	pricePerToken: '0',
} satisfies CreateReqWithDateExpiry;

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
