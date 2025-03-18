import { observable } from '@legendapp/state';
import type { UseQueryResult } from '@tanstack/react-query';
import { render } from '@test';
import { screen, waitFor } from '@testing-library/react';
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

	it('should update selected currency when changed programmatically', async () => {
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

		// Programmatically change the selected currency
		props.selectedCurrency$.set(mockCurrencies[1]);

		// Verify the new selection is reflected in the observable
		expect(props.selectedCurrency$.get()?.contractAddress).toBe(
			mockCurrencies[1].contractAddress,
		);
		expect(props.selectedCurrency$.get()?.symbol).toBe(
			mockCurrencies[1].symbol,
		);
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

		// Wait for initial currency to be set
		await waitFor(() => {
			expect(props.selectedCurrency$.get()).toBeDefined();
		});

		// Programmatically set the second currency
		props.selectedCurrency$.set(mockCurrencies[1]);

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
	});
});
