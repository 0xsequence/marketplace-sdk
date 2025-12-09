'use client'

import { n as CollectibleCardAction } from "./types.js";
import { c as cn$1, l as compareAddress } from "./utils.js";
import { n as ContractType } from "./_internal.js";
import { t as BellIcon_default } from "./BellIcon.js";
import { useAccount } from "wagmi";
import { Suspense, forwardRef, lazy, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, IconButton, Image, Skeleton, Text, cn } from "@0xsequence/design-system";
import { jsx, jsxs } from "react/jsx-runtime";
import { formatUnits } from "viem";

//#region src/react/ui/images/chess-tile.png
var chess_tile_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK8AAACuCAYAAABAzl3QAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgB7dyxbUMxEAXBs6FEjagv91/AD+keeNFCMw1csmBEvJ/P53Nm4Xme2Xi/37Ph/nfeP+f8/Q5EiZcs8ZIlXrLES5Z4yRIvWeIlS7xkiZcs8ZIlXrLES5Z4yRIvWS//Ud2v3vfykiVessRLlnjJEi9Z4iVLvGSJlyzxkiVessRLlnjJEi9Z4iVLvGS9/Ed1v3j/nOPlpUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMmyz+v+bNjnhQviJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWfV73Z8M+L1wQL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6y7PO6Pxv2eeGCeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSZZ/X/dmwzwsXxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPu87s+GfV64IF6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZNnndX827PPCBfGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1niJcs+r/uzYZ8XLoiXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6yxEuWeMkSL1n2ed2fDfu8cEG8ZImXLPGSJV6yxEuWeMkSL1niJUu8ZImXLPGSJV6y/gF97MkwfJRH7QAAAABJRU5ErkJggg==";

//#endregion
//#region src/react/hooks/ui/useCollectibleCardOfferState.ts
/**
* Hook to determine the state of the collectible card offer notification
*
* @param highestOffer - The highest offer for the collectible
* @param balance - The user's balance of the collectible
* @returns CollectibleCardOfferState if there's an offer, null otherwise
*/
function useCollectibleCardOfferState(highestOffer, balance) {
	const { address: currentUserAddress } = useAccount();
	if (!highestOffer) return null;
	const isOfferMadeBySelf = currentUserAddress && highestOffer.createdBy && compareAddress(highestOffer.createdBy, currentUserAddress);
	const userOwnsToken = balance !== void 0 && Number(balance) > 0;
	return {
		show: true,
		canAcceptOffer: !isOfferMadeBySelf && userOwnsToken,
		isOfferMadeBySelf: !!isOfferMadeBySelf,
		userOwnsToken
	};
}

//#endregion
//#region src/utils/fetchContentType.ts
/**
* Fetches the Content-Type header of a given URL and returns the primary type if it's supported.
* @param url The URL to send the request to.
* @returns A Promise that resolves with 'image', 'video', 'html', or null.
*/
function fetchContentType(url) {
	return new Promise((resolve, reject) => {
		if (typeof XMLHttpRequest === "undefined") {
			reject(/* @__PURE__ */ new Error("XMLHttpRequest is not supported in this environment."));
			return;
		}
		if (!url) return;
		const client = new XMLHttpRequest();
		let settled = false;
		const settle = (value) => {
			if (!settled) {
				settled = true;
				resolve(value);
				client.abort();
			}
		};
		const fail = (error) => {
			if (!settled) {
				settled = true;
				reject(error);
			}
		};
		client.open("HEAD", url, true);
		client.onreadystatechange = () => {
			if (settled || client.readyState < XMLHttpRequest.HEADERS_RECEIVED) return;
			if (client.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
				const status = client.status;
				if (status < 200 || status >= 300) {
					settle(null);
					return;
				}
				const contentType = client.getResponseHeader("Content-Type");
				if (!contentType) {
					settle(null);
					return;
				}
				const primaryType = contentType.split("/")[0].toLowerCase();
				let result = null;
				switch (primaryType) {
					case "image":
						result = "image";
						break;
					case "video":
						result = "video";
						break;
					case "text":
						if (contentType.toLowerCase().includes("html")) result = "html";
						break;
					case "model":
						result = "3d-model";
						break;
				}
				settle(result);
				return;
			}
		};
		client.onerror = (errorEvent) => {
			fail(new Error(`XMLHttpRequest network error for URL: ${url}`, { cause: errorEvent }));
		};
		client.onabort = () => {
			if (!settled) settle(null);
		};
		try {
			client.send();
		} catch (error) {
			fail(new Error(`Error sending XMLHttpRequest for URL: ${url}`, { cause: error }));
		}
	});
}

