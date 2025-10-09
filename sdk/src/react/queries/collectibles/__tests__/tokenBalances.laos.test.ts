import { server } from '@test';
import { afterEach, describe, expect, it } from 'vitest';
import {
	laosHandlers,
	mockTokenBalancesResponse,
} from '../../../_internal/api/__mocks__/laos.msw';
import { fetchTokenBalances } from '../tokenBalances';

describe('fetchTokenBalances with LAOS', () => {
	const mockConfig = {
		projectAccessKey: 'test-key',
		projectId: '1',
		chainId: 11155111,
		apiUrl: 'https://marketplace-api.sequence.app',
		isDev: false,
	};

	afterEach(() => {
		server.resetHandlers();
	});

	it('should use LAOS API when isLaos721=true', async () => {
		server.use(...laosHandlers);

		const result = await fetchTokenBalances(
			{
				collectionAddress: '0x1234567890123456789012345678901234567890',
				userAddress: '0xuser1234567890123456789012345678901234567890',
				chainId: 11155111,
				isLaos721: true,
			},
			mockConfig,
		);

		// Should return array of balances from LAOS API response
		expect(result).toEqual(mockTokenBalancesResponse.balances);
		expect(result[0]?.balance).toBe('5');
		expect(result[0]?.contractInfo?.type).toBe('LAOS-ERC-721');
		expect(result[0]?.tokenMetadata?.name).toBe('Test Token 1');
	});

	it('should handle LAOS API errors', async () => {
		server.use(...laosHandlers);

		await expect(
			fetchTokenBalances(
				{
					collectionAddress: '0x1234567890123456789012345678901234567890',
					userAddress: '0x0000000000000000000000000000000000000001', // Special address for 500 error
					chainId: 11155111,
					isLaos721: true,
				},
				mockConfig,
			),
		).rejects.toThrow('Failed to get token balances: Internal Server Error');
	});

	it('should return empty array when LAOS API returns empty balances', async () => {
		server.use(...laosHandlers);

		const result = await fetchTokenBalances(
			{
				collectionAddress: '0x1234567890123456789012345678901234567890',
				userAddress: '0x0000000000000000000000000000000000000003', // Special address for empty response
				chainId: 11155111,
				isLaos721: true,
			},
			mockConfig,
		);

		expect(result).toEqual([]);
	});

	it('should include metadata in LAOS response', async () => {
		server.use(...laosHandlers);

		const result = await fetchTokenBalances(
			{
				collectionAddress: '0x1234567890123456789012345678901234567890',
				userAddress: '0xuser1234567890123456789012345678901234567890',
				chainId: 11155111,
				isLaos721: true,
			},
			mockConfig,
		);

		expect(result[0]?.tokenMetadata).toBeDefined();
		expect(result[0]?.tokenMetadata?.name).toBe('Test Token 1');
		expect(result[0]?.tokenMetadata?.description).toBe(
			'A test token for LAOS testing',
		);
		expect(result[0]?.tokenMetadata?.image).toBe(
			'https://example.com/token1.png',
		);
		expect(result[0]?.tokenMetadata?.attributes).toEqual([
			{
				trait_type: 'Rarity',
				value: 'Common',
			},
		]);
	});

	it('should handle different pagination orders', async () => {
		server.use(...laosHandlers);

		const result = await fetchTokenBalances(
			{
				collectionAddress: '0x1234567890123456789012345678901234567890',
				userAddress: '0xuser1234567890123456789012345678901234567890',
				chainId: 11155111,
				isLaos721: true,
			},
			mockConfig,
		);

		// Should return array of balances regardless of sort order
		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
		expect(result.every((balance) => typeof balance.balance === 'string')).toBe(
			true,
		);
	});
});
