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
const AlienSwapLogo = createMarketplaceLogo(() => import("./alien_swap-DjtGZoCO.js"), "AlienSwap Logo");
const AquaXyzLogo = createMarketplaceLogo(() => import("./aqua-xyz-B_G39K_W.js"), "AquaXyz Logo");
const AuraLogo = createMarketplaceLogo(() => import("./aura-C_aZ5E19.js"), "Aura Logo");
const BlurLogo = createMarketplaceLogo(() => import("./blur-fLk2T5sJ.js"), "Blur Logo");
const CoinbaseLogo = createMarketplaceLogo(() => import("./coinbase-CcZ1ojkA.js"), "Coinbase Logo");
const ElementLogo = createMarketplaceLogo(() => import("./element-6wXWJbjD.js"), "Element Logo");
const FoundationLogo = createMarketplaceLogo(() => import("./foundation-BUBZD8vS.js"), "Foundation Logo");
const LooksRareLogo = createMarketplaceLogo(() => import("./looks-rare-Drxr4omA.js"), "LooksRare Logo");
const MagicEdenLogo = createMarketplaceLogo(() => import("./magic-eden-BPDZhwDd.js"), "MagicEden Logo");
const ManifoldLogo = createMarketplaceLogo(() => import("./manifold-BVFDWTN8.js"), "Manifold Logo");
const MintifyLogo = createMarketplaceLogo(() => import("./mintify-Bs1SpID9.js"), "Mintify Logo");
const NftxLogo = createMarketplaceLogo(() => import("./nftx-ZNebOqAy.js"), "NFTX Logo");
const OkxLogo = createMarketplaceLogo(() => import("./okx-CxYCQDxW.js"), "OKX Logo");
const OpenSeaLogo = createMarketplaceLogo(() => import("./open-sea-BRDLkjoh.js"), "OpenSea Logo");
const RaribleLogo = createMarketplaceLogo(() => import("./rarible-b18jzXwD.js"), "Rarible Logo");
const SequenceLogo = createMarketplaceLogo(() => import("./sequence-DgPPNu-v.js"), "Sequence Logo");
const SudoSwapLogo = createMarketplaceLogo(() => import("./sudo-swap-DEFm-WvP.js"), "SudoSwap Logo");
const SuperRareLogo = createMarketplaceLogo(() => import("./super-rare-CJUnUqLX.js"), "SuperRare Logo");
const X2y2Logo = createMarketplaceLogo(() => import("./x2y2-CCmiSiXC.js"), "X2Y2 Logo");
const ZoraLogo = createMarketplaceLogo(() => import("./zora-DvbePaZy.js"), "Zora Logo");

//#endregion
export { AlienSwapLogo, AquaXyzLogo, AuraLogo, BlurLogo, CoinbaseLogo, ElementLogo, FoundationLogo, LooksRareLogo, MagicEdenLogo, ManifoldLogo, MintifyLogo, NftxLogo, OkxLogo, OpenSeaLogo, RaribleLogo, SequenceLogo, SudoSwapLogo, SuperRareLogo, X2y2Logo, ZoraLogo };
//# sourceMappingURL=marketplace-logos-CJo2UJ7W.js.map