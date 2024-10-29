import {
	type ChainId,
	GenerateListingTransactionArgs,
	StepType,
} from '@internal';
import { OrderbookKind, type ContractType } from '@types';
import { useGenerateListingTransaction } from './useGenerateListingTransaction';
import { useAccount, useSendTransaction } from 'wagmi';
import { useMount } from '@legendapp/state/react';
import { Address } from 'viem';
import { useToast } from '@0xsequence/design-system';
import marketplaceToastMessages from '../consts/toastMessages';

export const PLACEHOLDER_LISTING = {
	tokenId: '1',
	quantity: '1',
	expiry: Date.now().toString(),
	currencyAddress: '0x',
	pricePerToken: '0',
} as GenerateListingTransactionArgs['listing'];

export type UseApproveTokenArgs = {
	chainId: ChainId;
	collectionAddress: string;
	tokenId: string;
	collectionType: ContractType;
};

const useApproveTokenMount = ({
	chainId,
	collectionAddress,
	collectionType,
}: UseApproveTokenArgs) => {
	const { data, generateListingTransactionAsync } =
		useGenerateListingTransaction({
			chainId: chainId,
		});
	const { address: accountAddress } = useAccount();
	const toast = useToast();

	// checks if the token needs to be approved
	useMount(async () => {
		try {
			await generateListingTransactionAsync({
				collectionAddress: collectionAddress,
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
	});

	return {
		data,
	};
};

export const useApproveToken = (params: UseApproveTokenArgs) => {
	const { data } = useApproveTokenMount({
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		collectionType: params.collectionType,
		tokenId: params.tokenId,
	});
	const { generateListingTransactionAsync } = useGenerateListingTransaction({
		chainId: params.chainId,
	});
	const { address: accountAddress } = useAccount();
	const { sendTransactionAsync, isSuccess, isPending } = useSendTransaction();
	const toast = useToast();
	const tokenApprovalCall = data?.steps.find(
		(step) => step.id === StepType.tokenApproval,
	);

	async function handleApproveToken() {
		if (!tokenApprovalCall) return;

		const listing = {
			tokenId: params.tokenId,
			quantity: '1',
			expiry: Date.now().toString(),
			currencyAddress: '0x',
			pricePerToken: '0',
		} as GenerateListingTransactionArgs['listing'];

		try {
			await generateListingTransactionAsync({
				collectionAddress: params.collectionAddress,
				owner: accountAddress!,
				contractType: params.collectionType,
				orderbook: OrderbookKind.sequence_marketplace_v1,
				listing: listing,
			});

			await sendTransactionAsync({
				chainId: Number(params.chainId),
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
	}

	return {
		tokenApprovalNeeded: !!tokenApprovalCall,
		approveToken: handleApproveToken,
		result: {
			isSuccess,
			isPending,
		},
	};
};
