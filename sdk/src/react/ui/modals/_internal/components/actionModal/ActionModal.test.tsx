import { fireEvent, render, screen, waitFor } from '@test';
import { type Address, custom, zeroAddress } from 'viem';
import { mainnet, polygon } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletKind } from '../../../../../_internal';
import * as walletModule from '../../../../../_internal/wallet/useWallet';
import { ActionModal } from './ActionModal';

const mockShowSwitchChainModal = vi.fn();
vi.mock('../switchChainModal', () => ({
	useSwitchChainModal: () => ({
		show: mockShowSwitchChainModal,
		close: vi.fn(),
		isSwitching$: { get: () => false },
	}),
}));

describe('ActionModal', () => {
	const mockOnClose = vi.fn();
	const mockOnClick = vi.fn();

	const defaultProps = {
		isOpen: true,
		onClose: mockOnClose,
		title: 'Test Modal',
		children: <div>Modal Content</div>,
		ctas: [
			{
				label: 'Test Button',
				onClick: mockOnClick,
				testid: 'test-button',
			},
		],
		chainId: polygon.id,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Loading states', () => {
		it('should show a loading spinner when modalLoading prop is true', async () => {
			render(<ActionModal {...defaultProps} modalLoading={true} />);

			expect(screen.getByTestId('spinner')).toBeInTheDocument();
		});

		it('should show a loading spinner when isLoading from useWallet is true', async () => {
			vi.spyOn(walletModule, 'useWallet').mockReturnValue({
				wallet: null,
				isLoading: true,
				isError: false,
			});

			render(<ActionModal {...defaultProps} />);

			expect(screen.getByTestId('spinner')).toBeInTheDocument();
		});

		it('should show error message when useWallet returns an error', () => {
			vi.spyOn(walletModule, 'useWallet').mockReturnValue({
				wallet: null,
				isLoading: false,
				isError: true,
			});

			render(<ActionModal {...defaultProps} />);

			expect(screen.getByTestId('error-loading-text')).toBeInTheDocument();
			expect(screen.getByText('Error loading modal')).toBeInTheDocument();
			expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
			expect(screen.queryByTestId('test-button')).not.toBeInTheDocument();
		});

		it('should show modal content if loading states is false and no error', async () => {
			vi.spyOn(walletModule, 'useWallet').mockReturnValue({
				wallet: null,
				isLoading: false,
				isError: false,
			});

			render(<ActionModal {...defaultProps} modalLoading={false} />);

			expect(screen.getByText('Modal Content')).toBeInTheDocument();
			expect(screen.getByTestId('test-button')).toBeInTheDocument();
		});
	});

	describe('Chain switching', () => {
		it('should automatically switch chain for Sequence WaaS wallets', async () => {
			const switchChainMock = vi.fn();

			vi.spyOn(walletModule, 'useWallet').mockReturnValue({
				wallet: {
					address: () => Promise.resolve(zeroAddress as Address),
					getChainId: vi.fn().mockResolvedValue(mainnet.id),
					switchChain: switchChainMock,
					transport: custom({ request: vi.fn() }),
					walletKind: WalletKind.sequence,
					isWaaS: true,
					handleConfirmTransactionStep: vi.fn(),
					handleSendTransactionStep: vi.fn(),
					handleSignMessageStep: vi.fn(),
					hasTokenApproval: vi.fn(),
				},
				isLoading: false,
				isError: false,
			});

			render(<ActionModal {...defaultProps} />);

			expect(switchChainMock).toHaveBeenCalledWith(polygon.id);
		});

		it('should show switch chain modal when CTA is clicked with chain mismatch', async () => {
			mockShowSwitchChainModal.mockClear();

			vi.spyOn(walletModule, 'useWallet').mockReturnValue({
				wallet: {
					address: () => Promise.resolve(zeroAddress as Address),
					getChainId: vi.fn().mockResolvedValue(mainnet.id), // different from defaultProps.chainId
					switchChain: vi.fn(),
					transport: custom({ request: vi.fn() }),
					walletKind: WalletKind.sequence,
					isWaaS: false,
					handleConfirmTransactionStep: vi.fn(),
					handleSendTransactionStep: vi.fn(),
					handleSignMessageStep: vi.fn(),
					hasTokenApproval: vi.fn(),
				},
				isLoading: false,
				isError: false,
			});

			render(<ActionModal {...defaultProps} />);

			const button = screen.getByTestId('test-button');
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockShowSwitchChainModal).toHaveBeenCalledWith({
					chainIdToSwitchTo: polygon.id,
					onSuccess: expect.any(Function),
				});
			});
		});

		it('should directly execute callback when chain already matches', async () => {
			mockOnClick.mockClear();

			vi.spyOn(walletModule, 'useWallet').mockReturnValue({
				wallet: {
					address: () => Promise.resolve(zeroAddress as Address),
					getChainId: vi.fn().mockResolvedValue(polygon.id), // Same as defaultProps.chainId
					switchChain: vi.fn(),
					transport: custom({ request: vi.fn() }),
					walletKind: WalletKind.sequence,
					isWaaS: false,
					handleConfirmTransactionStep: vi.fn(),
					handleSendTransactionStep: vi.fn(),
					handleSignMessageStep: vi.fn(),
					hasTokenApproval: vi.fn(),
				},
				isLoading: false,
				isError: false,
			});

			render(<ActionModal {...defaultProps} />);

			const button = screen.getByTestId('test-button');
			fireEvent.click(button);

			await waitFor(() => {
				expect(mockOnClick).toHaveBeenCalled();
			});
		});
	});
});
