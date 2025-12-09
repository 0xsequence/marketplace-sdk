import { t as networkToWagmiChain } from "./networkconfigToWagmiChain.js";
import { n as MissingConfigError } from "./transaction.js";
import { MarketplaceWalletType } from "@0xsequence/api-client";
import { allNetworks, findNetworkConfig } from "@0xsequence/network";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { apple, appleWaas, coinbaseWallet, ecosystemWallet, email, emailWaas, facebook, getConnectWallets, google, googleWaas, metaMask, sequence, twitch, walletConnect } from "@0xsequence/connect";
import React from "react";

//#region src/react/_internal/consts.ts
const DEFAULT_NETWORK = 137;

//#endregion
//#region src/react/_internal/wagmi/get-connectors.ts
function getConnectors({ marketplaceConfig, sdkConfig, walletType }) {
	const connectors = commonConnectors(marketplaceConfig, sdkConfig);
	if (walletType === MarketplaceWalletType.UNIVERSAL) connectors.push(...getUniversalWalletConfigs(sdkConfig, marketplaceConfig));
	else if (walletType === MarketplaceWalletType.EMBEDDED) connectors.push(...getWaasConnectors(sdkConfig, marketplaceConfig));
	else if (walletType === MarketplaceWalletType.ECOSYSTEM) connectors.push(getEcosystemConnector(marketplaceConfig, sdkConfig));
	else throw new Error("Invalid wallet type");
	return getConnectWallets(sdkConfig.projectAccessKey, connectors);
}
function commonConnectors(marketplaceConfig, sdkConfig) {
	const wallets = [];
	const { title: appName } = marketplaceConfig.settings;
	const walletOptions = marketplaceConfig.settings.walletOptions;
	const walletConnectProjectId = sdkConfig.walletConnectProjectId;
	if (walletOptions.connectors.includes("coinbase")) wallets.push(coinbaseWallet({ appName }));
	if (walletConnectProjectId && walletOptions.connectors.includes("walletconnect")) wallets.push(walletConnect({ projectId: walletConnectProjectId }));
	if (walletOptions.connectors.includes("metamask")) wallets.push(metaMask({ dappMetadata: { name: appName } }));
	return wallets;
}
function getUniversalWalletConfigs(config, marketplaceConfig) {
	const sequenceWalletOverrides = config._internal?.overrides?.api?.sequenceWallet;
	const sequenceWalletOptions = {
		walletAppURL: sequenceWalletOverrides?.url || getSequenceWalletURL(sequenceWalletOverrides?.env || "production"),
		defaultNetwork: DEFAULT_NETWORK,
		connect: {
			projectAccessKey: sequenceWalletOverrides?.accessKey || config.projectAccessKey,
			app: marketplaceConfig.settings.title,
			settings: { bannerUrl: marketplaceConfig.market.ogImage }
		}
	};
	return [
		sequence(sequenceWalletOptions),
		email(sequenceWalletOptions),
		facebook(sequenceWalletOptions),
		google(sequenceWalletOptions),
		apple(sequenceWalletOptions),
		twitch(sequenceWalletOptions)
	];
}
function getWaasConnectors(config, marketplaceConfig) {
	const { projectAccessKey } = config;
	const waasConfigKey = marketplaceConfig.settings.walletOptions.embedded?.tenantKey;
	if (!waasConfigKey) throw new MissingConfigError("Embedded wallet config is missing, please check your access key");
	const waasOptions = marketplaceConfig.settings.walletOptions.oidcIssuers;
	const googleClientId = waasOptions.google;
	const appleClientId = waasOptions.apple;
	const appleRedirectURI = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : void 0;
	const wallets = [];
	if (marketplaceConfig.settings.walletOptions.embedded?.emailEnabled) wallets.push(emailWaas({
		projectAccessKey,
		waasConfigKey
	}));
	if (googleClientId) wallets.push(googleWaas({
		projectAccessKey,
		googleClientId,
		waasConfigKey,
		network: DEFAULT_NETWORK
	}));
	if (appleClientId) wallets.push(appleWaas({
		projectAccessKey,
		appleClientId,
		appleRedirectURI,
		waasConfigKey,
		network: DEFAULT_NETWORK
	}));
	return wallets;
}
function getEcosystemConnector(marketplaceConfig, sdkConfig) {
	const ecosystemOptions = marketplaceConfig.settings.walletOptions.ecosystem;
	if (!ecosystemOptions) throw new MissingConfigError("ecosystem");
	const { walletAppName, walletUrl, logoDarkUrl, logoLightUrl } = ecosystemOptions;
	return ecosystemWallet({
		projectAccessKey: sdkConfig.projectAccessKey,
		walletUrl,
		name: walletAppName,
		defaultNetwork: DEFAULT_NETWORK,
		logoDark: getEcosystemLogo(logoDarkUrl, walletAppName),
		logoLight: getEcosystemLogo(logoLightUrl, walletAppName)
	});
}
function getEcosystemLogo(url, name) {
	if (!url) return () => null;
	const Logo = () => React.createElement("img", {
		src: url,
		alt: name,
		width: 32,
		height: 32
	});
	Logo.displayName = "EcosystemLogo";
	return Logo;
}
function getSequenceWalletURL(env) {
	switch (env) {
		case "development": return "https://dev.sequence.app";
		case "next": return "https://next.sequence.app";
		case "production":
		default: return "https://sequence.app";
	}
}

