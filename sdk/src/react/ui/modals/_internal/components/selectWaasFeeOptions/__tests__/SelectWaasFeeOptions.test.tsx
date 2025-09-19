import { TokenType } from '@0xsequence/api';
import * as sequenceConnect from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { fireEvent, render, screen, waitFor } from '@test';
import { TEST_CURRENCY } from '@test/const';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
	FeeOptionExtended,
	WaasFeeOptionConfirmation,
} from '../../../../../../../types/waas-types';
import SelectWaasFeeOptions from '..';
import * as storeModule from '../store';
import { selectWaasFeeOptionsStore } from '../store';
import * as useWaasFeeOptionManagerModule from '../useWaasFeeOptionManager';

const mockFeeOption: FeeOptionExtended = {
	gasLimit: 21000,
	to: '0x123',
	value: '1000000000000000',
	token: {
		chainId: 1,
		contractAddress: TEST_CURRENCY.contractAddress,
		decimals: TEST_CURRENCY.decimals,
		logoURL: TEST_CURRENCY.imageUrl,
		name: TEST_CURRENCY.name,
		symbol: TEST_CURRENCY.symbol,
		tokenID: null,
		type: TokenType.ERC20,
	},
	balance: '1000000000000000',
	balanceFormatted: '1',
	hasEnoughBalanceForFee: true,
};

const mockFeeOption2: FeeOptionExtended = {
	gasLimit: 21000,
	to: '0x456',
	value: '2000000000000000',
	token: {
		chainId: 1,
		contractAddress: '0x456',
		decimals: 6,
		logoURL: 'https://example.com/usdc.png',
		name: 'USD Coin',
		symbol: 'USDC',
		tokenID: null,
		type: TokenType.ERC20,
	},
	balance: '2000000000000000',
	balanceFormatted: '2',
	hasEnoughBalanceForFee: true,
};

const mockPendingFeeOptionConfirmation: WaasFeeOptionConfirmation = {
	id: 'fee-confirmation-id',
	options: [mockFeeOption],
	chainId: 1,
};

const mockPendingFeeOptionConfirmationMultiple: WaasFeeOptionConfirmation = {
	id: 'fee-confirmation-id-multiple',
	options: [mockFeeOption, mockFeeOption2],
	chainId: 1,
};

// Mock currency balance with formatted value
const mockCurrencyBalance = {
	value: 2000000000000000n,
	formatted: '0.002',
};

