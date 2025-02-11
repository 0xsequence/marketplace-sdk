import { http, HttpResponse } from 'msw';
import { WalletOptions, type MarketplaceConfig } from '../../../../types';
import { mockCurrencies } from '../../../_internal/api/__mocks__/marketplace.msw';

// Mock data
export const mockConfig: MarketplaceConfig = {
	projectId: 123,
	publisherId: 'test-publisher',
	title: 'Test Marketplace',
	shortDescription: 'A test marketplace',
	faviconUrl: 'https://example.com/favicon.png',
	landingBannerUrl: 'https://example.com/banner.png',
	logoUrl: 'https://example.com/logo.png',
	titleTemplate: '%s | Test Marketplace',
	walletOptions: [WalletOptions.Sequence],
	collections: [{
		collectionAddress: '0x1234567890123456789012345678901234567890',
		chainId: 1,
		marketplaceFeePercentage: 2.5,
		marketplaceType: 'orderbook',
		currencyOptions: mockCurrencies.map(c => c.contractAddress),
	}],
	landingPageLayout: 'default',
	cssString: '',
	manifestUrl: '',
};

export const mockStyles = `
  .marketplace-theme {
    --primary-color: #000000;
  }
`;

// Debug configuration
export let isDebugEnabled = false;
export const enableDebug = () => {
	isDebugEnabled = true;
};
export const disableDebug = () => {
	isDebugEnabled = false;
};

// Debug logger function
const debugLog = (endpoint: string, request: Request, response: Response) => {
	if (isDebugEnabled) {
		console.log(`[MSW Debug] ${endpoint}:`, {
			request,
			response,
		});
	}
};

// MSW handlers
export const createConfigHandler = (config = mockConfig) =>
	http.get('*/marketplace/*/config.json', ({ request }) => {
		const response = HttpResponse.json(config);
		debugLog('config.json', request, response);
		return response;
	});

export const createStylesHandler = (styles = mockStyles) =>
	http.get('*/marketplace/*/styles.css', ({ request }) => {
		const response = new HttpResponse(styles, {
			headers: { 'Content-Type': 'text/css' },
		});
		debugLog('styles.css', request, response);
		return response;
	});

export const createErrorHandler = () =>
	http.get('*/marketplace/*/config.json', () => {
		return HttpResponse.json(
			{ code: 3000, msg: 'Project not found' },
			{ status: 404 },
		);
	});

export const createStylesErrorHandler = () =>
	http.get('*/marketplace/*/styles.css', () => {
		return new HttpResponse('', { status: 500 });
	});

// Default handlers
export const handlers = [createConfigHandler(), createStylesHandler()];
