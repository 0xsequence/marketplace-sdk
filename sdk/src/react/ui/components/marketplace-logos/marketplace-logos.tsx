import { Image } from '@0xsequence/design-system';
import { type ComponentProps, lazy, Suspense } from 'react';

/* @__PURE__ */
const createMarketplaceLogo = (
	importFn: () => Promise<{ default: string }>,
	alt: string,
) => {
	const LazyLogo = lazy(async () => {
		const src = await importFn();
		return {
			default({ alt: altProp, ...props }: ComponentProps<typeof Image>) {
				return <Image src={src.default} alt={altProp || alt} {...props} />;
			},
		};
	});

	return function MarketplaceLogo(props: ComponentProps<typeof Image>) {
		return (
			<Suspense
				fallback={<div style={{ width: props.width, height: props.height }} />}
			>
					<LazyLogo {...props} />
			</Suspense>
		);
	};
};

export const AlienSwapLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/alien_swap.png'),
	'AlienSwap Logo',
);
export const AquaXyzLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/aqua-xyz.png'),
	'AquaXyz Logo',
);
export const AuraLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/aura.png'),
	'Aura Logo',
);
export const BlurLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/blur.png'),
	'Blur Logo',
);
export const CoinbaseLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/coinbase.png'),
	'Coinbase Logo',
);
export const ElementLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/element.png'),
	'Element Logo',
);
export const FoundationLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/foundation.png'),
	'Foundation Logo',
);
export const LooksRareLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/looks-rare.png'),
	'LooksRare Logo',
);
export const MagicEdenLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/magic-eden.png'),
	'MagicEden Logo',
);
export const ManifoldLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/manifold.png'),
	'Manifold Logo',
);
export const MintifyLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/mintify.png'),
	'Mintify Logo',
);
export const NftxLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/nftx.png'),
	'NFTX Logo',
);
export const OkxLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/okx.png'),
	'OKX Logo',
);
export const OpenSeaLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/open-sea.png'),
	'OpenSea Logo',
);
export const RaribleLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/rarible.png'),
	'Rarible Logo',
);
export const SequenceLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/sequence.png'),
	'Sequence Logo',
);
export const SudoSwapLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/sudo-swap.png'),
	'SudoSwap Logo',
);
export const SuperRareLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/super-rare.png'),
	'SuperRare Logo',
);
export const X2y2Logo = createMarketplaceLogo(
	() => import('../../images/marketplaces/x2y2.png'),
	'X2Y2 Logo',
);
export const ZoraLogo = createMarketplaceLogo(
	() => import('../../images/marketplaces/zora.png'),
	'Zora Logo',
);
