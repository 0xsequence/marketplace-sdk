import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomSelect, type SelectItem } from '../CustomSelect';

describe('CustomSelect', () => {
	const mockItems: SelectItem[] = [
		{ value: 'item1', content: 'Item 1' },
		{ value: 'item2', content: 'Item 2' },
		{ value: 'item3', content: 'Item 3', disabled: true },
	];

	const defaultValue = mockItems[0];

	beforeEach(() => {
		cleanup();
	});

	it('should render with default value', () => {
		render(<CustomSelect items={mockItems} defaultValue={defaultValue} />);

		expect(screen.getByText('Item 1')).toBeInTheDocument();
	});

	it('should open dropdown when clicked', () => {
		render(<CustomSelect items={mockItems} defaultValue={defaultValue} />);

		const trigger = screen.getByRole('combobox');
		fireEvent.click(trigger);

		expect(screen.getByText('Item 2')).toBeInTheDocument();
		expect(screen.getByText('Item 3')).toBeInTheDocument();
	});

	it('should call onValueChange when selecting an item', () => {
		const onValueChange = vi.fn();
		render(
			<CustomSelect
				items={mockItems}
				onValueChange={onValueChange}
				defaultValue={defaultValue}
			/>,
		);

		const trigger = screen.getByRole('combobox');
		fireEvent.click(trigger);

		const option = screen.getByText('Item 2');
		fireEvent.click(option);

		expect(onValueChange).toHaveBeenCalledWith('item2');
	});

	it('should not allow selection of disabled items', () => {
		const onValueChange = vi.fn();
		render(
			<CustomSelect
				items={mockItems}
				onValueChange={onValueChange}
				defaultValue={defaultValue}
			/>,
		);

		const trigger = screen.getByRole('combobox');
		fireEvent.click(trigger);

		const disabledOption = screen.getByText('Item 3');
		expect(disabledOption.parentElement).toHaveAttribute(
			'aria-disabled',
			'true',
		);

		fireEvent.click(disabledOption);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('should render custom content in items', () => {
		const customItems: SelectItem[] = [
			{
				value: 'custom1',
				content: <div data-testid="custom-content">Custom Content</div>,
			},
		];

		render(<CustomSelect items={customItems} defaultValue={customItems[0]} />);

		expect(screen.getByTestId('custom-content')).toBeInTheDocument();
	});
});
