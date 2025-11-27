import type { FeeOption } from '@0xsequence/waas';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';

export class Deferred<T> {
	private _resolve: (value: T) => void = () => {};
	private _reject: (value: T) => void = () => {};

	private _promise: Promise<T> = new Promise<T>((resolve, reject) => {
		this._reject = reject;
		this._resolve = resolve;
	});

	get promise(): Promise<T> {
		return this._promise;
	}

	resolve(value: T) {
		this._resolve(value);
	}

	reject(value: T) {
		this._reject(value);
	}
}

/**
 * Extended FeeOption type that includes balance information
 */
export type FeeOptionExtended = FeeOption & {
	/** Raw balance string */
	balance: string;
	/** Formatted balance with proper decimals */
	balanceFormatted: string;
	/** Indicates if the wallet has enough balance to pay the fee */
	hasEnoughBalanceForFee: boolean;
};

/**
 * Fee option confirmation data structure
 */
export type WaasFeeOptionConfirmation = {
	/** Unique identifier for the fee confirmation */
	id: string;
	/** Available fee options with balance information */
	options: FeeOptionExtended[] | FeeOption[];
	/** Chain ID where the transaction will be executed */
	chainId: number;
};

/**
 * Result type for fee option confirmation
 */
export type FeeOptionConfirmationResult = {
	id: string;
	feeTokenAddress?: string | null;
	confirmed: boolean;
};

export interface WaasFeeOptionsState {
	pendingConfirmation: WaasFeeOptionConfirmation | undefined;
	deferred: Deferred<FeeOptionConfirmationResult> | undefined;
}

const initialContext: WaasFeeOptionsState = {
	pendingConfirmation: undefined,
	deferred: undefined,
};

export const waasFeeOptionsStore = createStore({
	context: initialContext,
	on: {
		setPendingConfirmation: (
			context,
			event: { confirmation: WaasFeeOptionConfirmation | undefined },
		) => ({
			...context,
			pendingConfirmation: event.confirmation,
		}),

		setDeferred: (
			context,
			event: { deferred: Deferred<FeeOptionConfirmationResult> | undefined },
		) => ({
			...context,
			deferred: event.deferred,
		}),

		confirmFeeOption: (
			context,
			event: { id: string; feeTokenAddress: string | null },
		) => {
			if (context.deferred && context.pendingConfirmation?.id === event.id) {
				context.deferred.resolve({
					id: event.id,
					feeTokenAddress: event.feeTokenAddress,
					confirmed: true,
				});

				return {
					...context,
					deferred: undefined,
					pendingConfirmation: undefined,
				};
			}
			return context;
		},

		rejectFeeOption: (context, event: { id: string }) => {
			if (context.deferred && context.pendingConfirmation?.id === event.id) {
				context.deferred.resolve({
					id: event.id,
					feeTokenAddress: undefined,
					confirmed: false,
				});

				return {
					...context,
					deferred: undefined,
					pendingConfirmation: undefined,
				};
			}
			return context;
		},

		clear: () => initialContext,
	},
});

// Selector hooks
export const usePendingConfirmation = () =>
	useSelector(
		waasFeeOptionsStore,
		(state) => state.context.pendingConfirmation,
	);

export const useDeferred = () =>
	useSelector(waasFeeOptionsStore, (state) => state.context.deferred);

export const useWaasFeeOptionsState = () =>
	useSelector(waasFeeOptionsStore, (state) => state.context);
