import type { Step } from '../../_internal';
import { useProcessStep } from './useProcessStep';

export function useTransactionExecution() {
	const { processStep } = useProcessStep();

	const executeSteps = async (steps: Step[], chainId: number) => {
		const results = [];

		for (const step of steps) {
			try {
				const result = await processStep(step, chainId);
				results.push(result);

				// Handle step-specific logic if needed
				if (result.type === 'transaction' && step.id === 'tokenApproval') {
					// Wait for approval confirmation before proceeding
					// This is handled automatically by processStep
				}
			} catch (error) {
				throw new Error(
					`Failed to execute step ${step.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
				);
			}
		}

		return results;
	};

	return { executeSteps };
}
