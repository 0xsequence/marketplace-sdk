import type { TypedData, TypedDataDomain } from 'viem';
import type { Hex } from 'viem';
import { type PostRequest, type Signature, type Step, StepType } from '../api';

export interface SignatureStep {
	id: StepType.signEIP191 | StepType.signEIP712;
	domain?: TypedDataDomain;
	types?: TypedData;
	primaryType?: string;
	to: Hex; // TODO: This should not be here, its wrongly typed in webrpc
	data: string;
	value: string;
	signature?: Signature;
	post: PostRequest;
}

export interface TransactionStep {
	id:
		| StepType.buy
		| StepType.sell
		| StepType.cancel
		| StepType.createOffer
		| StepType.createListing;
	data: Hex;
	to: Hex;
	value: Hex;
	maxFeePerGas?: Hex;
	maxPriorityFeePerGas?: Hex;
	gas?: Hex;
}
export interface ApprovalStep {
	id: StepType.tokenApproval;
	data: string;
	to: Hex;
	value: string;
}

export function isSignatureStep(step: Step): step is SignatureStep {
	return step.id === StepType.signEIP191 || step.id === StepType.signEIP712;
}

export function isTransactionStep(step: Step): step is TransactionStep {
	return [
		StepType.buy,
		StepType.sell,
		StepType.cancel,
		StepType.createOffer,
		StepType.createListing,
	].includes(step.id);
}
