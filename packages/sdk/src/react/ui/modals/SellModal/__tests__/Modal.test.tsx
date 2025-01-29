import '@testing-library/jest-dom/vitest';
import {
	render,
	screen,
	cleanup,
	fireEvent,
} from '../../../../_internal/test-utils';
import {
	describe,
	it,
	expect,
	vi,
	beforeEach,
	beforeAll,
	afterAll,
	afterEach,
} from 'vitest';
import { SellModal } from '../Modal';
import { type OpenSellModalArgs, sellModal$ } from '../store';
import {
	useCollection,
	useCurrency,
	useCollectible,
	useMarketplaceConfig,
	useRoyaltyPercentage,
} from '../../../../hooks';
import { useSell } from '../hooks/useSell';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { MarketplaceKind, type Order } from '../../../../_internal';

import { setupServer } from 'msw/node';
import {
	handlers,
	mockMarketplaceEndpoint,
} from '../../../../_internal/api/__mocks__/marketplace.msw';
import { http, HttpResponse } from 'msw';

// Setup MSW Server
const server = setupServer(...handlers);

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done
afterAll(() => server.close());

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
	chainId: '1',
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

describe('SellModal', () => {
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

	it('should not render when modal is closed', () => {
		render(<SellModal />);
		expect(screen.queryByText('You have an offer')).toBeNull();
	});

	it('should render loading state', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectible'), () => {
				return new Promise(() => {}); // Never resolve to keep loading
			}),
		);
		sellModal$.open(mockModalProps);
		render(<SellModal />);
		expect(screen.getByTestId('loading-modal')).toBeVisible();
	});

	it('should render error state', async () => {
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

	it('should render main modal when data is loaded', async () => {
		vi.mocked(useCollection as any).mockReturnValue({
			data: {},
			isLoading: false,
			isError: false,
		});

		vi.mocked(useCurrency as any).mockReturnValue({
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

// describe('Modal Actions', () => {
// 	it('should handle approval step correctly', async () => {
// 		vi.mocked(useCollection as any).mockReturnValue({
// 			data: {},
// 			isLoading: false,
// 			isError: false,
// 		});

// 		vi.mocked(useCurrency as any).mockReturnValue({
// 			data: {},
// 			isLoading: false,
// 			isError: false,
// 		});

// 		const mockExecuteApproval = vi.fn().mockResolvedValue(undefined);

// 		(useSell as any).mockReturnValue({
// 			isLoading: false,
// 			executeApproval: mockExecuteApproval,
// 			sell: vi.fn(),
// 		});

// 		sellModal$.open(mockModalProps);
// 		sellModal$.steps.approval.exist.set(true);
// 		sellModal$.steps.approval.isExecuting.set(false);
// 		render(<SellModal />);

// 		const approveButton = await screen.findByText('Approve TOKEN');
// 		fireEvent.click(approveButton);
// 		expect(mockExecuteApproval).toHaveBeenCalled();
// 	});
// });

// 	it('should handle sell action correctly', async () => {
// 		const mockSell = vi.fn();
// 		(useSell as any).mockReturnValue({
// 			isLoading: false,
// 			executeApproval: vi.fn(),
// 			sell: mockSell,
// 		});

// 		sellModal$.open(mockModalProps);
// 		sellModal$.steps.approval.exist.set(false);
// 		sellModal$.steps.approval.isExecuting.set(false);
// 		sellModal$.steps.transaction.isExecuting.set(false);
// 		render(<SellModal />);

// 		const acceptButton = screen.getByText('Accept');
// 		await fireEvent.click(acceptButton);
// 		expect(mockSell).toHaveBeenCalled();
// 	});

// 	it('should disable accept button when approval is needed', () => {
// 		sellModal$.open(mockModalProps);
// 		render(<SellModal />);
// 		sellModal$.steps.approval.exist.set(true);
// 		sellModal$.steps.approval.isExecuting.set(false);

// 		const acceptButton = screen.getByRole('button', { name: 'Accept' });
// 		expect(acceptButton).toBeDisabled();
// 	});
// });
