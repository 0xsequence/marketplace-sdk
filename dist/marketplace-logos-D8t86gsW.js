import { Suspense, lazy } from "react";
import { Image } from "@0xsequence/design-system";
import { jsx } from "react/jsx-runtime";

//#region src/react/ui/components/marketplace-logos/marketplace-logos.tsx
const createMarketplaceLogo = (importFn, alt) => {
	const LazyLogo = lazy(async () => {
		const src = await importFn();
		return { default: function MarketplaceLogo({ alt: altProp,...props }) {
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
const AlienSwapLogo = createMarketplaceLogo(() => import("./alien_swap-DJ98gZQp.js"), "AlienSwap Logo");
const AquaXyzLogo = createMarketplaceLogo(() => import("./aqua-xyz-n1PcCCZ0.js"), "AquaXyz Logo");
const AuraLogo = createMarketplaceLogo(() => import("./aura-Bevk_YkS.js"), "Aura Logo");
const BlurLogo = createMarketplaceLogo(() => import("./blur-B5sHErx5.js"), "Blur Logo");
const CoinbaseLogo = createMarketplaceLogo(() => import("./coinbase-D30W-lxA.js"), "Coinbase Logo");
const ElementLogo = createMarketplaceLogo(() => import("./element-C2NJexro.js"), "Element Logo");
const FoundationLogo = createMarketplaceLogo(() => import("./foundation-QgY1lvUj.js"), "Foundation Logo");
const LooksRareLogo = createMarketplaceLogo(() => import("./looks-rare-CMVPny4v.js"), "LooksRare Logo");
const MagicEdenLogo = createMarketplaceLogo(() => import("./magic-eden-IrWp2ZXk.js"), "MagicEden Logo");
const ManifoldLogo = createMarketplaceLogo(() => import("./manifold-DeOE-p2G.js"), "Manifold Logo");
const MintifyLogo = createMarketplaceLogo(() => import("./mintify-DG3GrljJ.js"), "Mintify Logo");
const NftxLogo = createMarketplaceLogo(() => import("./nftx-B3LH-ZYM.js"), "NFTX Logo");
const OkxLogo = createMarketplaceLogo(() => import("./okx-CRFLrT3Z.js"), "OKX Logo");
const OpenSeaLogo = createMarketplaceLogo(() => import("./open-sea-cOpfl366.js"), "OpenSea Logo");
const RaribleLogo = createMarketplaceLogo(() => import("./rarible-guwUx4cn.js"), "Rarible Logo");
const SequenceLogo = createMarketplaceLogo(() => import("./sequence-Dt2Xo7Fa.js"), "Sequence Logo");
const SudoSwapLogo = createMarketplaceLogo(() => import("./sudo-swap-CGoARONs.js"), "SudoSwap Logo");
const SuperRareLogo = createMarketplaceLogo(() => import("./super-rare-NeQtZjcn.js"), "SuperRare Logo");
const X2y2Logo = createMarketplaceLogo(() => import("./x2y2-CQdg24VP.js"), "X2Y2 Logo");
const ZoraLogo = createMarketplaceLogo(() => import("./zora-DdEydy4L.js"), "Zora Logo");

//#endregion
export { AlienSwapLogo, AquaXyzLogo, AuraLogo, BlurLogo, CoinbaseLogo, ElementLogo, FoundationLogo, LooksRareLogo, MagicEdenLogo, ManifoldLogo, MintifyLogo, NftxLogo, OkxLogo, OpenSeaLogo, RaribleLogo, SequenceLogo, SudoSwapLogo, SuperRareLogo, X2y2Logo, ZoraLogo };
//# sourceMappingURL=marketplace-logos-D8t86gsW.js.map