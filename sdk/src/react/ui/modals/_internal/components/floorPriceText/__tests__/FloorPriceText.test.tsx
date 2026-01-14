import type { Address, Currency } from '@0xsequence/api-client';
import { render } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	useCollectibleMarketLowestListing,
	useCurrencyComparePrices,
} from '../../../../../../hooks';
import FloorPriceText from '../index';

vi.mock('../../../../../../hooks', async (importOriginal) => {
	const actual =
		(await importOriginal()) as typeof import('../../../../../../hooks');
	return {
		...actual,
		useCollectibleMarketLowestListing: vi.fn(),
		useCurrencyComparePrices: vi.fn(),
	};
});

describe('FloorPriceText', () => {
	const mockCurrency: Currency = {
		contractAddress: '0x0000000000000000000000000000000000000000' as Address,
		symbol: 'ETH',
		decimals: 18,
		name: 'Ethereum',
		chainId: 1,
		status: 'VERIFIED' as Currency['status'],
		imageUrl: '',
		exchangeRate: 0,
		defaultChainCurrency: false,
		nativeCurrency: true,
		openseaListing: true,
		openseaOffer: true,
		createdAt: '',
		updatedAt: '',
	};

	const mockProps = {
		chainId: 1,
		collectionAddress: '0x1234567890123456789012345678901234567890' as Address,
		tokenId: 1n,
		price: {
			amountRaw: 1000000000000000000n,
			currency: mockCurrency,
		},
		onBuyNow: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it.skip('should render null when loading', () => {
		const useCollectibleMarketLowestListingSpy = vi.mocked(
			useCollectibleMarketLowestListing,
		);
		const useComparePricesSpy = vi.mocked(useCurrencyComparePrices);

		const lowestListingMock = {
			data: undefined,
			isLoading: true,
			status: 'pending',
			fetchStatus: 'fetching',
		} as unknown as ReturnType<typeof useCollectibleMarketLowestListing>;

		const comparePricesMock = {
			data: undefined,
			isLoading: true,
			status: 'pending',
			fetchStatus: 'fetching',
		} as unknown as ReturnType<typeof useCurrencyComparePrices>;

		useCollectibleMarketLowestListingSpy.mockReturnValue(lowestListingMock);
		useComparePricesSpy.mockReturnValue(comparePricesMock);

		const { container } = render(<FloorPriceText {...mockProps} />);
		expect(container.firstChild).toBeNull();
	});

	it.skip('should render null when floorPriceRaw is undefined even when not loading', () => {
		const useCollectibleMarketLowestListingSpy = vi.mocked(
			useCollectibleMarketLowestListing,
		);
		const useComparePricesSpy = vi.mocked(useCurrencyComparePrices);

		const lowestListingMock = {
			data: null,
			isLoading: false,
			status: 'success',
			fetchStatus: 'idle',
		} as ReturnType<typeof useCollectibleMarketLowestListing>;

		const comparePricesMock = {
			data: undefined,
			isLoading: false,
			status: 'success',
			fetchStatus: 'idle',
		} as unknown as ReturnType<typeof useCurrencyComparePrices>;

		useCollectibleMarketLowestListingSpy.mockReturnValue(lowestListingMock);
		useComparePricesSpy.mockReturnValue(comparePricesMock);

		const { container } = render(<FloorPriceText {...mockProps} />);
		expect(container.firstChild).toBeNull();
	});

	it.skip('should display "Same as floor price" and Buy Now button when price is same as floor price', () => {
		const useCollectibleMarketLowestListingSpy = vi.mocked(
			useCollectibleMarketLowestListing,
		);
		const useComparePricesSpy = vi.mocked(useCurrencyComparePrices);

		const lowestListingMock = {
			data: {
				priceAmount: 1000000000000000000n,
				priceAmountFormatted: '1',
				priceCurrencyAddress:
					'0x0000000000000000000000000000000000000000' as Address,
			},
			isLoading: false,
			status: 'success',
			fetchStatus: 'idle',
		} as ReturnType<typeof useCollectibleMarketLowestListing>;

		const comparePricesMock = {
			data: {
				status: 'same',
				percentageDifferenceFormatted: '0',
			},
			isLoading: false,
			status: 'success',
			fetchStatus: 'idle',
		} as ReturnType<typeof useCurrencyComparePrices>;

		useCollectibleMarketLowestListingSpy.mockReturnValue(lowestListingMock);
		useComparePricesSpy.mockReturnValue(comparePricesMock);

		const { getByText } = render(<FloorPriceText {...mockProps} />);

		expect(getByText('Same as floor price')).toBeInTheDocument();
		expect(getByText('Buy for 1 ETH')).toBeInTheDocument();
		expect(mockProps.onBuyNow).not.toHaveBeenCalled();
	});

	it.skip('should display percentage below floor price and not show Buy Now button when price is below floor price', () => {
		const useCollectibleMarketLowestListingSpy = vi.mocked(
			useCollectibleMarketLowestListing,
		);
		const useComparePricesSpy = vi.mocked(useCurrencyComparePrices);

		const lowestListingMock = {
			data: {
				priceAmount: 1200000000000000000n, // Floor price is higher
				priceAmountFormatted: '1.2',
				priceCurrencyAddress:
					'0x0000000000000000000000000000000000000000' as Address,
			},
			isLoading: false,
			status: 'success',
			fetchStatus: 'idle',
		} as ReturnType<typeof useCollectibleMarketLowestListing>;

		const comparePricesMock = {
			data: {
				status: 'below',
				percentageDifferenceFormatted: '20',
			},
			isLoading: false,
			status: 'success',
			fetchStatus: 'idle',
		} as ReturnType<typeof useCurrencyComparePrices>;

		useCollectibleMarketLowestListingSpy.mockReturnValue(lowestListingMock);
		useComparePricesSpy.mockReturnValue(comparePricesMock);

		const { getByText, queryByText } = render(
			<FloorPriceText {...mockProps} />,
		);

		expect(getByText('20% below floor price')).toBeInTheDocument();
		expect(queryByText('Buy for 1.2 ETH')).not.toBeInTheDocument();
		expect(mockProps.onBuyNow).not.toHaveBeenCalled();
	});

	it.skip('should display percentage above floor price and show Buy Now button when price is above floor price', () => {
		const useCollectibleMarketLowestListingSpy = vi.mocked(
			useCollectibleMarketLowestListing,
		);
		const useComparePricesSpy = vi.mocked(useCurrencyComparePrices);

		const lowestListingMock = {
			data: {
				priceAmount: 800000000000000000n, // Floor price is lower
				priceAmountFormatted: '0.8',
				priceCurrencyAddress:
					'0x0000000000000000000000000000000000000000' as Address,
			},
			isLoading: false,
			status: 'success',
			fetchStatus: 'idle',
		} as ReturnType<typeof useCollectibleMarketLowestListing>;

		const comparePricesMock = {
			data: {
				status: 'above',
				percentageDifferenceFormatted: '25',
			},
			isLoading: false,
			status: 'success',
			fetchStatus: 'idle',
		} as ReturnType<typeof useCurrencyComparePrices>;

		useCollectibleMarketLowestListingSpy.mockReturnValue(lowestListingMock);
		useComparePricesSpy.mockReturnValue(comparePricesMock);

		const { getByText } = render(<FloorPriceText {...mockProps} />);

		expect(getByText('25% above floor price')).toBeInTheDocument();
		expect(getByText('Buy for 0.8 ETH')).toBeInTheDocument();
		expect(mockProps.onBuyNow).not.toHaveBeenCalled();
	});
});
