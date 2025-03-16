import { observable } from '@legendapp/state';
import type { UseQueryResult } from '@tanstack/react-query';
import { render } from '@test';
import { fireEvent, screen, waitFor } from '@test';
import { describe, expect, it, vi } from 'vitest';
import CurrencyOptionsSelect from '..';
import type { Currency } from '../../../../../../_internal';
import { mockCurrencies } from '../../../../../../_internal/api/__mocks__/marketplace.msw';
import { useCurrencies } from '../../../../../../hooks';

describe.skip('CurrencyOptionsSelect', () => {
	const createDefaultProps = () => ({
		collectionAddress: '0xCollection' as `0x${string}`,
		chainId: 1,
		selectedCurrency$: observable<Currency | null | undefined>(null),
		secondCurrencyAsDefault: false,
		includeNativeCurrency: false,
	});

	it('should render loading skeleton when currencies are loading', () => {
		const props = createDefaultProps();
		render(<CurrencyOptionsSelect {...props} />);
		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
	});

	it('should set first currency as default when currencies load', async () => {
		vi.mocked(useCurrencies).mockReturnValue({
			data: mockCurrencies,
			isLoading: false,
		} as UseQueryResult<Currency[], Error>);

		const props = createDefaultProps();
		render(<CurrencyOptionsSelect {...props} />);

		await waitFor(() => {
			const selectedCurrency = props.selectedCurrency$.get();
			expect(selectedCurrency).toBeDefined();
			expect(selectedCurrency?.contractAddress).toBe(
				mockCurrencies[0].contractAddress,
			);
			expect(selectedCurrency?.symbol).toBe(mockCurrencies[0].symbol);
		});

		expect(screen.getByText(mockCurrencies[0].symbol)).toBeInTheDocument();
	});

	it('should set second currency as default when secondCurrencyAsDefault is true', async () => {
		vi.mocked(useCurrencies).mockReturnValue({
			data: mockCurrencies,
			isLoading: false,
		} as UseQueryResult<Currency[], Error>);

		const props = createDefaultProps();
		render(<CurrencyOptionsSelect {...props} secondCurrencyAsDefault={true} />);

		await waitFor(() => {
			const selectedCurrency = props.selectedCurrency$.get();
			expect(selectedCurrency).toBeDefined();
			expect(selectedCurrency?.contractAddress).toBe(
				mockCurrencies[1].contractAddress,
			);
			expect(selectedCurrency?.symbol).toBe(mockCurrencies[1].symbol);
		});

		expect(screen.getByText(mockCurrencies[1].symbol)).toBeInTheDocument();
	});

	it('should update selected currency when user selects a different option', async () => {
		vi.mocked(useCurrencies).mockReturnValue({
			data: mockCurrencies,
			isLoading: false,
		} as UseQueryResult<Currency[], Error>);

		const props = createDefaultProps();
		render(<CurrencyOptionsSelect {...props} />);

		// Wait for initial currency to be set
		await waitFor(() => {
			expect(props.selectedCurrency$.get()).toBeDefined();
		});

		// Find and click the select element
		const selectButton = screen.getByRole('combobox');
		fireEvent.click(selectButton);

		// Find and click the second currency option
		const secondOption = screen.getByText(mockCurrencies[1].symbol);
		fireEvent.click(secondOption);

		// Verify the new selection is reflected in both the observable and UI
		expect(props.selectedCurrency$.get()?.contractAddress).toBe(
			mockCurrencies[1].contractAddress,
		);
		expect(props.selectedCurrency$.get()?.symbol).toBe(
			mockCurrencies[1].symbol,
		);
		expect(screen.getByText(mockCurrencies[1].symbol)).toBeInTheDocument();
	});

	it('should maintain selected currency when currencies reload', async () => {
		const useCurrenciesMock = vi.mocked(useCurrencies);

		// Initial load with currencies
		useCurrenciesMock.mockReturnValue({
			data: mockCurrencies,
			isLoading: false,
		} as UseQueryResult<Currency[], Error>);

		const props = createDefaultProps();
		render(<CurrencyOptionsSelect {...props} />);

		// Wait for initial currency to be set and select the second currency
		await waitFor(() => {
			expect(props.selectedCurrency$.get()).toBeDefined();
		});

		const selectButton = screen.getByRole('combobox');
		fireEvent.click(selectButton);
		const secondOption = screen.getByText(mockCurrencies[1].symbol);
		fireEvent.click(secondOption);

		// Verify second currency is selected
		expect(props.selectedCurrency$.get()?.contractAddress).toBe(
			mockCurrencies[1].contractAddress,
		);

		// Simulate reload by setting loading state
		useCurrenciesMock.mockReturnValue({
			data: undefined,
			isLoading: true,
			error: null,
		} as unknown as UseQueryResult<Currency[], Error>);

		// Verify the selected currency remains the same during loading
		expect(props.selectedCurrency$.get()?.contractAddress).toBe(
			mockCurrencies[1].contractAddress,
		);
		expect(props.selectedCurrency$.get()?.symbol).toBe(
			mockCurrencies[1].symbol,
		);
		expect(screen.getByText(mockCurrencies[1].symbol)).toBeInTheDocument();

		// Simulate reload completion
		useCurrenciesMock.mockReturnValue({
			data: mockCurrencies,
			isLoading: false,
			error: null,
		} as unknown as UseQueryResult<Currency[], Error>);

		// Verify the same currency is still selected after reload
		await waitFor(() => {
			expect(props.selectedCurrency$.get()?.contractAddress).toBe(
				mockCurrencies[1].contractAddress,
			);
			expect(props.selectedCurrency$.get()?.symbol).toBe(
				mockCurrencies[1].symbol,
			);
		});
		expect(screen.getByText(mockCurrencies[1].symbol)).toBeInTheDocument();
	});
});
