import {
	type ChainId,
	GenerateListingTransactionArgs,
	StepType,
} from '@internal';
import { OrderbookKind, type ContractType } from '@types';
import { useGenerateListingTransaction } from './useGenerateListingTransaction';
import { useAccount } from 'wagmi';
import { useMount } from '@legendapp/state/react';

export type UseApproveTokenArgs = {
	chainId: ChainId;
	collectionAddress: string;
	collectionType: ContractType;
};

async function approveToken({ chainId }: { chainId: ChainId }) {
	const { data, generateListingTransaction } = useGenerateListingTransaction({
		chainId: chainId,
	});

	console.log('TOKEN APPROVAL NEEDED', data?.steps, generateListingTransaction);
}

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
	});

	async function handleApproveToken() {
		if (!tokenApprovalNeeded) return;

		await approveToken({
			chainId: params.chainId,
		});
	}

	return {
		tokenApprovalNeeded: tokenApprovalNeeded,
		approveToken: handleApproveToken,
	};
};
