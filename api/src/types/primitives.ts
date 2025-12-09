/**
 * Universal type primitives used across all API adapters
 */

import type { Address as ViemAddress, Hash as ViemHash } from 'viem';

/**
 * Universal chain identifier as number
 * Replaces: chainID (number), chainID (string)
 */
export type ChainId = number;

/**
 * Universal token identifier as bigint
 * Replaces: tokenId (string), tokenID (string)
 */
export type TokenId = bigint;

/**
 * Universal address type (viem compatible)
 */
export type Address = ViemAddress;

/**
 * Universal contract address
 */
export type ContractAddress = Address;

/**
 * Universal wallet address
 */
export type WalletAddress = Address;

/**
 * Universal amount/balance type (wei)
 */
export type Amount = bigint;

/**
 * Universal quantity type
 */
export type Quantity = bigint;

/**
 * Universal hash type (transaction, block, etc)
 */
export type Hash = ViemHash;

/**
 * Universal project identifier as number
 */
export type ProjectId = number;
