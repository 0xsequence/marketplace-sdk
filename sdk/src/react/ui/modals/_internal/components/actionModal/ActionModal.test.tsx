'use client';

import { fireEvent, render, screen, waitFor } from '@test';
import { mainnet, polygon } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { ActionModal } from './ActionModal';

const mockShowSwitchChainErrorModal = vi.fn();
vi.mock('../switchChainErrorModal', () => ({
	useSwitchChainErrorModal: () => ({
		show: mockShowSwitchChainErrorModal,
		close: vi.fn(),
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
		chainId: mainnet.id,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Basic Rendering', () => {
		it('should render modal content when account is connected', async () => {
			render(<ActionModal {...defaultProps} />);

			await waitFor(() => {
				expect(screen.getByText('Modal Content')).toBeInTheDocument();
				expect(screen.getByTestId('test-button')).toBeInTheDocument();
			});
		});

		it('should not render when isOpen is false', () => {
			render(<ActionModal {...defaultProps} isOpen={false} />);
			expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
		});

		it('should render title correctly', async () => {
			render(<ActionModal {...defaultProps} />);

			await waitFor(() => {
				expect(screen.getByText('Test Modal')).toBeInTheDocument();
			});
		});
	});

	describe('Loading States', () => {
		it('should show a loading spinner when modalLoading prop is true', async () => {
			render(<ActionModal {...defaultProps} modalLoading={true} />);

			expect(screen.getByTestId('spinner')).toBeInTheDocument();
		});

		it('should show modal content when not loading', async () => {
			render(<ActionModal {...defaultProps} modalLoading={false} />);

			await waitFor(() => {
				expect(screen.getByText('Modal Content')).toBeInTheDocument();
				expect(screen.getByTestId('test-button')).toBeInTheDocument();
			});
		});
	});

	describe('Chain Switching Integration', () => {
		it('should directly execute onClick when chain matches', async () => {
			const onClick = vi.fn();
			render(
				<ActionModal
					{...defaultProps}
					ctas={[{ label: 'Test', onClick, testid: 'test-btn' }]}
				/>,
			);

			await waitFor(() => {
				const button = screen.getByTestId('test-btn');
				fireEvent.click(button);
			});

			expect(onClick).toHaveBeenCalled();
		});

		it('should attempt chain switching when chain mismatch occurs', async () => {
			const onClick = vi.fn();
			render(
				<ActionModal
					{...defaultProps}
					ctas={[{ label: 'Test', onClick, testid: 'test-btn' }]}
					chainId={polygon.id}
				/>,
			);

			await waitFor(() => {
				const button = screen.getByTestId('test-btn');
				fireEvent.click(button);
			});

			// When there's a chain mismatch, the switch chain error modal should be shown
			// and onClick should not be called immediately
			expect(mockShowSwitchChainErrorModal).toHaveBeenCalledWith({
				chainIdToSwitchTo: polygon.id,
			});
			expect(onClick).not.toHaveBeenCalled();
		});

		it('should handle chain switching for WaaS wallets', async () => {
			function ChainStatus() {
				const { chainId } = useAccount();
				return <div>{chainId}</div>;
			}
			render(
				<>
					<ChainStatus />
					<ActionModal
						{...defaultProps}
						ctas={[{ label: 'Test', onClick: vi.fn(), testid: 'test-btn' }]}
						chainId={polygon.id}
					/>
				</>,
				{
					useEmbeddedWallet: true,
				},
			);

			// Wait for the account to be connected and initial chainId to be shown
			await waitFor(() => {
				expect(screen.getByText('1')).toBeInTheDocument(); // mainnet.id
			});

			await waitFor(() => {
				const button = screen.getByTestId('test-btn');
				fireEvent.click(button);
			});

			// For WaaS wallets, chain switching should show error modal since mock connector fails
			expect(mockShowSwitchChainErrorModal).toHaveBeenCalledWith({
				chainIdToSwitchTo: polygon.id,
			});
		});
	});

	describe('CTA Buttons', () => {
		it('should call onClick when CTA button is clicked', async () => {
			const onClick = vi.fn();
			render(
				<ActionModal
					{...defaultProps}
					ctas={[{ label: 'Click Me', onClick, testid: 'cta-button' }]}
				/>,
			);

			await waitFor(() => {
				const button = screen.getByTestId('cta-button');
				fireEvent.click(button);
			});

			expect(onClick).toHaveBeenCalled();
		});

		it('should disable the button when disabled prop is true', async () => {
			render(
				<ActionModal
					{...defaultProps}
					ctas={[
						{
							label: 'Disabled Button',
							onClick: mockOnClick,
							disabled: true,
							testid: 'disabled-button',
						},
					]}
				/>,
			);

			await waitFor(() => {
				const button = screen.getByTestId('disabled-button');
				expect(button).toBeDisabled();
			});
		});

		it('should show spinner when pending prop is true', async () => {
			render(
				<ActionModal
					{...defaultProps}
					ctas={[
						{
							label: 'Loading Button',
							onClick: mockOnClick,
							pending: true,
							testid: 'pending-button',
						},
					]}
				/>,
			);

			await waitFor(() => {
				expect(screen.getByTestId('pending-button')).toBeInTheDocument();
				expect(
					screen.getByTestId('pending-button-spinner'),
				).toBeInTheDocument();
			});
		});

		it('should not render hidden buttons', async () => {
			render(
				<ActionModal
					{...defaultProps}
					ctas={[
						{
							label: 'Visible Button',
							onClick: vi.fn(),
							testid: 'visible-button',
						},
						{
							label: 'Hidden Button',
							onClick: vi.fn(),
							hidden: true,
							testid: 'hidden-button',
						},
					]}
				/>,
			);

			await waitFor(() => {
				expect(screen.getByTestId('visible-button')).toBeInTheDocument();
				expect(screen.queryByTestId('hidden-button')).not.toBeInTheDocument();
			});
		});

		it('should render multiple CTA buttons', async () => {
			render(
				<ActionModal
					{...defaultProps}
					ctas={[
						{
							label: 'Primary CTA',
							onClick: vi.fn(),
							testid: 'primary-cta',
						},
						{
							label: 'Secondary CTA',
							onClick: vi.fn(),
							testid: 'secondary-cta',
						},
					]}
				/>,
			);

			await waitFor(() => {
				expect(screen.getByTestId('primary-cta')).toBeInTheDocument();
				expect(screen.getByTestId('secondary-cta')).toBeInTheDocument();
			});
		});
	});

	describe('Modal Behavior', () => {
		it('should hide CTAs when hideCtas is true', async () => {
			render(<ActionModal {...defaultProps} hideCtas={true} />);

			await waitFor(() => {
				expect(screen.queryByTestId('test-button')).not.toBeInTheDocument();
			});
		});
	});
});