//#endregion
//#region src/react/ui/components/ModelViewer.tsx
const ModelViewerComponent = lazy(() => import("@google/model-viewer").then(() => ({ default: ({ posterSrc, src, onLoad, onError }) => /* @__PURE__ */ jsx("div", {
	className: "h-full w-full bg-background-raised",
	children: /* @__PURE__ */ jsx("model-viewer", {
		alt: "3d model",
		"auto-rotate": true,
		autoplay: true,
		"camera-controls": true,
		class: "h-full w-full",
		error: onError,
		load: onLoad,
		loading: "eager",
		poster: posterSrc,
		reveal: "auto",
		"shadow-intensity": "1",
		src,
		"touch-action": "pan-y"
	})
}) })));
const ModelViewerLoading = () => /* @__PURE__ */ jsx(Skeleton, { className: "h-full w-full" });
const ModelViewer = (props) => {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx(ModelViewerLoading, {}),
		children: /* @__PURE__ */ jsx(ModelViewerComponent, { ...props })
	});
};
var ModelViewer_default = ModelViewer;

//#endregion
//#region src/react/ui/components/media/MediaSkeleton.tsx
function MediaSkeleton() {
	return /* @__PURE__ */ jsx(Skeleton, {
		"data-testid": "media",
		size: "lg",
		className: "absolute inset-0 h-full w-full",
		style: { borderRadius: 0 }
	});
}

//#endregion
//#region src/react/ui/components/media/utils.ts
const isImage = (fileName) => {
	return /.*\.(png|jpg|jpeg|gif|svg|webp)$/.test(fileName?.toLowerCase() || "");
};
const isHtml = (fileName) => {
	return /.*\.(html\?.+|html)$/.test(fileName?.toLowerCase() || "");
};
const isVideo = (fileName) => {
	return /.*\.(mp4|ogg|webm)$/.test(fileName?.toLowerCase() || "");
};
const is3dModel = (fileName) => {
	return /.*\.(gltf|glb|obj|fbx|stl|usdz)$/.test(fileName?.toLowerCase() || "");
};
const getContentType = (url) => {
	return new Promise((resolve, reject) => {
		const type = isHtml(url) ? "html" : isVideo(url) ? "video" : isImage(url) ? "image" : is3dModel(url) ? "3d-model" : null;
		if (type) resolve(type);
		else reject(/* @__PURE__ */ new Error("Unsupported file type"));
	});
};

