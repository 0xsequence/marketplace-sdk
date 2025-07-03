import type { Meta, StoryObj } from '@storybook/react-vite';
import Pill from './Pill';

const meta: Meta<typeof Pill> = {
	title: 'Internals/Pill',
	component: Pill,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The Pill component displays text in a rounded, styled container. Commonly used for tags, labels, and status indicators.
				`,
			},
		},
	},
	argTypes: {
		text: {
			control: 'text',
			description: 'The text content to display inside the pill',
		},
	},
	decorators: [
		(Story) => (
			<div style={{ padding: '1rem' }}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {
	args: {
		text: 'Default Pill',
	},
};

export const Short: Story = {
	args: {
		text: 'Tag',
	},
};

export const Long: Story = {
	args: {
		text: 'This is a longer pill text',
	},
};

export const WithNumbers: Story = {
	args: {
		text: '123',
	},
};

export const Status: Story = {
	args: {
		text: 'Active',
	},
};

export const WithEmoji: Story = {
	args: {
		text: '🎮 Gaming',
	},
};

// Showcase multiple pills
export const PillShowcase: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Pill text="Short" />
			<Pill text="Medium Length" />
			<Pill text="Active" />
			<Pill text="123" />
			<Pill text="🎮 Gaming" />
			<Pill text="Web3" />
		</div>
	),
};
