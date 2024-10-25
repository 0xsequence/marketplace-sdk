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
	const { data, generateListingTransaction } = useGenerateListingTransaction({
		chainId: chainId,
	});
	const { address: accountAddress } = useAccount();
	const placeholderListing = {
		tokenId: '1',
		quantity: '1',
		expiry: Date.now().toString(),
		currencyAddress: '0x',
		pricePerToken: '0',
	} as GenerateListingTransactionArgs['listing'];

	useMount(async () => {
		generateListingTransaction({
			collectionAddress: collectionAddress,
			owner: accountAddress!,
			contractType: collectionType,
			orderbook: OrderbookKind.sequence_marketplace_v1,
			listing: placeholderListing,
		});
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
	const { sendTransaction, isSuccess, isPending } = useSendTransaction();
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

			sendTransaction({
				chainId: Number(params.chainId),
				to: tokenApprovalCall.to as Address,
				data: tokenApprovalCall.data as Address,
				value: BigInt(tokenApprovalCall.value) || BigInt(0),
			});
		} catch (error) {
			toast({
				title: 'Error while approving token',
				description: 'An error occurred while approving the token',
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
