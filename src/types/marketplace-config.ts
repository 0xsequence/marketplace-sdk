import { ChainId } from '@0xsequence/network';

interface Socials {
	twitter?: string;
	website?: string;
	discord?: string;
	instagram?: string;
	tiktok?: string;
	youtube?: string;
}

//TODO: This is deprecated, use newWalletOptions
enum WalletOptions {
	Sequence = 'sequence',
	Metamask = 'metamask',
	WalletConnect = 'walletconnect',
	Coinbase = 'coinbase',
	Injected = 'injected',
	Ledger = 'ledger',
	Rainbow = 'rainbow',
}

interface Collection {
	collectionAddress: string;
	chainId: ChainId;
	exchanges?: string[];
	marketplaceFeePercentage: number;
	bannerUrl?: string;
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
	collections: Collection[];
	landingPageLayout: LandingPageLayout;
	// Appended in the sdk
	cssString: string;
	// Appended in the sdk

	manifestUrl: string;
}
