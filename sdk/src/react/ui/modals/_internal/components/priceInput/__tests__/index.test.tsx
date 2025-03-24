import { observable } from '@legendapp/state';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PriceInput from '..';
import type { Currency, Price } from '../../../../../../../types';
import { CurrencyStatus } from '../../../../../../_internal';

vi.mock('../hooks/usePriceInput', () => ({
	usePriceInput: vi.fn(({ onPriceChange }) => ({
		value: '0',
		handlePriceChange: (value: string) => {
			try {
				if (value === '0' || !value || Number.isNaN(Number(value))) {
					return;
				}
				onPriceChange?.(value);
			} catch {
				return;
			}
		},
	})),
}));

// Mock useCurrencyBalance hook
vi.mock('../../../../../hooks/useCurrencyBalance', () => ({
	useCurrencyBalance: vi.fn(() => ({
		data: { value: 100n },
		isSuccess: true,
	})),
}));

// TODO: Remove local mocks
// Mock currency data
const MOCK_CURRENCY: Currency = {
	symbol: 'USDC',
	contractAddress: '0x1234' as `0x${string}`,
	chainId: 1,
	name: 'USD Coin',
	decimals: 6,
	imageUrl: 'https://example.com/usdc.png',
	status: CurrencyStatus.active,
	exchangeRate: 1,
	defaultChainCurrency: false,
	nativeCurrency: false,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

// Mock currency with different decimals
const MOCK_CURRENCY_HIGH_DECIMALS: Currency = {
	...MOCK_CURRENCY,
	symbol: 'aPOL',
	contractAddress: '0x5678' as `0x${string}`,
	name: 'aPOL Token',
	decimals: 18,
};

// Mock price data
const createMockPrice = (amount = '0'): Price => ({
	amountRaw: amount,
	currency: MOCK_CURRENCY,
});

describe('PriceInput', () => {
	const defaultProps = {
		collectionAddress: '0xCollection' as `0x${string}`,
		chainId: '1',
		$price: observable<Price | undefined>(createMockPrice()),
		includeNativeCurrency: false,
		secondCurrencyAsDefault: false,
	};

	beforeEach(() => {
		cleanup();
		vi.clearAllMocks();
	});
	afterEach(() => {
		cleanup();
	});

	it('should render price input', () => {
		render(<PriceInput {...defaultProps} />);
		expect(screen.getByRole('textbox', { name: /price/i })).toBeInTheDocument();
	});

	it('should handle price changes', () => {
		const onPriceChange = vi.fn();
		const { getByRole } = render(
			<PriceInput {...defaultProps} onPriceChange={onPriceChange} />,
		);

		const input = getByRole('textbox', { name: /price/i });
		fireEvent.change(input, { target: { value: '100' } });

		expect(onPriceChange).toHaveBeenCalled();
	});

	it('should trigger callback when balance is insufficient', () => {
		const checkBalance = {
			enabled: true,
			callback: vi.fn(),
		};
		const price$ = observable<Price | undefined>(createMockPrice());
		render(
			<PriceInput
				{...defaultProps}
				$price={price$}
				checkBalance={checkBalance}
			/>,
		);

		expect(screen.queryByText('Insufficient balance')).not.toBeInTheDocument();

		const input = screen.getByRole('textbox', { name: /price/i });
		fireEvent.change(input, { target: { value: '2000' } });

		expect(checkBalance.callback).toHaveBeenCalledWith(false);
	});

	it('should not call onPriceChange when amount is zero', () => {
		const onPriceChange = vi.fn();
		render(<PriceInput {...defaultProps} onPriceChange={onPriceChange} />);

		const input = screen.getByRole('textbox', { name: /price/i });
		fireEvent.change(input, { target: { value: '0' } });

		expect(onPriceChange).not.toHaveBeenCalled();
	});

	it('should adjust raw amount when currency decimals change', async () => {
		// Create a price observable with initial currency (6 decimals)
		const price$ = observable<Price | undefined>(createMockPrice());
		const onPriceChange = vi.fn();

		render(
			<PriceInput
				{...defaultProps}
				$price={price$}
				onPriceChange={onPriceChange}
			/>,
		);

		// Enter a price value
		const input = screen.getByRole('textbox', { name: /price/i });

		act(() => {
			fireEvent.change(input, { target: { value: '1000' } });
		});

		// Verify initial raw amount (with 6 decimals)
		expect(price$.get()?.amountRaw).toBe('1000000000');

		// Change currency to one with 18 decimals
		act(() => {
			price$.currency.set(MOCK_CURRENCY_HIGH_DECIMALS);
		});

		// Wait for the effect to process
		await waitFor(() => {
			// The raw amount should be adjusted for the new currency's decimals
			expect(price$.get()?.amountRaw).toBe('1000000000000000000000');
		});
	});
});
