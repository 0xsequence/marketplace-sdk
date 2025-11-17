/**
 * Wrapped Indexer Client
 *
 * Wraps the raw @0xsequence/indexer SequenceIndexer client with transformation layer.
 * Provides normalized types (bigints) to SDK consumers while handling API type conversion.
 */

import type * as IndexerGen from '@0xsequence/indexer';
import { SequenceIndexer } from '@0xsequence/indexer';
import type { Address } from '../../types/primitives';
import * as transforms from './transforms';
import type * as Normalized from './types';

/**
 * Wrapped Indexer Client
 *
 * Wraps the raw SequenceIndexer with methods that return normalized types.
 * Uses composition rather than inheritance to avoid type conflicts.
 */
export class IndexerClient {
	private client: SequenceIndexer;

	constructor(hostname: string, projectAccessKey?: string, jwtAuth?: string) {
		this.client = new SequenceIndexer(hostname, projectAccessKey, jwtAuth);
	}

	/**
	 * Get token balances for an account with normalized types (bigint)
	 * Accepts tokenId as bigint, transforms to tokenID string for API
	 */
	async getTokenBalances(
		args: Normalized.GetTokenBalancesRequest,
	): Promise<Normalized.GetTokenBalancesResponse> {
		const apiArgs = transforms.toGetTokenBalancesArgs(args);
		const rawResponse = await this.client.getTokenBalances(apiArgs);
		return transforms.toGetTokenBalancesResponse(rawResponse);
	}

	/**
	 * Get token supplies for a contract with normalized types (bigint)
	 */
	async getTokenSupplies(
		args: IndexerGen.GetTokenSuppliesArgs,
	): Promise<Normalized.GetTokenSuppliesResponse> {
		const rawResponse = await this.client.getTokenSupplies(args);
		return transforms.toGetTokenSuppliesResponse(
			rawResponse,
			args.contractAddress as Address,
		);
	}

	/**
	 * Get token ID ranges for a contract with normalized types (bigint)
	 */
	async getTokenIDRanges(
		args: IndexerGen.GetTokenIDRangesArgs,
	): Promise<Normalized.GetTokenIDRangesResponse> {
		const rawResponse = await this.client.getTokenIDRanges(args);
		return transforms.toGetTokenIDRangesResponse(
			rawResponse,
			args.contractAddress as Address,
		);
	}

	/**
	 * Get token balance details with normalized types (bigint)
	 */
	async getTokenBalancesDetails(
		args: IndexerGen.GetTokenBalancesDetailsArgs,
	): Promise<Normalized.GetTokenBalancesDetailsResponse> {
		const rawResponse = await this.client.getTokenBalancesDetails(args);
		return {
			page: transforms.toPage(rawResponse.page) || {
				page: 0,
				pageSize: 0,
				more: false,
			},
			nativeBalances: rawResponse.nativeBalances || [],
			balances: rawResponse.balances.map(transforms.toTokenBalance),
		};
	}

	/**
	 * Fetch transaction receipt with normalized types (bigint)
	 */
	async fetchTransactionReceipt(args: {
		txnHash: string;
		maxBlockWait?: number;
	}): Promise<{ receipt: Normalized.TransactionReceipt }> {
		const rawResponse = await this.client.fetchTransactionReceipt(args);
		return {
			receipt: transforms.toTransactionReceipt(rawResponse.receipt),
		};
	}

	/**
	 * Access the underlying raw client for any methods not wrapped
	 */
	get raw(): SequenceIndexer {
		return this.client;
	}
}
