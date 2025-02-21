import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { observable } from '@legendapp/state';
import PriceInput from '..';
import type { Currency, Price } from '../../../../../../../types';
import {
	render,
	screen,
	cleanup,
	fireEvent,
} from '../../../../../../_internal/test-utils';
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
});
