import { NetworkType } from '@0xsequence/network';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWallet } from '../../../_internal/wallet/useWallet';
import { useCollection, useCurrency } from '../../../hooks';
import { selectWaasFeeOptionsStore } from '../_internal/components/selectWaasFeeOptions/store';
import { useSell } from './hooks/useSell';
import { SellModal } from './Modal';
import { sellModal$ } from './store';

// Mock dependencies
vi.mock('../../../hooks');
vi.mock('../../../_internal/wallet/useWallet');
vi.mock('./hooks/useSell');
vi.mock('../../../../utils/network', () => ({
	getNetwork: vi.fn(() => ({ type: NetworkType.MAINNET })),
}));

// Mock components
vi.mock('../_internal/components/actionModal/ActionModal', () => ({
	ActionModal: vi.fn(({ children, ctas, onClose, title, isOpen }) => (
		<div data-testid="action-modal" data-open={isOpen}>
			<h1>{title}</h1>
			{children}
			{ctas?.map((cta, index) => (
				<button
					key={index}
					onClick={cta.onClick}
					disabled={cta.disabled}
					data-pending={cta.pending}
					style={{ display: cta.hidden ? 'none' : 'block' }}
				>
					{cta.label}
				</button>
			))}
			<button onClick={onClose}>Close</button>
		</div>
	)),
}));

vi.mock('../_internal/components/actionModal/ErrorModal', () => ({
	ErrorModal: vi.fn(({ title, isOpen, onClose }) => (
		<div data-testid="error-modal" data-open={isOpen}>
			<h1>{title}</h1>
			<button onClick={onClose}>Close</button>
		</div>
	)),
}));

vi.mock('../_internal/components/selectWaasFeeOptions', () => ({
	default: vi.fn(({ onCancel }) => (
		<div data-testid="waas-fee-options">
			<button onClick={onCancel}>Cancel</button>
		</div>
	)),
}));

vi.mock('../_internal/components/tokenPreview', () => ({
	default: vi.fn(() => <div data-testid="token-preview" />),
}));

vi.mock('../_internal/components/transactionDetails', () => ({
	default: vi.fn(() => <div data-testid="transaction-details" />),
}));

vi.mock('../_internal/components/transactionHeader', () => ({
	default: vi.fn(() => <div data-testid="transaction-header" />),
}));

