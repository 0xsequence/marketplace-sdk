import { createAtom, createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { addDays } from 'date-fns/addDays';
import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import type { Address } from 'viem';
import { type Currency, OrderbookKind } from '../../../../types';
import type { ModalCallbacks } from '../_internal/types';

// ===========================
// Core Store - Minimal State
// ===========================

type CreateListingContext = {
	// Modal lifecycle
	isOpen: boolean;
	callbacks?: ModalCallbacks;

	// Initial params (immutable after open)
	params: {
		collectionAddress: Address;
		chainId: number;
		collectibleId: string;
		orderbookKind: OrderbookKind;
	} | null;

	// User input only
	form: {
		price: {
			amount: Dnum;
			currency: Currency | null;
		};
		quantity: string;
		expiry: Date;
	};

	// Transaction state only
	transaction: {
		approvalRequired: boolean;
		isProcessing: boolean;
	};
};

type CreateListingEvents = {
	open: {
		collectionAddress: Address;
		chainId: number;
		collectibleId: string;
		orderbookKind?: OrderbookKind;
		callbacks?: ModalCallbacks;
	};
	close: Record<string, never>;

	// Single event for all form updates
	updateForm: Partial<{
		price: { amount?: Dnum; currency?: Currency };
		quantity: string;
		expiry: Date;
	}>;

	// Transaction state updates
	setApprovalRequired: { required: boolean };
	setProcessing: { processing: boolean };
};

export type OpenCreateListingModalArgs = CreateListingEvents['open'];

// Helper functions
const defaultExpiry = () => new Date(addDays(new Date(), 7).toJSON());

const initialContext: CreateListingContext = {
	isOpen: false,
	callbacks: undefined,
	params: null,
	form: {
		price: {
			amount: dn.from(0, 0),
			currency: null,
		},
		quantity: '1',
		expiry: defaultExpiry(),
	},
	transaction: {
		approvalRequired: false,
		isProcessing: false,
	},
};

// Main store
export const createListingModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event: CreateListingEvents['open']) => ({
			...context,
			isOpen: true,
			callbacks: event.callbacks,
			params: {
				collectionAddress: event.collectionAddress,
				chainId: event.chainId,
				collectibleId: event.collectibleId,
				orderbookKind:
					event.orderbookKind ?? OrderbookKind.sequence_marketplace_v2,
			},
			// Reset form on open
			form: {
				...initialContext.form,
				expiry: defaultExpiry(),
			},
			transaction: initialContext.transaction,
		}),

		close: () => ({
			...initialContext,
			form: {
				...initialContext.form,
				expiry: defaultExpiry(),
			},
		}),

		updateForm: (context, event: CreateListingEvents['updateForm']) => {
			const newForm = { ...context.form };

			if (event.price) {
				newForm.price = {
					amount: event.price.amount ?? context.form.price.amount,
					currency: event.price.currency ?? context.form.price.currency,
				};

				// Handle currency change with decimal adjustment
				if (
					event.price.currency &&
					context.form.price.currency &&
					event.price.currency.decimals !== context.form.price.currency.decimals
				) {
					newForm.price.amount = dn.setDecimals(
						context.form.price.amount,
						event.price.currency.decimals,
					);
				}
			}

			if (event.quantity !== undefined) {
				newForm.quantity = event.quantity;
			}

			if (event.expiry) {
				newForm.expiry = event.expiry;
			}

			return { ...context, form: newForm };
		},

		setApprovalRequired: (
			context,
			event: CreateListingEvents['setApprovalRequired'],
		) => ({
			...context,
			transaction: {
				...context.transaction,
				approvalRequired: event.required,
			},
		}),

		setProcessing: (context, event: CreateListingEvents['setProcessing']) => ({
			...context,
			transaction: {
				...context.transaction,
				isProcessing: event.processing,
			},
		}),
	},
});

// ===========================
// Atoms - Derived State
// ===========================

// Price validation
export const priceValidationAtom = createAtom(() => {
	const { form } = createListingModalStore.getSnapshot().context;
	if (!form.price.currency) {
		return 'Please select a currency';
	}
	if (dn.eq(form.price.amount, [0n, 0])) {
		return 'Price must be greater than 0';
	}
	return undefined;
});

// Quantity validation
export const quantityValidationAtom = createAtom(() => {
	const { form } = createListingModalStore.getSnapshot().context;
	const quantity = Number(form.quantity);
	if (Number.isNaN(quantity) || quantity <= 0) {
		return 'Quantity must be greater than 0';
	}
	return undefined;
});

// Combined validation state
export const formValidationAtom = createAtom(() => {
	const priceError = priceValidationAtom.get();
	const quantityError = quantityValidationAtom.get();

	return {
		priceError,
		quantityError,
		isValid: !priceError && !quantityError,
	};
});

// Can submit check
export const canSubmitAtom = createAtom(() => {
	const validation = formValidationAtom.get();
	const { transaction } = createListingModalStore.getSnapshot().context;

	return (
		validation.isValid &&
		!transaction.isProcessing &&
		!transaction.approvalRequired
	);
});

// ===========================
// Selector Hooks
// ===========================

// Basic selectors
export const useIsOpen = () =>
	useSelector(createListingModalStore, (state) => state.context.isOpen);

export const useParams = () =>
	useSelector(createListingModalStore, (state) => state.context.params);

export const useFormData = () =>
	useSelector(createListingModalStore, (state) => state.context.form);

