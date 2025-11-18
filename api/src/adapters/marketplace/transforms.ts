/**
 * Transform functions for marketplace API types
 *
 * Converts raw API types (strings) to typed versions (Address, Hex, TypedDataDomain)
 */

import type { TypedDataDomain } from 'viem';
import { normalizeAddress } from '../../utils/address';
import type * as Gen from './marketplace.gen';
import { StepType } from './marketplace.gen';
import type {
	Currency,
	Signature,
	SignatureStep,
	Step,
	TransactionStep,
} from './types';

/**
 * Transform raw Domain to TypedDataDomain
 */
function toDomain(domain: Gen.Domain): TypedDataDomain {
	return {
		name: domain.name,
		version: domain.version,
		chainId: domain.chainId,
		verifyingContract: normalizeAddress(domain.verifyingContract),
	};
}

/**
 * Transform raw Signature to typed Signature
 */
function toSignature(signature: Gen.Signature): Signature {
	return {
		domain: toDomain(signature.domain),
		types: signature.types,
		primaryType: signature.primaryType,
		value: signature.value,
	};
}

/**
 * Transform raw Step to typed Step
 *
 * Note: The API returns additional fields (maxFeePerGas, maxPriorityFeePerGas, gas)
 * that aren't in the generated Step type, so we cast to any to access them.
 */
export function toStep(raw: Gen.Step): Step {
	const rawAny = raw as any;
	const baseStep = {
		...raw,
		to: normalizeAddress(raw.to),
	};

	// Transaction steps
	if (
		raw.id === StepType.tokenApproval ||
		raw.id === StepType.buy ||
		raw.id === StepType.sell ||
		raw.id === StepType.cancel ||
		raw.id === StepType.createOffer ||
		raw.id === StepType.createListing
	) {
		return {
			...baseStep,
			id: raw.id,
			data: raw.data as `0x${string}`, // Transaction data is always hex
			maxFeePerGas: rawAny.maxFeePerGas as `0x${string}` | undefined,
			maxPriorityFeePerGas: rawAny.maxPriorityFeePerGas as
				| `0x${string}`
				| undefined,
			gas: rawAny.gas as `0x${string}` | undefined,
		} as TransactionStep;
	}

	// Signature steps
	if (raw.id === StepType.signEIP191) {
		return {
			...baseStep,
			id: raw.id,
			post: raw.post!,
		} as SignatureStep;
	}

	if (raw.id === StepType.signEIP712) {
		if (!raw.signature) {
			throw new Error('EIP-712 step missing signature data');
		}
		return {
			...baseStep,
			id: raw.id,
			post: raw.post!,
			signature: toSignature(raw.signature),
		} as SignatureStep;
	}

	throw new Error(`Unknown step type: ${raw.id}`);
}

/**
 * Transform array of raw Steps to typed Steps
 */
export function toSteps(raw: Gen.Step[]): Step[] {
	return raw.map(toStep);
}

/**
 * Transform raw Currency to typed Currency with Address
 */
export function toCurrency(raw: Gen.Currency): Currency {
	return {
		...raw,
		contractAddress: normalizeAddress(raw.contractAddress),
	};
}

/**
 * Transform array of raw Currencies to typed Currencies
 */
export function toCurrencies(raw: Gen.Currency[]): Currency[] {
	return raw.map(toCurrency);
}

/**
 * Transform raw Order to typed Order with Address for priceCurrencyAddress
 */
export function toOrder(raw: Gen.Order): import('./types').Order {
	return {
		...raw,
		priceCurrencyAddress: normalizeAddress(raw.priceCurrencyAddress),
	};
}

/**
 * Transform array of raw Orders to typed Orders
 */
export function toOrders(raw: Gen.Order[]): import('./types').Order[] {
	return raw.map(toOrder);
}

/**
 * Transform raw CollectibleOrder to typed CollectibleOrder with normalized Order types
 */
export function toCollectibleOrder(
	raw: Gen.CollectibleOrder,
): import('./types').CollectibleOrder {
	return {
		...raw,
		order: raw.order ? toOrder(raw.order) : undefined,
		listing: raw.listing ? toOrder(raw.listing) : undefined,
		offer: raw.offer ? toOrder(raw.offer) : undefined,
	};
}

/**
 * Transform array of raw CollectibleOrders to typed CollectibleOrders
 */
export function toCollectibleOrders(
	raw: Gen.CollectibleOrder[],
): import('./types').CollectibleOrder[] {
	return raw.map(toCollectibleOrder);
}
