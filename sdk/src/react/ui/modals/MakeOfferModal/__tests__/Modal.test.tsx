import { cleanup, render, renderHook, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { createMockWallet } from '@test/mocks/wallet';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMakeOfferModal } from '..';
import { ContractType, OrderbookKind, WalletKind } from '../../../../_internal';
import * as walletModule from '../../../../_internal/wallet/useWallet';
import { useGenerateOfferTransaction } from '../../../../hooks';
import { MakeOfferModal } from '../Modal';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	collectibleId: TEST_COLLECTIBLE.collectibleId,
};

const mockOffer = {
	tokenId: '1',
	quantity: '1',
	expiry: new Date('2024-12-31'),
	currencyAddress: zeroAddress,
	pricePerToken: '1000000000000000000',
};

const mockTransactionProps = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	maker: zeroAddress,
	contractType: ContractType.ERC721,
	orderbook: OrderbookKind.sequence_marketplace_v2,
	offer: mockOffer,
};

describe('MakeOfferModal', () => {
	const mockOnSuccess = vi.fn();
	const mockWallet = createMockWallet();

	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('should render', () => {
		const { result } = renderHook(() => useMakeOfferModal());

		result.current.show(defaultArgs);

		const modal = render(<MakeOfferModal />);

		expect(modal).toBeDefined();

		modal.unmount();
	});

	it('should show main button if there is no approval step', async () => {
		// Mock sequence wallet
		const sequenceWallet = {
			...mockWallet,
			walletKind: WalletKind.sequence,
		};
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: sequenceWallet,
			isLoading: false,
			isError: false,
		});

		// Render the modal
		const { result } = renderHook(() => useMakeOfferModal());
		result.current.show(defaultArgs);

		const { queryByText } = render(<MakeOfferModal />);

		// Wait for the component to update
		await waitFor(() => {
			// The Approve TOKEN button should not exist
			const approveButton = queryByText('Approve TOKEN');
			expect(approveButton).toBeNull();

			const makeOfferButton = queryByText('Make offer');
			expect(makeOfferButton).toBeDefined();
		});
	});

	it('(non-sequence wallets) should show approve token button if there is an approval step, disable main button', async () => {
		const nonSequenceWallet = {
			...mockWallet,
			walletKind: 'unknown' as WalletKind,
		};
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: nonSequenceWallet,
			isLoading: false,
			isError: false,
		});

		// Render the modal
		const { result } = renderHook(() => useMakeOfferModal());
		result.current.show(defaultArgs);

		const { getByText } = render(<MakeOfferModal />);

		await waitFor(() => {
			// find the Approve TOKEN button
			const approveButton = getByText('Approve TOKEN');
			expect(approveButton).toBeDefined();

			// main button is disabled when approval step exists
			const makeOfferButton = getByText('Make offer');
			expect(makeOfferButton.closest('button')).toHaveAttribute('disabled');
		});
	});
});
