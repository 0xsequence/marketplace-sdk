import { useMutation } from '@tanstack/react-query';
import type { Step } from '../../../../_internal';
import { useConfig, useProcessStep } from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils';
import { useSellModalState } from './store';
import type { useGenerateSellTransaction } from './use-generate-sell-transaction';

export const useSellMutations = (
	tx: ReturnType<typeof useGenerateSellTransaction>['data'],
) => {
	const sdkConfig = useConfig();
	const state = useSellModalState();
	const { processStep } = useProcessStep();

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

	const approve = useMutation({
		mutationFn: async () => {
			if (!tx?.approveStep) throw new Error('No approval step available');
			return await executeStepAndWait(tx.approveStep);
		},
		onError: (e) => state.callbacks?.onError?.(e as Error),
	});

	return {
		approve,
		sell: null as any, // Placeholder for next commit
	};
};
