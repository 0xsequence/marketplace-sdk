import { Suspense, lazy } from "react";
import { Image } from "@0xsequence/design-system";
import { jsx } from "react/jsx-runtime";

//#region src/react/ui/components/marketplace-logos/marketplace-logos.tsx
const createMarketplaceLogo = (importFn, alt) => {
	const LazyLogo = lazy(async () => {
		const src = await importFn();
		return { default({ alt: altProp, ...props }) {
			return /* @__PURE__ */ jsx(Image, {
				src: src.default,
				alt: altProp || alt,
				...props
			});
		} };
	});
	return function MarketplaceLogo(props) {
		return /* @__PURE__ */ jsx(Suspense, {
			fallback: /* @__PURE__ */ jsx("div", { style: {
				width: props.width,
				height: props.height
			} }),
			children: /* @__PURE__ */ jsx(LazyLogo, { ...props })
		});
	};
};
const AlienSwapLogo = createMarketplaceLogo(() => import("./alien_swap.js"), "AlienSwap Logo");
const AquaXyzLogo = createMarketplaceLogo(() => import("./aqua-xyz.js"), "AquaXyz Logo");
const AuraLogo = createMarketplaceLogo(() => import("./aura.js"), "Aura Logo");
const BlurLogo = createMarketplaceLogo(() => import("./blur.js"), "Blur Logo");
const CoinbaseLogo = createMarketplaceLogo(() => import("./coinbase.js"), "Coinbase Logo");
const ElementLogo = createMarketplaceLogo(() => import("./element.js"), "Element Logo");
const FoundationLogo = createMarketplaceLogo(() => import("./foundation.js"), "Foundation Logo");
const LooksRareLogo = createMarketplaceLogo(() => import("./looks-rare.js"), "LooksRare Logo");
const MagicEdenLogo = createMarketplaceLogo(() => import("./magic-eden.js"), "MagicEden Logo");
const ManifoldLogo = createMarketplaceLogo(() => import("./manifold.js"), "Manifold Logo");
const MintifyLogo = createMarketplaceLogo(() => import("./mintify.js"), "Mintify Logo");
const NftxLogo = createMarketplaceLogo(() => import("./nftx.js"), "NFTX Logo");
const OkxLogo = createMarketplaceLogo(() => import("./okx.js"), "OKX Logo");
const OpenSeaLogo = createMarketplaceLogo(() => import("./open-sea.js"), "OpenSea Logo");
const RaribleLogo = createMarketplaceLogo(() => import("./rarible.js"), "Rarible Logo");
const SequenceLogo = createMarketplaceLogo(() => import("./sequence.js"), "Sequence Logo");
const SudoSwapLogo = createMarketplaceLogo(() => import("./sudo-swap.js"), "SudoSwap Logo");
const SuperRareLogo = createMarketplaceLogo(() => import("./super-rare.js"), "SuperRare Logo");
const X2y2Logo = createMarketplaceLogo(() => import("./x2y2.js"), "X2Y2 Logo");
const ZoraLogo = createMarketplaceLogo(() => import("./zora.js"), "Zora Logo");

//#endregion
export { SudoSwapLogo as _, CoinbaseLogo as a, ZoraLogo as b, LooksRareLogo as c, MintifyLogo as d, NftxLogo as f, SequenceLogo as g, RaribleLogo as h, BlurLogo as i, MagicEdenLogo as l, OpenSeaLogo as m, AquaXyzLogo as n, ElementLogo as o, OkxLogo as p, AuraLogo as r, FoundationLogo as s, AlienSwapLogo as t, ManifoldLogo as u, SuperRareLogo as v, X2y2Logo as y };
//# sourceMappingURL=marketplace-logos.js.map