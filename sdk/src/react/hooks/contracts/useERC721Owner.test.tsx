import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { TEST_COLLECTIBLE } from '../../../../test/const';
import { ContractType } from '../../_internal';
import { useERC721Owner } from './useERC721Owner';
import { isAddress } from 'viem';

describe('useERC721Owner', () => {
	const defaultArgs = {
		chainId: TEST_COLLECTIBLE.chainId,
		collectionAddress: TEST_COLLECTIBLE.collectionAddress,
		tokenId: TEST_COLLECTIBLE.tokenId,
		contractType: ContractType.ERC721,
	};

	it('should fetch ERC721 owner successfully', async () => {
		const { result } = renderHook(() => useERC721Owner(defaultArgs));

		// Initially loading or idle
		expect(result.current.isLoading).toBe(true);

		// Wait for the data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		}, { timeout: 10000 });

		expect(result.current.error).toBeNull();
		expect(result.current.owner).toBeDefined();
		expect(isAddress(result.current.owner!)).toBe(true);
	});

	it('should return undefined owner when disabled', async () => {
		const { result } = renderHook(() =>
			useERC721Owner({
				...defaultArgs,
				enabled: false,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.owner).toBeUndefined();
	});

	it('should return undefined owner when contractType is not ERC721', async () => {
		const { result } = renderHook(() =>
			useERC721Owner({
				...defaultArgs,
				contractType: ContractType.ERC1155,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.owner).toBeUndefined();
	});

	it('should return undefined owner when collectionAddress is missing', async () => {
		const { result } = renderHook(() =>
			useERC721Owner({
				...defaultArgs,
				collectionAddress: undefined,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.owner).toBeUndefined();
	});

	it('should return undefined owner when tokenId is missing', async () => {
		const { result } = renderHook(() =>
			useERC721Owner({
				...defaultArgs,
				tokenId: undefined,
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.owner).toBeUndefined();
	});
});
