import { describe, expect, test } from 'vitest';
import { getPublicRpcClient } from '../get-public-rpc-client';
import { allNetworks, findNetworkConfig } from '@0xsequence/network';
import { MissingConfigError } from '../_internal/error/transaction';
import type { PublicClient } from 'viem';

describe('getPublicRpcClient', () => {
	describe('successful client creation', () => {
		test('should create client for mainnet', () => {
			const chainId = 1;
			const client = getPublicRpcClient(chainId);

			expect(client).toBeDefined();
			expect(client).toHaveProperty('chain');
			expect(
				(client as PublicClient & { chain: { id: number } }).chain.id,
			).toBe(chainId);
			expect(
				(client as PublicClient & { chain: { name: string } }).chain.name,
			).toBe('mainnet');
		});

		test('should create client for polygon', () => {
			const chainId = 137;
			const client = getPublicRpcClient(chainId);

			expect(client).toBeDefined();
			expect(
				(client as PublicClient & { chain: { id: number } }).chain.id,
			).toBe(chainId);
			expect(
				(client as PublicClient & { chain: { name: string } }).chain.name,
			).toBe('polygon');
		});

		test('should set up multicall batching', () => {
			const chainId = 1;
			const client = getPublicRpcClient(chainId);

			expect(client).toHaveProperty('batch');
			expect(
				(client as PublicClient & { batch: { multicall: boolean } }).batch
					.multicall,
			).toBe(true);
		});

		test('should configure RPC URLs correctly', () => {
			const chainId = 1;
			const network = findNetworkConfig(allNetworks, chainId);
			expect(network).toBeDefined();
			const client = getPublicRpcClient(chainId);

			expect(client.chain!.rpcUrls.default.http).toEqual([network!.rpcUrl]);
		});

		test('should set up native currency details', () => {
			const chainId = 1;
			const network = findNetworkConfig(allNetworks, chainId);
			expect(network).toBeDefined();
			const client = getPublicRpcClient(chainId);

			expect(client.chain!.nativeCurrency).toEqual(network!.nativeToken);
		});
	});

	describe('error handling', () => {
		test('should throw MissingConfigError for invalid chainId', () => {
			const invalidChainId = 999999;

			expect(() => getPublicRpcClient(invalidChainId)).toThrow(
				MissingConfigError,
			);
			expect(() => getPublicRpcClient(invalidChainId)).toThrow(
				`Network configuration for chainId: ${invalidChainId}`,
			);
		});

		test('should throw MissingConfigError for undefined chainId', () => {
			const undefinedChainId = undefined as unknown as number;

			expect(() => getPublicRpcClient(undefinedChainId)).toThrow(
				`Network configuration for chainId: ${undefinedChainId}`,
			);
		});
	});

	describe('client configuration', () => {
		test('should create client with correct transport configuration', () => {
			const chainId = 1;
			const client = getPublicRpcClient(chainId);

			expect(client).toHaveProperty('transport');
			expect(client.transport).toHaveProperty('request');
			expect(typeof client.transport.request).toBe('function');
		});

		test('should create unique instances for different chains', () => {
			const mainnetClient = getPublicRpcClient(1);
			const polygonClient = getPublicRpcClient(137);

			expect(mainnetClient).not.toBe(polygonClient);
			expect(
				(mainnetClient as PublicClient & { chain: { id: number } }).chain.id,
			).not.toBe(
				(polygonClient as PublicClient & { chain: { id: number } }).chain.id,
			);
		});
	});
});
