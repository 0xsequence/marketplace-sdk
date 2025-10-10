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
const AlienSwapLogo = createMarketplaceLogo(() => import("./alien_swap-DoY6XfMA.js"), "AlienSwap Logo");
const AquaXyzLogo = createMarketplaceLogo(() => import("./aqua-xyz-BBDxnG14.js"), "AquaXyz Logo");
const AuraLogo = createMarketplaceLogo(() => import("./aura-DGx2zwvF.js"), "Aura Logo");
const BlurLogo = createMarketplaceLogo(() => import("./blur-D8GKrRrq.js"), "Blur Logo");
const CoinbaseLogo = createMarketplaceLogo(() => import("./coinbase-DOry4PXY.js"), "Coinbase Logo");
const ElementLogo = createMarketplaceLogo(() => import("./element-ciybd_VF.js"), "Element Logo");
const FoundationLogo = createMarketplaceLogo(() => import("./foundation-Bq4lRz4x.js"), "Foundation Logo");
const LooksRareLogo = createMarketplaceLogo(() => import("./looks-rare-6H--x3AM.js"), "LooksRare Logo");
const MagicEdenLogo = createMarketplaceLogo(() => import("./magic-eden-BoxEQ1Li.js"), "MagicEden Logo");
const ManifoldLogo = createMarketplaceLogo(() => import("./manifold-DycKsljb.js"), "Manifold Logo");
const MintifyLogo = createMarketplaceLogo(() => import("./mintify-Dyqyo8jQ.js"), "Mintify Logo");
const NftxLogo = createMarketplaceLogo(() => import("./nftx-2LbFjj9Q.js"), "NFTX Logo");
const OkxLogo = createMarketplaceLogo(() => import("./okx-CBEWJNsR.js"), "OKX Logo");
const OpenSeaLogo = createMarketplaceLogo(() => import("./open-sea-Dxntz_PA.js"), "OpenSea Logo");
const RaribleLogo = createMarketplaceLogo(() => import("./rarible-CS0SupHr.js"), "Rarible Logo");
const SequenceLogo = createMarketplaceLogo(() => import("./sequence-paCCener.js"), "Sequence Logo");
const SudoSwapLogo = createMarketplaceLogo(() => import("./sudo-swap-9rH2EgfT.js"), "SudoSwap Logo");
const SuperRareLogo = createMarketplaceLogo(() => import("./super-rare-DHIuWtRw.js"), "SuperRare Logo");
const X2y2Logo = createMarketplaceLogo(() => import("./x2y2-45WDooeh.js"), "X2Y2 Logo");
const ZoraLogo = createMarketplaceLogo(() => import("./zora-CbeBoLvQ.js"), "Zora Logo");

//#endregion
export { AlienSwapLogo, AquaXyzLogo, AuraLogo, BlurLogo, CoinbaseLogo, ElementLogo, FoundationLogo, LooksRareLogo, MagicEdenLogo, ManifoldLogo, MintifyLogo, NftxLogo, OkxLogo, OpenSeaLogo, RaribleLogo, SequenceLogo, SudoSwapLogo, SuperRareLogo, X2y2Logo, ZoraLogo };
//# sourceMappingURL=marketplace-logos-D4dS1Foy.js.map