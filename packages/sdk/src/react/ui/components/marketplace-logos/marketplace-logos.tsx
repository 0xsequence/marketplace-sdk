import { Image } from '@0xsequence/design-system';
import { type ComponentProps, Suspense, lazy } from 'react';
import type { JSX } from 'react/jsx-runtime';

/* @__PURE__ */
const createMarketplaceLogo = (
	importFn: () => Promise<{ default: string }>,
	alt: string,
) => {
	const LazyLogo = lazy(async () => {
		const src = await importFn();
		return {
			default: function MarketplaceLogo({
				alt: altProp,
				...props
			}: ComponentProps<typeof Image>) {
				return <Image src={src.default} alt={altProp || alt} {...props} />;
			},
		};
	});

	return function MarketplaceLogo(
		props: ComponentProps<typeof Image>,
	): JSX.Element {
		return (
			<Suspense
				fallback={<div style={{ width: props.width, height: props.height }} />}
			>
				{/* @ts-ignore */}
				<LazyLogo {...props} />
			</Suspense>
		);
	};
};

export const AlienSwapLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/alien_swap.png'),
	'AlienSwap Logo',
);
export const AquaXyzLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/aqua-xyz.png'),
		'AquaXyz Logo',
	);
export const AuraLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/aura.png'),
		'Aura Logo',
	);
export const BlurLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/blur.png'),
		'Blur Logo',
	);
export const CoinbaseLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/coinbase.png'),
	'Coinbase Logo',
);
export const ElementLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/element.png'),
		'Element Logo',
	);
export const FoundationLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/foundation.png'),
	'Foundation Logo',
);
export const LooksRareLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/looks-rare.png'),
	'LooksRare Logo',
);
export const MagicEdenLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/magic-eden.png'),
	'MagicEden Logo',
);
export const ManifoldLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/manifold.png'),
	'Manifold Logo',
);
export const MintifyLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/mintify.png'),
		'Mintify Logo',
	);
export const NftxLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/nftx.png'),
		'NFTX Logo',
	);
export const OkxLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/okx.png'),
		'OKX Logo',
	);
export const OpenSeaLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/open-sea.png'),
		'OpenSea Logo',
	);
export const RaribleLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/rarible.png'),
		'Rarible Logo',
	);
export const SequenceLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/sequence.png'),
	'Sequence Logo',
);
export const SudoSwapLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/sudo-swap.png'),
	'SudoSwap Logo',
);
export const SuperRareLogo: (
	props: ComponentProps<typeof Image>,
) => JSX.Element = createMarketplaceLogo(
	() => import('../../images/marketplaces/super-rare.png'),
	'SuperRare Logo',
);
export const X2y2Logo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/x2y2.png'),
		'X2Y2 Logo',
	);
export const ZoraLogo: (props: ComponentProps<typeof Image>) => JSX.Element =
	createMarketplaceLogo(
		() => import('../../images/marketplaces/zora.png'),
		'Zora Logo',
	);
