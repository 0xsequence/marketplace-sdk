import * as kit from '@0xsequence/kit';
import { fireEvent, render, screen } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as wagmi from 'wagmi';
import { ActionButtonBody } from '../components/ActionButtonBody';
import { setPendingAction } from '../store';
import { CollectibleCardAction } from '../types';

// Mock the hooks
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
	};
});

vi.mock('@0xsequence/kit', () => ({
	useOpenConnectModal: vi.fn(),
}));

// Mock the store
vi.mock('../store', () => ({
	setPendingAction: vi.fn(),
}));

describe.skip('ActionButtonBody', () => {
	const defaultProps = {
		label: 'Buy now' as const,
		tokenId: '1',
		onClick: vi.fn(),
		action: CollectibleCardAction.BUY as CollectibleCardAction.BUY,
		disabled: false,
		loading: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: undefined });
		vi.mocked(kit.useOpenConnectModal).mockReturnValue({
			setOpenConnectModal: vi.fn(),
		});
	});

	it('renders with correct label', () => {
		render(<ActionButtonBody {...defaultProps} />);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('calls onClick directly when user is connected', () => {
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: '0x123' });
		render(<ActionButtonBody {...defaultProps} />);

		fireEvent.click(screen.getByText('Buy now'));
		expect(defaultProps.onClick).toHaveBeenCalled();
		expect(setPendingAction).not.toHaveBeenCalled();
	});

	it('sets pending action and opens connect modal when user is not connected', () => {
		const setOpenConnectModal = vi.fn();
		// @ts-expect-error
		vi.mocked(kit.useOpenConnectModal).mockReturnValue({
			setOpenConnectModal,
		});

		render(<ActionButtonBody {...defaultProps} />);

		fireEvent.click(screen.getByText('Buy now'));

		expect(setPendingAction).toHaveBeenCalledWith(
			CollectibleCardAction.BUY,
			defaultProps.onClick,
			defaultProps.tokenId,
		);
		expect(setOpenConnectModal).toHaveBeenCalledWith(true);
		expect(defaultProps.onClick).not.toHaveBeenCalled();
	});

	it('prevents event propagation on click', () => {
		const preventDefault = vi.fn();
		const stopPropagation = vi.fn();

		render(<ActionButtonBody {...defaultProps} />);

		const button = screen.getByRole('button');
		const mockEvent = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
		});
		Object.defineProperties(mockEvent, {
			preventDefault: { value: preventDefault },
			stopPropagation: { value: stopPropagation },
		});

		fireEvent(button, mockEvent);

		expect(preventDefault).toHaveBeenCalled();
		expect(stopPropagation).toHaveBeenCalled();
	});

	it('renders with custom icon when provided', () => {
		const TestIcon = () => <span data-testid="test-icon">Icon</span>;
		render(<ActionButtonBody {...defaultProps} icon={TestIcon} />);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
	});

	it('renders with different labels', () => {
		const labels = [
			'Sell',
			'Make an offer',
			'Create listing',
			'Transfer',
		] as const;

		for (const label of labels) {
			render(<ActionButtonBody {...defaultProps} label={label} />);
			expect(screen.getByText(label)).toBeInTheDocument();
		}
	});

	it('calls onClick when clicked and not disabled', () => {
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: '0x123' });
		render(<ActionButtonBody {...defaultProps} />);
		fireEvent.click(screen.getByRole('button'));
		expect(defaultProps.onClick).toHaveBeenCalled();
	});
});
