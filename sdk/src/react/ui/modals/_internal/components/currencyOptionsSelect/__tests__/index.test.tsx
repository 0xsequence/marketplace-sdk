import { observable } from '@legendapp/state';
import type { UseQueryResult } from '@tanstack/react-query';
import { render } from '@test';
import { TEST_CURRENCIES, TEST_CURRENCY } from '@test/const';
import { screen } from '@testing-library/react';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Currency } from '../../../../../../_internal';
import * as hooks from '../../../../../../hooks';
import CurrencyOptionsSelect from '..';

const defaultProps = {
	collectionAddress: zeroAddress,
	chainId: 1,
	selectedCurrency$: observable<Currency | null | undefined>(TEST_CURRENCY),
	secondCurrencyAsDefault: false,
	includeNativeCurrency: false,
};

describe('CurrencyOptionsSelect', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('should render loading skeleton when currencies are loading', () => {
		const useCurrenciesSpy = vi.spyOn(hooks, 'useMarketCurrencies');
		useCurrenciesSpy.mockReturnValue({
			isLoading: true,
			data: undefined,
			error: null,
		} as UseQueryResult<Currency[], Error>);

		render(<CurrencyOptionsSelect {...defaultProps} />);

		const skeleton = document.querySelector('.h-7.w-20.rounded-2xl');
		expect(skeleton).toBeInTheDocument();
		expect(skeleton).toHaveClass('animate-skeleton');
	});

	it('should set first currency as default when currencies load', async () => {
		const useCurrenciesSpy = vi.spyOn(hooks, 'useMarketCurrencies');
		useCurrenciesSpy.mockReturnValue({
			isLoading: false,
			data: TEST_CURRENCIES,
			error: null,
		} as UseQueryResult<Currency[], Error>);

		render(<CurrencyOptionsSelect {...defaultProps} />);

		const trigger = screen.getByTestId('currency-select-trigger');
		expect(trigger).toBeInTheDocument();
		expect(trigger).toHaveTextContent(TEST_CURRENCY.symbol);
	});
});
