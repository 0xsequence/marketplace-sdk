import { observable } from '@legendapp/state';
import { fireEvent, render, screen } from '@test';
import { describe, expect, it } from 'vitest';
import QuantityInput from '..';

describe('QuantityInput', () => {
	const defaultProps = {
		$quantity: observable<string>('1'),
		$invalidQuantity: observable<boolean>(false),
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
		const quantity$ = observable<string>('5');
		render(<QuantityInput {...defaultProps} $quantity={quantity$} />);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		expect(input).toHaveValue('5');
	});

	it('should handle quantity changes', () => {
		const quantity$ = observable<string>('1');
		render(<QuantityInput {...defaultProps} $quantity={quantity$} />);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '5' } });

		expect(quantity$.get()).toBe('5');
	});

	it('should not allow values greater than maxQuantity', () => {
		const quantity$ = observable<string>('1');
		const invalidQuantity$ = observable<boolean>(false);

		render(
			<QuantityInput
				{...defaultProps}
				$quantity={quantity$}
				$invalidQuantity={invalidQuantity$}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '15' } });

		expect(invalidQuantity$.get()).toBe(true);
	});

	it('should handle decimal values correctly based on decimal prop', () => {
		const quantity$ = observable<string>('1');
		const invalidQuantity$ = observable<boolean>(false);

		render(
			<QuantityInput
				{...defaultProps}
				$quantity={quantity$}
				$invalidQuantity={invalidQuantity$}
				decimals={2}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '1.234' } });

		expect(quantity$.get()).toBe('1.23'); // Should truncate to 2 decimals
	});

	it('should validate and mark invalid quantities', () => {
		const quantity$ = observable<string>('1');
		const invalidQuantity$ = observable<boolean>(false);

		render(
			<QuantityInput
				{...defaultProps}
				$quantity={quantity$}
				$invalidQuantity={invalidQuantity$}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });

		// Test zero value
		fireEvent.change(input, { target: { value: '0' } });
		expect(invalidQuantity$.get()).toBe(true);

		// Test empty value
		fireEvent.change(input, { target: { value: '' } });
		expect(invalidQuantity$.get()).toBe(true);

		// Test non-numeric value
		fireEvent.change(input, { target: { value: 'abc' } });
		expect(invalidQuantity$.get()).toBe(true);
	});

	it('should increment quantity when increment button is clicked', () => {
		const quantity$ = observable<string>('5');

		render(<QuantityInput {...defaultProps} $quantity={quantity$} />);

		const incrementButton = screen.getAllByRole('button')[1]; // The second button is the increment button
		fireEvent.click(incrementButton);

		expect(quantity$.get()).toBe('6');
	});

	it('should decrement quantity when decrement button is clicked', () => {
		const quantity$ = observable<string>('5');

		render(<QuantityInput {...defaultProps} $quantity={quantity$} />);

		const decrementButton = screen.getAllByRole('button')[0]; // The first button is the decrement button
		fireEvent.click(decrementButton);

		expect(quantity$.get()).toBe('4');
	});

	it('should disable decrement button when quantity is minimum value', () => {
		const quantity$ = observable<string>('0.1');

		render(<QuantityInput {...defaultProps} $quantity={quantity$} />);

		const decrementButton = screen.getAllByRole('button')[0]; // The first button is the decrement button
		expect(decrementButton).toBeDisabled();
	});

	it('should disable increment button when quantity is maximum value', () => {
		const quantity$ = observable<string>('10');

		render(<QuantityInput {...defaultProps} $quantity={quantity$} />);

		const incrementButton = screen.getAllByRole('button')[1]; // The second button is the increment button
		expect(incrementButton).toBeDisabled();
	});

	it('should properly handle non-zero decimals for minimum values', () => {
		const quantity$ = observable<string>('1');

		render(
			<QuantityInput {...defaultProps} $quantity={quantity$} decimals={1} />,
		);

		// Set to 1 first
		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '1' } });

		// Click decrement button, should go to minimum value
		const decrementButton = screen.getAllByRole('button')[0]; // The first button is the decrement button
		fireEvent.click(decrementButton);

		// For decimals=1, the min value should be 0.1
		expect(quantity$.get()).toBe('0.1');

		// Clicking again shouldn't reduce below minimum
		fireEvent.click(decrementButton);
		expect(quantity$.get()).toBe('0.1');
	});
});
