import { TokenType } from '@0xsequence/api';
import * as useNetworkModule from '@0xsequence/connect';
import * as useWaasFeeOptionsModule from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { render, screen } from '@test';
import { TEST_CURRENCY } from '@test/const';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SelectWaasFeeOptions from '..';
import type {
	FeeOption,
	FeeOptionExtended,
	WaasFeeOptionConfirmation,
} from '../../../../../../../types/waas-types';
import { selectWaasFeeOptions$ } from '../store';
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
	const mockSetSelectedFeeOption = vi.fn();

	beforeEach(() => {
		vi.resetAllMocks();
		vi.resetModules();

		// Reset store state
		selectWaasFeeOptions$.send({ type: 'hide' });
		selectWaasFeeOptions$.send({
			type: 'setSelectedFeeOption',
			feeOption: undefined,
		});
		selectWaasFeeOptions$.send({
			type: 'setPendingFeeOptionConfirmation',
			confirmation: undefined,
		});
	});

	it('should not render when isVisible is false', () => {
		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			setSelectedFeeOption: mockSetSelectedFeeOption,
			// @ts-expect-error - types are not compatible
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation,
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		// Set isVisible to false
		selectWaasFeeOptions$.send({ type: 'setVisible', isVisible: false });

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
			setSelectedFeeOption: mockSetSelectedFeeOption,
			// @ts-expect-error - types are not compatible
			pendingFeeOptionConfirmation: sponsoredFeeOptionConfirmation,
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});

		vi.spyOn(useNetworkModule, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});
		vi.spyOn(useWaasFeeOptionsModule, 'useWaasFeeOptions').mockReturnValue([
			// @ts-expect-error - types are not compatible
			sponsoredFeeOptionConfirmation,
			vi.fn(),
		]);

		selectWaasFeeOptions$.send({ type: 'setVisible', isVisible: true });

		const { container } = render(
			<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />,
		);

		expect(container.firstChild).toBeNull();
	});

	it('should render loading skeleton when fee options are loading', () => {
		// Mock the hook with loading state
		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			setSelectedFeeOption: mockSetSelectedFeeOption,
			pendingFeeOptionConfirmation: undefined,
			currencyBalance: undefined,
			currencyBalanceLoading: true,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});
		vi.spyOn(useWaasFeeOptionsModule, 'useWaasFeeOptions').mockReturnValue([
			// @ts-expect-error - types are not compatible
			mockPendingFeeOptionConfirmation,
			vi.fn(),
		]);
		vi.spyOn(useNetworkModule, 'getNetwork').mockReturnValue({
			type: NetworkType.MAINNET,
			chainId: 1,
			name: 'Mainnet',
			nativeToken: TEST_CURRENCY,
		});

		selectWaasFeeOptions$.send({ type: 'setVisible', isVisible: true });

		render(<SelectWaasFeeOptions chainId={1} onCancel={mockOnCancel} />);

		expect(screen.getByText('Select a fee option')).toBeInTheDocument();

		// Should render skeleton
		const skeleton = document.querySelector('.h-\\[52px\\]');
		expect(skeleton).toBeInTheDocument();
		expect(skeleton).toHaveClass('animate-shimmer');
	});

	it('should render fee options when loaded', () => {
		selectWaasFeeOptions$.send({
			type: 'setPendingFeeOptionConfirmation',
			confirmation: mockPendingFeeOptionConfirmation,
		});
		selectWaasFeeOptions$.send({
			type: 'setSelectedFeeOption',
			feeOption: mockFeeOption,
		});
		selectWaasFeeOptions$.send({ type: 'setVisible', isVisible: true });

		vi.spyOn(useWaasFeeOptionManagerModule, 'default').mockReturnValue({
			selectedFeeOption: mockFeeOption,
			setSelectedFeeOption: mockSetSelectedFeeOption,
			// @ts-expect-error - types are not compatible
			pendingFeeOptionConfirmation: mockPendingFeeOptionConfirmation,
			currencyBalance: mockCurrencyBalance,
			currencyBalanceLoading: false,
			insufficientBalance: false,
			feeOptionsConfirmed: false,
			handleConfirmFeeOption: mockHandleConfirmFeeOption,
		});
		vi.spyOn(useWaasFeeOptionsModule, 'useWaasFeeOptions').mockReturnValue([
			// @ts-expect-error - types are not compatible
			mockPendingFeeOptionConfirmation,
			vi.fn(),
		]);
		vi.spyOn(useNetworkModule, 'getNetwork').mockReturnValue({
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
