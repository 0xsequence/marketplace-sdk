import { BaseError } from "./base-DqaJPvfN.js";
import { getQueryClient } from "./get-query-client-D19vvfJo.js";
import { PROVIDER_ID } from "./get-provider-CYYHfrlg.js";
import { useOpenConnectModal } from "@0xsequence/connect";
import { createContext, useContext, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { jsx } from "react/jsx-runtime";
import { Databeat } from "@databeat/tracker";

//#region src/utils/_internal/error/config.ts
var ConfigError = class extends BaseError {
	name = "ConfigError";
};
var InvalidProjectAccessKeyError = class extends ConfigError {
	name = "InvalidProjectAccessKeyError";
	constructor(projectAccessKey) {
		super(`Invalid project access key: ${projectAccessKey}`);
	}
};

//#endregion
//#region src/react/_internal/databeat/index.ts
var DatabeatAnalytics = class extends Databeat {
	trackSellItems(args) {
		this.track({
			event: "SELL_ITEMS",
			props: args.props,
			nums: args.nums
		});
	}
	trackBuyModalOpened(args) {
		this.track({
			event: "BUY_MODAL_OPENED",
			props: args.props,
			nums: args.nums
		});
	}
	trackCreateListing(args) {
		this.track({
			event: "CREATE_LISTING",
			props: args.props,
			nums: args.nums
		});
	}
	trackCreateOffer(args) {
		this.track({
			event: "CREATE_OFFER",
			props: args.props,
			nums: args.nums
		});
	}
	trackTransactionFailed(args) {
		this.track({
			event: "TRANSACTION_FAILED",
			props: args
		});
	}
};
const useAnalytics = () => {
	const context = useContext(MarketplaceSdkContext);
	return context.analytics;
};

//#endregion
//#region src/react/provider.tsx
const MarketplaceSdkContext = createContext({});
function MarketplaceProvider({ config, children, openConnectModal }) {
	if (config.projectAccessKey === "" || !config.projectAccessKey) throw new InvalidProjectAccessKeyError(config.projectAccessKey);
	const analytics = useMemo(() => {
		const server = "https://nodes.sequence.app";
		const auth = {};
		auth.headers = { "X-Access-Key": config.projectAccessKey };
		return new DatabeatAnalytics(server, auth, {
			defaultEnabled: true,
			initProps: () => {
				return { origin: typeof window !== "undefined" ? window.location.origin : "" };
			}
		});
	}, [config.projectAccessKey, window]);
	if (openConnectModal) {
		const context = {
			...config,
			openConnectModal,
			analytics
		};
		return /* @__PURE__ */ jsx(MarketplaceQueryClientProvider, { children: /* @__PURE__ */ jsx(MarketplaceSdkContext.Provider, {
			value: context,
			children: /* @__PURE__ */ jsx("div", {
				id: PROVIDER_ID,
				children
			})
		}) });
	}
	return /* @__PURE__ */ jsx(MarketplaceProviderWithSequenceConnect, {
		config,
		analytics,
		children
	});
}
function MarketplaceQueryClientProvider({ children }) {
	const queryClient = getQueryClient();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children
	});
}
function MarketplaceProviderWithSequenceConnect({ config, children, analytics }) {
	const { setOpenConnectModal } = useOpenConnectModal();
	const context = {
		...config,
		openConnectModal: () => setOpenConnectModal(true),
		analytics
	};
	return /* @__PURE__ */ jsx(MarketplaceQueryClientProvider, { children: /* @__PURE__ */ jsx(MarketplaceSdkContext.Provider, {
		value: context,
		children: /* @__PURE__ */ jsx("div", {
			id: PROVIDER_ID,
			children
		})
	}) });
}

//#endregion
export { DatabeatAnalytics, MarketplaceProvider, MarketplaceQueryClientProvider, MarketplaceSdkContext, useAnalytics };
//# sourceMappingURL=provider-DPGUA10G.js.map