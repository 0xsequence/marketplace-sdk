import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from '@xstate/store/react';
import { useEffect } from 'react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import {
	type AdditionalFee,
	type GenerateSellTransactionArgs,
	getMarketplaceClient,
	MarketplaceKind,
	type Order,
	type OrderData,
	type Step,
	StepType,
} from '../../../../_internal';
import { useConfig } from '../../../../hooks/config/useConfig';
import { useOrderSteps } from '../../../../hooks/transactions/useOrderSteps';
import type { CheckApprovalParams } from '../models/sellTransaction';
import { sellModalStore } from '../store/sellModalStore';

export const sellQueryKeys = {
	all: ['sell'] as const,
	approval: (params: CheckApprovalParams) =>
		[...sellQueryKeys.all, 'approval', params] as const,
	transaction: (orderId: string) =>
		[...sellQueryKeys.all, 'transaction', orderId] as const,
};

function useCheckSellApprovalQuery(params: CheckApprovalParams | null) {
	const config = useConfig();
	const { address } = useAccount();
	const marketplaceClient = getMarketplaceClient(config);

	return useQuery({
		queryKey: sellQueryKeys.approval(params),
		queryFn: async () => {
			if (!params || !address) {
				throw new Error('Missing parameters or wallet');
			}

			const ordersData: OrderData[] = [
				{
					orderId: params.order.orderId,
					tokenId: params.tokenId,
					quantity: params.order.quantityRemaining || '1',
				},
			];

			const args: GenerateSellTransactionArgs = {
				chainId: String(params.chainId),
				collectionAddress: params.collectionAddress,
				seller: address,
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				ordersData,
				additionalFees: [],
			};

			const result = await marketplaceClient.generateSellTransaction(args);

			const approvalStep = result.steps.find(
				(step) => step.id === StepType.tokenApproval,
			);

			return {
				required: !!approvalStep,
				step: approvalStep || null,
			};
		},
		enabled: !!params && !!address,
	});
}

function useExecuteApprovalMutation() {
	const queryClient = useQueryClient();
	const { executeStep } = useOrderSteps();

	return useMutation({
		mutationFn: async (params: { step: Step; chainId: number }) => {
			const txHash = await executeStep({
				step: params.step,
				chainId: params.chainId,
			});
			return { txHash };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: sellQueryKeys.all,
			});

			sellModalStore.send({ type: 'approvalCompleted' });
		},
		onError: (error) => {
			sellModalStore.send({ type: 'errorOccurred', error: error as Error });
		},
	});
}

function useExecuteSellTransactionMutation() {
	const queryClient = useQueryClient();
	const config = useConfig();
	const { address } = useAccount();
	const { executeStep } = useOrderSteps();
	const marketplaceClient = getMarketplaceClient(config);

	return useMutation({
		mutationFn: async (params: {
			chainId: number;
			collectionAddress: Hex;
			tokenId: string;
			order: Order;
			marketplace: MarketplaceKind;
			additionalFees: AdditionalFee[];
		}) => {
			if (!address) {
				throw new Error('Wallet not connected');
			}

			const ordersData: OrderData[] = [
				{
					orderId: params.order.orderId,
					tokenId: params.tokenId,
					quantity: params.order.quantityRemaining || '1',
				},
			];

			const args: GenerateSellTransactionArgs = {
				chainId: String(params.chainId),
				collectionAddress: params.collectionAddress,
				seller: address,
				marketplace: params.marketplace,
				ordersData,
				additionalFees: params.additionalFees,
			};

			const result = await marketplaceClient.generateSellTransaction(args);

			const transactionStep = result.steps.find(
				(step) => step.id !== StepType.tokenApproval,
			);

			if (!transactionStep) {
				throw new Error('No transaction step found');
			}

			const txHash = await executeStep({
				step: transactionStep,
				chainId: params.chainId,
			});

			return {
				hash: txHash as Hex,
				orderId: params.order.orderId,
			};
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['collectibles'],
			});
			queryClient.invalidateQueries({
				queryKey: ['orders'],
			});

			sellModalStore.send({
				type: 'sellCompleted',
				hash: data.hash,
				orderId: data.orderId,
			});
		},
		onError: (error) => {
			sellModalStore.send({ type: 'errorOccurred', error: error as Error });
		},
	});
}


export function useSellFlow() {
	const context = useSelector(sellModalStore, (state) => state.context);
	const { address } = useAccount();

	const approvalParams: CheckApprovalParams | null =
		context.status !== 'idle' &&
		context.order &&
		context.collectionAddress &&
		address
			? {
					chainId: context.chainId!,
					collectionAddress: context.collectionAddress,
					tokenId: context.tokenId!,
					order: context.order,
					walletAddress: address as Hex,
				}
			: null;

	const approvalQuery = useCheckSellApprovalQuery(approvalParams);
	const approvalMutation = useExecuteApprovalMutation();
	const sellMutation = useExecuteSellTransactionMutation();

	useEffect(() => {
		if (
			context.status === 'idle' &&
			context.isOpen &&
			approvalQuery.data !== undefined
		) {
			sellModalStore.send({ type: 'checkApprovalStart' });

			if (approvalQuery.data.required) {
				sellModalStore.send({
					type: 'approvalRequired',
					step: approvalQuery.data.step,
				});
			} else {
				sellModalStore.send({ type: 'approvalNotRequired' });
			}
		}
	}, [context.status, context.isOpen, approvalQuery.data]);

	return {
		approval: {
			isLoading: approvalQuery.isLoading,
			isRequired: approvalQuery.data?.required ?? false,
			step: approvalQuery.data?.step,
			execute: (step: Step) =>
				approvalMutation.mutate({
					step,
					chainId: context.chainId!,
				}),
			isExecuting: approvalMutation.isPending,
		},
		sell: {
			execute: () => {
				if (!context.order || !context.collectionAddress || !context.tokenId) {
					throw new Error('Missing required data for sell transaction');
				}

				sellMutation.mutate({
					chainId: context.chainId!,
					collectionAddress: context.collectionAddress,
					tokenId: context.tokenId,
					order: context.order,
					marketplace: MarketplaceKind.sequence_marketplace_v2,
					additionalFees: [],
				});
			},
			isExecuting: sellMutation.isPending,
		},
	};
}