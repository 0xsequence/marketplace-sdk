import type { Address, Hex, TypedData, TypedDataDomain } from "viem";
import { type PostRequest, type Signature, type Step, StepType } from "./api";
import {
	SEQUENCE_MARKET_V1_ADDRESS,
	SEQUENCE_MARKET_V2_ADDRESS,
} from "../../consts";
import { SequenceMarketplaceKind } from "../hooks/validation/useValidateSequenceMarketOrder";

export interface SignatureStep {
	id: StepType.signEIP191 | StepType.signEIP712;
	domain?: TypedDataDomain;
	types?: TypedData;
	primaryType?: string;
	to: Address; // TODO: This should not be here, its wrongly typed in webrpc
	data: string;
	value: string;
	price: string;
	signature?: Signature;
	post: PostRequest;
}

export interface TransactionStep {
	id:
		| StepType.tokenApproval
		| StepType.buy
		| StepType.sell
		| StepType.cancel
		| StepType.createOffer
		| StepType.createListing;
	data: Hex;
	to: Address;
	value: Hex;
	price: Hex;
	maxFeePerGas?: Hex;
	maxPriorityFeePerGas?: Hex;
	gas?: Hex;
}
export interface ApprovalStep {
	id: StepType.tokenApproval;
	data: string;
	to: Address;
	value: string;
	price: string;
}

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

export type SequenceMarketplaceKind =
	| "sequence_marketplace_v1"
	| "sequence_marketplace_v2";

export function getSequenceMarketAddress(marketplace: SequenceMarketplaceKind) {
	switch (marketplace) {
		case "sequence_marketplace_v1":
			return SEQUENCE_MARKET_V1_ADDRESS;
		case "sequence_marketplace_v2":
			return SEQUENCE_MARKET_V2_ADDRESS;
		default:
			throw new Error(`Unsupported marketplace: ${marketplace}`);
	}
}
