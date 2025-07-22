'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Step } from '../../_internal';
import { useOrderSteps } from './useOrderSteps';

export interface UseTransactionExecutionOptions {
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
	invalidateQueries?: string[][];
}

export function useTransactionExecution(
	options: UseTransactionExecutionOptions = {},
) {
	const queryClient = useQueryClient();
	const { executeStep } = useOrderSteps();

	return useMutation({
		mutationFn: async ({ step, chainId }: { step: Step; chainId: number }) => {
			const txHash = await executeStep({ step, chainId });
			return { txHash, step };
		},
		onSuccess: (data) => {
			// Invalidate specified queries
			options.invalidateQueries?.forEach((queryKey) => {
				queryClient.invalidateQueries({ queryKey });
			});

			options.onSuccess?.(data);
		},
		onError: (error) => {
			options.onError?.(error as Error);
		},
	});
}
