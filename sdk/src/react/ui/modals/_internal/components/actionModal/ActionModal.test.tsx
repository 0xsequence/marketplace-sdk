import { fireEvent, render, renderHook, screen, waitFor } from '@test';
import { mainnet, polygon } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useConnect } from 'wagmi';
import * as walletModule from '../../../../../_internal/wallet/useWallet';
import SwitchChainModal from '../switchChainModal';
import { switchChainModal$ } from '../switchChainModal/store';
import { ActionModal } from './ActionModal';

describe('ActionModal', async () => {
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
		vi.resetAllMocks();
	});

	it('Should show a loading spinner when both the modalLoading prop and the isLoading state are true', async () => {
		const { result: walletResult } = renderHook(() => walletModule.useWallet());
		render(<ActionModal {...defaultProps} modalLoading={true} />);

		expect(screen.getByTestId('spinner')).toBeInTheDocument();
		expect(walletResult.current.isLoading).toBe(true);
	});

	it('Should show error message when useWallet returns isError as true', async () => {
		// Create a spy on useWallet just for this test
		const useWalletSpy = vi.spyOn(walletModule, 'useWallet');

		useWalletSpy.mockReturnValue({
			wallet: null,
			isLoading: false,
			isError: true,
		});

		render(<ActionModal {...defaultProps} />);

		expect(screen.getByTestId('error-loading-text')).toBeInTheDocument();
		expect(screen.getByText('Error loading modal')).toBeInTheDocument();
		expect(screen.getByTestId('error-loading-wrapper')).toBeInTheDocument();

		expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
		expect(screen.queryByTestId('test-button')).not.toBeInTheDocument();

		// Restore the spy to not affect other tests
		useWalletSpy.mockRestore();
	});

	describe('switch chain', async () => {
		const { result: walletResult } = renderHook(() => walletModule.useWallet());

		expect(walletResult.current.isLoading).toBe(true);
		render(<ActionModal {...defaultProps} modalLoading={false} />);

		// while wallet is loading, the modal should show the loading spinner
		expect(screen.getByTestId('spinner')).toBeInTheDocument();

		await waitFor(() => {
			expect(walletResult.current.isLoading).toBe(false);
		});

		expect(walletResult.current.isError).toBe(false);
		expect(walletResult.current.wallet?.address).toBeDefined();

		const walletChainId = await walletResult.current.wallet?.getChainId();
		// wallet is connected to mainnet (1)
		expect(walletChainId).toBe(mainnet.id);

		expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
		expect(screen.queryByTestId('error-loading-text')).not.toBeInTheDocument();
		expect(
			screen.queryByTestId('error-loading-wrapper'),
		).not.toBeInTheDocument();

		expect(screen.getByText('Modal Content')).toBeInTheDocument();
		const testButton = screen.getByTestId('test-button');

		it('Should show switch chain modal when chain mismatch (wallet is not a Sequence WaaS or Sequence Ecosystem WaaS)', async () => {
			fireEvent.click(testButton);
			switchChainModal$.state.chainIdToSwitchTo.set(polygon.id);

			render(<SwitchChainModal />);

			expect(screen.getByText('Wrong network')).toBeInTheDocument(); // title of the switch chain modal
		});

		it('Should automatically switch chain without rendering switch chain modal when chain mismatch (wallet is a Sequence WaaS or Sequence Ecosystem WaaS)', async () => {
			const { result: connectResult } = renderHook(() => useConnect(), {
				useEmbeddedWallet: true,
			});

			await connectResult.current.connectAsync({
				connector: connectResult.current.connectors[0],
			});

			const { result: walletResult } = renderHook(
				() => walletModule.useWallet(),
				{
					useEmbeddedWallet: true,
				},
			);

			render(<ActionModal {...defaultProps} modalLoading={false} />);

			await waitFor(() => {
				expect(walletResult.current.isLoading).toBe(false);
			});

			expect(walletResult.current.wallet?.isWaaS).toBe(true); // connector is a Sequence WaaS
			expect(await walletResult.current.wallet?.getChainId()).toBe(mainnet.id); // wallet is connected to mainnet, which means chain mismatch

			// modal content is rendered
			expect(screen.getByText('Modal Content')).toBeInTheDocument();

			await walletResult.current.wallet?.switchChain(polygon.id); // chain is switched without rendering switch chain modal
		});

		it('Should call ctas onClick after checking chain', async () => {
			fireEvent.click(testButton);

			switchChainModal$.state.chainIdToSwitchTo.set(polygon.id);
			switchChainModal$.state.onSuccess.set(mockOnClick);

			render(<SwitchChainModal />);

			expect(screen.getByText('Wrong network')).toBeInTheDocument();
			const switchNetworkCta = screen.getByText('Switch Network');
			fireEvent.click(switchNetworkCta);

			await waitFor(() => {
				expect(mockOnClick).toHaveBeenCalled();
			});
		});

		it('Should NOT call ctas onClick after checking chain', async () => {
			fireEvent.click(testButton);

			switchChainModal$.state.chainIdToSwitchTo.set(polygon.id);

			render(<SwitchChainModal />);

			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeInTheDocument();
			fireEvent.click(closeButton);

			// switch chain modal is closed
			expect(screen.queryByText('Wrong network')).not.toBeInTheDocument();

			expect(mockOnClick).not.toHaveBeenCalled();
		});
	});
});
