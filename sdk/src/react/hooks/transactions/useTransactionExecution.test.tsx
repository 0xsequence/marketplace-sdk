import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Step } from '../../_internal';
import { useProcessStep } from './useProcessStep';
import { useTransactionExecution } from './useTransactionExecution';

// Mock dependencies
vi.mock('./useProcessStep');

describe('useTransactionExecution', () => {
	const mockProcessStep = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(useProcessStep).mockReturnValue({
			processStep: mockProcessStep,
		});
	});

	it('should execute steps in order and return results', async () => {
		const steps: Step[] = [
			{
				id: 'step1',
				type: 'transaction',
				to: '0x1',
				data: '0x',
				value: '0',
			} as any,
			{
				id: 'step2',
				type: 'transaction',
				to: '0x2',
				data: '0x',
				value: '0',
			} as any,
		];
		const chainId = 1;

		// Mock successful execution
		mockProcessStep
			.mockResolvedValueOnce({ type: 'transaction', hash: '0xhash1' })
			.mockResolvedValueOnce({ type: 'transaction', hash: '0xhash2' });

		const { result } = renderHook(() => useTransactionExecution());

		const executionPromise = result.current.executeSteps(steps, chainId);

		await expect(executionPromise).resolves.toEqual([
			{ type: 'transaction', hash: '0xhash1' },
			{ type: 'transaction', hash: '0xhash2' },
		]);

		expect(mockProcessStep).toHaveBeenCalledTimes(2);
		expect(mockProcessStep).toHaveBeenNthCalledWith(1, steps[0], chainId);
		expect(mockProcessStep).toHaveBeenNthCalledWith(2, steps[1], chainId);
	});

	it('should stop and throw if a step fails', async () => {
		const steps: Step[] = [
			{ id: 'step1', type: 'transaction' } as any,
			{ id: 'step2', type: 'transaction' } as any,
		];
		const chainId = 1;

		// First step succeeds, second fails
		mockProcessStep
			.mockResolvedValueOnce({ type: 'transaction', hash: '0xhash1' })
			.mockRejectedValueOnce(new Error('Step execution failed'));

		const { result } = renderHook(() => useTransactionExecution());

		await expect(result.current.executeSteps(steps, chainId)).rejects.toThrow(
			'Failed to execute step step2: Step execution failed',
		);

		expect(mockProcessStep).toHaveBeenCalledTimes(2);
	});

	it('should handle different result types', async () => {
		const steps: Step[] = [
			{ id: 'step1', type: 'transaction' } as any,
			{ id: 'sign1', type: 'signature' } as any, // implicitly EIP-191 or 712 in real usage
		];
		const chainId = 137;

		mockProcessStep
			.mockResolvedValueOnce({ type: 'transaction', hash: '0xhash1' })
			.mockResolvedValueOnce({ type: 'signature', signature: '0xsig' });

		const { result } = renderHook(() => useTransactionExecution());

		const output = await result.current.executeSteps(steps, chainId);

		expect(output).toEqual([
			{ type: 'transaction', hash: '0xhash1' },
			{ type: 'signature', signature: '0xsig' },
		]);
	});
});
