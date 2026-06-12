//#region src/utils/networkconfigToWagmiChain.ts
const networkToWagmiChain = (network) => ({
	...network,
	id: Number(network.chainId),
	name: network.name,
	nativeCurrency: { ...network.nativeToken },
	rpcUrls: {
		default: { http: [network.rpcUrl] },
		public: { http: [network.rpcUrl] }
	},
	contracts: network.ensAddress ? { ensRegistry: { address: network.ensAddress } } : void 0
});

//#endregion
export { networkToWagmiChain as t };
//# sourceMappingURL=networkconfigToWagmiChain.js.map