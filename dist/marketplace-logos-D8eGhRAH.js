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
const AlienSwapLogo = createMarketplaceLogo(() => import("./alien_swap-CkPQlmyy.js"), "AlienSwap Logo");
const AquaXyzLogo = createMarketplaceLogo(() => import("./aqua-xyz-C1lJYrSq.js"), "AquaXyz Logo");
const AuraLogo = createMarketplaceLogo(() => import("./aura-BNqCi-Z0.js"), "Aura Logo");
const BlurLogo = createMarketplaceLogo(() => import("./blur-CLX7t1SS.js"), "Blur Logo");
const CoinbaseLogo = createMarketplaceLogo(() => import("./coinbase-CjkBYBFD.js"), "Coinbase Logo");
const ElementLogo = createMarketplaceLogo(() => import("./element-pG6IvNwa.js"), "Element Logo");
const FoundationLogo = createMarketplaceLogo(() => import("./foundation-dA1XQqwA.js"), "Foundation Logo");
const LooksRareLogo = createMarketplaceLogo(() => import("./looks-rare-7eXqDroL.js"), "LooksRare Logo");
const MagicEdenLogo = createMarketplaceLogo(() => import("./magic-eden-2Rq-i0VF.js"), "MagicEden Logo");
const ManifoldLogo = createMarketplaceLogo(() => import("./manifold-BS48sLIJ.js"), "Manifold Logo");
const MintifyLogo = createMarketplaceLogo(() => import("./mintify-DK-rpK3M.js"), "Mintify Logo");
const NftxLogo = createMarketplaceLogo(() => import("./nftx-uQ2_0hJQ.js"), "NFTX Logo");
const OkxLogo = createMarketplaceLogo(() => import("./okx-_jqVcaN7.js"), "OKX Logo");
const OpenSeaLogo = createMarketplaceLogo(() => import("./open-sea-D9V79Ear.js"), "OpenSea Logo");
const RaribleLogo = createMarketplaceLogo(() => import("./rarible-DlC7f8Iw.js"), "Rarible Logo");
const SequenceLogo = createMarketplaceLogo(() => import("./sequence-C98Njynz.js"), "Sequence Logo");
const SudoSwapLogo = createMarketplaceLogo(() => import("./sudo-swap-D4nCpahh.js"), "SudoSwap Logo");
const SuperRareLogo = createMarketplaceLogo(() => import("./super-rare-bG9YLrVA.js"), "SuperRare Logo");
const X2y2Logo = createMarketplaceLogo(() => import("./x2y2-DL2Z0M00.js"), "X2Y2 Logo");
const ZoraLogo = createMarketplaceLogo(() => import("./zora-CzaEZFPb.js"), "Zora Logo");

//#endregion
export { AlienSwapLogo, AquaXyzLogo, AuraLogo, BlurLogo, CoinbaseLogo, ElementLogo, FoundationLogo, LooksRareLogo, MagicEdenLogo, ManifoldLogo, MintifyLogo, NftxLogo, OkxLogo, OpenSeaLogo, RaribleLogo, SequenceLogo, SudoSwapLogo, SuperRareLogo, X2y2Logo, ZoraLogo };
//# sourceMappingURL=marketplace-logos-D8eGhRAH.js.map