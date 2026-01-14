import type { Address, Hash, TypedDataDomain } from 'viem';
import type { ChainId } from '../../types/primitives';
import {
	type CheckoutOptionsSalesContractRequest as GenCheckoutOptionsSalesContractRequest,
	type CollectibleOrder as GenCollectibleOrder,
	type CollectiblePrimarySaleItem as GenCollectiblePrimarySaleItem,
	type Currency as GenCurrency,
	type Order as GenOrder,
	type PrimarySaleItem as GenPrimarySaleItem,
	type Signature as GenSignature,
	type Step as GenStep,
	type PostRequest,
	StepType,
} from './marketplace.gen';

export type {
	Collectible,
	Collection,
	TokenMetadata,
} from './marketplace.gen';

export type Currency = Omit<GenCurrency, 'contractAddress'> & {
	contractAddress: Address;
};

export type PrimarySaleItem = Omit<
	GenPrimarySaleItem,
	'currencyAddress' | 'itemAddress'
> & {
	currencyAddress: Address;
	itemAddress: Address;
};

export type CollectiblePrimarySaleItem = Omit<
	GenCollectiblePrimarySaleItem,
	'primarySaleItem'
> & {
	primarySaleItem: PrimarySaleItem;
};

export type Order = Omit<GenOrder, 'priceCurrencyAddress'> & {
	priceCurrencyAddress: Address;
};

export type CollectibleOrder = Omit<
	GenCollectibleOrder,
	'order' | 'listing' | 'offer'
> & {
	order?: Order;
	listing?: Order;
	offer?: Order;
};

type StepBase = Omit<GenStep, 'to'> & {
	to: Address;
};

export type Signature = Omit<GenSignature, 'domain'> & {
	domain: TypedDataDomain;
};

export type SignatureStep =
	| (Omit<StepBase, 'signature'> & {
			id: StepType.signEIP191;
			post: PostRequest;
			signature?: never;
	  })
	| (Omit<StepBase, 'signature'> & {
			id: StepType.signEIP712;
			post: PostRequest;
			signature: Signature;
	  });

export type TransactionStep = Omit<StepBase, 'data'> & {
	id:
		| StepType.tokenApproval
		| StepType.buy
		| StepType.sell
		| StepType.cancel
		| StepType.createOffer
		| StepType.createListing;
	data: Hash;
};

export type ApprovalStep = TransactionStep & {
	id: StepType.tokenApproval;
};

export type BuyStep = TransactionStep & {
	id: StepType.buy;
};

export type SellStep = TransactionStep & {
	id: StepType.sell;
};

export type CreateListingStep = TransactionStep & {
	id: StepType.createListing;
};

export type CreateOfferStep = TransactionStep & {
	id: StepType.createOffer;
};

export type CancelStep = TransactionStep & {
	id: StepType.cancel;
};

export type UnknownStep = StepBase & {
	id: StepType.unknown;
};

export type Step = SignatureStep | TransactionStep | UnknownStep;

export function isSignatureStep(step: Step): step is SignatureStep {
	return step.id === StepType.signEIP191 || step.id === StepType.signEIP712;
}

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

export function isApprovalStep(step: Step): step is ApprovalStep {
	return step.id === StepType.tokenApproval;
}

export function isBuyStep(step: Step): step is BuyStep {
	return step.id === StepType.buy;
}

export function isSellStep(step: Step): step is SellStep {
	return step.id === StepType.sell;
}

export function isCreateListingStep(step: Step): step is CreateListingStep {
	return step.id === StepType.createListing;
}

export function isCreateOfferStep(step: Step): step is CreateOfferStep {
	return step.id === StepType.createOffer;
}

export function isCancelStep(step: Step): step is CancelStep {
	return step.id === StepType.cancel;
}

export function findStepByType<T extends StepType>(
	steps: Step[],
	type: T,
): Extract<Step, { id: T }> | undefined {
	return steps.find((step) => step.id === type) as
		| Extract<Step, { id: T }>
		| undefined;
}

export function findApprovalStep(steps: Step[]): ApprovalStep | undefined {
	return steps.find(isApprovalStep);
}

export function findBuyStep(steps: Step[]): BuyStep | undefined {
	return steps.find(isBuyStep);
}

export function findSellStep(steps: Step[]): SellStep | undefined {
	return steps.find(isSellStep);
}

export function hasPendingApproval(steps: Step[]): boolean {
	return steps.some(isApprovalStep);
}

export type GetPrimarySaleCheckoutOptionsRequest = Omit<
	GenCheckoutOptionsSalesContractRequest,
	'chainId' | 'wallet' | 'contractAddress' | 'collectionAddress'
> & {
	chainId: ChainId;
	walletAddress: Address;
	contractAddress: Address;
	collectionAddress: Address;
};
