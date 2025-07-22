'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { type Step, StepType } from '../../_internal';

export interface UseApprovalCheckParams<TArgs> {
	enabled?: boolean;
	generateTransactionArgs: TArgs | null;
	generateTransactionFn: (args: TArgs) => Promise<{ steps: Step[] }>;
	approvalStepType?: StepType;
	queryKey?: unknown[];
}

export function useApprovalCheck<TArgs>({
	enabled = true,
	generateTransactionArgs,
	generateTransactionFn,
	approvalStepType = StepType.tokenApproval,
	queryKey = [],
}: UseApprovalCheckParams<TArgs>) {
	const { address } = useAccount();

	return useQuery({
		queryKey: [
			'approval-check',
			approvalStepType,
			...queryKey,
			generateTransactionArgs,
		],
		queryFn: async () => {
			if (!generateTransactionArgs || !address) {
				throw new Error('Missing parameters');
			}

			const result = await generateTransactionFn(generateTransactionArgs);
			const approvalStep = result.steps.find(
				(step) => step.id === approvalStepType,
			);

			return {
				required: !!approvalStep,
				step: approvalStep || null,
			};
		},
		enabled: enabled && !!generateTransactionArgs && !!address,
		staleTime: 30_000,
		gcTime: 5 * 60_000,
	});
}
