import { renderHook } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSendTransaction, useSignMessage, useSignTypedData } from 'wagmi';
import {
	ExecuteType,
	type SignatureStep,
	StepType,
	type TransactionStep,
} from '../../_internal';
import { useProcessStep } from './useProcessStep';

vi.mock('wagmi', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		// @ts-expect-error - ignore spread type error
		...actual,
		useSendTransaction: vi.fn(),
		useSignMessage: vi.fn(),
		useSignTypedData: vi.fn(),
	};
});

vi.mock('../../_internal/api', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		// @ts-expect-error - ignore spread type error
		...actual,
		getMarketplaceClient: vi.fn(() => ({
			execute: vi.fn(),
		})),
	};
});

describe('useProcessStep', () => {
	const mockSendTransactionAsync = vi.fn();
	const mockSignMessageAsync = vi.fn();
	const mockSignTypedDataAsync = vi.fn();
	const mockExecute = vi.fn();

	beforeEach(async () => {
		vi.clearAllMocks();

		vi.mocked(useSendTransaction).mockReturnValue({
			sendTransactionAsync: mockSendTransactionAsync,
		} as any);

		vi.mocked(useSignMessage).mockReturnValue({
			signMessageAsync: mockSignMessageAsync,
		} as any);

		vi.mocked(useSignTypedData).mockReturnValue({
			signTypedDataAsync: mockSignTypedDataAsync,
		} as any);

		const api = await import('../../_internal/api');
		vi.mocked(api.getMarketplaceClient).mockReturnValue({
			execute: mockExecute,
		} as any);
	});

	describe('transaction steps', () => {
		it('should process a buy transaction step', async () => {
			const mockHash = '0x123abc';
			mockSendTransactionAsync.mockResolvedValue(mockHash);

			const { result } = renderHook(() => useProcessStep());

			const step = {
				id: StepType.buy,
				to: '0x123',
				data: '0xabc',
				value: 0n,
				price: 0n,
			} as TransactionStep;

			const response = await result.current.processStep(step, 1);

			expect(response).toEqual({ type: 'transaction', hash: mockHash });
			expect(mockSendTransactionAsync).toHaveBeenCalledWith({
				chainId: 1,
				to: '0x123',
				data: '0xabc',
				value: 0n,
			});
		});

		it('should process a token approval step', async () => {
			const mockHash = '0x456def';
			mockSendTransactionAsync.mockResolvedValue(mockHash);

			const { result } = renderHook(() => useProcessStep());

			const step = {
				id: StepType.tokenApproval,
				to: '0x456',
				data: '0xdef',
				value: 0n,
				price: 0n,
			} as TransactionStep;

			const response = await result.current.processStep(step, 1);

			expect(response).toEqual({ type: 'transaction', hash: mockHash });
		});
	});

	describe('signature steps', () => {
		it('should process EIP191 signature with API call', async () => {
			const mockSignature = '0xsignature191';
			const mockOrderId = 'order-123';
			mockSignMessageAsync.mockResolvedValue(mockSignature);
			mockExecute.mockResolvedValue({ orderId: mockOrderId });

			const { result } = renderHook(() => useProcessStep());

			const step = {
				id: StepType.signEIP191,
				data: 'Sign this message',
				to: '0x0',
				value: 0n,
				price: 0n,
				post: {
					endpoint: '/api/order',
					method: 'POST',
					body: { test: 'data' },
				},
			} as SignatureStep;

			const response = await result.current.processStep(step, 1);

			expect(response).toEqual({ type: 'signature', orderId: mockOrderId });
			expect(mockSignMessageAsync).toHaveBeenCalledWith({
				message: 'Sign this message',
			});
			expect(mockExecute).toHaveBeenCalledWith({
				params: {
					chainId: '1',
					signature: mockSignature,
					method: 'POST',
					endpoint: '/api/order',
					body: { test: 'data' },
					executeType: ExecuteType.order,
				},
			});
		});

		it('should process EIP712 signature with API call', async () => {
			const mockSignature = '0xsignature712';
			const mockOrderId = 'order-456';
			mockSignTypedDataAsync.mockResolvedValue(mockSignature);
			mockExecute.mockResolvedValue({ orderId: mockOrderId });

			const { result } = renderHook(() => useProcessStep());

			const step = {
				id: StepType.signEIP712,
				data: '0x0',
				to: '0x0',
				value: 0n,
				price: 0n,
				signature: {
					domain: {
						name: 'Test',
						version: '1',
						chainId: 1,
						verifyingContract: '0x0000000000000000000000000000000000000000',
					},
					types: { Test: [{ name: 'data', type: 'string' }] },
					primaryType: 'Test',
					value: { data: 'test' },
				},
				post: {
					endpoint: '/api/order',
					method: 'POST',
					body: { test: 'data' },
				},
			} as SignatureStep;

			const response = await result.current.processStep(step, 1);

			expect(response).toEqual({ type: 'signature', orderId: mockOrderId });
			expect(mockSignTypedDataAsync).toHaveBeenCalledWith({
				domain: {
					name: 'Test',
					version: '1',
					chainId: 1,
					verifyingContract: '0x0000000000000000000000000000000000000000',
				},
				types: { Test: [{ name: 'data', type: 'string' }] },
				primaryType: 'Test',
				message: { data: 'test' },
			});
		});

		it('should handle signature step with valid post', async () => {
			const mockSignature = '0xsignaturevalid';
			const mockOrderId = 'order-789';
			mockSignMessageAsync.mockResolvedValue(mockSignature);
			mockExecute.mockResolvedValue({ orderId: mockOrderId });

			const { result } = renderHook(() => useProcessStep());

			const step = {
				id: StepType.signEIP191,
				data: 'Sign this message',
				to: '0x0',
				value: 0n,
				price: 0n,
				post: {
					endpoint: '/api/create-order',
					method: 'POST',
					body: { orderData: 'test' },
				},
			} as SignatureStep;

			const response = await result.current.processStep(step, 1);

			expect(response).toEqual({ type: 'signature', orderId: mockOrderId });
			expect(mockSignMessageAsync).toHaveBeenCalledWith({
				message: 'Sign this message',
			});
			expect(mockExecute).toHaveBeenCalledWith({
				params: {
					chainId: '1',
					signature: mockSignature,
					method: 'POST',
					endpoint: '/api/create-order',
					body: { orderData: 'test' },
					executeType: ExecuteType.order,
				},
			});
		});
	});

	describe('error handling', () => {
		it('should throw error for unsupported step type', async () => {
			const { result } = renderHook(() => useProcessStep());

			const step = {
				id: 'unsupported' as any,
				data: '0x0',
				to: '0x0',
				value: 0n,
				price: 0n,
				post: {
					endpoint: '',
					method: '',
					body: {},
				},
			} as any;

			await expect(result.current.processStep(step, 1)).rejects.toThrow(
				'Unsupported step type',
			);
		});

		it('should throw error for EIP712 without signature data', async () => {
			const { result } = renderHook(() => useProcessStep());

			const step = {
				id: StepType.signEIP712,
				data: '0x0',
				to: '0x0',
				value: 0n,
				price: 0n,
				post: {
					endpoint: '',
					method: '',
					body: {},
				},
			} as unknown as SignatureStep;

			await expect(result.current.processStep(step, 1)).rejects.toThrow(
				'EIP-712 step missing signature data',
			);
		});
	});
});
