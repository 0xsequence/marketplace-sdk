import { MarketplaceKind } from '@0xsequence/api-client';
import type { Image } from '@0xsequence/design-system';
import type { ComponentType } from 'react';
import {
	AlienSwapLogo,
	BlurLogo,
	LooksRareLogo,
	MagicEdenLogo,
	MintifyLogo,
	OpenSeaLogo,
	SequenceLogo,
	X2y2Logo,
} from '../react/ui/components/marketplace-logos';

interface Marketplace {
	logo: ComponentType<React.ComponentProps<typeof Image>>;
	displayName: string;
}

const MARKETPLACES: Record<string, Marketplace> = {
	sequence: {
		logo: SequenceLogo,
		displayName: 'Sequence',
	},
	opensea: {
		logo: OpenSeaLogo,
		displayName: 'OpenSea',
	},
	magiceden: {
		logo: MagicEdenLogo,
		displayName: 'Magic Eden',
	},
	mintify: {
		logo: MintifyLogo,
		displayName: 'Mintify',
	},
	looksrare: {
		logo: LooksRareLogo,
		displayName: 'Looks Rare',
	},
	x2y2: {
		logo: X2y2Logo,
		displayName: 'X2Y2',
	},
	blur: {
		logo: BlurLogo,
		displayName: 'Blur',
	},
	alienswap: {
		logo: AlienSwapLogo,
		displayName: 'AlienSwap',
	},
} as const;

const KIND_TO_MARKETPLACE: Partial<
	Record<MarketplaceKind, keyof typeof MARKETPLACES>
> = {
	[MarketplaceKind.sequence_marketplace_v1]: 'sequence',
	[MarketplaceKind.sequence_marketplace_v2]: 'sequence',
	[MarketplaceKind.opensea]: 'opensea',
	[MarketplaceKind.mintify]: 'mintify',
	[MarketplaceKind.looks_rare]: 'looksrare',
	[MarketplaceKind.x2y2]: 'x2y2',
	[MarketplaceKind.blur]: 'blur',
	[MarketplaceKind.magic_eden]: 'magiceden',
};

type MarketplaceDetailsProp = {
	originName: string;
	kind: MarketplaceKind;
};

// TODO: add support for more marketplaces and improve detection of marketplace
export function getMarketplaceDetails({
	originName,
	kind,
}: MarketplaceDetailsProp) {
	if (
		kind === MarketplaceKind.sequence_marketplace_v1 ||
		kind === MarketplaceKind.sequence_marketplace_v2
	) {
		return MARKETPLACES.sequence;
	}

	let name = originName.toLowerCase();

	try {
		//Check if the name can be parsed as a url
		new URL(name);
		// if it can we are naively trying to extract the root domain
		name = getRootDomain(name) || name;
	} catch {}

	name = name.replace(/ /g, '');

	const details = MARKETPLACES[name];

	if (details) {
		return details;
	}

	if (KIND_TO_MARKETPLACE[kind]) {
		return MARKETPLACES[KIND_TO_MARKETPLACE[kind]];
	}
}

function getRootDomain(url: string) {
	const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '');
	const parts = domain.split('.');
	return parts[parts.length - 2] || parts[0];
}
