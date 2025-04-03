import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import { type Currency, OrderbookKind } from '../../../../types';
import type { CollectionType, TransactionSteps } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type CreateListingState = BaseModalState & {
	collectibleId: string;
	collectionName: string;
	orderbookKind?: OrderbookKind;
	collectionType: CollectionType | undefined;
	listingPrice: {
		amountRaw: string;
		currency: Currency;
	};
	quantity: string;
	invalidQuantity: boolean;
	expiry: Date;
	steps: TransactionSteps;
	listingIsBeingProcessed: boolean;
};

export type OpenCreateListingModalArgs = {
	collectionAddress: Hex;
	chainId: number;
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
};

type Actions = {
	open: (args: OpenCreateListingModalArgs) => void;
	close: () => void;
};

const listingPrice = {
	amountRaw: '0',
	currency: {} as Currency,
};

const approval = {
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve(),
};

const transaction = {
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve(),
};

const steps = {
	approval: { ...approval },
	transaction: { ...transaction },
};

const initialState: CreateListingState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: 0,
	collectibleId: '',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionName: '',
	collectionType: undefined,
	listingPrice: { ...listingPrice },
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	callbacks: undefined as ModalCallbacks | undefined,
	steps: { ...steps },
	listingIsBeingProcessed: false,
};

const actions: Actions = {
	open: (args) => {
		createListingModal$.collectionAddress.set(args.collectionAddress);
		createListingModal$.chainId.set(args.chainId);
		createListingModal$.collectibleId.set(args.collectibleId);
		createListingModal$.orderbookKind.set(args.orderbookKind);
		createListingModal$.callbacks.set(args.callbacks);
		createListingModal$.isOpen.set(true);
	},
	close: () => {
		createListingModal$.isOpen.set(false);
		createListingModal$.set({ ...initialState, ...actions });
		createListingModal$.listingPrice.set({ ...listingPrice });
		createListingModal$.steps.set({ ...steps });
		createListingModal$.listingIsBeingProcessed.set(false);
		createListingModal$.steps.approval.isExecuting.set(false);
		createListingModal$.steps.transaction.isExecuting.set(false);
	},
};

export const createListingModal$ = observable<CreateListingState & Actions>({
	...initialState,
	...actions,
});
