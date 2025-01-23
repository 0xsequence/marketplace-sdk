import { ComponentProps } from 'react';

import AlienSwapLogoSrc from '../images/marketplaces/alien_swap.png';
import AquaXyzLogoSrc from '../images/marketplaces/aqua-xyz.png';
import AuraLogoSrc from '../images/marketplaces/aura.png';
import BlurLogoSrc from '../images/marketplaces/blur.png';
import CoinbaseLogoSrc from '../images/marketplaces/coinbase.png';
import ElementLogoSrc from '../images/marketplaces/element.png';
import FoundationLogoSrc from '../images/marketplaces/foundation.png';
import LooksRareLogoSrc from '../images/marketplaces/looks-rare.png';
import MagicEdenLogoSrc from '../images/marketplaces/magic-eden.png';
import ManifoldLogoSrc from '../images/marketplaces/manifold.png';
import MintifyLogoSrc from '../images/marketplaces/mintify.png';
import NftxLogoSrc from '../images/marketplaces/nftx.png';
import OkxLogoSrc from '../images/marketplaces/okx.png';
import OpenSeaLogoSrc from '../images/marketplaces/open-sea.png';
import RaribleLogoSrc from '../images/marketplaces/rarible.png';
import SequenceLogoSrc from '../images/marketplaces/sequence.png';
import SudoSwapLogoSrc from '../images/marketplaces/sudo-swap.png';
import SuperRareLogoSrc from '../images/marketplaces/super-rare.png';
import X2y2LogoSrc from '../images/marketplaces/x2y2.png';
import ZoraLogoSrc from '../images/marketplaces/zora.png';
import { Image } from '@0xsequence/design-system';

type MarketplaceLogoProps = ComponentProps<typeof Image>;

const createMarketplaceLogo = (src: string, alt: string) => {
	return function MarketplaceLogo({
		alt: altProp,
		...props
	}: MarketplaceLogoProps) {
		return <Image src={src} alt={altProp || alt} {...props} />;
	};
};

export const AlienSwapLogo = createMarketplaceLogo(
	AlienSwapLogoSrc,
	'AlienSwap Logo',
);
export const AquaXyzLogo = createMarketplaceLogo(
	AquaXyzLogoSrc,
	'AquaXyz Logo',
);
export const AuraLogo = createMarketplaceLogo(AuraLogoSrc, 'Aura Logo');
export const BlurLogo = createMarketplaceLogo(BlurLogoSrc, 'Blur Logo');
export const CoinbaseLogo = createMarketplaceLogo(
	CoinbaseLogoSrc,
	'Coinbase Logo',
);
export const ElementLogo = createMarketplaceLogo(
	ElementLogoSrc,
	'Element Logo',
);
export const FoundationLogo = createMarketplaceLogo(
	FoundationLogoSrc,
	'Foundation Logo',
);
export const LooksRareLogo = createMarketplaceLogo(
	LooksRareLogoSrc,
	'LooksRare Logo',
);
export const MagicEdenLogo = createMarketplaceLogo(
	MagicEdenLogoSrc,
	'MagicEden Logo',
);
export const ManifoldLogo = createMarketplaceLogo(
	ManifoldLogoSrc,
	'Manifold Logo',
);
export const MintifyLogo = createMarketplaceLogo(
	MintifyLogoSrc,
	'Mintify Logo',
);
export const NftxLogo = createMarketplaceLogo(NftxLogoSrc, 'NFTX Logo');
export const OkxLogo = createMarketplaceLogo(OkxLogoSrc, 'OKX Logo');
export const OpenSeaLogo = createMarketplaceLogo(
	OpenSeaLogoSrc,
	'OpenSea Logo',
);
export const RaribleLogo = createMarketplaceLogo(
	RaribleLogoSrc,
	'Rarible Logo',
);
export const SequenceLogo = createMarketplaceLogo(
	SequenceLogoSrc,
	'Sequence Logo',
);
export const SudoSwapLogo = createMarketplaceLogo(
	SudoSwapLogoSrc,
	'SudoSwap Logo',
);
export const SuperRareLogo = createMarketplaceLogo(
	SuperRareLogoSrc,
	'SuperRare Logo',
);
export const X2y2Logo = createMarketplaceLogo(X2y2LogoSrc, 'X2Y2 Logo');
export const ZoraLogo = createMarketplaceLogo(ZoraLogoSrc, 'Zora Logo');
