import '@testing-library/jest-dom/vitest';
import { screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { observable } from '@legendapp/state';
import CurrencyOptionsSelect from '..';
import type { Currency } from '../../../../../../_internal';
import { useCurrencies } from '../../../../../../hooks';
import { mockCurrencies } from '../../../../../../_internal/api/__mocks__/marketplace.msw';
import {
	render,
	createSuccessResponse,
	createLoadingResponse,
} from '../../../../../../_internal/test-utils';

// Mock the hooks
vi.mock('../../../../../../hooks', () => ({
	useCurrencies: vi.fn(),
	useCurrencyOptions: vi.fn().mockReturnValue({}),
}));

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
		vi.clearAllMocks();
		vi.mocked(useCurrencies).mockReturnValue(
			createSuccessResponse(mockCurrencies),
		);
	});

	it('should render loading skeleton when currencies are loading', () => {
		vi.mocked(useCurrencies).mockReturnValue(createLoadingResponse());

		render(<CurrencyOptionsSelect {...defaultProps} />);
		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
	});

	it('should set first currency as default when currencies load', async () => {
		const selectedCurrency$ = observable<Currency | null | undefined>(null);

		render(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
			/>,
		);

		await waitFor(() => {
			expect(selectedCurrency$.get()).toEqual(mockCurrencies[0]);
		});
	});

	it('should set second currency as default when secondCurrencyAsDefault is true', async () => {
		const selectedCurrency$ = observable<Currency | null | undefined>(null);

		render(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
				secondCurrencyAsDefault={true}
			/>,
		);

		await waitFor(() => {
			expect(selectedCurrency$.get()).toEqual(mockCurrencies[1]);
		});
	});

	it('should update selected currency when user selects a different option', async () => {
		const firstCurrency = mockCurrencies[0];
		const secondCurrency = mockCurrencies[1];
		const selectedCurrency$ = observable(firstCurrency);

		render(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
			/>,
		);

		await waitFor(() => {
			expect(screen.getByRole('combobox')).toBeInTheDocument();
		});

		// Find and click the select to open the dropdown
		const selectButton = screen.getByRole('combobox');
		fireEvent.click(selectButton);

		// Find and click the second currency option in the dropdown
		const currencyOption = screen.getByText(secondCurrency.symbol);
		fireEvent.click(currencyOption);

		expect(selectedCurrency$.get()).toEqual(secondCurrency);
	});

	it('should maintain selected currency when currencies reload', async () => {
		const selectedCurrency$ = observable(mockCurrencies[0]);

		const { rerender } = render(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
			/>,
		);

		await waitFor(() => {
			expect(screen.getByRole('combobox')).toBeInTheDocument();
		});

		rerender(
			<CurrencyOptionsSelect
				{...defaultProps}
				selectedCurrency$={selectedCurrency$}
			/>,
		);

		expect(selectedCurrency$.get()).toEqual(mockCurrencies[0]);
	});
});
