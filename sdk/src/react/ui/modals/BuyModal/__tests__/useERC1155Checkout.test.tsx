import { renderHook, waitFor } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useERC1155Checkout } from '../hooks/useERC1155Checkout';
import { buyModalStore } from '../store';

// Mock the checkout SDK
vi.mock('@0xsequence/checkout', () => {
	const mockOpenCheckoutModal = vi.fn();
	const mockUseERC1155SaleContractCheckout = vi.fn(() => ({
		openCheckoutModal: mockOpenCheckoutModal,
		isLoading: false,
		isError: false,
	}));

	return {
		useERC1155SaleContractCheckout: mockUseERC1155SaleContractCheckout,
	};
});

// Mock wagmi
vi.mock('wagmi', () => ({
	useAccount: vi.fn(() => ({
		address: '0x1234567890123456789012345678901234567890',
	})),
}));

describe('useERC1155Checkout', () => {
	const defaultParams = {
		chainId: 1,
		salesContractAddress: '0x456',
		collectionAddress: '0x123',
		items: [{ tokenId: '1', quantity: '2' }],
		enabled: true,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		buyModalStore.send({ type: 'close' });
		buyModalStore.send({ type: 'setQuantity', quantity: 2 });
	});

	it('should initialize with correct checkout parameters', () => {
		const { result } = renderHook(() => useERC1155Checkout(defaultParams));

		expect(result.current.checkoutParams).toEqual({
			chain: 1,
			contractAddress: '0x456',
			collectionAddress: '0x123',
			items: [
				{
					tokenId: '1',
					quantity: '2',
				},
			],
			wallet: '0x1234567890123456789012345678901234567890',
			onSuccess: expect.any(Function),
			onError: expect.any(Function),
			onClose: expect.any(Function),
		});

		expect(result.current.isEnabled).toBe(true);
	});

	it('should pass checkout options when provided', () => {
		const checkoutOptions = {
			cryptoCheckoutOptions: [
				{
					paymentToken: {
						contractAddress: '0x0000000000000000000000000000000000000000',
						chainId: 1,
						name: 'Ethereum',
						symbol: 'ETH',
						decimals: 18,
					},
					price: {
						amount: '1000000000000000000',
						amountFormatted: '1.0',
					},
				},
			],
			fiatCheckoutOptions: [],
		};

		const { result } = renderHook(() =>
			useERC1155Checkout({
				...defaultParams,
				checkoutOptions,
			}),
		);

		expect(result.current.checkoutParams.checkoutOptions).toEqual(
			checkoutOptions,
		);
	});

	it('should be disabled when no wallet address', () => {
		vi.mocked(require('wagmi').useAccount).mockReturnValue({
			address: undefined,
		});

		const { result } = renderHook(() => useERC1155Checkout(defaultParams));

		expect(result.current.isEnabled).toBe(false);
	});

	it('should be disabled when enabled prop is false', () => {
		const { result } = renderHook(() =>
			useERC1155Checkout({
				...defaultParams,
				enabled: false,
			}),
		);

		expect(result.current.isEnabled).toBe(false);
	});

	it('should use quantity from store when available', () => {
		buyModalStore.send({ type: 'setQuantity', quantity: 5 });

		const { result } = renderHook(() => useERC1155Checkout(defaultParams));

		expect(result.current.checkoutParams.items[0].quantity).toBe('5');
	});

	it('should default to quantity 1 when no quantity in store', () => {
		buyModalStore.send({ type: 'setQuantity', quantity: null });

		const { result } = renderHook(() => useERC1155Checkout(defaultParams));

		expect(result.current.checkoutParams.items[0].quantity).toBe('1');
	});

	it('should handle onSuccess callback', async () => {
		const mockOnSuccess = vi.fn();
		buyModalStore.send({
			type: 'setOnSuccess',
			onSuccess: mockOnSuccess,
		});

		const { result } = renderHook(() => useERC1155Checkout(defaultParams));

		// Simulate successful checkout
		result.current.checkoutParams.onSuccess('0xabcd1234');

		await waitFor(() => {
			expect(mockOnSuccess).toHaveBeenCalledWith({
				hash: '0xabcd1234',
			});
		});
	});

	it('should handle onError callback', async () => {
		const mockOnError = vi.fn();
		buyModalStore.send({
			type: 'setOnError',
			onError: mockOnError,
		});

		const { result } = renderHook(() => useERC1155Checkout(defaultParams));

		// Simulate checkout error
		const testError = new Error('Checkout failed');
		result.current.checkoutParams.onError(testError);

		await waitFor(() => {
			expect(mockOnError).toHaveBeenCalledWith(testError);
		});
	});

	it('should handle onClose callback and close modal', () => {
		buyModalStore.send({ type: 'open', props: {} as unknown });

		const { result } = renderHook(() => useERC1155Checkout(defaultParams));

		// Simulate modal close
		result.current.checkoutParams.onClose();

		// Should close the modal
		expect(buyModalStore.get().isOpen).toBe(false);
	});

	it('should pass custom provider callback when provided', () => {
		const customProviderCallback = vi.fn();

		const { result } = renderHook(() =>
			useERC1155Checkout({
				...defaultParams,
				customProviderCallback,
			}),
		);

		expect(result.current.checkoutParams.customProviderCallback).toBe(
			customProviderCallback,
		);
	});
});
