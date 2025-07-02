import type { Meta, StoryObj } from '@storybook/react-vite';
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
