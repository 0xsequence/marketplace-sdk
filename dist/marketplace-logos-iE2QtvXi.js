import { Suspense, lazy } from "react";
import { Image } from "@0xsequence/design-system";
import { jsx } from "react/jsx-runtime";

//#region src/react/ui/components/marketplace-logos/marketplace-logos.tsx
const createMarketplaceLogo = (importFn, alt) => {
	const LazyLogo = lazy(async () => {
		const src = await importFn();
		return { default: function MarketplaceLogo({ alt: altProp, ...props }) {
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
const AlienSwapLogo = createMarketplaceLogo(() => import("./alien_swap-CFih7nva.js"), "AlienSwap Logo");
const AquaXyzLogo = createMarketplaceLogo(() => import("./aqua-xyz-CsiCE83T.js"), "AquaXyz Logo");
const AuraLogo = createMarketplaceLogo(() => import("./aura-DTuzDOyH.js"), "Aura Logo");
const BlurLogo = createMarketplaceLogo(() => import("./blur-qLfDC3YH.js"), "Blur Logo");
const CoinbaseLogo = createMarketplaceLogo(() => import("./coinbase-seViJOC5.js"), "Coinbase Logo");
const ElementLogo = createMarketplaceLogo(() => import("./element-BghwK4uf.js"), "Element Logo");
const FoundationLogo = createMarketplaceLogo(() => import("./foundation-2Y_UbZG4.js"), "Foundation Logo");
const LooksRareLogo = createMarketplaceLogo(() => import("./looks-rare-kF6PR63u.js"), "LooksRare Logo");
const MagicEdenLogo = createMarketplaceLogo(() => import("./magic-eden-DVEeQp5j.js"), "MagicEden Logo");
const ManifoldLogo = createMarketplaceLogo(() => import("./manifold-BcFukSho.js"), "Manifold Logo");
const MintifyLogo = createMarketplaceLogo(() => import("./mintify-B2b_gEVB.js"), "Mintify Logo");
const NftxLogo = createMarketplaceLogo(() => import("./nftx-DObWcTwi.js"), "NFTX Logo");
const OkxLogo = createMarketplaceLogo(() => import("./okx-BRJQN42X.js"), "OKX Logo");
const OpenSeaLogo = createMarketplaceLogo(() => import("./open-sea-BHIgXmLW.js"), "OpenSea Logo");
const RaribleLogo = createMarketplaceLogo(() => import("./rarible-DNiIH_yL.js"), "Rarible Logo");
const SequenceLogo = createMarketplaceLogo(() => import("./sequence-CQx7i7JE.js"), "Sequence Logo");
const SudoSwapLogo = createMarketplaceLogo(() => import("./sudo-swap-B5tLZTvt.js"), "SudoSwap Logo");
const SuperRareLogo = createMarketplaceLogo(() => import("./super-rare-VgAiwM2G.js"), "SuperRare Logo");
const X2y2Logo = createMarketplaceLogo(() => import("./x2y2-DlQtU1LF.js"), "X2Y2 Logo");
const ZoraLogo = createMarketplaceLogo(() => import("./zora-B6hpiGSG.js"), "Zora Logo");

//#endregion
export { SudoSwapLogo as _, CoinbaseLogo as a, ZoraLogo as b, LooksRareLogo as c, MintifyLogo as d, NftxLogo as f, SequenceLogo as g, RaribleLogo as h, BlurLogo as i, MagicEdenLogo as l, OpenSeaLogo as m, AquaXyzLogo as n, ElementLogo as o, OkxLogo as p, AuraLogo as r, FoundationLogo as s, AlienSwapLogo as t, ManifoldLogo as u, SuperRareLogo as v, X2y2Logo as y };
//# sourceMappingURL=marketplace-logos-iE2QtvXi.js.map