//#endregion
//#region src/react/_internal/wagmi/create-config.ts
const createWagmiConfig = (marketplaceConfig, sdkConfig, ssr) => {
	const { chains, transports } = getWagmiChainsAndTransports({
		marketplaceConfig,
		sdkConfig
	});
	const walletType = marketplaceConfig.settings.walletOptions.walletType;
	const connectors = getConnectors({
		marketplaceConfig,
		sdkConfig,
		walletType
	});
	const multiInjectedProviderDiscovery = marketplaceConfig.settings.walletOptions.includeEIP6963Wallets;
	return createConfig({
		connectors,
		chains,
		ssr,
		multiInjectedProviderDiscovery,
		storage: ssr ? createStorage({ storage: cookieStorage }) : void 0,
		transports
	});
};
function getWagmiChainsAndTransports({ marketplaceConfig, sdkConfig }) {
	const chains = getChainConfigs(marketplaceConfig);
	const nodeGatewayOverrides = sdkConfig._internal?.overrides?.api?.nodeGateway;
	const nodeGatewayEnv = nodeGatewayOverrides?.env ?? "production";
	const nodeGatewayUrl = nodeGatewayOverrides?.url;
	return {
		chains,
		transports: getTransportConfigs(chains, nodeGatewayOverrides?.accessKey ?? sdkConfig.projectAccessKey, nodeGatewayEnv, nodeGatewayUrl)
	};
}
function getChainConfigs(_marketConfig) {
	return Object.values(allNetworks).map(networkToWagmiChain);
}
function getTransportConfigs(chains, projectAccessKey, nodeGatewayEnv, nodeGatewayUrl) {
	return chains.reduce((acc, chain) => {
		const network = findNetworkConfig(allNetworks, chain.id);
		if (network) {
			let rpcUrl;
			if (nodeGatewayUrl) rpcUrl = nodeGatewayUrl;
			else {
				rpcUrl = network.rpcUrl;
				if (nodeGatewayEnv === "development") rpcUrl = rpcUrl.replace("nodes.", "dev-nodes.");
				if (!network.rpcUrl.endsWith(projectAccessKey)) rpcUrl = `${rpcUrl}/${projectAccessKey}`;
			}
			acc[chain.id] = http(rpcUrl);
		}
		return acc;
	}, {});
}

//#endregion
export { getWaasConnectors as a, getEcosystemConnector as i, getWagmiChainsAndTransports as n, DEFAULT_NETWORK as o, getConnectors as r, createWagmiConfig as t };
//# sourceMappingURL=create-config.js.map