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
export { networkToWagmiChain };
//# sourceMappingURL=networkconfigToWagmiChain-DbUf6HiO.js.map