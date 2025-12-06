import { TEST_CURRENCY } from '@test/const';
import { fireEvent, render, screen } from '@test/test-utils';
import { zeroAddress } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import PriceInput from '..';

const defaultProps = {
	chainId: 1,
	collectionAddress: zeroAddress,
	price: {
		amountRaw: 0n,
		currency: TEST_CURRENCY,
	},
};

describe('PriceInput', () => {
	it('should render with initial value of 0', () => {
		render(<PriceInput {...defaultProps} />);
		const input = screen.getByRole('textbox', { name: 'Enter price' });
		expect(input).toHaveValue('0');
	});

	it('should update the price when the input changes', () => {
		render(<PriceInput {...defaultProps} />);
		const input = screen.getByRole('textbox', { name: 'Enter price' });
		fireEvent.change(input, { target: { value: '100' } });
		expect(input).toHaveValue('100');
	});

	it('should call onPriceChange when the input changes', () => {
		const onPriceChange = vi.fn();
		render(<PriceInput {...defaultProps} onPriceChange={onPriceChange} />);
		const input = screen.getByRole('textbox', { name: 'Enter price' });
		fireEvent.change(input, { target: { value: '100' } });
		expect(onPriceChange).toHaveBeenCalledTimes(1);
		expect(onPriceChange).toHaveBeenCalledWith({
			amountRaw: expect.any(BigInt),
			currency: TEST_CURRENCY,
		});
	});

	it('should call onPriceChange with updated price when the input is 0', () => {
		const onPriceChange = vi.fn();
		render(<PriceInput {...defaultProps} onPriceChange={onPriceChange} />);
		const input = screen.getByRole('textbox', { name: 'Enter price' });
		fireEvent.change(input, { target: { value: '100' } });
		fireEvent.change(input, { target: { value: '0' } });
		expect(onPriceChange).toHaveBeenCalledTimes(2); // Called once for '100', once for '0'
		expect(onPriceChange).toHaveBeenCalledWith({
			amountRaw: 0n,
			currency: TEST_CURRENCY,
		});
	});

	it('should handle disabled prop', () => {
		render(<PriceInput {...defaultProps} disabled />);

		const priceInputWrapper = screen
			.getByRole('textbox', { name: 'Enter price' })
			.closest('.price-input');
		expect(priceInputWrapper).toHaveClass('pointer-events-none opacity-50');
	});
});
