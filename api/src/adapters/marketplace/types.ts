/**
 * Normalized Marketplace API Types
 *
 * These types extend the generated types from marketplace.gen.ts and add:
 * - Viem types (Address, Hash) instead of strings
 * - Discriminated unions for better type safety
 * - Additional optional fields returned by the API
 *
 * All types extend from generated types to ensure they stay in sync with API changes.
 */

import type { Address, Hash, TypedDataDomain } from 'viem';
import {
	type CollectibleOrder as GenCollectibleOrder,
	type CollectiblePrimarySaleItem as GenCollectiblePrimarySaleItem,
	type Currency as GenCurrency,
	type Order as GenOrder,
	type PrimarySaleItem as GenPrimarySaleItem,
	type Step as GenStep,
	type PostRequest,
	StepType,
} from './marketplace.gen';

export type {
	Collectible,
	Collection,
	TokenMetadata,
} from './marketplace.gen';

// ============================================================================
// Currency - Normalized with Address type
// ============================================================================

/**
 * Currency type with normalized Address (viem branded type instead of string)
 */
export interface Currency extends Omit<GenCurrency, 'contractAddress'> {
	contractAddress: Address;
}

// ============================================================================
// PrimarySaleItem - Normalized with Address type
// ============================================================================

/**
 * PrimarySaleItem type with normalized Address for currencyAddress.
 *
 * Uses Omit + intersection to stay type-safe with generated API types.
 */
export interface PrimarySaleItem
	extends Omit<GenPrimarySaleItem, 'currencyAddress' | 'itemAddress'> {
	currencyAddress: Address;
	itemAddress: Address;
}

/**
 * CollectiblePrimarySaleItem with normalized PrimarySaleItem
 */
export interface CollectiblePrimarySaleItem
	extends Omit<GenCollectiblePrimarySaleItem, 'primarySaleItem'> {
	primarySaleItem: PrimarySaleItem;
}

// ============================================================================
// Order - Normalized with Address type
// ============================================================================

/**
 * Order type with normalized Address for priceCurrencyAddress.
 *
 * Uses Omit + intersection to stay type-safe with generated API types.
 * When the API changes, this type automatically stays in sync.
 */
export interface Order extends Omit<GenOrder, 'priceCurrencyAddress'> {
	priceCurrencyAddress: Address;
}

/**
 * CollectibleOrder type with normalized Order (includes typed priceCurrencyAddress).
 *
 * Uses Omit + intersection to stay type-safe with generated API types.
 */
export interface CollectibleOrder
	extends Omit<GenCollectibleOrder, 'order' | 'listing' | 'offer'> {
	order?: Order;
	listing?: Order;
	offer?: Order;
}

// ============================================================================
// Step Types - Discriminated Unions for Type Safety
// ============================================================================

/**
 * Base step type that extends Gen.Step with viem Address type.
 *
 * We override `to` to use viem's Address type instead of string for better type safety.
 * The `data` field remains as string since it can be:
 * - Plain text message (for EIP-191 signatures)
 * - Hex string (for transaction data and some signatures)
 *
 * All other fields are inherited from the generated Step type, ensuring we stay
 * in sync with API changes.
 */
type StepBase = Omit<GenStep, 'to'> & {
	to: Address; // Gen has string, we want viem's Address
};

/**
 * Signature type with viem's TypedDataDomain instead of raw Domain
 */
export type Signature = Omit<
	import('./marketplace.gen').Signature,
	'domain'
> & {
	domain: TypedDataDomain;
};

/**
 * Step representing a signature request (EIP-191 or EIP-712).
 *
 * These steps require user signature and must post the result to step.post endpoint.
 *
 * For EIP-191: data field contains the message to sign (can be plain text or hex)
 * For EIP-712: signature field contains domain, types, and value for typed data
 */
export type SignatureStep =
	| (Omit<StepBase, 'signature'> & {
			id: StepType.signEIP191;
			post: PostRequest;
			signature?: never;
	  })
	| (Omit<StepBase, 'signature'> & {
			id: StepType.signEIP712;
			post: PostRequest;
			signature: Signature; // Required for EIP-712
	  });

/**
 * Step representing a blockchain transaction.
 *
 * These steps should be sent as transactions to the network.
 *
 * Extends GenStep with:
 * - Discriminated id field (only transaction step types)
 * - data field as Hex (transactions always have hex-encoded data)
 * - Additional EIP-1559 gas fields (maxFeePerGas, maxPriorityFeePerGas, gas) as Hex
 */
export type TransactionStep = Omit<StepBase, 'data'> & {
	id:
		| StepType.tokenApproval
		| StepType.buy
		| StepType.sell
		| StepType.cancel
		| StepType.createOffer
		| StepType.createListing;
	data: Hash; // Override to Hex for transactions
	// Additional fields specific to transaction steps (not in GenStep)
	maxFeePerGas?: Hash;
	maxPriorityFeePerGas?: Hash;
	gas?: Hash;
};

/**
 * Token approval step - grants permission to spend tokens.
 */
export type ApprovalStep = TransactionStep & {
	id: StepType.tokenApproval;
};

/**
 * Buy step - purchases a collectible from a listing.
 */
export type BuyStep = TransactionStep & {
	id: StepType.buy;
};

/**
 * Sell step - accepts an offer for a collectible.
 */
export type SellStep = TransactionStep & {
	id: StepType.sell;
};

/**
 * Create listing step - lists a collectible for sale.
 */