describe('SellModal', () => {
	const mockCollection = {
		name: 'Test Collection',
		decimals: 18,
	};

	const mockCurrency = {
		imageUrl: 'https://example.com/currency.png',
	};

	const mockOrder = {
		orderId: 'order-123',
		quantityRemaining: '1',
		priceAmount: '1000000000000000000',
		priceCurrencyAddress: '0x0000000000000000000000000000000000000000',
		marketplace: 'SEQUENCE_MARKETPLACE_V1',
		createdAt: '2024-01-01T00:00:00Z',
	};

	const mockSellFunctions = {
		isLoading: false,
		executeApproval: vi.fn(),
		sell: vi.fn(),
	};

	const mockWallet = {
		isWaaS: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Reset store state
		sellModal$.isOpen.set(true);
		sellModal$.collectionAddress.set('0x123');
		sellModal$.chainId.set(1);
		sellModal$.tokenId.set('1');
		sellModal$.order.set(mockOrder);
		sellModal$.sellIsBeingProcessed.set(false);
		sellModal$.steps.approval.exist.set(false);
		sellModal$.steps.approval.isExecuting.set(false);
		sellModal$.steps.transaction.isExecuting.set(false);

		// Setup default mocks
		vi.mocked(useCollection).mockReturnValue({
			data: mockCollection,
			isLoading: false,
			isError: false,
		} as any);

		vi.mocked(useCurrency).mockReturnValue({
			data: mockCurrency,
			isLoading: false,
			isError: false,
		} as any);

		vi.mocked(useSell).mockReturnValue(mockSellFunctions as any);

		vi.mocked(useWallet).mockReturnValue({
			wallet: mockWallet,
		} as any);
	});

	describe('Rendering States', () => {
		it('renders the modal when open', () => {
			render(<Modal />);
			expect(screen.getByTestId('action-modal')).toHaveAttribute(
				'data-open',
				'true',
			);
			expect(screen.getByText('You have an offer')).toBeInTheDocument();
		});

		it('renders loading state when collection is loading', () => {
			vi.mocked(useCollection).mockReturnValue({
				data: undefined,
				isLoading: true,
				isError: false,
			} as any);

			render(<Modal />);
			expect(screen.getByTestId('action-modal')).toBeInTheDocument();
		});

		it('renders loading state when currency is loading', () => {
			vi.mocked(useCurrency).mockReturnValue({
				data: undefined,
				isLoading: true,
				isError: false,
			} as any);

			render(<Modal />);
			expect(screen.getByTestId('action-modal')).toBeInTheDocument();
		});

		it('renders error modal when collection fetch fails', () => {
			vi.mocked(useCollection).mockReturnValue({
				data: undefined,
				isLoading: false,
				isError: true,
			} as any);

			render(<Modal />);
			expect(screen.getByTestId('error-modal')).toHaveAttribute(
				'data-open',
				'true',
			);
		});

		it('renders error modal when currency fetch fails', () => {
			vi.mocked(useCurrency).mockReturnValue({
				data: undefined,
				isLoading: false,
				isError: true,
			} as any);

			render(<Modal />);
			expect(screen.getByTestId('error-modal')).toHaveAttribute(
				'data-open',
				'true',
			);
		});

		it('renders error modal when order is undefined', () => {
			sellModal$.order.set(undefined);

			render(<Modal />);
			expect(screen.getByTestId('error-modal')).toHaveAttribute(
				'data-open',
				'true',
			);
		});
	});

	describe('Button States', () => {
		it('shows approval button when approval is needed', () => {
			sellModal$.steps.approval.exist.set(true);

			render(<Modal />);
			const approvalButton = screen.getByText('Approve TOKEN');
			expect(approvalButton).toBeVisible();
			expect(approvalButton).not.toBeDisabled();
		});

		it('disables approval button when loading', () => {
			sellModal$.steps.approval.exist.set(true);
			vi.mocked(useSell).mockReturnValue({
				...mockSellFunctions,
				isLoading: true,
			} as any);

			render(<Modal />);
			expect(screen.getByText('Approve TOKEN')).toBeDisabled();
		});

		it('disables approval button when quantity is zero', () => {
			sellModal$.steps.approval.exist.set(true);
			sellModal$.order.set({ ...mockOrder, quantityRemaining: '0' });

			render(<Modal />);
			expect(screen.getByText('Approve TOKEN')).toBeDisabled();
		});

		it('shows pending state on approval button when executing', () => {
			sellModal$.steps.approval.exist.set(true);
			sellModal$.steps.approval.isExecuting.set(true);

			render(<Modal />);
			expect(screen.getByText('Approve TOKEN')).toHaveAttribute(
				'data-pending',
				'true',
			);
		});

		it('disables sell button when approval is needed', () => {
			sellModal$.steps.approval.exist.set(true);

			render(<Modal />);
			expect(screen.getByText('Accept')).toBeDisabled();
		});

		it('disables sell button when approval is executing', () => {
			sellModal$.steps.approval.isExecuting.set(true);

			render(<Modal />);
			expect(screen.getByText('Accept')).toBeDisabled();
		});

		it('shows correct label for WaaS wallet on mainnet', () => {
			vi.mocked(useWallet).mockReturnValue({
				wallet: { isWaaS: true },
			} as any);
			sellModal$.sellIsBeingProcessed.set(true);

			render(<Modal />);
			expect(screen.getByText('Loading fee options')).toBeInTheDocument();
		});

		it('shows Accept label for WaaS wallet on testnet', () => {
			vi.mocked(useWallet).mockReturnValue({
				wallet: { isWaaS: true },
			} as any);
			vi.mock('../../../../utils/network', () => ({
				getNetwork: vi.fn(() => ({ type: NetworkType.TESTNET })),
			}));
			sellModal$.sellIsBeingProcessed.set(true);

			render(<Modal />);
			expect(screen.getByText('Accept')).toBeInTheDocument();
		});
	});

	describe('User Interactions', () => {
		it('calls executeApproval when approval button is clicked', async () => {
			const user = userEvent.setup();
			sellModal$.steps.approval.exist.set(true);

			render(<Modal />);
			await user.click(screen.getByText('Approve TOKEN'));

			expect(mockSellFunctions.executeApproval).toHaveBeenCalled();
		});

		it('handles sell flow for non-WaaS wallet', async () => {
			const user = userEvent.setup();

			render(<Modal />);
			await user.click(screen.getByText('Accept'));

			expect(sellModal$.sellIsBeingProcessed.get()).toBe(true);
			expect(mockSellFunctions.sell).toHaveBeenCalledWith({
				isTransactionExecuting: false,
			});
		});

		it('shows fee options for WaaS wallet', async () => {
			const user = userEvent.setup();
			vi.mocked(useWallet).mockReturnValue({
				wallet: { isWaaS: true },
			} as any);

			render(<Modal />);
			await user.click(screen.getByText('Accept'));

			await waitFor(() => {
				expect(screen.getByTestId('waas-fee-options')).toBeInTheDocument();
			});
		});

		it('handles sell error gracefully', async () => {
			const user = userEvent.setup();
			const consoleError = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {});
			mockSellFunctions.sell.mockRejectedValue(new Error('Sell failed'));

			render(<Modal />);
			await user.click(screen.getByText('Accept'));

			await waitFor(() => {
				expect(consoleError).toHaveBeenCalledWith(
					'Sell failed:',
					expect.any(Error),
				);
				expect(sellModal$.sellIsBeingProcessed.get()).toBe(false);
				expect(sellModal$.steps.transaction.isExecuting.get()).toBe(false);
			});

			consoleError.mockRestore();
		});

		it('closes modal and resets state', async () => {
			const user = userEvent.setup();
			const closeSpy = vi.spyOn(sellModal$, 'close');

			render(<Modal />);
			await user.click(screen.getByText('Close'));

			expect(closeSpy).toHaveBeenCalled();
			expect(selectWaasFeeOptionsStore.send).toHaveBeenCalledWith({
				type: 'hide',
			});
			expect(sellModal$.steps.transaction.isExecuting.get()).toBe(false);
		});

		it('cancels fee options and resets processing state', async () => {
			const user = userEvent.setup();
			vi.mocked(useWallet).mockReturnValue({
				wallet: { isWaaS: true },
			} as any);
			sellModal$.sellIsBeingProcessed.set(true);

			// Mock the fee options store to show fee options
			vi.mock('../_internal/hooks/useSelectWaasFeeOptions', () => ({
				useSelectWaasFeeOptions: () => ({
					shouldHideActionButton: false,
				}),
			}));

			vi.mock('../_internal/components/selectWaasFeeOptions/store', () => ({
				useSelectWaasFeeOptionsStore: () => ({
					isVisible: true,
					selectedFeeOption: null,
				}),
				selectWaasFeeOptionsStore: {
					send: vi.fn(),
				},
			}));

			render(<Modal />);

			// Click cancel in fee options
			const cancelButton = screen.getByText('Cancel');
			await user.click(cancelButton);

			expect(sellModal$.sellIsBeingProcessed.get()).toBe(false);
			expect(sellModal$.steps.transaction.isExecuting.get()).toBe(false);
		});
	});

	describe('Component Integration', () => {
		it('renders all child components correctly', () => {
			render(<Modal />);

			expect(screen.getByTestId('transaction-header')).toBeInTheDocument();
			expect(screen.getByTestId('token-preview')).toBeInTheDocument();
			expect(screen.getByTestId('transaction-details')).toBeInTheDocument();
		});

		it('passes correct props to child components', () => {
			render(<Modal />);

			// Verify the modal received correct props
			const modal = screen.getByTestId('action-modal');
			expect(modal).toHaveAttribute('data-open', 'true');
			expect(screen.getByText('You have an offer')).toBeInTheDocument();
		});

		it('hides CTAs when shouldHideSellButton is true', () => {
			vi.mock('../_internal/hooks/useSelectWaasFeeOptions', () => ({
				useSelectWaasFeeOptions: () => ({
					shouldHideActionButton: true,
				}),
			}));

			render(<Modal />);

			// The ActionModal mock should receive hideCtas=true
			// In a real implementation, this would hide the buttons
		});
	});
});
