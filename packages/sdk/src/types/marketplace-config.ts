import type { ChainId } from '@0xsequence/network';
import type { Hex } from 'viem';
import type { OrderbookKind } from './api-types';

interface Socials {
	twitter?: string;
	website?: string;
	discord?: string;
	instagram?: string;
	tiktok?: string;
	youtube?: string;
}

export enum WalletOptions {
	Sequence = 'sequence',
	Metamask = 'metamask',
	WalletConnect = 'walletconnect',
	Coinbase = 'coinbase',
	Injected = 'injected',
	Ledger = 'ledger',
	Rainbow = 'rainbow',
}

type NewWalletConnectors = 'walletconnect' | 'coinbase';
interface WalletOptionsNew {
	connectors: NewWalletConnectors[];
	includeEIP6963Wallets: boolean;
	walletType: 'embedded' | 'universal';
}

interface Collection {
	collectionAddress: Hex;
	chainId: ChainId;
	exchanges?: string[];
	marketplaceFeePercentage: number;
	bannerUrl?: string;
	marketplaceType: 'p2p' | 'orderbook' | 'amm';
	destinationMarketplace?: OrderbookKind;
	currencyOptions?: string[];
}

type LandingPageLayout = 'default' | 'big_left_banner' | 'floating_header';

export interface MarketplaceConfig {
	projectId: number; // builder project Id
	publisherId: string;
	title: string;
	shortDescription: string;
	socials?: Socials;
	faviconUrl: string;
	landingBannerUrl: string;
	logoUrl?: string;
	fontUrl?: string;
	ogImage?: string;
	titleTemplate: string;
	disableLiquidityProviderTools?: boolean;
	walletOptions: WalletOptions[];
	walletOptionsNew?: WalletOptionsNew;
	collections: Collection[];

	landingPageLayout: LandingPageLayout;
	// Appended in the sdk
	cssString: string;
	// Appended in the sdk

	manifestUrl: string;
}
