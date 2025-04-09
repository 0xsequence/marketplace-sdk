import { cleanup, render, renderHook, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useConnect } from 'wagmi';
import { useMakeOfferModal } from '..';
import { ContractType, OrderbookKind } from '../../../../_internal';
import { useWallet } from '../../../../_internal/wallet/useWallet';
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

	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
	});

	it('should render', () => {
		const { result } = renderHook(() => useMakeOfferModal());

		result.current.show(defaultArgs);

		const modal = render(<MakeOfferModal />);

		expect(modal).toBeDefined();

		modal.unmount();
	});

	describe('non-sequence wallets', () => {
		it('should have a tokenApproval step if an approval is required', async () => {
			const { result: connectResult } = renderHook(() => useConnect());
			const { result: walletResult } = renderHook(() => useWallet());
			const { result: makeOfferResult } = renderHook(() => useMakeOfferModal());

			// .connect without options defaults to non-sequence wallets, which, if an approval step is required, we will see it in response of the useGenerateOfferTransaction hook
			connectResult.current.connect({
				connector: connectResult.current.connectors[0],
			});

			expect(walletResult.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(walletResult.current.isLoading).toBe(false);
			});

			makeOfferResult.current.show(defaultArgs);

			const modal = render(<MakeOfferModal />);

			expect(modal).toBeDefined();

			const { result } = renderHook(() =>
				useGenerateOfferTransaction({
					...defaultArgs,
					onSuccess: mockOnSuccess,
				}),
			);

			await result.current.generateOfferTransactionAsync(mockTransactionProps);

			// there's a tokenApproval step and a createOffer step
			expect(mockOnSuccess.mock.lastCall).toMatchInlineSnapshot(`
				[
				  [
				    {
				      "data": "0x...",
				      "id": "tokenApproval",
				      "price": "0",
				      "to": "0x1234567890123456789012345678901234567890",
				      "value": "0",
				    },
				    {
				      "data": "0x...",
				      "id": "createOffer",
				      "price": "0",
				      "to": "0x1234567890123456789012345678901234567890",
				      "value": "0",
				    },
				  ],
				  {
				    "collectionAddress": "0xbabafdd8045740449a42b788a26e9b3a32f88ac1",
				    "contractType": "ERC721",
				    "maker": "0x0000000000000000000000000000000000000000",
				    "offer": {
				      "currencyAddress": "0x0000000000000000000000000000000000000000",
				      "expiry": 2024-12-31T00:00:00.000Z,
				      "pricePerToken": "1000000000000000000",
				      "quantity": "1",
				      "tokenId": "1",
				    },
				    "orderbook": "sequence_marketplace_v2",
				  },
				  undefined,
				]
			`);
		});
	});
});
