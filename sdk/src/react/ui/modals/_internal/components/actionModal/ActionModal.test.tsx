// import { fireEvent, render, screen, waitFor } from '@test';
// import { polygon } from 'viem/chains';
// import { describe, expect, it, vi } from 'vitest';
// import { ActionModal } from './ActionModal';

// const mockShowSwitchChainModal = vi.fn();
// vi.mock('../switchChainModal', () => ({
// 	useSwitchChainModal: () => ({
// 		show: mockShowSwitchChainModal,
// 		close: vi.fn(),
// 	}),
// }));

// describe('ActionModal', () => {
// 	const mockOnClose = vi.fn();
// 	const mockOnClick = vi.fn();
// 	const mockSwitchChain = vi.fn();

// 	const defaultProps = {
// 		isOpen: true,
// 		onClose: mockOnClose,
// 		title: 'Test Modal',
// 		children: <div>Modal Content</div>,
// 		ctas: [
// 			{
// 				label: 'Test Button',
// 				onClick: mockOnClick,
// 				testid: 'test-button',
// 			},
// 		],
// 		chainId: polygon.id,
// 	};

// 	describe('Loading states', () => {
// 		it('should show a loading spinner when modalLoading prop is true', async () => {
// 			render(<ActionModal {...defaultProps} modalLoading={true} />);

// 			expect(screen.getByTestId('spinner')).toBeInTheDocument();
// 		});

// 		it('should show a loading spinner when wallet is connecting', async () => {
// 			render(<ActionModal {...defaultProps} />);

// 			expect(screen.getByTestId('spinner')).toBeInTheDocument();
// 		});

// 		it('should show error message when wallet is disconnected', () => {
// 			render(<ActionModal {...defaultProps} />);

// 			expect(screen.getByTestId('error-loading-text')).toBeInTheDocument();
// 			expect(screen.getByText('Error loading modal')).toBeInTheDocument();
// 			expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
// 			expect(screen.queryByTestId('test-button')).not.toBeInTheDocument();
// 		});

// 		it('should show modal content if wallet is connected', async () => {
// 			render(<ActionModal {...defaultProps} modalLoading={false} />);

// 			expect(screen.getByText('Modal Content')).toBeInTheDocument();
// 			expect(screen.getByTestId('test-button')).toBeInTheDocument();
// 		});
// 	});

// 	describe('Chain switching', () => {
// 		it('should automatically switch chain for Sequence WaaS wallets', async () => {
// 			render(<ActionModal {...defaultProps} />);

// 			expect(mockSwitchChain).toHaveBeenCalledWith({ chainId: polygon.id });
// 		});

// 		it('should show switch chain modal for non-WaaS wallets on wrong chain', async () => {

// 			render(<ActionModal {...defaultProps} />);

// 			const button = screen.getByTestId('test-button');
// 			fireEvent.click(button);

// 			await waitFor(() => {
// 				expect(mockShowSwitchChainModal).toHaveBeenCalledWith({
// 					chainIdToSwitchTo: polygon.id,
// 					onSuccess: expect.any(Function),
// 				});
// 			});

// 			expect(mockOnClick).not.toHaveBeenCalled();
// 		});

// 		it('should execute action directly when on correct chain', async () => {
// 			render(<ActionModal {...defaultProps} />);

// 			const button = screen.getByTestId('test-button');
// 			fireEvent.click(button);

// 			await waitFor(() => {
// 				expect(mockOnClick).toHaveBeenCalled();
// 			});

// 			expect(mockShowSwitchChainModal).not.toHaveBeenCalled();
// 		});
// 	});

// 	describe('Modal behavior', () => {
// 		it('should not render when isOpen is false', () => {
// 			render(<ActionModal {...defaultProps} isOpen={false} />);

// 			expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
// 		});

// 		it('should not render when chainId is not provided', () => {
// 			render(<ActionModal {...defaultProps} chainId={0} />);

// 			expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
// 		});

// 		it('should hide CTAs when hideCtas is true', () => {
// 			render(<ActionModal {...defaultProps} hideCtas={true} />);

// 			expect(screen.queryByTestId('test-button')).not.toBeInTheDocument();
// 		});

// 		it('should handle multiple CTAs', () => {
// 			const multipleCtasProps = {
// 				...defaultProps,
// 				ctas: [
// 					{
// 						label: 'Primary Action',
// 						onClick: vi.fn(),
// 						testid: 'primary-button',
// 					},
// 					{
// 						label: 'Secondary Action',
// 						onClick: vi.fn(),
// 						variant: 'ghost' as const,
// 						testid: 'secondary-button',
// 					},
// 				],
// 			};

// 			render(<ActionModal {...multipleCtasProps} />);

// 			expect(screen.getByTestId('primary-button')).toBeInTheDocument();
// 			expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
// 		});

// 		it('should handle hidden CTAs', () => {
// 			const hiddenCtaProps = {
// 				...defaultProps,
// 				ctas: [
// 					{
// 						label: 'Visible Action',
// 						onClick: vi.fn(),
// 						testid: 'visible-button',
// 					},
// 					{
// 						label: 'Hidden Action',
// 						onClick: vi.fn(),
// 						hidden: true,
// 						testid: 'hidden-button',
// 					},
// 				],
// 			};

// 			render(<ActionModal {...hiddenCtaProps} />);

// 			expect(screen.getByTestId('visible-button')).toBeInTheDocument();
// 			expect(screen.queryByTestId('hidden-button')).not.toBeInTheDocument();
// 		});

// 		it('should handle disabled CTAs', () => {
// 			const disabledCtaProps = {
// 				...defaultProps,
// 				ctas: [
// 					{
// 						label: 'Disabled Action',
// 						onClick: vi.fn(),
// 						disabled: true,
// 						testid: 'disabled-button',
// 					},
// 				],
// 			};

// 			render(<ActionModal {...disabledCtaProps} />);

// 			const button = screen.getByTestId('disabled-button');
// 			expect(button).toBeDisabled();
// 		});

// 		it('should handle pending CTAs', () => {
// 			const pendingCtaProps = {
// 				...defaultProps,
// 				ctas: [
// 					{
// 						label: 'Pending Action',
// 						onClick: vi.fn(),
// 						pending: true,
// 						testid: 'pending-button',
// 					},
// 				],
// 			};

// 			render(<ActionModal {...pendingCtaProps} />);

// 			const spinner = screen.getByTestId('pending-button-spinner');
// 			expect(spinner).toBeInTheDocument();
// 		});
// 	});
// });
