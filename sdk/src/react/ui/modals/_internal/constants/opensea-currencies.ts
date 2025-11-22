/**
 * OpenSea supported chains and their currency configurations
 */

import type { Address } from 'viem';

export interface ChainCurrency {
	chainId: number | null;
	openseaId: string;
	name: string;
	nativeCurrency: {
		symbol: string;
		address: Address;
	};
	wrappedNativeCurrency: {
		address: Address;
	};
	offerCurrency: {
		symbol: string;
		address: Address;
	};
	listingCurrency: {
		symbol: string;
		address: Address;
	};
}

export const OPENSEA_CHAIN_CURRENCIES: Record<string, ChainCurrency> = {
	// Ethereum
	'1': {
		chainId: 1,
		openseaId: 'ethereum',
		name: 'Ethereum',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Optimism
	'10': {
		chainId: 10,
		openseaId: 'optimism',
		name: 'Optimism',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x4200000000000000000000000000000000000006',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x4200000000000000000000000000000000000006',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	'137': {
		chainId: 137,
		openseaId: 'matic',
		name: 'Polygon',
		nativeCurrency: {
			symbol: 'POL',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
		},
		listingCurrency: {
			symbol: 'WETH',
			address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
		},
	},
	// Shape
	'360': {
		chainId: 360,
		openseaId: 'shape',
		name: 'Shape',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x4200000000000000000000000000000000000006',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x4200000000000000000000000000000000000006',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// HyperEVM
	'998': {
		chainId: 998,
		openseaId: 'hyperevm',
		name: 'HyperEVM',
		nativeCurrency: {
			symbol: 'HYPE',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x5555555555555555555555555555555555555555',
		},
		offerCurrency: {
			symbol: 'WHYPE',
			address: '0x5555555555555555555555555555555555555555',
		},
		listingCurrency: {
			symbol: 'HYPE',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Unichain
	'130': {
		chainId: 130,
		openseaId: 'unichain',
		name: 'Unichain',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x4200000000000000000000000000000000000006',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x4200000000000000000000000000000000000006',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Sei
	'1329': {
		chainId: 1329,
		openseaId: 'sei',
		name: 'Sei',
		nativeCurrency: {
			symbol: 'SEI',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7',
		},
		offerCurrency: {
			symbol: 'WSEI',
			address: '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7',
		},
		listingCurrency: {
			symbol: 'SEI',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Soneium
	'1868': {
		chainId: 1868,
		openseaId: 'soneium',
		name: 'Soneium',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x4200000000000000000000000000000000000006',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x4200000000000000000000000000000000000006',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Ronin
	'2020': {
		chainId: 2020,
		openseaId: 'ronin',
		name: 'Ronin',
		nativeCurrency: {
			symbol: 'RON',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0xe514d9deb7966c8be0ca922de8a064264ea6bcd4',
		},
		offerCurrency: {
			symbol: 'WRON',
			address: '0xe514d9deb7966c8be0ca922de8a064264ea6bcd4',
		},
		listingCurrency: {
			symbol: 'RON',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Abstract
	'2741': {
		chainId: 2741,
		openseaId: 'abstract',
		name: 'Abstract',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x3439153eb7af838ad19d56e1571fbd09333c2809',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x3439153eb7af838ad19d56e1571fbd09333c2809',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// B3
	'8333': {
		chainId: 8333,
		openseaId: 'b3',
		name: 'B3',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x4200000000000000000000000000000000000006',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x4200000000000000000000000000000000000006',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Base
	'8453': {
		chainId: 8453,
		openseaId: 'base',
		name: 'Base',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x4200000000000000000000000000000000000006',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x4200000000000000000000000000000000000006',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// ApeChain
	'33139': {
		chainId: 33139,
		openseaId: 'ape_chain',
		name: 'ApeChain',
		nativeCurrency: {
			symbol: 'APE',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x48b62137edfa95a428d35c09e44256a739f6b557',
		},
		offerCurrency: {
			symbol: 'WAPE',
			address: '0x48b62137edfa95a428d35c09e44256a739f6b557',
		},
		listingCurrency: {
			symbol: 'APE',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Arbitrum One
	'42161': {
		chainId: 42161,
		openseaId: 'arbitrum',
		name: 'Arbitrum',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Arbitrum Nova
	'42170': {
		chainId: 42170,
		openseaId: 'arbitrum_nova',
		name: 'Arbitrum Nova',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x722e8bdd2ce80a4422e880164f2079488e115365',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x722e8bdd2ce80a4422e880164f2079488e115365',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Avalanche C-Chain
	'43114': {
		chainId: 43114,
		openseaId: 'avalanche',
		name: 'Avalanche',
		nativeCurrency: {
			symbol: 'AVAX',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
		},
		offerCurrency: {
			symbol: 'WAVAX',
			address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
		},
		listingCurrency: {
			symbol: 'AVAX',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// GUNZ
	'43419': {
		chainId: 43419,
		openseaId: 'gunzilla',
		name: 'GUNZ',
		nativeCurrency: {
			symbol: 'GUN',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x5aad7bba61d95c2c4e525a35f4062040264611f1',
		},
		offerCurrency: {
			symbol: 'WGUN',
			address: '0x5aad7bba61d95c2c4e525a35f4062040264611f1',
		},
		listingCurrency: {
			symbol: 'GUN',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Somnia
	'50311': {
		chainId: 50311,
		openseaId: 'somnia',
		name: 'Somnia',
		nativeCurrency: {
			symbol: 'SOMI',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x046ede9564a72571df6f5e44d0405360c0f4dcab',
		},
		offerCurrency: {
			symbol: 'WSOMI',
			address: '0x046ede9564a72571df6f5e44d0405360c0f4dcab',
		},
		listingCurrency: {
			symbol: 'SOMI',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Berachain mainnet
	'80094': {
		chainId: 80094,
		openseaId: 'bera_chain',
		name: 'Berachain',
		nativeCurrency: {
			symbol: 'BERA',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x6969696969696969696969696969696969696969',
		},
		offerCurrency: {
			symbol: 'WBERA',
			address: '0x6969696969696969696969696969696969696969',
		},
		listingCurrency: {
			symbol: 'BERA',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Blast
	'81457': {
		chainId: 81457,
		openseaId: 'blast',
		name: 'Blast',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x4300000000000000000000000000000000000004',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x4300000000000000000000000000000000000004',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
	// Zora
	'7777777': {
		chainId: 7777777,
		openseaId: 'zora',
		name: 'Zora',
		nativeCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
		wrappedNativeCurrency: {
			address: '0x4200000000000000000000000000000000000006',
		},
		offerCurrency: {
			symbol: 'WETH',
			address: '0x4200000000000000000000000000000000000006',
		},
		listingCurrency: {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
		},
	},
};

export function getOpenseaCurrencyForChain(
	chainId: number,
	modalType: 'listing' | 'offer',
): { symbol: string; address: Address } | undefined {
	const config = OPENSEA_CHAIN_CURRENCIES[chainId.toString()];
	if (!config) {
		return undefined;
	}

	return modalType === 'listing'
		? config.listingCurrency
		: config.offerCurrency;
}
