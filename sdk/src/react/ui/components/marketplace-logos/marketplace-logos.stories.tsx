import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AlienSwapLogo,
	AquaXyzLogo,
	AuraLogo,
	BlurLogo,
	CoinbaseLogo,
	ElementLogo,
	FoundationLogo,
	LooksRareLogo,
	MagicEdenLogo,
	ManifoldLogo,
	MintifyLogo,
	NftxLogo,
	OkxLogo,
	OpenSeaLogo,
	RaribleLogo,
	SequenceLogo,
	SudoSwapLogo,
	SuperRareLogo,
	X2y2Logo,
	ZoraLogo,
} from './marketplace-logos';

const meta: Meta<typeof OpenSeaLogo> = {
	title: 'Internals/Marketplace Logos',
	component: OpenSeaLogo,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
Marketplace logo components that lazy-load marketplace brand images. Each logo is optimized for performance with lazy loading and proper fallbacks.
				`,
			},
		},
	},
	argTypes: {
		width: {
			control: 'number',
			description: 'Logo width',
		},
		height: {
			control: 'number',
			description: 'Logo height',
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
type Story = StoryObj<typeof OpenSeaLogo>;

export const OpenSea: Story = {
	args: {
		width: 64,
		height: 64,
	},
};

export const Sequence: Story = {
	render: (args) => <SequenceLogo {...args} />,
	args: {
		width: 64,
		height: 64,
	},
};

export const Blur: Story = {
	render: (args) => <BlurLogo {...args} />,
	args: {
		width: 64,
		height: 64,
	},
};

export const MagicEden: Story = {
	render: (args) => <MagicEdenLogo {...args} />,
	args: {
		width: 64,
		height: 64,
	},
};

export const LooksRare: Story = {
	render: (args) => <LooksRareLogo {...args} />,
	args: {
		width: 64,
		height: 64,
	},
};

export const SmallSize: Story = {
	args: {
		width: 32,
		height: 32,
	},
};

export const LargeSize: Story = {
	args: {
		width: 128,
		height: 128,
	},
};

// Showcase all marketplace logos
export const AllMarketplaceLogos: Story = {
	render: () => (
		<div className="grid grid-cols-5 gap-4 p-4">
			<div className="flex flex-col items-center gap-2">
				<AlienSwapLogo width={48} height={48} />
				<span className="text-xs">AlienSwap</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<AquaXyzLogo width={48} height={48} />
				<span className="text-xs">AquaXyz</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<AuraLogo width={48} height={48} />
				<span className="text-xs">Aura</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<BlurLogo width={48} height={48} />
				<span className="text-xs">Blur</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<CoinbaseLogo width={48} height={48} />
				<span className="text-xs">Coinbase</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<ElementLogo width={48} height={48} />
				<span className="text-xs">Element</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<FoundationLogo width={48} height={48} />
				<span className="text-xs">Foundation</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<LooksRareLogo width={48} height={48} />
				<span className="text-xs">LooksRare</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<MagicEdenLogo width={48} height={48} />
				<span className="text-xs">MagicEden</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<ManifoldLogo width={48} height={48} />
				<span className="text-xs">Manifold</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<MintifyLogo width={48} height={48} />
				<span className="text-xs">Mintify</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<NftxLogo width={48} height={48} />
				<span className="text-xs">NFTX</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<OkxLogo width={48} height={48} />
				<span className="text-xs">OKX</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<OpenSeaLogo width={48} height={48} />
				<span className="text-xs">OpenSea</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<RaribleLogo width={48} height={48} />
				<span className="text-xs">Rarible</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<SequenceLogo width={48} height={48} />
				<span className="text-xs">Sequence</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<SudoSwapLogo width={48} height={48} />
				<span className="text-xs">SudoSwap</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<SuperRareLogo width={48} height={48} />
				<span className="text-xs">SuperRare</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<X2y2Logo width={48} height={48} />
				<span className="text-xs">X2Y2</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<ZoraLogo width={48} height={48} />
				<span className="text-xs">Zora</span>
			</div>
		</div>
	),
};
