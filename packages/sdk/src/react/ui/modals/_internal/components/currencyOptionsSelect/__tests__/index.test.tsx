import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { observable } from '@legendapp/state';
import CurrencyOptionsSelect from '..';
import { Currency } from '../../../../../../_internal';
import { useCurrencies } from '../../../../../../hooks';

// Mock currencies for testing
const MOCK_USDC: Currency = {
  symbol: 'USDC',
  contractAddress: '0x1234',
  chainId: 1,
  name: 'USD Coin',
  decimals: 6,
  imageUrl: 'https://example.com/usdc.png',
  exchangeRate: 1,
  defaultChainCurrency: false,
  nativeCurrency: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const MOCK_WETH: Currency = {
  symbol: 'WETH',
  contractAddress: '0x5678',
  chainId: 1,
  name: 'Wrapped Ether',
  decimals: 18,
  imageUrl: 'https://example.com/weth.png',
  exchangeRate: 1,
  defaultChainCurrency: false,
  nativeCurrency: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock the required hooks
vi.mock('../../../../../../hooks/useCurrencyOptions', () => ({
  useCurrencyOptions: vi.fn(() => ({
    USDC: MOCK_USDC.contractAddress,
    WETH: MOCK_WETH.contractAddress
  }))
}));

vi.mock('../../../../../../hooks', () => ({
  useCurrencies: vi.fn(() => ({
    data: [MOCK_USDC, MOCK_WETH],
    isLoading: false
  }))
}));

// Mock the Skeleton component
vi.mock('@0xsequence/design-system', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    //@ts-ignore
    ...actual,
    Skeleton: () => <div data-testid="skeleton">Loading...</div>
  };
});

describe('CurrencyOptionsSelect', () => {
  const defaultProps = {
    collectionAddress: '0xCollection' as `0x${string}`,
    chainId: 1,
    selectedCurrency$: observable<Currency | null | undefined>(null),
    secondCurrencyAsDefault: false,
    includeNativeCurrency: false
  };

  beforeEach(() => {
    cleanup();
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock values
    vi.mocked(useCurrencies as any).mockReturnValue({
      data: [MOCK_USDC, MOCK_WETH],
      isLoading: false
    });
  });

  it('should render loading skeleton when currencies are loading', () => {
    vi.mocked(useCurrencies as any).mockReturnValueOnce({
      data: undefined,
      isLoading: true
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
      />
    );

    expect(selectedCurrency$.get()).toEqual(MOCK_USDC);
  });

  it('should set second currency as default when secondCurrencyAsDefault is true', () => {
    const selectedCurrency$ = observable<Currency | null | undefined>(null);
    render(
      <CurrencyOptionsSelect
        {...defaultProps}
        selectedCurrency$={selectedCurrency$}
        secondCurrencyAsDefault={true}
      />
    );

    expect(selectedCurrency$.get()).toEqual(MOCK_WETH);
  });

  it('should update selected currency when user selects a different option', () => {
    const selectedCurrency$ = observable(MOCK_USDC);

    const { getByRole, getByText } = render(
      <CurrencyOptionsSelect
        {...defaultProps}
        selectedCurrency$={selectedCurrency$}
      />
    );

    // Find and click the select to open the dropdown
    const selectButton = getByRole('combobox');
    fireEvent.click(selectButton);

    // Find and click the WETH option in the dropdown
    const wethOption = getByText('WETH');
    fireEvent.click(wethOption);

    expect(selectedCurrency$.get()).toEqual(MOCK_WETH);
  });

  it('should maintain selected currency when currencies reload', () => {
    const selectedCurrency$ = observable(MOCK_WETH);

    const { rerender } = render(
      <CurrencyOptionsSelect
        {...defaultProps}
        selectedCurrency$={selectedCurrency$}
      />
    );

    rerender(
      <CurrencyOptionsSelect
        {...defaultProps}
        selectedCurrency$={selectedCurrency$}
      />
    );

    expect(selectedCurrency$.get()).toEqual(MOCK_WETH);
  });
});