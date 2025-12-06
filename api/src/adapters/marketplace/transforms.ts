/**
 * Transform functions for marketplace API types
 *
 * Converts raw API types (strings) to typed versions (Address, Hex, TypedDataDomain)
 */

import type { TypedDataDomain } from 'viem';
import { normalizeAddress } from '../../utils/normalize';
import type * as Gen from './marketplace.gen';
import { StepType } from './marketplace.gen';
import type {
	CollectibleOrder,
	CollectiblePrimarySaleItem,
	Currency,
	Order,
	PrimarySaleItem,
	Signature,
	SignatureStep,
	Step,
	TransactionStep,
} from './types';

function toDomain(domain: Gen.Domain): TypedDataDomain {
	return {
		name: domain.name,
		version: domain.version,
		chainId: domain.chainId,
		verifyingContract: normalizeAddress(domain.verifyingContract),
	};
}

function toSignature(signature: Gen.Signature): Signature {
	return {
		domain: toDomain(signature.domain),
		types: signature.types,
		primaryType: signature.primaryType,
		value: signature.value,
	};
}

export function toStep(raw: Gen.Step): Step {
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
			data: raw.data,
		} as TransactionStep;
	}

	// Signature steps
	if (raw.id === StepType.signEIP191) {
		return {
			...baseStep,
			id: raw.id,
			// biome-ignore lint/style/noNonNullAssertion: post is required for signature steps
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
			// biome-ignore lint/style/noNonNullAssertion: post is required for signature steps
			post: raw.post!,
			signature: toSignature(raw.signature),
		} as SignatureStep;
	}

	throw new Error(`Unknown step type: ${raw.id}`);
}

export function toSteps(raw: Gen.Step[]): Step[] {
	return raw.map(toStep);
}

export function toCurrency(raw: Gen.Currency): Currency {
	return {
		...raw,
		contractAddress: normalizeAddress(raw.contractAddress),
	};
}

export function toCurrencies(raw: Gen.Currency[]): Currency[] {
	return raw.map(toCurrency);
}

export function toOrder(raw: Gen.Order): Order {
	return {
		...raw,
		priceCurrencyAddress: normalizeAddress(raw.priceCurrencyAddress),
	};
}

export function toOrders(raw: Gen.Order[]): Order[] {
	return raw.map(toOrder);
}

export function toCollectibleOrder(
	raw: Gen.CollectibleOrder,
): CollectibleOrder {
	return {
		...raw,
		metadata: {
			...raw.metadata,
			tokenId:
				typeof raw.metadata.tokenId === 'string'
					? BigInt(raw.metadata.tokenId)
					: raw.metadata.tokenId,
		},
		order: raw.order ? toOrder(raw.order) : undefined,
		listing: raw.listing ? toOrder(raw.listing) : undefined,
		offer: raw.offer ? toOrder(raw.offer) : undefined,
	};
}

export function toCollectibleOrders(
	raw: Gen.CollectibleOrder[],
): CollectibleOrder[] {
	return raw.map(toCollectibleOrder);
}

export function toPrimarySaleItem(raw: Gen.PrimarySaleItem): PrimarySaleItem {
	return {
		...raw,
		currencyAddress: normalizeAddress(raw.currencyAddress),
		itemAddress: normalizeAddress(raw.itemAddress),
	};
}

export function toPrimarySaleItems(
	raw: Gen.PrimarySaleItem[],
): PrimarySaleItem[] {
	return raw.map(toPrimarySaleItem);
}

export function toCollectiblePrimarySaleItem(
	raw: Gen.CollectiblePrimarySaleItem,
): CollectiblePrimarySaleItem {
	return {
		...raw,
		primarySaleItem: toPrimarySaleItem(raw.primarySaleItem),
	};
}

export function toCollectiblePrimarySaleItems(
	raw: Gen.CollectiblePrimarySaleItem[],
): CollectiblePrimarySaleItem[] {
	return raw.map(toCollectiblePrimarySaleItem);
}
