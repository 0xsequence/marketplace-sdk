'use client';

import { cleanup, fireEvent, render, screen } from '@test';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomSelect, type SelectItem } from '../CustomSelect';

// Define types for the props to avoid any
interface DropdownMenuContentProps {
	children: ReactNode;
	align?: string;
	side?: string;
	sideOffset?: number;
	className?: string;
	'data-testid'?: string;
	[key: string]: unknown;
}

interface DropdownMenuCheckboxItemProps {
	children: ReactNode;
	checked?: boolean;
	onCheckedChange?: () => void;
	disabled?: boolean;
	className?: string;
	'data-testid'?: string;
}

// Mock the design system components
vi.mock('@0xsequence/design-system', async (importOriginal) => {
	const actual = await importOriginal();

	// Create a mock implementation that renders all dropdown content immediately
	return {
		// @ts-expect-error - ignore spread type error
		...actual,
		DropdownMenuRoot: ({ children }: { children: ReactNode }) => (
			<div>{children}</div>
		),
		DropdownMenuTrigger: ({ children }: { children: ReactNode }) => (
			<div>{children}</div>
		),
		DropdownMenuPortal: ({ children }: { children: ReactNode }) => (
			<div>{children}</div>
		),
		DropdownMenuContent: ({ children, ...props }: DropdownMenuContentProps) => (
			<div data-testid={props['data-testid']} className="dropdown-content-mock">
				{children}
			</div>
		),
		DropdownMenuCheckboxItem: ({
			children,
			onCheckedChange,
			disabled,
			className,
			'data-testid': testId,
		}: DropdownMenuCheckboxItemProps) => (
			<button
				type="button"
				onClick={disabled ? undefined : onCheckedChange}
				tabIndex={disabled ? -1 : 0}
				data-testid={testId}
				data-disabled={disabled ? 'true' : 'false'}
				className={className}
				disabled={disabled}
			>
				{children}
			</button>
		),
	};
});

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
		// Use getByTestId instead of getByText to avoid duplicate text matches
		expect(screen.getByTestId('custom-select-trigger')).toBeInTheDocument();
		expect(screen.getByTestId('custom-select-trigger')).toHaveTextContent(
			'Item 1',
		);
	});

	it('should display dropdown content', () => {
		render(<CustomSelect items={mockItems} defaultValue={defaultValue} />);

		// With our mocks, the content should be visible without clicking
		expect(screen.getByTestId('custom-select-content')).toBeInTheDocument();
		expect(
			screen.getByTestId('custom-select-option-item2'),
		).toBeInTheDocument();
		expect(
			screen.getByTestId('custom-select-option-item3'),
		).toBeInTheDocument();
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

		const option = screen.getByTestId('custom-select-option-item2');
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

		const disabledOption = screen.getByTestId('custom-select-option-item3');
		expect(disabledOption).toHaveAttribute('data-disabled', 'true');

		fireEvent.click(disabledOption);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	it('should render custom content in items', () => {
		const customItems: SelectItem[] = [
			{
				value: 'custom1',
				content: <div data-testid="custom-content-test">Custom Content</div>,
			},
		];

		render(<CustomSelect items={customItems} defaultValue={customItems[0]} />);

		// Use getAllByTestId since the content appears in both the trigger and dropdown
		const customContentElements = screen.getAllByTestId('custom-content-test');
		expect(customContentElements.length).toBeGreaterThan(0);
		expect(customContentElements[0]).toHaveTextContent('Custom Content');
	});
});