//#endregion
//#region src/react/ui/components/media/Media.tsx
/**
* @description This component is used to display a collectible asset.
* It will display the first valid asset from the assets array.
* If no valid asset is found, it will display the fallback content or the default placeholder image.
*
* @example
* <Media
*  name="Collectible"
*  assets={[undefined, "some-image-url", undefined]} // undefined assets will be ignored, "some-image-url" will be rendered
*  assetSrcPrefixUrl="https://example.com/"
*  className="w-full h-full"
*  fallbackContent={<YourCustomFallbackComponent />} // Optional custom fallback content
* />
*/
function Media({ name, assets, assetSrcPrefixUrl, className = "", containerClassName = "", mediaClassname = "", isLoading, fallbackContent, shouldListenForLoad = true }) {
	const [assetLoadFailed, setAssetLoadFailed] = useState(false);
	const [assetLoading, setAssetLoading] = useState(shouldListenForLoad);
	const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
	const [isSafari, setIsSafari] = useState(false);
	const [contentType, setContentType] = useState({
		type: null,
		loading: true,
		failed: false
	});
	const videoRef = useRef(null);
	useEffect(() => {
		setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
	}, []);
	const assetUrl = assets.filter((asset) => !!asset)[currentAssetIndex];
	const proxiedAssetUrl = assetUrl ? assetSrcPrefixUrl ? `${assetSrcPrefixUrl}${assetUrl}` : assetUrl : "";
	const containerClassNames = cn$1("relative aspect-square bg-background-secondary", containerClassName || className);
	useEffect(() => {
		if (!assetUrl) {
			setContentType({
				type: null,
				loading: false,
				failed: true
			});
			return;
		}
		const determineContentType = async () => {
			try {
				setContentType({
					type: await getContentType(proxiedAssetUrl),
					loading: false,
					failed: false
				});
			} catch {
				try {
					setContentType({
						type: await fetchContentType(proxiedAssetUrl),
						loading: false,
						failed: false
					});
				} catch {
					handleAssetError();
					setContentType({
						type: null,
						loading: false,
						failed: true
					});
				}
			}
		};
		determineContentType();
	}, [proxiedAssetUrl, assetUrl]);
	const handleAssetError = () => {
		const nextIndex = currentAssetIndex + 1;
		if (nextIndex < assets.length) {
			setCurrentAssetIndex(nextIndex);
			setAssetLoading(true);
			setAssetLoadFailed(false);
		} else setAssetLoadFailed(true);
	};
	const handleAssetLoad = () => {
		setAssetLoading(false);
	};
	const renderFallback = () => {
		if (fallbackContent) return /* @__PURE__ */ jsx("div", {
			className: cn$1("flex h-full w-full items-center justify-center", containerClassNames),
			children: fallbackContent
		});
		return /* @__PURE__ */ jsx("div", {
			className: cn$1("h-full w-full", containerClassNames),
			children: /* @__PURE__ */ jsx("img", {
				src: chess_tile_default,
				alt: name || "Collectible",
				className: "h-full w-full object-cover",
				onError: (e) => {
					console.error("Failed to load placeholder image");
					e.currentTarget.style.display = "none";
				}
			})
		});
	};
	if (assetLoadFailed || !isLoading && contentType.failed || !assetUrl) return renderFallback();
	if (contentType.type === "html" && !assetLoadFailed) return /* @__PURE__ */ jsxs("div", {
		className: cn$1("flex w-full items-center justify-center rounded-lg", containerClassNames),
		children: [(assetLoading || contentType.loading || isLoading) && /* @__PURE__ */ jsx(MediaSkeleton, {}), /* @__PURE__ */ jsx("iframe", {
			title: name || "Collectible",
			className: cn$1("aspect-square w-full", mediaClassname),
			src: proxiedAssetUrl,
			allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
			sandbox: "allow-scripts",
			style: { border: "0px" },
			onError: shouldListenForLoad ? handleAssetError : void 0,
			onLoad: shouldListenForLoad ? handleAssetLoad : void 0
		})]
	});
	if (contentType.type === "3d-model" && !assetLoadFailed) return /* @__PURE__ */ jsx("div", {
		className: cn$1("h-full w-full", containerClassNames),
		children: /* @__PURE__ */ jsx(ModelViewer_default, {
			src: proxiedAssetUrl,
			posterSrc: chess_tile_default,
			onLoad: shouldListenForLoad ? handleAssetLoad : void 0,
			onError: shouldListenForLoad ? handleAssetError : void 0
		})
	});
	if (contentType.type === "video" && !assetLoadFailed) {
		const videoClassNames = cn$1("absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover", assetLoading || isLoading ? "invisible" : "visible", isSafari && "pointer-events-none", mediaClassname);
		return /* @__PURE__ */ jsxs("div", {
			className: containerClassNames,
			children: [(assetLoading || contentType.loading || isLoading) && /* @__PURE__ */ jsx(MediaSkeleton, {}), /* @__PURE__ */ jsx("video", {
				ref: videoRef,
				className: videoClassNames,
				autoPlay: true,
				loop: true,
				controls: true,
				playsInline: true,
				muted: true,
				controlsList: "nodownload noremoteplayback nofullscreen",
				onError: shouldListenForLoad ? handleAssetError : void 0,
				onLoadedMetadata: shouldListenForLoad ? handleAssetLoad : void 0,
				"data-testid": "collectible-asset-video",
				children: /* @__PURE__ */ jsx("source", { src: proxiedAssetUrl })
			})]
		});
	}
	const imgSrc = assetLoadFailed || contentType.failed ? chess_tile_default : proxiedAssetUrl;
	const imgClassNames = cn$1("absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover", assetLoading || contentType.loading || isLoading ? "invisible" : "visible", mediaClassname);
	return /* @__PURE__ */ jsxs("div", {
		className: containerClassNames,
		children: [(assetLoading || contentType.loading || isLoading) && /* @__PURE__ */ jsx(MediaSkeleton, {}), /* @__PURE__ */ jsx("img", {
			src: imgSrc,
			alt: name || "Collectible",
			className: imgClassNames,
			onError: shouldListenForLoad ? handleAssetError : void 0,
			onLoad: shouldListenForLoad ? handleAssetLoad : void 0
		})]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card.tsx
const Card = forwardRef(({ children, onClick, onKeyDown, className = "", ...props }, ref) => {
	const handleKeyDown = (e) => {
		if (onClick && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			onClick(e);
		}
		onKeyDown?.(e);
	};
	const isInteractive = !!onClick;
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-testid": "collectible-card",
		className: cn$1("group relative z-10 flex flex-col items-start overflow-hidden rounded-xl", "w-card-width min-w-card-min-width border border-border-base", isInteractive && [
			"cursor-pointer",
			"focus-visible:border-border-focus focus-visible:shadow-focus-ring focus-visible:outline-focus",
			"active:border-border-focus active:shadow-active-ring"
		], className),
		...isInteractive && {
			onClick,
			onKeyDown: handleKeyDown,
			role: "button",
			tabIndex: 0
		},
		...!isInteractive && onKeyDown && { onKeyDown },
		...props,
		children
	});
});
Card.displayName = "Card";

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-badge.tsx
const CardBadge = forwardRef(({ type, balance, className, ...props }, ref) => {
	const displayText = type === ContractType.ERC1155 ? balance ? `Owned: ${balance}` : "ERC-1155" : "ERC-721";
	return /* @__PURE__ */ jsx("div", {
		ref,
		...props,
		children: /* @__PURE__ */ jsx(Text, {
			className: cn$1("rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs", className),
			children: displayText
		})
	});
});
CardBadge.displayName = "CardBadge";

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-content.tsx
const CardContent = forwardRef(({ children, className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("div", {
		ref,
		className: cn$1("relative flex w-full flex-col items-start gap-2 whitespace-nowrap p-4", className || "bg-background-primary"),
		...props,
		children
	});
});
CardContent.displayName = "CardContent";

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-footer.tsx
/**
* CardFooter - Generic animated action container for card buttons
* Provides slide-up animation on card hover. Content is provided via children.
*
* @example
* <Card.Footer>
*   <ActionButton action="buy" {...props} />
* </Card.Footer>
*/
const CardFooter = forwardRef(({ children, show = true, className, ...props }, ref) => {
	if (!show) return null;
	return /* @__PURE__ */ jsx("div", {
		ref,
		className: cn$1("-bottom-16 absolute flex w-full origin-bottom items-center justify-center bg-overlay-light p-2 backdrop-blur transition-transform duration-200 ease-in-out group-hover:translate-y-[-64px]", className ?? ""),
		...props,
		children
	});
});
CardFooter.displayName = "CardFooter";

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-media.tsx
const CardMedia = forwardRef(({ name, image, video, animationUrl, metadata, assetSrcPrefixUrl, className, fallbackContent, ...props }, ref) => {
	const finalName = name ?? metadata?.name ?? "";
	const finalImage = image ?? metadata?.image;
	const finalVideo = video ?? metadata?.video;
	const finalAnimationUrl = animationUrl ?? metadata?.animation_url;
	return /* @__PURE__ */ jsx("div", {
		className: "w-full overflow-hidden",
		style: { aspectRatio: "1" },
		ref,
		...props,
		children: /* @__PURE__ */ jsx(Media, {
			name: finalName,
			assets: [
				finalImage,
				finalVideo,
				finalAnimationUrl
			],
			assetSrcPrefixUrl,
			mediaClassname: cn$1("object-contain", className),
			fallbackContent,
			containerClassName: "w-full h-full"
		})
	});
});
CardMedia.displayName = "CardMedia";

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/determineCardAction.ts
/**
* Determines the appropriate action for a card based on ownership and market state.
*
* Priority rules:
* - **Owner actions** (when hasBalance is true):
*   1. SELL - if there's an offer (highest priority for owners)
*   2. LIST - if not currently listed
*   3. TRANSFER - default owner action
*
* - **Non-owner actions** (when hasBalance is false):
*   1. BUY - if the item is listed for sale
*   2. OFFER - default non-owner action
*
* @param params - Object containing ownership and market state flags
* @returns The appropriate CollectibleCardAction for the given state
*
* @example
* ```tsx
* // Owner with offer
* const action = determineCardAction({
*   hasBalance: true,
*   hasOffer: true,
*   hasListing: false
* }); // Returns CollectibleCardAction.SELL
*
* // Non-owner with listing
* const action = determineCardAction({
*   hasBalance: false,
*   hasOffer: false,
*   hasListing: true
* }); // Returns CollectibleCardAction.BUY
* ```
*/
function determineCardAction(params) {
	const { hasBalance, hasOffer, hasListing } = params;
	if (hasBalance) {
		if (hasOffer) return CollectibleCardAction.SELL;
		if (!hasListing) return CollectibleCardAction.LIST;
		return CollectibleCardAction.TRANSFER;
	}
	if (hasListing) return CollectibleCardAction.BUY;
	return CollectibleCardAction.OFFER;
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/formatPrice.ts
const OVERFLOW_PRICE = 1e8;
const UNDERFLOW_PRICE = 1e-4;
const formatPriceNumber = (amount, decimals) => {
	const formattedPrice = formatUnits(amount, decimals);
	const numericPrice = Number.parseFloat(formattedPrice);
	if (numericPrice < UNDERFLOW_PRICE) return {
		formattedNumber: UNDERFLOW_PRICE.toString(),
		isUnderflow: true,
		isOverflow: false
	};
	if (numericPrice > OVERFLOW_PRICE) return {
		formattedNumber: OVERFLOW_PRICE.toLocaleString("en-US", { maximumFractionDigits: 2 }),
		isUnderflow: false,
		isOverflow: true
	};
	const maxDecimals = numericPrice < .01 ? 6 : 4;
	return {
		formattedNumber: numericPrice.toLocaleString("en-US", {
			minimumFractionDigits: 0,
			maximumFractionDigits: maxDecimals
		}),
		isUnderflow: false,
		isOverflow: false
	};
};
/**
* Formats price data into a structured object for presentation.
* This pure data transformation function is easily testable and
* separates business logic from UI concerns.
*
* @param amount - Raw amount bigint (in base units)
* @param currency - Currency object with symbol and decimals
* @returns FormattedPrice object for presentation layer
*
* @example
* ```ts
* const priceData = formatPriceData(1000000000000000000n, {
*   symbol: 'ETH',
*   decimals: 18
* });
* // Returns: { type: 'normal', displayText: '1', symbol: 'ETH' }
* ```
*/
function formatPriceData(amount, currency) {
	if (amount === 0n) return {
		type: "free",
		displayText: "Free",
		symbol: ""
	};
	const { formattedNumber, isUnderflow, isOverflow } = formatPriceNumber(amount, currency.decimals);
	if (isUnderflow) return {
		type: "underflow",
		displayText: formattedNumber,
		symbol: currency.symbol
	};
	if (isOverflow) return {
		type: "overflow",
		displayText: formattedNumber,
		symbol: currency.symbol
	};
	return {
		type: "normal",
		displayText: formattedNumber,
		symbol: currency.symbol
	};
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/renderSkeleton.tsx
/**
* Determines whether to render a skeleton loading state for a card
* and returns the skeleton component if appropriate.
*
* @param params - Loading state parameters
* @param params.cardLoading - Whether the card data is loading
* @param params.balanceIsLoading - Whether the balance data is loading (optional)
* @param params.collectionType - Type of collection (ERC721/ERC1155)
* @param params.isShop - Whether this is a shop card variant
* @returns Skeleton component if loading, null otherwise
*
* @example
* ```tsx
* const skeleton = renderSkeletonIfLoading({
*   cardLoading,
*   balanceIsLoading,
*   collectionType,
*   isShop: false
* });
* if (skeleton) return skeleton;
* ```
*/
function renderSkeletonIfLoading(params) {
	const { cardLoading, balanceIsLoading = false, collectionType, isShop } = params;
	if (cardLoading || balanceIsLoading) return /* @__PURE__ */ jsx(Card$1.Skeleton, {
		type: collectionType,
		isShop
	});
	return null;
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/shopCardState.ts
/**
* Calculates the display state for a shop card based on stock availability
*
* @param params - Stock and collection parameters
* @returns Computed state for visual styling and interaction
*
* @example
* ```tsx
* const shopState = getShopCardState({
*   quantityRemaining: '5',
*   quantityInitial: '100',
*   unlimitedSupply: false,
*   collectionType: ContractType.ERC1155,
*   salesContractAddress: '0x...'
* });
*
* // Use computed state
* <Card.Media className={shopState.mediaClassName} />
* <Card.Title className={shopState.titleClassName} />
* <Card.Actions show={shopState.showActionButton} />
* ```
*/
function getShopCardState(params) {
	const { quantityRemaining, quantityInitial, unlimitedSupply, collectionType, salesContractAddress } = params;
	const isOutOfStock = !unlimitedSupply && (quantityRemaining === 0n || quantityRemaining === void 0);
	const isMissingStockInfo = quantityInitial === void 0 || quantityRemaining === void 0;
	return {
		isOutOfStock,
		isMissingStockInfo,
		showActionButton: !!salesContractAddress && collectionType === ContractType.ERC1155 && (unlimitedSupply || quantityRemaining !== void 0 && quantityRemaining > 0n),
		mediaClassName: isOutOfStock ? "opacity-50" : "opacity-100",
		titleClassName: isMissingStockInfo ? "text-text-50" : void 0
	};
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/supplyStatus.ts
const getSupplyStatusText = ({ quantityRemaining, collectionType, unlimitedSupply }) => {
	if (unlimitedSupply) return "Unlimited Supply";
	if (collectionType === ContractType.ERC721 && quantityRemaining === void 0) return "Out of stock";
	if (collectionType === ContractType.ERC1155 && !unlimitedSupply && quantityRemaining === 0n) return "Out of stock";
	if (quantityRemaining && quantityRemaining > 0n) return `Supply: ${quantityRemaining.toString()}`;
	return "Out of stock";
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/_internals/PriceDisplay.tsx
/**
* Formats price into React components for display.
* Uses formatPriceData for data transformation.
*/
const formatPrice = (amount, currency, className) => {
	const price = formatPriceData(amount, currency);
	if (price.type === "free") return /* @__PURE__ */ jsx(Text, {
		className: "font-bold text-sm text-text-100",
		children: "Free"
	});
	const Icon = price.type === "underflow" ? ChevronLeftIcon : price.type === "overflow" ? ChevronRightIcon : null;
	if (Icon) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center",
		children: [/* @__PURE__ */ jsx(Icon, { className: "h-3 w-3 text-text-100" }), /* @__PURE__ */ jsx(Text, {
			className: cn("font-bold text-sm", className || "text-text-100"),
			children: `${price.displayText} ${price.symbol}`
		})]
	});
	return /* @__PURE__ */ jsxs(Text, {
		className: cn("font-bold text-sm", className || "text-text-100"),
		children: [
			price.displayText,
			" ",
			price.symbol
		]
	});
};
const PriceDisplay = ({ amount, currency, showCurrencyIcon = true, className }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-1",
		children: [showCurrencyIcon && currency.imageUrl && /* @__PURE__ */ jsx(Image, {
			alt: currency.symbol,
			className: "h-3 w-3",
			src: currency.imageUrl,
			onError: (e) => {
				e.currentTarget.style.display = "none";
			}
		}), formatPrice(amount, currency, className)]
	});
};

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-price.tsx
const CardPrice = forwardRef(({ amount, currency, showCurrencyIcon = true, className, ...props }, ref) => {
	if (!amount || !currency) return /* @__PURE__ */ jsx("div", {
		ref,
		...props,
		children: /* @__PURE__ */ jsx(Text, {
			className: "text-left font-body font-bold text-sm text-text-50",
			children: "Not listed yet"
		})
	});
	return /* @__PURE__ */ jsx("div", {
		ref,
		...props,
		children: /* @__PURE__ */ jsx(PriceDisplay, {
			amount,
			currency,
			showCurrencyIcon,
			className: cn("text-text-100", className)
		})
	});
});
CardPrice.displayName = "CardPrice";

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-sale-details.tsx
function CardSaleDetails({ quantityRemaining, type, unlimitedSupply, className }) {
	const supplyText = getSupplyStatusText({
		quantityRemaining,
		collectionType: type,
		unlimitedSupply
	});
	return /* @__PURE__ */ jsx(Text, {
		className: cn$1("rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs", className),
		children: supplyText
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-skeleton.tsx
function CardSkeleton({ type = ContractType.ERC721, isShop = false }) {
	return /* @__PURE__ */ jsxs("div", {
		"data-testid": "collectible-card-skeleton",
		className: "w-card-width overflow-hidden rounded-xl border border-border-base focus-visible:border-border-focus focus-visible:shadow-none focus-visible:outline-focus active:border-border-focus active:shadow-none",
		children: [/* @__PURE__ */ jsx("div", {
			className: "relative aspect-square overflow-hidden bg-background-secondary",
			children: /* @__PURE__ */ jsx(Skeleton, {
				size: "lg",
				className: "absolute inset-0 h-full w-full animate-shimmer",
				style: { borderRadius: 0 }
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-2 flex flex-col gap-2 px-4 pb-4",
			children: [
				/* @__PURE__ */ jsx(Skeleton, {
					size: "lg",
					className: "animate-shimmer"
				}),
				/* @__PURE__ */ jsx(Skeleton, {
					size: "sm",
					className: "h-5 w-16 animate-shimmer"
				}),
				isShop && type === ContractType.ERC1155 && /* @__PURE__ */ jsx(Skeleton, {
					size: "lg",
					className: "h-6 w-20 animate-shimmer"
				})
			]
		})]
	});
}

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/constants.ts
/**
* Constants used across card components
*/
/**
* Default maximum length for card titles
*/
const CARD_TITLE_MAX_LENGTH_DEFAULT = 17;
/**
* Maximum length for card titles when an offer bell is displayed
* Reduced to reserve space for the offer notification icon
*/
const CARD_TITLE_MAX_LENGTH_WITH_OFFER = 15;
/**
* Number of characters reserved for the offer bell icon in the title
* Used internally by Card.Title for truncation calculations
*/
const OFFER_BELL_RESERVED_CHARS = 2;

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/card-title.tsx
function OfferBell({ canAcceptOffer, onOfferClick }) {
	return /* @__PURE__ */ jsx(IconButton, {
		className: `absolute top-0 right-0 z-10 h-[22px] w-[22px] ${!canAcceptOffer ? "opacity-50 hover:animate-none hover:opacity-50" : "hover:animate-bell-ring"}`,
		size: "xs",
		variant: "primary",
		onClick: (e) => {
			if (!canAcceptOffer) return;
			e.stopPropagation();
			e.preventDefault();
			onOfferClick?.(e);
		},
		onMouseEnter: (e) => {
			if (canAcceptOffer) e.stopPropagation();
		},
		icon: (props) => /* @__PURE__ */ jsx(BellIcon_default, {
			...props,
			size: "xs"
		})
	});
}
const CardTitle = forwardRef(({ children, className, as: Comp = "h3", highestOffer, onOfferClick, balance, maxLength, ...props }, ref) => {
	const collectibleCardOfferState = useCollectibleCardOfferState(highestOffer, balance);
	const name = typeof children === "string" ? children : String(children);
	const truncateAt = maxLength ? collectibleCardOfferState ? maxLength - OFFER_BELL_RESERVED_CHARS : maxLength : Number.POSITIVE_INFINITY;
	const displayName = name.length > truncateAt ? `${name.substring(0, truncateAt)}...` : name;
	const showOfferBell = collectibleCardOfferState && onOfferClick;
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex w-full items-center justify-between",
		children: [/* @__PURE__ */ jsx(Comp, {
			ref,
			className: cn("overflow-hidden text-ellipsis text-left font-body font-bold text-sm text-text-100", className),
			...props,
			children: displayName || "Untitled"
		}), showOfferBell && /* @__PURE__ */ jsx(OfferBell, {
			canAcceptOffer: collectibleCardOfferState.canAcceptOffer,
			onOfferClick
		})]
	});
});
CardTitle.displayName = "CardTitle";

//#endregion
//#region src/react/ui/components/marketplace-collectible-card/Card/index.ts
const Card$1 = Object.assign(Card, {
	Media: CardMedia,
	Content: CardContent,
	Title: CardTitle,
	Price: CardPrice,
	Badge: CardBadge,
	Footer: CardFooter,
	SaleDetails: CardSaleDetails,
	Skeleton: CardSkeleton
});

//#endregion
export { getSupplyStatusText as a, OVERFLOW_PRICE as c, formatPriceNumber as d, determineCardAction as f, chess_tile_default as h, OFFER_BELL_RESERVED_CHARS as i, UNDERFLOW_PRICE as l, useCollectibleCardOfferState as m, CARD_TITLE_MAX_LENGTH_DEFAULT as n, getShopCardState as o, Media as p, CARD_TITLE_MAX_LENGTH_WITH_OFFER as r, renderSkeletonIfLoading as s, Card$1 as t, formatPriceData as u };
//# sourceMappingURL=Card.js.map