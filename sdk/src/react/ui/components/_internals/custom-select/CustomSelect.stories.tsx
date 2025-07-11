import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CustomSelect } from './CustomSelect';

const meta: Meta<typeof CustomSelect> = {
	title: 'Internals/Custom Select',
	component: CustomSelect,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A custom dropdown select component with support for string and ReactNode content. Includes keyboard navigation, disabled states, and customizable styling.
				`,
			},
		},
	},
	argTypes: {
		items: {
			control: 'object',
			description: 'Array of selectable items',
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text when no item is selected',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the select is disabled',
		},
		onValueChange: {
			action: 'value changed',
			description: 'Callback when selection changes',
		},
	},
	decorators: [
		(Story) => (
			<div style={{ padding: '1rem', width: '300px' }}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof CustomSelect>;

const basicItems = [
	{ value: 'option1', content: 'Option 1' },
	{ value: 'option2', content: 'Option 2' },
	{ value: 'option3', content: 'Option 3' },
];

const manyItems = [
	{ value: 'apple', content: 'Apple' },
	{ value: 'banana', content: 'Banana' },
	{ value: 'cherry', content: 'Cherry' },
	{ value: 'date', content: 'Date' },
	{ value: 'elderberry', content: 'Elderberry' },
	{ value: 'fig', content: 'Fig' },
	{ value: 'grape', content: 'Grape' },
	{ value: 'honeydew', content: 'Honeydew' },
];

const itemsWithDisabled = [
	{ value: 'available1', content: 'Available Option 1' },
	{ value: 'disabled1', content: 'Disabled Option 1', disabled: true },
	{ value: 'available2', content: 'Available Option 2' },
	{ value: 'disabled2', content: 'Disabled Option 2', disabled: true },
	{ value: 'available3', content: 'Available Option 3' },
];

export const Default: Story = {
	args: {
		items: basicItems,
		placeholder: 'Select an option',
		backgroundColor: '#020000',
	},
};

export const WithDefaultValue: Story = {
	args: {
		items: basicItems,
		defaultValue: basicItems[1],
		placeholder: 'Select an option',
	},
};

export const Disabled: Story = {
	args: {
		items: basicItems,
		placeholder: 'Select an option',
		disabled: true,
	},
};

export const ManyOptions: Story = {
	args: {
		items: manyItems,
		placeholder: 'Choose a fruit',
	},
};

export const WithDisabledItems: Story = {
	args: {
		items: itemsWithDisabled,
		placeholder: 'Select an option',
	},
};

export const CustomPlaceholder: Story = {
	args: {
		items: [
			{ value: 'eth', content: 'Ethereum' },
			{ value: 'btc', content: 'Bitcoin' },
			{ value: 'ada', content: 'Cardano' },
		],
		placeholder: 'Choose cryptocurrency',
	},
};

export const WithReactNodeContent: Story = {
	args: {
		items: [
			{
				value: 'user1',
				content: (
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded-full bg-blue-500" />
						<span>John Doe</span>
					</div>
				),
			},
			{
				value: 'user2',
				content: (
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded-full bg-green-500" />
						<span>Jane Smith</span>
					</div>
				),
			},
			{
				value: 'user3',
				content: (
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded-full bg-red-500" />
						<span>Bob Johnson</span>
					</div>
				),
			},
		],
		placeholder: 'Select a user',
	},
};

// Showcase different configurations
export const SelectShowcase: Story = {
	render: () => (
		<div className="space-y-4">
			<div>
				<h3 className="mb-2 font-medium text-sm">Basic Select</h3>
				<CustomSelect items={basicItems} placeholder="Select an option" />
			</div>
			<div>
				<h3 className="mb-2 font-medium text-sm">With Default Value</h3>
				<CustomSelect
					items={basicItems}
					defaultValue={basicItems[0]}
					placeholder="Select an option"
				/>
			</div>
			<div>
				<h3 className="mb-2 font-medium text-sm">Disabled</h3>
				<CustomSelect
					items={basicItems}
					placeholder="Select an option"
					disabled={true}
				/>
			</div>
			<div>
				<h3 className="mb-2 font-medium text-sm">With Some Disabled Items</h3>
				<CustomSelect
					items={itemsWithDisabled}
					placeholder="Select an option"
				/>
			</div>
		</div>
	),
};

// ========================================
// INTERACTION TESTS - Hidden from UI
// ========================================

export const BasicInteractionTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: basicItems,
		placeholder: 'Select an option',
		onValueChange: fn(),
		testId: 'basic-select',
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Verify initial render with placeholder', async () => {
			const trigger = canvas.getByTestId('basic-select-trigger');
			await expect(trigger).toBeInTheDocument();
			await expect(trigger).toHaveTextContent('Select an option');
		});

		await step('Open dropdown by clicking trigger', async () => {
			const trigger = canvas.getByTestId('basic-select-trigger');
			await userEvent.click(trigger);

			// Content is rendered in a portal, so search in body
			const content = await body.findByTestId('basic-select-content');
			await expect(content).toBeInTheDocument();
		});

		await step('Verify all options are visible', async () => {
			for (const item of basicItems) {
				const option = body.getByTestId(`basic-select-option-${item.value}`);
				await expect(option).toBeInTheDocument();
				await expect(option).toHaveTextContent(item.content as string);
			}
		});

		await step('Select an option and verify callback', async () => {
			const optionToSelect = body.getByTestId('basic-select-option-option2');
			await userEvent.click(optionToSelect);

			await expect(args.onValueChange).toHaveBeenCalledWith('option2');

			// Verify selected option is displayed in trigger
			const trigger = canvas.getByTestId('basic-select-trigger');
			await expect(trigger).toHaveTextContent('Option 2');
		});
	},
};

export const DefaultValueTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: basicItems,
		defaultValue: basicItems[1], // Option 2
		placeholder: 'Select an option',
		onValueChange: fn(),
		testId: 'default-value-select',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Verify default value is displayed', async () => {
			const trigger = canvas.getByTestId('default-value-select-trigger');
			await expect(trigger).toBeInTheDocument();
			await expect(trigger).toHaveTextContent('Option 2');
		});

		await step('Open dropdown and verify default selection', async () => {
			const trigger = canvas.getByTestId('default-value-select-trigger');
			await userEvent.click(trigger);

			const selectedOption = await body.findByTestId(
				'default-value-select-option-option2',
			);
			await expect(selectedOption).toBeInTheDocument();
			// Note: The visual indication of selection would depend on the component's styling
		});
	},
};

export const DisabledStateTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: basicItems,
		placeholder: 'Select an option',
		disabled: true,
		onValueChange: fn(),
		testId: 'disabled-select',
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Verify disabled trigger cannot be clicked', async () => {
			const trigger = canvas.getByTestId('disabled-select-trigger');
			await expect(trigger).toBeInTheDocument();
			await expect(trigger).toBeDisabled();
		});

		await step('Attempt to click disabled trigger', async () => {
			const trigger = canvas.getByTestId('disabled-select-trigger');
			await userEvent.click(trigger);

			// Dropdown should not open
			const content = body.queryByTestId('disabled-select-content');
			await expect(content).not.toBeInTheDocument();

			// Callback should not be called
			await expect(args.onValueChange).not.toHaveBeenCalled();
		});
	},
};

export const DisabledItemsTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: itemsWithDisabled,
		placeholder: 'Select an option',
		onValueChange: fn(),
		testId: 'disabled-items-select',
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Open dropdown', async () => {
			const trigger = canvas.getByTestId('disabled-items-select-trigger');
			await userEvent.click(trigger);

			const content = await body.findByTestId('disabled-items-select-content');
			await expect(content).toBeInTheDocument();
		});

		await step('Verify disabled items cannot be selected', async () => {
			const disabledOption = body.getByTestId(
				'disabled-items-select-option-disabled1',
			);
			await expect(disabledOption).toBeInTheDocument();

			// Verify disabled option has disabled attributes
			await expect(disabledOption).toHaveAttribute('data-disabled', '');

			// Try to click disabled option (this should not work due to pointer-events: none)
			try {
				await userEvent.click(disabledOption);
			} catch (error) {
				// Expected to fail due to pointer-events: none
				expect((error as Error).message).toContain('pointer-events: none');
			}

			// Should not trigger callback for disabled item
			await expect(args.onValueChange).not.toHaveBeenCalledWith('disabled1');
		});

		await step('Verify enabled items can be selected', async () => {
			const enabledOption = body.getByTestId(
				'disabled-items-select-option-available1',
			);
			await userEvent.click(enabledOption);

			await expect(args.onValueChange).toHaveBeenCalledWith('available1');
		});
	},
};

export const ReactNodeContentTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: [
			{
				value: 'user1',
				content: (
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded-full bg-blue-500" />
						<span>John Doe</span>
					</div>
				),
			},
			{
				value: 'user2',
				content: (
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded-full bg-green-500" />
						<span>Jane Smith</span>
					</div>
				),
			},
		],
		placeholder: 'Select a user',
		onValueChange: fn(),
		testId: 'react-node-select',
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Open dropdown with ReactNode content', async () => {
			const trigger = canvas.getByTestId('react-node-select-trigger');
			await userEvent.click(trigger);

			const content = await body.findByTestId('react-node-select-content');
			await expect(content).toBeInTheDocument();
		});

		await step('Verify ReactNode content is rendered', async () => {
			const user1Option = body.getByTestId(
				'react-node-select-option-content-user1',
			);
			await expect(user1Option).toBeInTheDocument();

			const user2Option = body.getByTestId(
				'react-node-select-option-content-user2',
			);
			await expect(user2Option).toBeInTheDocument();
		});

		await step('Select ReactNode option', async () => {
			const user1Option = body.getByTestId('react-node-select-option-user1');
			await userEvent.click(user1Option);

			await expect(args.onValueChange).toHaveBeenCalledWith('user1');
		});
	},
};

export const KeyboardNavigationTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: basicItems,
		placeholder: 'Select an option',
		onValueChange: fn(),
		testId: 'keyboard-select',
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Focus trigger with keyboard', async () => {
			const trigger = canvas.getByTestId('keyboard-select-trigger');
			trigger.focus();
			await expect(trigger).toHaveFocus();
		});

		await step('Open dropdown with Enter key', async () => {
			await userEvent.keyboard('{Enter}');

			const content = await body.findByTestId('keyboard-select-content');
			await expect(content).toBeInTheDocument();
		});

		await step('Navigate with arrow keys', async () => {
			// Test arrow key navigation
			await userEvent.keyboard('{ArrowDown}');
			await userEvent.keyboard('{ArrowDown}');

			// Select with Enter
			await userEvent.keyboard('{Enter}');

			// Should have selected an option
			await expect(args.onValueChange).toHaveBeenCalled();
		});
	},
};

export const MultipleSelectionsTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: basicItems,
		placeholder: 'Select an option',
		onValueChange: fn(),
		testId: 'multiple-select',
	},
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Select first option', async () => {
			const trigger = canvas.getByTestId('multiple-select-trigger');
			await userEvent.click(trigger);

			const option1 = await body.findByTestId('multiple-select-option-option1');
			await userEvent.click(option1);

			await expect(args.onValueChange).toHaveBeenCalledWith('option1');
		});

		await step('Change selection to different option', async () => {
			const trigger = canvas.getByTestId('multiple-select-trigger');
			await userEvent.click(trigger);

			const option3 = await body.findByTestId('multiple-select-option-option3');
			await userEvent.click(option3);

			await expect(args.onValueChange).toHaveBeenCalledWith('option3');

			// Verify trigger shows new selection
			await expect(trigger).toHaveTextContent('Option 3');
		});
	},
};

export const PerformanceTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: manyItems,
		placeholder: 'Choose a fruit',
		onValueChange: fn(),
		testId: 'performance-select',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Measure dropdown open performance', async () => {
			const startTime = performance.now();

			const trigger = canvas.getByTestId('performance-select-trigger');
			await userEvent.click(trigger);

			const content = await body.findByTestId('performance-select-content');
			await expect(content).toBeInTheDocument();

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			console.log(`CustomSelect dropdown render time: ${renderTime}ms`);

			// Verify reasonable render time (less than 100ms for 8 items)
			expect(renderTime).toBeLessThan(100);
		});

		await step('Verify all items rendered', async () => {
			for (const item of manyItems) {
				const option = body.getByTestId(
					`performance-select-option-${item.value}`,
				);
				await expect(option).toBeInTheDocument();
			}
		});
	},
};

export const AccessibilityTest: Story = {
	tags: ['!dev', '!autodocs'],
	args: {
		items: basicItems,
		placeholder: 'Select an option',
		onValueChange: fn(),
		testId: 'accessibility-select',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await step('Verify ARIA attributes', async () => {
			const trigger = canvas.getByTestId('accessibility-select-trigger');
			await expect(trigger).toBeInTheDocument();

			// Check that it's a button element (no need for explicit role="button")
			await expect(trigger.tagName).toBe('BUTTON');

			// Check for ARIA attributes
			await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
		});

		await step('Verify keyboard accessibility', async () => {
			const trigger = canvas.getByTestId('accessibility-select-trigger');

			// Test tab navigation
			trigger.focus();
			await expect(trigger).toHaveFocus();

			// Test space bar to open
			await userEvent.keyboard(' ');

			const content = await body.findByTestId('accessibility-select-content');
			await expect(content).toBeInTheDocument();
		});

		await step('Test Escape key to close', async () => {
			await userEvent.keyboard('{Escape}');

			const content = body.queryByTestId('accessibility-select-content');
			await expect(content).not.toBeInTheDocument();
		});
	},
};
