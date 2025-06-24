import { fireEvent, render, screen } from '@test';
import { describe, expect, it, vi } from 'vitest';
import QuantityInput from '..';

describe('QuantityInput', () => {
	const defaultProps = {
		quantity: '1',
		invalidQuantity: false,
		onQuantityChange: vi.fn(),
		onInvalidQuantityChange: vi.fn(),
		decimals: 1,
		maxQuantity: '10',
	};

	it('should render quantity input', () => {
		render(<QuantityInput {...defaultProps} />);
		expect(
			screen.getByRole('textbox', { name: /Enter quantity/i }),
		).toBeInTheDocument();
	});

	it('should display current quantity value', () => {
		render(<QuantityInput {...defaultProps} quantity="5" />);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		expect(input).toHaveValue('5');
	});

	it('should handle quantity changes', () => {
		const onQuantityChange = vi.fn();
		render(
			<QuantityInput {...defaultProps} onQuantityChange={onQuantityChange} />,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '5' } });

		expect(onQuantityChange).toHaveBeenCalledWith('5');
	});

	it('should not allow values greater than maxQuantity', () => {
		const onQuantityChange = vi.fn();
		const onInvalidQuantityChange = vi.fn();

		render(
			<QuantityInput
				{...defaultProps}
				onQuantityChange={onQuantityChange}
				onInvalidQuantityChange={onInvalidQuantityChange}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '15' } });

		expect(onQuantityChange).toHaveBeenCalledWith('10'); // Capped at max
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(false);
	});

	it('should handle decimal values correctly based on decimal prop', () => {
		const onQuantityChange = vi.fn();
		const onInvalidQuantityChange = vi.fn();

		render(
			<QuantityInput
				{...defaultProps}
				onQuantityChange={onQuantityChange}
				onInvalidQuantityChange={onInvalidQuantityChange}
				decimals={2}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '1.234' } });

		expect(onQuantityChange).toHaveBeenCalledWith('1.23'); // Should truncate to 2 decimals
	});

	it('should validate and mark invalid quantities', () => {
		const onQuantityChange = vi.fn();
		const onInvalidQuantityChange = vi.fn();

		render(
			<QuantityInput
				{...defaultProps}
				onQuantityChange={onQuantityChange}
				onInvalidQuantityChange={onInvalidQuantityChange}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });

		// Test less than min value (should set invalidQuantity to true)
		fireEvent.change(input, { target: { value: '0' } });
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(true);

		// Test empty value (should set invalidQuantity to true)
		fireEvent.change(input, { target: { value: '' } });
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(true);

		// Reset to valid value
		fireEvent.change(input, { target: { value: '1' } });
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(false);
	});

	it('should increment quantity when increment button is clicked', () => {
		const onQuantityChange = vi.fn();

		render(
			<QuantityInput
				{...defaultProps}
				quantity="5"
				onQuantityChange={onQuantityChange}
			/>,
		);

		const incrementButton = screen.getAllByRole('button')[1]; // The second button is the increment button
		fireEvent.click(incrementButton);

		expect(onQuantityChange).toHaveBeenCalledWith('6');
	});

	it('should decrement quantity when decrement button is clicked', () => {
		const onQuantityChange = vi.fn();

		render(
			<QuantityInput
				{...defaultProps}
				quantity="5"
				onQuantityChange={onQuantityChange}
			/>,
		);

		const decrementButton = screen.getAllByRole('button')[0]; // The first button is the decrement button
		fireEvent.click(decrementButton);

		expect(onQuantityChange).toHaveBeenCalledWith('4');
	});

	it('should disable decrement button when quantity is minimum value', () => {
		render(<QuantityInput {...defaultProps} quantity="0.1" />);

		const decrementButton = screen.getAllByRole('button')[0]; // The first button is the decrement button
		expect(decrementButton).toBeDisabled();
	});

	it('should disable increment button when quantity is maximum value', () => {
		render(<QuantityInput {...defaultProps} quantity="10" />);

		const incrementButton = screen.getAllByRole('button')[1]; // The second button is the increment button
		expect(incrementButton).toBeDisabled();
	});

	it('should properly handle non-zero decimals for minimum values', () => {
		const onQuantityChange = vi.fn();

		render(
			<QuantityInput
				{...defaultProps}
				quantity="1"
				onQuantityChange={onQuantityChange}
				decimals={1}
			/>,
		);

		// Set to 1 first
		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '1' } });

		// Click decrement button, should go to minimum value
		const decrementButton = screen.getAllByRole('button')[0]; // The first button is the decrement button
		fireEvent.click(decrementButton);

		// For decimals=1, the min value should be 0.1
		expect(onQuantityChange).toHaveBeenCalledWith('0.1');
	});

	it('should cap quantity to maxQuantity when incrementing past the maximum', () => {
		const onQuantityChange = vi.fn();
		const maxQuantity = '10';

		render(
			<QuantityInput
				{...defaultProps}
				quantity="9"
				onQuantityChange={onQuantityChange}
				maxQuantity={maxQuantity}
			/>,
		);

		// Click increment button when quantity is 9
		const incrementButton = screen.getAllByRole('button')[1]; // The second button is the increment button
		fireEvent.click(incrementButton);

		// Value should be 10
		expect(onQuantityChange).toHaveBeenCalledWith('10');
	});

	it('should set quantity to maxQuantity when direct input exceeds max', () => {
		const onQuantityChange = vi.fn();
		const onInvalidQuantityChange = vi.fn();
		const maxQuantity = '10';

		render(
			<QuantityInput
				{...defaultProps}
				quantity="5"
				onQuantityChange={onQuantityChange}
				onInvalidQuantityChange={onInvalidQuantityChange}
				maxQuantity={maxQuantity}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '15' } });

		// Value should be capped at max
		expect(onQuantityChange).toHaveBeenCalledWith('10');
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(false);
	});
});
