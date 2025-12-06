import { MarketplaceKind } from '@0xsequence/api-client';
import { describe, expect, test } from 'vitest';
import {
	MagicEdenLogo,
	OpenSeaLogo,
	SequenceLogo,
} from '../../react/ui/components/marketplace-logos';
import { getMarketplaceDetails } from '../getMarketplaceDetails';

describe('getMarketplaceDetails', () => {
	describe('detection by marketplace kind', () => {
		test('should detect Sequence marketplace v1', () => {
			const result = getMarketplaceDetails({
				originName: 'any',
				kind: MarketplaceKind.sequence_marketplace_v1,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(SequenceLogo);
			expect(result?.displayName).toBe('Sequence');
		});

		test('should detect Sequence marketplace v2', () => {
			const result = getMarketplaceDetails({
				originName: 'any',
				kind: MarketplaceKind.sequence_marketplace_v2,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(SequenceLogo);
			expect(result?.displayName).toBe('Sequence');
		});

		test('should detect OpenSea by kind', () => {
			const result = getMarketplaceDetails({
				originName: 'any',
				kind: MarketplaceKind.opensea,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(OpenSeaLogo);
			expect(result?.displayName).toBe('OpenSea');
		});
	});

	describe('detection by marketplace name', () => {
		test('should detect OpenSea by name', () => {
			const result = getMarketplaceDetails({
				originName: 'opensea',
				kind: MarketplaceKind.unknown,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(OpenSeaLogo);
			expect(result?.displayName).toBe('OpenSea');
		});

		test('should detect Magic Eden by name', () => {
			const result = getMarketplaceDetails({
				originName: 'magiceden',
				kind: MarketplaceKind.unknown,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(MagicEdenLogo);
			expect(result?.displayName).toBe('Magic Eden');
		});

		test('should be case insensitive', () => {
			const result = getMarketplaceDetails({
				originName: 'OPENSEA',
				kind: MarketplaceKind.unknown,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(OpenSeaLogo);
			expect(result?.displayName).toBe('OpenSea');
		});

		test('should handle spaces in name', () => {
			const result = getMarketplaceDetails({
				originName: 'magic eden',
				kind: MarketplaceKind.unknown,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(MagicEdenLogo);
			expect(result?.displayName).toBe('Magic Eden');
		});
	});

	describe('detection by URL', () => {
		test('should detect marketplace from URL', () => {
			const result = getMarketplaceDetails({
				originName: 'https://opensea.io/assets/123',
				kind: MarketplaceKind.unknown,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(OpenSeaLogo);
			expect(result?.displayName).toBe('OpenSea');
		});

		test('should handle www subdomain', () => {
			const result = getMarketplaceDetails({
				originName: 'https://www.opensea.io',
				kind: MarketplaceKind.unknown,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(OpenSeaLogo);
			expect(result?.displayName).toBe('OpenSea');
		});

		test('should handle invalid URLs gracefully', () => {
			const result = getMarketplaceDetails({
				originName: 'not-a-url',
				kind: MarketplaceKind.unknown,
			});
			expect(result).toBeUndefined();
		});
	});

	describe('fallback behavior', () => {
		test('should return undefined for unknown marketplace', () => {
			const result = getMarketplaceDetails({
				originName: 'unknown-marketplace',
				kind: MarketplaceKind.unknown,
			});
			expect(result).toBeUndefined();
		});

		test('should prioritize kind over name for Sequence marketplaces', () => {
			const result = getMarketplaceDetails({
				originName: 'opensea',
				kind: MarketplaceKind.sequence_marketplace_v1,
			});
			expect(result).toBeDefined();
			expect(result?.logo).toBe(SequenceLogo);
			expect(result?.displayName).toBe('Sequence');
		});
	});
});
