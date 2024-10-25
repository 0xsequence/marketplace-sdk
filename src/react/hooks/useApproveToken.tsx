import {
	type ChainId,
	GenerateListingTransactionArgs,
	StepType,
} from '@internal';
import { OrderbookKind, type ContractType } from '@types';
import { useGenerateListingTransaction } from './useGenerateListingTransaction';
import { useAccount, useCall } from 'wagmi';
import { useMount } from '@legendapp/state/react';
import { Address } from 'viem';

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

	const tokenApprovalNeeded = data?.steps.some(
		(step) => (step.id as StepType) === StepType.tokenApproval,
	);

	return {
		tokenApprovalNeeded: tokenApprovalNeeded,
	};
};

export const useApproveToken = (params: UseApproveTokenArgs) => {
	const { tokenApprovalNeeded } = useApproveTokenMount({
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		collectionType: params.collectionType,
		tokenId: params.tokenId,
	});
	const { data, generateListingTransactionAsync } =
		useGenerateListingTransaction({
			chainId: params.chainId,
		});
	const { address: accountAddress } = useAccount();
	const tokenApprovalCall = data?.steps.find(
		(step) => (step.id as StepType) === StepType.tokenApproval,
	);
	const approveResult = useCall({
		account: accountAddress,
		data: tokenApprovalCall?.data as Address,
		to: tokenApprovalCall?.to as Address,
	});

	async function handleApproveToken() {
		if (!tokenApprovalNeeded) return;

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
		} catch (error) {
			console.error(error);
		}
	}

	return {
		tokenApprovalNeeded,
		approveToken: handleApproveToken,
		approveResult,
	};
};