export type CreateListingStep = TransactionStep & {
	id: StepType.createListing;
};

/**
 * Create offer step - makes an offer on a collectible.
 */
export type CreateOfferStep = TransactionStep & {
	id: StepType.createOffer;
};

/**
 * Cancel step - cancels a listing or offer.
 */
export type CancelStep = TransactionStep & {
	id: StepType.cancel;
};

/**
 * Step in a marketplace transaction flow.
 *
 * Steps are returned by transaction generation endpoints and should be
 * executed in order. Each step represents either:
 *
 * - A blockchain transaction (TransactionStep) - send to network via wallet
 * - A signature request (SignatureStep) - sign with wallet and post to API
 *
 * After executing a signature step, the result MUST be posted to step.post endpoint.
 * Transaction steps MAY optionally post results for tracking purposes.
 *
 * @example
 * ```typescript
 * const steps = await generateBuyTransaction({ ... });
 *
 * for (const step of steps) {
 *   if (step.id === StepType.tokenApproval || step.id === StepType.buy) {
 *     // TypeScript knows this is a TransactionStep
 *     const hash = await sendTransaction({
 *       to: step.to,
 *       data: step.data,
 *       value: step.value,
 *     });
 *   } else if (step.id === StepType.signEIP191) {
 *     // TypeScript knows this is a SignatureStep with post required
 *     const signature = await signMessage({ message: step.data });
 *     await fetch(step.post.endpoint, {
 *       method: step.post.method,
 *       body: JSON.stringify({ ...step.post.body, signature }),
 *     });
 *   }
 * }
 * ```
 */
export type Step = SignatureStep | TransactionStep;

// NOTE: This Step type is a more specific version of the Step interface in marketplace.gen.ts
// They are compatible at runtime, but TypeScript sees them as different types.
// The discriminated union here provides better type safety and auto-completion.

// ============================================================================
// Step Type Guards
// ============================================================================
// Step Type Guards
// ============================================================================

/**
 * Type guard to check if a step is a signature step (EIP-191 or EIP-712).
 *
 * @param step - Step to check
 * @returns True if step requires signature
 *
 * @example
 * ```typescript
 * if (isSignatureStep(step)) {
 *   const signature = await signMessage({ message: step.data });
 *   // step.post is guaranteed to exist
 * }
 * ```
 */
export function isSignatureStep(step: Step): step is SignatureStep {
	return step.id === StepType.signEIP191 || step.id === StepType.signEIP712;
}

/**
 * Type guard to check if a step is a transaction step.
 *
 * @param step - Step to check
 * @returns True if step is a blockchain transaction
 *
 * @example
 * ```typescript
 * if (isTransactionStep(step)) {
 *   const hash = await sendTransaction({
 *     to: step.to,
 *     data: step.data,
 *     value: step.value,
 *   });
 * }
 * ```
 */
export function isTransactionStep(step: Step): step is TransactionStep {
	return [
		StepType.tokenApproval,
		StepType.buy,
		StepType.sell,
		StepType.cancel,
		StepType.createOffer,
		StepType.createListing,
	].includes(step.id);
}

/**
 * Type guard to check if a step is a token approval step.
 */
export function isApprovalStep(step: Step): step is ApprovalStep {
	return step.id === StepType.tokenApproval;
}

/**
 * Type guard to check if a step is a buy step.
 */
export function isBuyStep(step: Step): step is BuyStep {
	return step.id === StepType.buy;
}

/**
 * Type guard to check if a step is a sell step.
 */
export function isSellStep(step: Step): step is SellStep {
	return step.id === StepType.sell;
}

/**
 * Type guard to check if a step is a create listing step.
 */
export function isCreateListingStep(step: Step): step is CreateListingStep {
	return step.id === StepType.createListing;
}

/**
 * Type guard to check if a step is a create offer step.
 */
export function isCreateOfferStep(step: Step): step is CreateOfferStep {
	return step.id === StepType.createOffer;
}

/**
 * Type guard to check if a step is a cancel step.
 */
export function isCancelStep(step: Step): step is CancelStep {
	return step.id === StepType.cancel;
}

// ============================================================================
// Step Utility Functions
// ============================================================================

/**
 * Find a step by its type in an array of steps.
 * Returns a properly typed step or undefined.
 *
 * @param steps - Array of steps to search
 * @param type - StepType to find
 * @returns Step of the specified type or undefined
 *
 * @example
 * ```typescript
 * const buyStep = findStepByType(steps, StepType.buy);
 * if (buyStep) {
 *   // buyStep is typed as BuyStep
 * }
 * ```
 */
export function findStepByType<T extends StepType>(
	steps: Step[],
	type: T,
): Extract<Step, { id: T }> | undefined {
	return steps.find((step) => step.id === type) as
		| Extract<Step, { id: T }>
		| undefined;
}

/**
 * Find the approval step in an array of steps.
 */
export function findApprovalStep(steps: Step[]): ApprovalStep | undefined {
	return steps.find(isApprovalStep);
}

/**
 * Find the buy step in an array of steps.
 */
export function findBuyStep(steps: Step[]): BuyStep | undefined {
	return steps.find(isBuyStep);
}

/**
 * Find the sell step in an array of steps.
 */
export function findSellStep(steps: Step[]): SellStep | undefined {
	return steps.find(isSellStep);
}

/**
 * Check if an array of steps includes a token approval step.
 */
export function hasPendingApproval(steps: Step[]): boolean {
	return steps.some(isApprovalStep);
}
