import { ContractType, WalletKind } from '@0xsequence/api-client';
import { renderHook, waitFor } from '@test';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import * as Hooks from '../../../../hooks';
import { useWaasFeeOptions } from '../../../../hooks/utils/useWaasFeeOptions';
import * as FeeStore from '../../_internal/components/selectWaasFeeOptions/store';
import { useTransferModalContext } from './context';
import { transferModalStore } from './store';

vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
	};
});

vi.mock('../../../../hooks', async () => {
	const actual = (await vi.importActual('../../../../hooks')) as object;
	return {
		...actual,
		useCollectibleMetadata: vi.fn(),
		useCollectionMetadata: vi.fn(),
		useCollectibleBalance: vi.fn(),
		useConfig: vi.fn().mockReturnValue({}),
		useConnectorMetadata: vi.fn(),
		useTransferTokens: vi.fn(),
	};
});

vi.mock('../../../../hooks/utils/useWaasFeeOptions', () => ({
	useWaasFeeOptions: vi.fn(),
}));

vi.mock('../../_internal/components/selectWaasFeeOptions/store', () => ({
	selectWaasFeeOptionsStore: { send: vi.fn() },
	useSelectWaasFeeOptionsStore: vi.fn(),
}));

vi.mock('../../_internal/components/transactionStatusModal', () => ({
	useTransactionStatusModal: vi.fn().mockReturnValue({
		show: vi.fn(),
		close: vi.fn(),
	}),
}));

const mockUseAccount = vi.mocked(useAccount);
const mockUseCollectibleMetadata = vi.mocked(Hooks.useCollectibleMetadata);
const mockUseCollectionMetadata = vi.mocked(Hooks.useCollectionMetadata);
const mockUseCollectibleBalance = vi.mocked(Hooks.useCollectibleBalance);
const mockUseConnectorMetadata = vi.mocked(Hooks.useConnectorMetadata);
const mockUseTransferTokens = vi.mocked(Hooks.useTransferTokens);
const mockUseSelectWaasFeeOptionsStore = vi.mocked(
	FeeStore.useSelectWaasFeeOptionsStore,
);
const mockUseWaasFeeOptions = vi.mocked(useWaasFeeOptions);

describe('useTransferModalContext', () => {
	const defaultAddress = '0x742d35Cc6634C0532925a3b8D4C9db96' as Address;
	const defaultCollectionAddress =
		'0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef' as Address;

	beforeEach(() => {
		vi.clearAllMocks();
		transferModalStore.send({ type: 'close' });
		transferModalStore.send({
			type: 'open',
			collectionAddress: defaultCollectionAddress,
			tokenId: 1n,
			chainId: 1,
			collectionType: ContractType.ERC1155,
		});

		mockUseAccount.mockReturnValue({
			address: defaultAddress,
			addresses: [defaultAddress],
			chain: undefined,
			chainId: 1,
			connector: undefined,
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
			// biome-ignore lint/suspicious/noExplicitAny: test mock
		} as any);

		mockUseCollectibleMetadata.mockReturnValue({
			data: { name: 'Example', decimals: 0 },
			isLoading: false,
			error: null,
		} as any);
		mockUseCollectionMetadata.mockReturnValue({
			data: { type: ContractType.ERC1155 },
			isLoading: false,
			error: null,
		} as any);
		mockUseCollectibleBalance.mockReturnValue({
			data: { balance: '2' },
			isLoading: false,
			error: null,
		} as any);
		mockUseConnectorMetadata.mockReturnValue({
			isWaaS: false,
			isSequence: false,
			walletKind: WalletKind.unknown,
		});
		mockUseTransferTokens.mockReturnValue({
			transferTokensAsync: vi.fn().mockResolvedValue('0xhash'),
			hash: undefined,
			transferring: false,
			transferFailed: false,
			transferSuccess: false,
			error: null,
		});
		mockUseSelectWaasFeeOptionsStore.mockReturnValue({
			isVisible: false,
			selectedFeeOption: undefined,
			show: vi.fn(),
			hide: vi.fn(),
			setSelectedFeeOption: vi.fn(),
			id: undefined,
		});
		mockUseWaasFeeOptions.mockReturnValue({
			pendingFeeOptionConfirmation: undefined,
			rejectPendingFeeOption: vi.fn(),
			confirmPendingFeeOption: vi.fn(),
		});
	});

	it('disables transfer when receiver is invalid', async () => {
		transferModalStore.send({ type: 'updateReceiver', value: 'invalid' });
		transferModalStore.send({ type: 'touchReceiver' });

		const { result } = renderHook(() => useTransferModalContext());

		await waitFor(() =>
			expect(result.current.form.receiver.validation.isValid).toBe(false),
		);
		expect(result.current.actions.transfer.disabled).toBe(true);
		expect(result.current.formError).toBeDefined();
	});

	it('enforces ERC1155 quantity limits', async () => {
		transferModalStore.send({ type: 'updateReceiver', value: defaultAddress });
		transferModalStore.send({ type: 'updateQuantity', value: '5' });
		transferModalStore.send({ type: 'touchQuantity' });

		const { result } = renderHook(() => useTransferModalContext());

		await waitFor(() =>
			expect(result.current.form.quantity.validation.isValid).toBe(false),
		);
		expect(result.current.form.errors.quantity).toContain('exceeds');
		expect(result.current.actions.transfer.disabled).toBe(true);
	});

	it('surfaces WaaS fee selection step when WaaS is enabled', () => {
		mockUseConnectorMetadata.mockReturnValue({
			isWaaS: true,
			isSequence: false,
			walletKind: WalletKind.sequence,
		});

		it('executes transfer action when form is valid', async () => {
			const mutate = vi.fn().mockResolvedValue('0xhash');
			mockUseTransferTokens.mockReturnValue({
				transferTokensAsync: mutate,
				hash: undefined,
				transferring: false,
				transferFailed: false,
				transferSuccess: false,
				error: null,
			});

			transferModalStore.send({
				type: 'updateReceiver',
				value: defaultAddress,
			});
			transferModalStore.send({ type: 'updateQuantity', value: '1' });

			const { result } = renderHook(() => useTransferModalContext());
			await result.current.actions.transfer.onClick();

			expect(mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					receiverAddress: defaultAddress,
					collectionAddress: defaultCollectionAddress,
				}),
			);
		});
	});
});
