import { cleanup, render, renderHook, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { createMockWallet } from '@test/mocks/wallet';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMakeOfferModal } from '..';
import { ContractType, OrderbookKind } from '../../../../_internal';
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
	});

	it('should render', () => {
		const { result } = renderHook(() => useMakeOfferModal());

		result.current.show(defaultArgs);

		const modal = render(<MakeOfferModal />);

		expect(modal).toBeDefined();

		modal.unmount();
	});
});