export const useTransactionState = () =>
	useSelector(createListingModalStore, (state) => state.context.transaction);

// Atom hooks - use useSelector for read-only atoms
export const usePriceValidation = () =>
	useSelector(priceValidationAtom, (s) => s);
export const useQuantityValidation = () =>
	useSelector(quantityValidationAtom, (s) => s);
export const useFormValidation = () =>
	useSelector(formValidationAtom, (s) => s);
export const useCanSubmit = () => useSelector(canSubmitAtom, (s) => s);

// Convenience hooks
export const usePrice = () =>
	useSelector(createListingModalStore, (state) => state.context.form.price);

export const useQuantity = () =>
	useSelector(createListingModalStore, (state) => state.context.form.quantity);

export const useExpiry = () =>
	useSelector(createListingModalStore, (state) => state.context.form.expiry);

// ===========================
// Backward Compatibility
// ===========================

// For gradual migration - mimics old API
export const useCreateListingState = () =>
	useSelector(createListingModalStore, (state) => {
		const { isOpen, callbacks, params, form, transaction } = state.context;

		if (!params) {
			// Return minimal state when modal hasn't been opened
			return {
				isOpen: false,
				callbacks: undefined,
				collectionAddress: '' as Address,
				chainId: 0,
				collectibleId: '',
				collectionName: '',
				collectionType: undefined,
				orderbookKind: OrderbookKind.sequence_marketplace_v2,
				listingPrice: {
					amount: dn.from(0, 0),
					amountRaw: '0',
					currency: {} as Currency,
				},
				quantity: '1',
				invalidQuantity: false,
				expiry: defaultExpiry(),
				steps: {
					approval: {
						exist: false,
						isExecuting: false,
						execute: () => Promise.resolve(),
					},
					transaction: {
						exist: false,
						isExecuting: false,
						execute: () => Promise.resolve(),
					},
				},
				listingIsBeingProcessed: false,
			};
		}

		return {
			isOpen,
			callbacks,
			collectionAddress: params.collectionAddress,
			chainId: params.chainId,
			collectibleId: params.collectibleId,
			collectionName: '', // Will come from React Query
			collectionType: undefined, // Will come from React Query
			orderbookKind: params.orderbookKind,
			listingPrice: {
				amount: form.price.amount,
				amountRaw: dn.toString(form.price.amount),
				currency: form.price.currency || ({} as Currency),
			},
			quantity: form.quantity,
			invalidQuantity: !!quantityValidationAtom.get(),
			expiry: form.expiry,
			steps: {
				approval: {
					exist: transaction.approvalRequired,
					isExecuting: false,
					execute: () => Promise.resolve(),
				},
				transaction: {
					exist: true,
					isExecuting: transaction.isProcessing,
					execute: () => Promise.resolve(),
				},
			},
			listingIsBeingProcessed: transaction.isProcessing,
		};
	});

export const useSteps = () =>
	useSelector(createListingModalStore, (state) => {
		const { transaction } = state.context;
		return {
			approval: {
				exist: transaction.approvalRequired,
				isExecuting: false,
				execute: () => Promise.resolve(),
			},
			transaction: {
				exist: true,
				isExecuting: transaction.isProcessing,
				execute: () => Promise.resolve(),
			},
		};
	});

export const useListingPrice = () =>
	useSelector(createListingModalStore, (state) => {
		const { form } = state.context;
		return {
			amount: form.price.amount,
			amountRaw: dn.toString(form.price.amount),
			currency: form.price.currency || ({} as Currency),
		};
	});

export const useInvalidQuantity = () =>
	useSelector(createListingModalStore, () => !!quantityValidationAtom.get());

export const useListingProcessing = () =>
	useSelector(
		createListingModalStore,
		(state) => state.context.transaction.isProcessing,
	);

export const useCollectionData = () =>
	useSelector(createListingModalStore, () => ({
		name: '', // Will come from React Query
		type: undefined, // Will come from React Query
	}));

// ===========================
// Action Helpers
// ===========================

export const createListingActions = {
	open: (params: CreateListingEvents['open']) =>
		createListingModalStore.send({ type: 'open', ...params }),

	close: () => createListingModalStore.send({ type: 'close' }),

	updatePrice: (amount: Dnum, currency?: Currency) =>
		createListingModalStore.send({
			type: 'updateForm',
			price: { amount, currency },
		}),

	updateCurrency: (currency: Currency) =>
		createListingModalStore.send({
			type: 'updateForm',
			price: { currency },
		}),

	updateQuantity: (quantity: string) =>
		createListingModalStore.send({ type: 'updateForm', quantity }),

	updateExpiry: (expiry: Date) =>
		createListingModalStore.send({ type: 'updateForm', expiry }),

	setApprovalRequired: (required: boolean) =>
		createListingModalStore.send({ type: 'setApprovalRequired', required }),

	setProcessing: (processing: boolean) =>
		createListingModalStore.send({ type: 'setProcessing', processing }),
};

// ===========================
// Development Tools
// ===========================

if (process.env.NODE_ENV === 'development') {
	createListingModalStore.inspect((inspectionEvent) => {
		if (inspectionEvent.type === '@xstate.event') {
			console.log('🏷️ CreateListing Event:', inspectionEvent.event);
		}
	});

	// Log atom values on change
	formValidationAtom.subscribe((validation) => {
		console.log('📊 Form Validation:', validation);
	});
}

// Export types
export type { CreateListingContext, CreateListingEvents };
