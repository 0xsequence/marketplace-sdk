/**
 * Wrapped Metadata Client
 *
 * Wraps the raw @0xsequence/metadata client to accept normalized types (number chainId, bigint tokenId)
 * and automatically convert to/from the raw API types (string chainID, string tokenID).
 */

import { Metadata as RawMetadata } from '@0xsequence/metadata';
import * as Transforms from './transforms';
import type * as NormalizedTypes from './types';

/**
 * Wrapped Metadata Client
 *
 * This client accepts SDK-friendly types (number for chainId, bigint for tokenId)
 * and handles conversion to/from the raw API types internally.
 */
export class MetadataClient {
	private client: RawMetadata;

	constructor(hostname: string, jwtAuth?: string | typeof globalThis.fetch) {
		// RawMetadata signature is (hostname: string, fetch?: Fetch)
		// But SDK passes jwtAuth string. Handle both for compatibility.
		if (typeof jwtAuth === 'string' || jwtAuth === undefined) {
			// SDK passes jwtAuth, but Metadata expects fetch
			// Just use default fetch for now
			this.client = new RawMetadata(hostname, globalThis.fetch);
		} else {
			this.client = new RawMetadata(hostname, jwtAuth);
		}
	}

	/**
	 * Get contract info
	 * Accepts normalized types (chainId: number)
	 */
	async getContractInfo(
		args: NormalizedTypes.GetContractInfoArgs,
	): Promise<NormalizedTypes.GetContractInfoReturn> {
		// Convert normalized args to raw API args
		const apiArgs = Transforms.toGetContractInfoArgs(args);
		// Call raw API
		const rawResult = await this.client.getContractInfo(apiArgs);
		// Convert raw response to normalized
		return Transforms.toGetContractInfoReturn(rawResult);
	}

	/**
	 * Get contract info batch
	 * Accepts normalized types (chainId: number)
	 */
	async getContractInfoBatch(
		args: NormalizedTypes.GetContractInfoBatchArgs,
	): Promise<NormalizedTypes.GetContractInfoBatchReturn> {
		const apiArgs = Transforms.toGetContractInfoBatchArgs(args);
		const rawResult = await this.client.getContractInfoBatch(apiArgs);
		return Transforms.toGetContractInfoBatchReturn(rawResult);
	}

	/**
	 * Get token metadata
	 * Accepts normalized types (chainId: number, tokenIds: bigint[])
	 */
	async getTokenMetadata(
		args: NormalizedTypes.GetTokenMetadataArgs,
	): Promise<NormalizedTypes.GetTokenMetadataReturn> {
		const apiArgs = Transforms.toGetTokenMetadataArgs(args);
		const rawResult = await this.client.getTokenMetadata(apiArgs);
		return Transforms.toGetTokenMetadataReturn(rawResult);
	}

	/**
	 * Get token metadata batch
	 * Accepts normalized types (chainId: number, tokenIds: bigint[])
	 */
	async getTokenMetadataBatch(
		args: NormalizedTypes.GetTokenMetadataBatchArgs,
	): Promise<NormalizedTypes.GetTokenMetadataBatchReturn> {
		const apiArgs = Transforms.toGetTokenMetadataBatchArgs(args);
		const rawResult = await this.client.getTokenMetadataBatch(apiArgs);
		return Transforms.toGetTokenMetadataBatchReturn(rawResult);
	}

	/**
	 * Refresh token metadata
	 * Accepts normalized types (chainId: number, tokenIds: bigint[])
	 */
	async refreshTokenMetadata(
		args: NormalizedTypes.RefreshTokenMetadataArgs,
	): Promise<NormalizedTypes.RefreshTokenMetadataReturn> {
		const apiArgs = Transforms.toRefreshTokenMetadataArgs(args);
		return this.client.refreshTokenMetadata(apiArgs);
	}

	/**
	 * Search token metadata
	 * Accepts normalized types (chainId: number)
	 */
	async searchTokenMetadata(
		args: NormalizedTypes.SearchTokenMetadataArgs,
	): Promise<NormalizedTypes.SearchTokenMetadataReturn> {
		const apiArgs = Transforms.toSearchTokenMetadataArgs(args);
		const rawResult = await this.client.searchTokenMetadata(apiArgs);
		return Transforms.toSearchTokenMetadataReturn(rawResult);
	}

	/**
	 * Get token metadata property filters
	 * Accepts normalized types (chainId: number)
	 */
	async getTokenMetadataPropertyFilters(
		args: NormalizedTypes.GetTokenMetadataPropertyFiltersArgs,
	): Promise<NormalizedTypes.GetTokenMetadataPropertyFiltersReturn> {
		const apiArgs = Transforms.toGetTokenMetadataPropertyFiltersArgs(args);
		const rawResult =
			await this.client.getTokenMetadataPropertyFilters(apiArgs);
		return Transforms.toGetTokenMetadataPropertyFiltersReturn(rawResult);
	}

	/**
	 * Access the underlying raw client if needed
	 * (for advanced use cases or methods not yet wrapped)
	 */
	get raw(): RawMetadata {
		return this.client;
	}
}
