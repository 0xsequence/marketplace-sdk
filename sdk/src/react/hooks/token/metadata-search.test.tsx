import * as IndexerMocks from '@0xsequence/api-client/mocks/indexer';
import * as MetadataMocks from '@0xsequence/api-client/mocks/metadata';

const { mockIndexerEndpoint, mockTokenSupply } = IndexerMocks;
const { mockMetadataEndpoint, mockTokenMetadata, mockTokenMetadataNormalized } =
	MetadataMocks;

import { PropertyType } from '@0xsequence/api-client';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseTokenMetadataSearchParams } from './metadata-search';
import { useTokenMetadataSearch } from './metadata-search';

describe('useTokenMetadataSearch', () => {
	const defaultArgs: UseTokenMetadataSearchParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		filter: {
			text: 'test',
		},
	};

	const defaultArgsWithProperties: UseTokenMetadataSearchParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		filter: {
			properties: [
				{
					name: 'Rarity',
					type: PropertyType.STRING,
					values: ['Legendary'],
				},
				{
					name: 'Level',
					type: PropertyType.INT,
					min: 50,
					max: 100,
				},
			],
		},
	};

	it('should fetch metadata with text search successfully', async () => {
		const { result } = renderHook(() => useTokenMetadataSearch(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock (normalized with BigInt)
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.tokenMetadata).toEqual([
			mockTokenMetadataNormalized,
		]);
		expect(result.current.error).toBeNull();
	});

	it('should fetch metadata with property filters successfully', async () => {
		const { result } = renderHook(() =>
			useTokenMetadataSearch(defaultArgsWithProperties),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock (normalized with BigInt)
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.tokenMetadata).toEqual([
			mockTokenMetadataNormalized,
		]);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMetadataEndpoint('SearchTokenMetadata'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to search token metadata' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useTokenMetadataSearch(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should respect enabled option in query config', () => {
		const { result } = renderHook(() =>
			useTokenMetadataSearch({
				...defaultArgs,
				query: {
					enabled: false,
				},
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	describe('onlyMinted filter', () => {
		it('should return all tokens when onlyMinted is false', async () => {
			const { result } = renderHook(() =>
				useTokenMetadataSearch({
					...defaultArgs,
					onlyMinted: false,
				}),
			);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data).toBeDefined();
			expect(result.current.data?.tokenMetadata).toEqual([
				mockTokenMetadataNormalized,
			]);
		});

		it('should filter out unminted tokens when onlyMinted is true', async () => {
			const unmintedTokenSupply = {
				...mockTokenSupply,
				supply: '0',
			};

			server.use(
				http.post(mockIndexerEndpoint('GetTokenSupplies'), () => {
					return HttpResponse.json({
						page: { page: 1, pageSize: 10, more: false },
						contractType: 'ERC721',
						tokenIDs: [unmintedTokenSupply],
					});
				}),
			);

			const { result } = renderHook(() =>
				useTokenMetadataSearch({
					...defaultArgs,
					onlyMinted: true,
				}),
			);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data).toBeDefined();
			// Should be empty array since all tokens have supply 0
			expect(result.current.data?.tokenMetadata).toEqual([]);
		});

		it('should return only minted tokens when onlyMinted is true', async () => {
			const mintedTokenSupply = {
				...mockTokenSupply,
				supply: '1',
				tokenID: mockTokenMetadata.tokenId,
			};

			server.use(
				http.post(mockIndexerEndpoint('GetTokenSupplies'), () => {
					return HttpResponse.json({
						page: { page: 1, pageSize: 10, more: false },
						contractType: 'ERC721',
						tokenIDs: [mintedTokenSupply],
					});
				}),
			);

			const { result } = renderHook(() =>
				useTokenMetadataSearch({
					...defaultArgs,
					onlyMinted: true,
				}),
			);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data).toBeDefined();
			expect(result.current.data?.tokenMetadata).toEqual([
				mockTokenMetadataNormalized,
			]);
		});

		it('should handle errors from token supplies endpoint when onlyMinted is true', async () => {
			server.use(
				http.post(mockIndexerEndpoint('GetTokenSupplies'), () => {
					return HttpResponse.json(
						{ error: { message: 'Failed to fetch token supplies' } },
						{ status: 500 },
					);
				}),
			);

			const { result } = renderHook(() =>
				useTokenMetadataSearch({
					...defaultArgs,
					onlyMinted: true,
				}),
			);

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toBeDefined();
			expect(result.current.data).toBeUndefined();
		});

		it('should handle pagination correctly with onlyMinted filter', async () => {
			const mintedTokenSupply1 = {
				...mockTokenSupply,
				supply: '1',
				tokenID: '1',
			};
			const mintedTokenSupply2 = {
				...mockTokenSupply,
				supply: '1',
				tokenID: '2',
			};

			let page = 1;

			server.use(
				http.post(mockIndexerEndpoint('GetTokenSupplies'), () => {
					const response = {
						page: { page, pageSize: 1, more: page === 1 },
						contractType: 'ERC721',
						tokenIDs: [page === 1 ? mintedTokenSupply1 : mintedTokenSupply2],
					};
					page++;
					return HttpResponse.json(response);
				}),

				http.post(mockMetadataEndpoint('SearchTokenMetadata'), () => {
					return HttpResponse.json({
						tokenMetadata: [
							{ ...mockTokenMetadata, tokenId: '1' },
							{ ...mockTokenMetadata, tokenId: '2' },
						],
						page: { page: 1, pageSize: 10, more: false },
					});
				}),
			);

			const { result } = renderHook(() =>
				useTokenMetadataSearch({
					...defaultArgs,
					onlyMinted: true,
				}),
			);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.hasNextPage).toBe(true);
			expect(result.current.data?.tokenMetadata).toHaveLength(1);

			await result.current.fetchNextPage();

			await waitFor(() => {
				expect(result.current.isFetching).toBe(false);
			});

			expect(result.current.data?.tokenMetadata).toHaveLength(2);
			expect(result.current.hasNextPage).toBe(false);
		});
	});
});
