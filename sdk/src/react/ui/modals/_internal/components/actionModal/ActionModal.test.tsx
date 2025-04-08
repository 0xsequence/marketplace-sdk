import { fireEvent, render, renderHook, screen, waitFor } from '@test';
import { mainnet, polygon } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useConnect } from 'wagmi';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import SwitchChainModal from '../switchChainModal';
import { switchChainModal$ } from '../switchChainModal/store';
import { ActionModal } from './ActionModal';

describe('ActionModal', async () => {
	const mockOnClose = vi.fn();
	const mockOnClick = vi.fn();
	const { result: connectResult } = renderHook(() => useConnect());

	await connectResult.current.connectAsync({
		connector: connectResult.current.connectors[0],
	});

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

	describe('switch chain', async () => {
		const { result: walletResult } = renderHook(() => useWallet());

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
		/*
    it("Should automatically switch chain without rendering switch chain modal when chain mismatch (wallet is a Sequence WaaS or Sequence Ecosystem WaaS)", async () => {
	const { result: walletResult } = renderHook(() => useWallet());
	const waasConnector = createConnector((config) => ({
		id: 'custom-waas',
		name: 'Custom WAAS Connector',
		type: 'custom',
		ready: true,
		connect: async () => ({
			accounts: [TEST_WAAS_ADDRESS],
			chainId: 1,
		}),
		disconnect: async () => {},
		getAccounts: async () => [TEST_WAAS_ADDRESS],
		getChainId: async () => 1,
		getProvider: async () => ({} as any),
		isAuthorized: async () => true,
		onAccountsChanged: () => {},
		onChainChanged: () => {},
		onDisconnect: () => {},
		onMessage: () => {},
	}));

	const waasWalletClient = createWalletClient({
		chain: polygon,
		transport: custom({
			request: async () => ({})
		})
	});

	const waasWalletInstance = wallet({
		wallet: waasWalletClient,
		chains: [polygon],
		connector: waasConnector,
		sdkConfig: createConfig({
			rpcUrl: "https://polygon-rpc.com",
			chainId: polygon.id,
			transport: custom({
				request: async () => ({})
			}),
		})})
    });*/

		it('Should call ctas onClick after checking chain', async () => {
			fireEvent.click(testButton);

			switchChainModal$.state.chainIdToSwitchTo.set(polygon.id);

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
