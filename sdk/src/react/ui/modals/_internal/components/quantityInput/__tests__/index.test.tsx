import { fireEvent, render, screen } from '@test';
import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import { describe, expect, it, vi } from 'vitest';
import QuantityInput from '..';

describe('QuantityInput', () => {
	const defaultProps = {
		quantity: dn.from('1', 0) as Dnum, // User-facing value
		invalidQuantity: false,
		onQuantityChange: vi.fn(),
		onInvalidQuantityChange: vi.fn(),
		maxQuantity: dn.from('100', 1) as Dnum, // Internal representation: 10.0 with 1 decimal
	};

	it('should render quantity input', () => {
		render(<QuantityInput {...defaultProps} />);
		expect(
			screen.getByRole('textbox', { name: /Enter quantity/i }),
		).toBeInTheDocument();
	});

	it('should display current quantity value', () => {
		render(<QuantityInput {...defaultProps} quantity={dn.from('5', 0)} />);

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

		expect(onQuantityChange).toHaveBeenCalledWith(dn.from('5', 0));
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

		// Try to enter 15, which is greater than max of 10
		fireEvent.change(input, { target: { value: '15' } });

		// Should be capped at max value (10)
		expect(onQuantityChange).toHaveBeenCalledWith(dn.from('10', 0));
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(false);
	});

	it('should handle increment button click', () => {
		const onQuantityChange = vi.fn();
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('5', 0)}
				onQuantityChange={onQuantityChange}
			/>,
		);

		const incrementButton = screen.getAllByRole('button')[1]; // The second button is increment
		fireEvent.click(incrementButton);

		expect(onQuantityChange).toHaveBeenCalledWith(dn.from('6', 0));
	});

	it('should handle decrement button click', () => {
		const onQuantityChange = vi.fn();
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('5', 0)}
				onQuantityChange={onQuantityChange}
			/>,
		);

		const decrementButton = screen.getAllByRole('button')[0]; // The first button is decrement
		fireEvent.click(decrementButton);

		expect(onQuantityChange).toHaveBeenCalledWith(dn.from('4', 0));
	});

	it('should not decrement below 1 for integer decimals', () => {
		const onQuantityChange = vi.fn();
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('1', 0)}
				maxQuantity={dn.from('100', 0)} // No decimals
				onQuantityChange={onQuantityChange}
			/>,
		);

		const decrementButton = screen.getAllByRole('button')[0];
		fireEvent.click(decrementButton);

		// Should not be called since we're at minimum
		expect(onQuantityChange).not.toHaveBeenCalled();
	});

	it('should validate and mark invalid quantities', () => {
		const onInvalidQuantityChange = vi.fn();
		render(
			<QuantityInput
				{...defaultProps}
				onInvalidQuantityChange={onInvalidQuantityChange}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });

		// Test empty value
		fireEvent.change(input, { target: { value: '' } });
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(true);

		// Test valid value
		fireEvent.change(input, { target: { value: '5' } });
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(false);
	});

	it('should disable decrement button when quantity is 1', () => {
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('1', 0)}
				maxQuantity={dn.from('100', 0)} // No decimals
			/>,
		);

		const decrementButton = screen.getAllByRole('button')[0];
		expect(decrementButton).toBeDisabled();
	});

	it('should disable increment button when quantity is maximum value', () => {
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('10', 0)}
				maxQuantity={dn.from('100', 1)} // Max is 10 in user-facing terms
			/>,
		);

		const incrementButton = screen.getAllByRole('button')[1];
		expect(incrementButton).toBeDisabled();
	});

	it('should handle disabled state', () => {
		render(<QuantityInput {...defaultProps} disabled={true} />);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		const buttons = screen.getAllByRole('button');

		expect(input).toBeDisabled();
		buttons.forEach((button) => expect(button).toBeDisabled());
	});

	it('should handle decimal values correctly', () => {
		const onQuantityChange = vi.fn();
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('1.5', 0)}
				maxQuantity={dn.from('1000', 2)} // 10.00 with 2 decimals
				onQuantityChange={onQuantityChange}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		fireEvent.change(input, { target: { value: '2.75' } });

		expect(onQuantityChange).toHaveBeenCalledWith(dn.from('2.75', 0));
	});

	it('should handle user-facing values correctly with decimals', () => {
		const onQuantityChange = vi.fn();
		const onInvalidQuantityChange = vi.fn();

		// maxQuantity is 1e18 (internal) = 1.0 (user-facing) with 18 decimals
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('0.5', 0)}
				maxQuantity={dn.from('1000000000000000000', 18)} // 1.0 with 18 decimals
				onQuantityChange={onQuantityChange}
				onInvalidQuantityChange={onInvalidQuantityChange}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });

		// Try to enter 1.5, which is greater than max of 1.0
		fireEvent.change(input, { target: { value: '1.5' } });

		// Should be capped at max user-facing value (1.0)
		expect(onQuantityChange).toHaveBeenCalledWith(dn.from('1', 0));
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(false);
	});

	it('should handle very small decimal increments', () => {
		const onQuantityChange = vi.fn();

		// Test with 18 decimals (common for ERC20 tokens)
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('0.000000000000000001', 0)} // Smallest possible value
				maxQuantity={dn.from('1000000000000000000', 18)} // 1.0 with 18 decimals
				onQuantityChange={onQuantityChange}
			/>,
		);

		const incrementButton = screen.getAllByRole('button')[1];
		fireEvent.click(incrementButton);

		// Should increment by the smallest unit
		expect(onQuantityChange).toHaveBeenCalledWith(
			dn.from('0.000000000000000002', 0),
		);
	});

	it('should format display values without trailing zeros', () => {
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('5.00', 0)}
				maxQuantity={dn.from('10000', 2)} // 100.00 with 2 decimals
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });
		// Should display "5" not "5.00"
		expect(input).toHaveValue('5');
	});

	it('should allow typing decimal point for user input', () => {
		const onInvalidQuantityChange = vi.fn();
		render(
			<QuantityInput
				{...defaultProps}
				onInvalidQuantityChange={onInvalidQuantityChange}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });

		// User types "5."
		fireEvent.change(input, { target: { value: '5.' } });

		// Should mark as invalid but allow the input for continued typing
		expect(onInvalidQuantityChange).toHaveBeenCalledWith(true);
		expect(input).toHaveValue('5.');
	});

	it('should reject non-numeric input', () => {
		const onQuantityChange = vi.fn();
		render(
			<QuantityInput
				{...defaultProps}
				quantity={dn.from('5', 0)}
				onQuantityChange={onQuantityChange}
			/>,
		);

		const input = screen.getByRole('textbox', { name: /Enter quantity/i });

		// Try to enter letters
		fireEvent.change(input, { target: { value: 'abc' } });

		// Should not update
		expect(onQuantityChange).not.toHaveBeenCalled();
		expect(input).toHaveValue('5'); // Should keep previous value
	});
});
