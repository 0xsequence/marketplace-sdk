import { cleanup, fireEvent, render, screen } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCollection, useCurrency } from '../../../../hooks';
import { SellModal } from '../Modal';
import { type OpenSellModalArgs, sellModal$ } from '../store';

import { MarketplaceKind, type Order } from '../../../../_internal';

import { server } from '@test';
import { http, HttpResponse } from 'msw';
import { mockMarketplaceEndpoint } from '../../../../_internal/api/__mocks__/marketplace.msw';
import { useSell } from '../hooks/useSell';

// Test data
const mockOrder = {
	orderId: '1',
	priceAmount: '1000000000000000000',
	priceCurrencyAddress: '0x0',
	quantityRemaining: '1',
	createdAt: new Date().toISOString(),
	marketplace: MarketplaceKind.sequence_marketplace_v2,
} as Order;

const mockModalProps = {
	collectionAddress: '0x123',
	chainId: 1,
	tokenId: '1',
	order: mockOrder,
} satisfies OpenSellModalArgs;

// TODO: remove when there is mocks for more endpoints
vi.mock(import('../../../../hooks'), async (importOriginal) => {
	const mod = await importOriginal();
	return {
		...mod,
		useCollection: vi.fn().mockImplementation(mod.useCollection),
		useCurrency: vi.fn().mockImplementation(mod.useCurrency),
	};
});

vi.mock('@0xsequence/kit', () => ({
	useWaasFeeOptions: vi.fn().mockReturnValue([]),
}));

beforeEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.mock('../hooks/useSell', () => ({
		useSell: vi.fn().mockReturnValue({
			isLoading: false,
			executeApproval: vi.fn(),
			sell: vi.fn(),
		}),
	}));
});

describe.skip('SellModal', () => {
	it('should not render when modal is closed', () => {
		render(<SellModal />);
		expect(screen.queryByText('You have an offer')).toBeNull();
	});

	it.skip('should render error state', async () => {
		// Override MSW to return error
		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectible'), () => {
				return HttpResponse.error();
			}),
		);
		sellModal$.open(mockModalProps);
		render(<SellModal />);
		const errorModal = await screen.findByTestId('error-modal');
		expect(errorModal).toBeVisible();
	});

	it.skip('should render main modal when data is loaded', async () => {
		vi.mocked(useCollection).mockReturnValue({
			// @ts-expect-error - TODO: mock this better
			data: {},
			isLoading: false,
			isError: false,
		});

		vi.mocked(useCurrency).mockReturnValue({
			// @ts-expect-error - TODO: mock this better
			data: {},
			isLoading: false,
			isError: false,
		});

		sellModal$.open(mockModalProps);
		render(<SellModal />);
		const text = await screen.findByText('Offer received');
		expect(text).toBeInTheDocument();
	});
});

describe.skip('Modal Actions', () => {
	it('should handle approval step correctly', async () => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		vi.mocked(useCollection as any).mockReturnValue({
			data: {
				name: 'Test Collection',
				decimals: 0,
			},
			isLoading: false,
			isError: false,
		});

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		vi.mocked(useCurrency as any).mockReturnValue({
			data: {
				name: 'Test Currency',
				imageUrl: 'test-url',
			},
			isLoading: false,
			isError: false,
		});

		const mockExecuteApproval = vi.fn();

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(useSell as any).mockReturnValue({
			isLoading: false,
			executeApproval: mockExecuteApproval,
			sell: vi.fn(),
		});

		sellModal$.open({
			...mockModalProps,
			order: {
				...mockOrder,
				quantityRemaining: '1',
			},
		});
		sellModal$.steps.approval.exist.set(true);
		sellModal$.steps.approval.isExecuting.set(false);
		sellModal$.steps.transaction.isExecuting.set(false);
		render(<SellModal />);

		const approveButton = await screen.findByText('Approve TOKEN');
		expect(approveButton).not.toBeDisabled();
		fireEvent.click(approveButton);
		expect(mockExecuteApproval).toHaveBeenCalled();
	});
});

it.skip('should handle sell action correctly', async () => {
	const mockSell = vi.fn();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	(useSell as any).mockReturnValue({
		isLoading: false,
		executeApproval: vi.fn(),
		sell: mockSell,
	});

	sellModal$.open(mockModalProps);
	sellModal$.steps.approval.exist.set(false);
	sellModal$.steps.approval.isExecuting.set(false);
	sellModal$.steps.transaction.isExecuting.set(false);
	render(<SellModal />);

	const acceptButton = screen.getByText('Accept');
	fireEvent.click(acceptButton);
	expect(mockSell).toHaveBeenCalled();
});
