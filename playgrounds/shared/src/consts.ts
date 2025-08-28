import type { PaginationMode } from './types';

export const DEFAULT_ENV: 'production' | 'development' = 'production';
export const STORAGE_KEY = 'marketplace-settings';
export const DEFAULT_PROJECT_ID = '34598';
export const DEFAULT_PROJECT_ACCESS_KEY = 'AQAAAAAAAIcmbL1VY2opsM234KeDmS5PxeM';
export const DEFAULT_PAGINATION_MODE: PaginationMode = 'infinite';
export const DEFAULT_ACTIVE_TAB = 'collections';
export const WAAS_CONFIG_KEY =
	'eyJwcm9qZWN0SWQiOjEzNjM5LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0';

export const DEFAULT_MARKETPLACE_TYPE = 'market';

export const PAGE_SIZE_OPTIONS = {
	5: { label: '5', value: 5 },
	10: { label: '10', value: 10 },
	20: { label: '20', value: 20 },
};
