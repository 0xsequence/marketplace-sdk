import { TokenType } from '@0xsequence/api';
import * as sequenceConnect from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { render, screen } from '@test';
import { TEST_CURRENCY } from '@test/const';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
	FeeOptionExtended,
	WaasFeeOptionConfirmation,
} from '../../../../../../../types/waas-types';
import SelectWaasFeeOptions from '..';
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

const mockPendingFeeOptionConfirmation: WaasFeeOptionConfirmation = {
	id: 'fee-confirmation-id',
	options: [mockFeeOption],
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
		selectWaasFeeOptionsStore.send({
			type: 'setPendingFeeOptionConfirmation',
			confirmation: undefined,
		});
	});

	it('should not render when isVisible is false', () => {
		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation as any,
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

	it('should not render when fees are sponsored (empty options array)', () => {
		const sponsoredFeeOptionConfirmation: WaasFeeOptionConfirmation = {
			id: 'fee-confirmation-id',
			options: [], // Empty array indicates sponsored fees
			chainId: 1,
		};

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: undefined,
			pendingFeeOptionConfirmation: sponsoredFeeOptionConfirmation,
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
			type: 'setPendingFeeOptionConfirmation',
			confirmation: mockPendingFeeOptionConfirmation as any,
		});
		selectWaasFeeOptionsStore.send({
			type: 'setSelectedFeeOption',
			feeOption: mockFeeOption,
		});

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation as any,
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
});
