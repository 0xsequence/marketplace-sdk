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
const AlienSwapLogo = createMarketplaceLogo(() => import("./alien_swap-BTJ7mSR-.js"), "AlienSwap Logo");
const AquaXyzLogo = createMarketplaceLogo(() => import("./aqua-xyz-BYJ9WSP_.js"), "AquaXyz Logo");
const AuraLogo = createMarketplaceLogo(() => import("./aura-D7SUjgro.js"), "Aura Logo");
const BlurLogo = createMarketplaceLogo(() => import("./blur-BcnRFCaV.js"), "Blur Logo");
const CoinbaseLogo = createMarketplaceLogo(() => import("./coinbase-ChoX9Hw2.js"), "Coinbase Logo");
const ElementLogo = createMarketplaceLogo(() => import("./element-Dbcv5qya.js"), "Element Logo");
const FoundationLogo = createMarketplaceLogo(() => import("./foundation-QPhUEUy8.js"), "Foundation Logo");
const LooksRareLogo = createMarketplaceLogo(() => import("./looks-rare-C7cQztTR.js"), "LooksRare Logo");
const MagicEdenLogo = createMarketplaceLogo(() => import("./magic-eden-D3r7jiBG.js"), "MagicEden Logo");
const ManifoldLogo = createMarketplaceLogo(() => import("./manifold-DsX0CBP-.js"), "Manifold Logo");
const MintifyLogo = createMarketplaceLogo(() => import("./mintify-DiOoDmO1.js"), "Mintify Logo");
const NftxLogo = createMarketplaceLogo(() => import("./nftx-CP82jNra.js"), "NFTX Logo");
const OkxLogo = createMarketplaceLogo(() => import("./okx-p9-4xRjs.js"), "OKX Logo");
const OpenSeaLogo = createMarketplaceLogo(() => import("./open-sea-D2GwAmKS.js"), "OpenSea Logo");
const RaribleLogo = createMarketplaceLogo(() => import("./rarible-DqiiW9ki.js"), "Rarible Logo");
const SequenceLogo = createMarketplaceLogo(() => import("./sequence-Bbb-TFKg.js"), "Sequence Logo");
const SudoSwapLogo = createMarketplaceLogo(() => import("./sudo-swap-CEPIM3Js.js"), "SudoSwap Logo");
const SuperRareLogo = createMarketplaceLogo(() => import("./super-rare-CMEn9PoO.js"), "SuperRare Logo");
const X2y2Logo = createMarketplaceLogo(() => import("./x2y2-DNe6JgtG.js"), "X2Y2 Logo");
const ZoraLogo = createMarketplaceLogo(() => import("./zora-w0Zqxxs4.js"), "Zora Logo");

//#endregion
export { AlienSwapLogo, AquaXyzLogo, AuraLogo, BlurLogo, CoinbaseLogo, ElementLogo, FoundationLogo, LooksRareLogo, MagicEdenLogo, ManifoldLogo, MintifyLogo, NftxLogo, OkxLogo, OpenSeaLogo, RaribleLogo, SequenceLogo, SudoSwapLogo, SuperRareLogo, X2y2Logo, ZoraLogo };
//# sourceMappingURL=marketplace-logos-DoRN8TTT.js.map