import type { Hex } from 'viem';
import { MarketplaceType } from '../../../sdk/src/types/new-marketplace-types';
import type { PaginationMode, WalletType } from './types';

export const STORAGE_KEY = 'marketplace-settings';
export const DEFAULT_COLLECTION_ADDRESS: Hex =
	'0xf2ea13ce762226468deac9d69c8e77d291821676';
export const DEFAULT_CHAIN_ID = 80002;
export const DEFAULT_COLLECTIBLE_ID = '1';
export const DEFAULT_PROJECT_ID = '34598';
export const DEFAULT_PROJECT_ACCESS_KEY = 'AQAAAAAAADVH8R2AGuQhwQ1y8NaEf1T7PJM';
export const DEFAULT_PAGINATION_MODE: PaginationMode = 'infinite';
export const DEFAULT_ACTIVE_TAB = 'collections';
export const DEFAULT_WALLET_TYPE: WalletType = 'embedded'; // TODO: cannot be universal, for now
export const WAAS_CONFIG_KEY =
	'eyJwcm9qZWN0SWQiOjEzNjM5LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0';

export const DEFAULT_MARKETPLACE_TYPE = MarketplaceType.MARKET;

export const PAGE_SIZE_OPTIONS = {
	5: { label: '5', value: 5 },
	10: { label: '10', value: 10 },
	20: { label: '20', value: 20 },
};
