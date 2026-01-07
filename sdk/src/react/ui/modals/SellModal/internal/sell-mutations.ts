import {
	type ContractType,
	OrderbookKind,
	type Step,
} from '@0xsequence/api-client';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Address, Hex } from 'viem';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { getConduitAddressForOrderbook } from '../../../../../utils/getConduitAddressForOrderbook';
import { TransactionType } from '../../../../_internal';
import { useAnalytics } from '../../../../_internal/databeat';
import {
	useConfig,
	useConnectorMetadata,
	useCurrency,
	useProcessStep,
} from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { useCollectibleApproval } from '../../CreateListingModal/internal/hooks';
import { useSellModalState } from './store';
import type { useGenerateSellTransaction } from './use-generate-sell-transaction';

/**
 * Result type from processStep mutation
 */
export type ProcessStepResult =
	| { type: 'transaction'; hash: Hex }
	| { type: 'signature'; orderId?: string; signature?: Hex };

type UseSellMutationsArgs = {
	tx: ReturnType<typeof useGenerateSellTransaction>['data'];
	collectionAddress: Address;
	chainId: number;
	contractType: ContractType;
	orderbookKind: OrderbookKind;
	nftApprovalEnabled: boolean;
};

export const useSellMutations = ({
	tx,
	collectionAddress,
	chainId,
	contractType,
	orderbookKind,
	nftApprovalEnabled,
}: UseSellMutationsArgs) => {
	const sdkConfig = useConfig();
	const { show: showTxModal } = useTransactionStatusModal();
	const analytics = useAnalytics();
	const state = useSellModalState();
	const { isSequence } = useConnectorMetadata();
	const canBeBundled =
		isSequence && orderbookKind === OrderbookKind.sequence_marketplace_v2;
	const { processStep } = useProcessStep();
	const { address: ownerAddress } = useAccount();
	const { data: currency } = useCurrency({
		chainId: state.chainId,
		currencyAddress: state.currencyAddress,
	});

	async function executeStepAndWait(step: Step) {
		const res = await processStep(step, state.chainId);
		if (res.type === 'transaction' && res.hash) {
			await waitForTransactionReceipt({
				txHash: res.hash,
				chainId: state.chainId,
				sdkConfig,
			});
		}
		return res;
	}
	const spenderAddress = getConduitAddressForOrderbook(orderbookKind);

	const collectibleApprovalQuery = useCollectibleApproval({
		collectionAddress,
		spenderAddress,
		chainId,
		contractType,
		enabled:
			nftApprovalEnabled &&
			!canBeBundled &&
			!!ownerAddress &&
			!!contractType &&
			!!orderbookKind &&
			!!spenderAddress,
	});

	const needsApproval = useMemo(() => {
		if (canBeBundled) return false;
		if (collectibleApprovalQuery.isApproved === undefined) return true;

		return !collectibleApprovalQuery.isApproved;
	}, [collectibleApprovalQuery.isApproved, canBeBundled]);

	const approve = useMutation<ProcessStepResult, Error, void>({
		mutationFn: async () => {
			if (!tx?.approveStep) throw new Error('No approval step available');
			return await executeStepAndWait(tx.approveStep);
		},
	});

	const sell = useMutation<ProcessStepResult, Error, void>({
		mutationFn: async () => {
			if (!tx?.sellStep) throw new Error('No sell step available');
			const res = await executeStepAndWait(tx.sellStep);

			if (currency && state.order?.priceAmount) {
				const dec = currency.decimals ?? 0;
				const raw = state.order.priceAmount;
				const currencyValueDecimal = Number(formatUnits(BigInt(raw), dec));

				analytics.trackSellItems({
					props: {
						marketplaceKind: state.order.marketplace,
						userId: ownerAddress || '',
						collectionAddress: state.collectionAddress,
						currencyAddress: currency.contractAddress,
						currencySymbol: currency.symbol || '',
						requestId: state.order.orderId,
						tokenId: state.tokenId.toString(),
						chainId: state.chainId.toString(),
						txnHash: res.type === 'transaction' ? res.hash : '',
					},
					nums: {
						currencyValueDecimal,
						currencyValueRaw: Number(raw),
					},
				});
			}

			return res;
		},
		onSuccess: (res) => {
			state.closeModal();
			showTxModal({
				type: TransactionType.SELL,
				chainId: state.chainId,
				hash: res?.type === 'transaction' ? res.hash : undefined,
				orderId: res?.type === 'signature' ? res.orderId : undefined,
				queriesToInvalidate: [
					['collectible', 'market-highest-offer'],
					['collectible', 'market-offers'],
					['collectible', 'market-offers-count'],
					['token', 'balances'],
					['collection', 'balance-details'],
				],
				collectionAddress: state.collectionAddress,
				tokenId: state.tokenId,
			});
		},
	});

	return {
		approve,
		sell,
		needsApproval,
		collectibleApprovalQuery,
	};
};
