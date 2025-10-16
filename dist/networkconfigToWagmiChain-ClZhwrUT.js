//#region src/utils/networkconfigToWagmiChain.ts
const networkToWagmiChain = (network) => ({
	...network,
	id: Number(network.chainId),
	name: network.name,
	nativeCurrency: { ...network.nativeToken },
	rpcUrls: {
		default: { http: [network.rpcUrl] },
		public: { http: [network.rpcUrl] }
	}
});

//#endregion
export { networkToWagmiChain as networkToWagmiChain$1 };
//# sourceMappingURL=networkconfigToWagmiChain-ClZhwrUT.js.map