describe('SelectWaasFeeOptions', () => {
	const mockOnCancel = vi.fn();
	const mockHandleConfirmFeeOption = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
		vi.resetModules();

		selectWaasFeeOptionsStore.send({ type: 'show' });
		selectWaasFeeOptionsStore.send({
			type: 'setSelectedFeeOption',
			feeOption: undefined,
		});
	});

	it.skip('should not render when isVisible is false', () => {
		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: undefined,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		// Set isVisible to false
		selectWaasFeeOptionsStore.send({ type: 'hide' });

		const { container } = render(
			<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />,
		);

		expect(container.firstChild).toBeNull();
	});

	it.skip('should not render when fees are sponsored (empty options array)', () => {
		const sponsoredFeeOptionConfirmation: WaasFeeOptionConfirmation = {
			id: 'fee-confirmation-id',
			options: [], // Empty array indicates sponsored fees
			chainId: 1,
		};

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: undefined,
			pendingFeeOptionConfirmation: sponsoredFeeOptionConfirmation as any,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		vi.spyOn(sequenceConnect, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});
		vi.spyOn(sequenceConnect, 'useWaasFeeOptions').mockReturnValue([
			sponsoredFeeOptionConfirmation as any,
			vi.fn(),
			false,
			false,
		] as any);

		const { container } = render(
			<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />,
		);

		expect(container.firstChild).toBeNull();
	});

	it('should render loading skeleton when fee options are loading', () => {
		// Mock the hook with loading state
		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: undefined,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: undefined,
			currencyBalanceLoading: true,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});
		vi.spyOn(sequenceConnect, 'useWaasFeeOptions').mockReturnValue([
			mockPendingFeeOptionConfirmation as any,
			vi.fn(),
			false,
		] as any);
		vi.spyOn(sequenceConnect, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});

		render(<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />);

		expect(screen.getByText('Select a fee option')).toBeInTheDocument();

		// Should render skeleton
		const skeleton = document.querySelector('.h-\\[52px\\]');
		expect(skeleton).toBeInTheDocument();
		expect(skeleton).toHaveClass('animate-shimmer');
	});

	it('should render fee options when loaded', () => {
		selectWaasFeeOptionsStore.send({
			type: 'setSelectedFeeOption',
			feeOption: mockFeeOption,
		});

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation as any,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});
		vi.spyOn(sequenceConnect, 'useWaasFeeOptions').mockReturnValue([
			mockPendingFeeOptionConfirmation as any,
			vi.fn(),
			false,
		] as any);
		vi.spyOn(sequenceConnect, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});

		render(
			<SelectWaasFeeOptions
				chainId={1}
				onCancel={mockOnCancel}
				titleOnConfirm="Confirm fee option"
			/>,
		);

		expect(screen.getByText('Select a fee option')).toBeInTheDocument();
		expect(screen.queryByText('Confirm fee option')).not.toBeInTheDocument();
	});

	it('should select a fee option from multiple options', async () => {
		const mockSetSelectedFeeOption = vi.fn();

		vi.spyOn(storeModule, 'useSelectWaasFeeOptionsStore').mockReturnValue({
			isVisible: true,
			selectedFeeOption: mockFeeOption,
			show: vi.fn(),
			hide: vi.fn(),
			setSelectedFeeOption: mockSetSelectedFeeOption,
			id: undefined,
		});

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation:
				mockPendingFeeOptionConfirmationMultiple as any,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		vi.spyOn(sequenceConnect, 'useWaasFeeOptions').mockReturnValue([
			mockPendingFeeOptionConfirmationMultiple as any,
			vi.fn(),
			false,
		] as any);
		vi.spyOn(sequenceConnect, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});

		render(<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />);

		// Find the select dropdown (fee option selector)
		const selectTrigger = screen.getByRole('combobox');
		expect(selectTrigger).toBeInTheDocument();
		expect(selectTrigger).toHaveAttribute('id', 'fee-option');

		// Click to open the dropdown
		fireEvent.click(selectTrigger);

		// Look for the USDC option in the dropdown
		await waitFor(() => {
			const usdcOption = screen.getByText(/USDC/);
			expect(usdcOption).toBeInTheDocument();

			// Select the USDC option
			fireEvent.click(usdcOption);
		});

		// Verify the setSelectedFeeOption was called with the USDC option
		await waitFor(() => {
			expect(mockSetSelectedFeeOption).toHaveBeenCalledWith(mockFeeOption2);
		});
	});

	it('should close the modal when cancel button is clicked', async () => {
		const mockHide = vi.fn();

		vi.spyOn(storeModule, 'useSelectWaasFeeOptionsStore').mockReturnValue({
			isVisible: true,
			selectedFeeOption: mockFeeOption,
			show: vi.fn(),
			hide: mockHide,
			setSelectedFeeOption: vi.fn(),
			id: undefined,
		});

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation as any,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		vi.spyOn(sequenceConnect, 'useWaasFeeOptions').mockReturnValue([
			mockPendingFeeOptionConfirmation as any,
			vi.fn(),
			false,
		] as any);
		vi.spyOn(sequenceConnect, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});

		render(<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />);

		const cancelButton = screen.getByText('Cancel');
		expect(cancelButton).toBeInTheDocument();

		fireEvent.click(cancelButton);

		expect(mockHide).toHaveBeenCalledTimes(1);
		expect(mockOnCancel).toHaveBeenCalledTimes(1);
	});

	it('should confirm fee option when confirm button is clicked', async () => {
		selectWaasFeeOptionsStore.send({
			type: 'setSelectedFeeOption',
			feeOption: mockFeeOption,
		});

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation as any,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		vi.spyOn(sequenceConnect, 'useWaasFeeOptions').mockReturnValue([
			mockPendingFeeOptionConfirmation as any,
			vi.fn(),
			false,
		] as any);
		vi.spyOn(sequenceConnect, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});

		render(<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />);

		const confirmButton = screen.getByText(
			`Continue with ${mockFeeOption.token.symbol}`,
		);
		expect(confirmButton).toBeInTheDocument();

		fireEvent.click(confirmButton);

		expect(mockHandleConfirmFeeOption).toHaveBeenCalledTimes(1);
	});

	it('should disable confirm button when insufficient balance', () => {
		selectWaasFeeOptionsStore.send({
			type: 'setSelectedFeeOption',
			feeOption: mockFeeOption,
		});

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation as any,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: true, // Insufficient balance
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		vi.spyOn(sequenceConnect, 'useWaasFeeOptions').mockReturnValue([
			mockPendingFeeOptionConfirmation as any,
			vi.fn(),
			false,
		] as any);
		vi.spyOn(sequenceConnect, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});

		render(<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />);

		const confirmButton = screen
			.getByText(`Continue with ${mockFeeOption.token.symbol}`)
			.closest('button');
		expect(confirmButton).toBeDisabled();

		// Try to click it and verify handleConfirmFeeOption is not called
		if (confirmButton) {
			fireEvent.click(confirmButton);
		}
		expect(mockHandleConfirmFeeOption).not.toHaveBeenCalled();
	});

	it('should show confirmed state when fee options are confirmed', () => {
		selectWaasFeeOptionsStore.send({
			type: 'setSelectedFeeOption',
			feeOption: mockFeeOption,
		});

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation as any,
			rejectPendingFeeOption: vi.fn(),
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: true, // Options confirmed
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		vi.spyOn(sequenceConnect, 'useWaasFeeOptions').mockReturnValue([
			mockPendingFeeOptionConfirmation as any,
			vi.fn(),
			false,
		] as any);
		vi.spyOn(sequenceConnect, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});

		render(
			<SelectWaasFeeOptions
				chainId={1}
				onCancel={mockOnCancel}
				titleOnConfirm="Confirm fee option"
			/>,
		);

		expect(screen.getByText('Confirm fee option')).toBeInTheDocument();

		// Should show "Confirming" state in button
		expect(screen.getByText('Confirming')).toBeInTheDocument();

		// Fee options selector should be disabled (pointer-events-none)
		const feeOptionsContainer = document.querySelector('.pointer-events-none');
		expect(feeOptionsContainer).toBeInTheDocument();
	});

	it('should reset store state when modal is hidden via cancel', () => {
		selectWaasFeeOptionsStore.send({
			type: 'setSelectedFeeOption',
			feeOption: mockFeeOption,
		});

		expect(selectWaasFeeOptionsStore.getSnapshot().context.isVisible).toBe(
			true,
		);
		expect(
			selectWaasFeeOptionsStore.getSnapshot().context.selectedFeeOption,
		).toBe(mockFeeOption);

		// Hide the modal (simulating cancel action)
		selectWaasFeeOptionsStore.send({ type: 'hide' });

		// Verify state is reset
		const state = selectWaasFeeOptionsStore.getSnapshot().context;
		expect(state.isVisible).toBe(false);
		expect(state.selectedFeeOption).toBeUndefined();
		expect(state.id).toBeUndefined();
	});
});
