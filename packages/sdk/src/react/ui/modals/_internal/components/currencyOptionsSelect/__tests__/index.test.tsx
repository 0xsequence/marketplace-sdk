import '@testing-library/jest-dom/vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { observable } from '@legendapp/state';
import CurrencyOptionsSelect from '..';
import { type Currency } from '../../../../../../_internal';
import { useCurrencies } from '../../../../../../hooks';
import { mockCurrencies } from '../../../../../../_internal/api/__mocks__/marketplace.msw';
import { render } from '../../../../../../_internal/test-utils';

// Mock the Skeleton component
vi.mock('@0xsequence/design-system', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		//@ts-ignore
		...actual,
		Skeleton: () => <div data-testid="skeleton">Loading...</div>,
	};
});

describe('CurrencyOptionsSelect', () => {
	const defaultProps = {
		collectionAddress: '0xCollection' as `0x${string}`,
		chainId: 1,
		selectedCurrency$: observable<Currency | null | undefined>(null),
		secondCurrencyAsDefault: false,
		includeNativeCurrency: false,
	};

	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
	});

	it('should render loading skeleton when currencies are loading', () => {
		vi.mocked(useCurrencies as any).mockReturnValueOnce({
			data: undefined,
			isLoading: true,
		});

		render(<CurrencyOptionsSelect {...defaultProps} />);
		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
	});

	it('should set first currency as default when currencies load', () => {
		const selectedCurrency$ = observable<Currency | null | undefined>(null);
		render(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
			/>,
		);

		expect(selectedCurrency$.get()).toEqual(mockCurrencies[0]);
	});

	it('should set second currency as default when secondCurrencyAsDefault is true', () => {
		const selectedCurrency$ = observable<Currency | null | undefined>(null);
		render(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
				secondCurrencyAsDefault={true}
			/>,
		);

		expect(selectedCurrency$.get()).toEqual(mockCurrencies[1]);
	});

	it('should update selected currency when user selects a different option', () => {
		const firstCurrency = mockCurrencies[0];
		const secondCurrency = mockCurrencies[1];

		const selectedCurrency$ = observable(firstCurrency);

		const { getByRole, getByText } = render(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
			/>,
		);

		// Find and click the select to open the dropdown
		const selectButton = getByRole('combobox');
		fireEvent.click(selectButton);

		// Find and click the WETH option in the dropdown
		const wethOption = getByText(secondCurrency.symbol);
		fireEvent.click(wethOption);

		expect(selectedCurrency$.get()).toEqual(secondCurrency);
	});

	it('should maintain selected currency when currencies reload', () => {
		const selectedCurrency$ = observable(mockCurrencies[0]);

		const { rerender } = render(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
			/>,
		);

		rerender(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
			/>,
		);

		expect(selectedCurrency$.get()).toEqual(mockCurrencies[0]);
	});
});
