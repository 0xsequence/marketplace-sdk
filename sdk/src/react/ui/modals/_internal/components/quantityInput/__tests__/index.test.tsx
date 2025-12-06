import { fireEvent, render, screen } from '@test';
import { describe, expect, it, vi } from 'vitest';
import QuantityInput from '..';

describe('QuantityInput', () => {
	const defaultProps = {
		quantity: 1n,
		invalidQuantity: false,
		onQuantityChange: vi.fn(),
		onInvalidQuantityChange: vi.fn(),
		maxQuantity: 10n,
	};

	it('should render quantity input', () => {
		render(<QuantityInput {...defaultProps} />);
		expect(
			screen.getByRole('textbox', { name: /Enter quantity/i }),
		).toBeInTheDocument();
	});

	it('should display current quantity value', () => {
		render(<QuantityInput {...defaultProps} quantity={5n} />);

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

		expect(onQuantityChange).toHaveBeenCalledWith(5n);
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

		expect(onQuantityChange).toHaveBeenCalledWith(10n); // Capped at max
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(false);
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
				quantity={5n}
				onQuantityChange={onQuantityChange}
			/>,
		);

		const incrementButton = screen.getAllByRole('button')[1]; // The second button is the increment button
		fireEvent.click(incrementButton);

		expect(onQuantityChange).toHaveBeenCalledWith(6n);
	});

	it('should decrement quantity when decrement button is clicked', () => {
		const onQuantityChange = vi.fn();

		render(
			<QuantityInput
				{...defaultProps}
				quantity={5n}
				onQuantityChange={onQuantityChange}
			/>,
		);

		const decrementButton = screen.getAllByRole('button')[0]; // The first button is the decrement button
		fireEvent.click(decrementButton);

		expect(onQuantityChange).toHaveBeenCalledWith(4n);
	});

	it('should disable decrement button when quantity is minimum value', () => {
		render(<QuantityInput {...defaultProps} quantity={1n} />);

		const decrementButton = screen.getAllByRole('button')[0]; // The first button is the decrement button
		expect(decrementButton).toBeDisabled();
	});

	it('should disable increment button when quantity is maximum value', () => {
		render(<QuantityInput {...defaultProps} quantity={10n} />);

		const incrementButton = screen.getAllByRole('button')[1]; // The second button is the increment button
		expect(incrementButton).toBeDisabled();
	});

	it('should properly handle minimum value of 1', () => {
		const onQuantityChange = vi.fn();

		render(
			<QuantityInput
				{...defaultProps}
				quantity={2n}
				onQuantityChange={onQuantityChange}
			/>,
		);

		// Click decrement button to reach minimum value
		const decrementButton = screen.getAllByRole('button')[0];
		fireEvent.click(decrementButton);

		// The min value should be 1
		expect(onQuantityChange).toHaveBeenLastCalledWith(1n);
	});

	it('should cap quantity to maxQuantity when incrementing past the maximum', () => {
		const onQuantityChange = vi.fn();
		const maxQuantity = 10n;

		render(
			<QuantityInput
				{...defaultProps}
				quantity={9n}
				onQuantityChange={onQuantityChange}
				maxQuantity={maxQuantity}
			/>,
		);

		// Click increment button when quantity is 9
		const incrementButton = screen.getAllByRole('button')[1]; // The second button is the increment button
		fireEvent.click(incrementButton);

		// Value should be 10
		expect(onQuantityChange).toHaveBeenCalledWith(10n);
	});

	it('should set quantity to maxQuantity when direct input exceeds max', () => {
		const onQuantityChange = vi.fn();
		const onInvalidQuantityChange = vi.fn();
		const maxQuantity = 10n;

		render(
			<QuantityInput
				{...defaultProps}
				quantity={5n}
				onQuantityChange={onQuantityChange}
				onInvalidQuantityChange={onInvalidQuantityChange}
				maxQuantity={maxQuantity}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '15' } });

		// Value should be capped at max
		expect(onQuantityChange).toHaveBeenCalledWith(10n);
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(false);
	});
});
