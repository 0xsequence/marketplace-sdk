import { TEST_CURRENCY } from '@test/const';
import { fireEvent, render, screen } from '@test/test-utils';
import { zeroAddress } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import PriceInput from '..';

const defaultProps = {
	chainId: 1,
	collectionAddress: zeroAddress,
	price: {
		amountRaw: '0',
		currency: TEST_CURRENCY,
	},
	onPriceChange: vi.fn(),
};

describe('PriceInput', () => {
	it('should render with initial value of 0', () => {
		const props = { ...defaultProps, onPriceChange: vi.fn() };
		render(<PriceInput {...props} />);
		const input = screen.getByRole('textbox', { name: 'Enter price' });
		expect(input).toHaveValue('0');
	});

	it('should update the price when the input changes', () => {
		const props = { ...defaultProps, onPriceChange: vi.fn() };
		render(<PriceInput {...props} />);
		const input = screen.getByRole('textbox', { name: 'Enter price' });
		fireEvent.change(input, { target: { value: '100' } });
		expect(input).toHaveValue('100');
	});

	it('should call onPriceChange when the input changes', () => {
		const onPriceChange = vi.fn();
		const props = { ...defaultProps, onPriceChange };
		render(<PriceInput {...props} />);
		const input = screen.getByRole('textbox', { name: 'Enter price' });
		fireEvent.change(input, { target: { value: '100' } });
		expect(onPriceChange).toHaveBeenCalledTimes(1);
	});

	it('should not call onPriceChange when the input is 0', () => {
		const onPriceChange = vi.fn();
		const props = { ...defaultProps, onPriceChange };
		render(<PriceInput {...props} />);
		const input = screen.getByRole('textbox', { name: 'Enter price' });
		fireEvent.change(input, { target: { value: '0' } });
		expect(onPriceChange).toHaveBeenCalledTimes(0);
	});

	it('should handle disabled prop', () => {
		const props = { ...defaultProps, onPriceChange: vi.fn(), disabled: true };
		render(<PriceInput {...props} />);

		const priceInputWrapper = screen
			.getByRole('textbox', { name: 'Enter price' })
			.closest('.price-input');
		expect(priceInputWrapper).toHaveClass('pointer-events-none opacity-50');
	});
});
