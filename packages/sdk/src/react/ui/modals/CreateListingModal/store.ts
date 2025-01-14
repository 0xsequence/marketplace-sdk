import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import { type Currency, OrderbookKind } from '../../../../types';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';
import type { CollectionType, TransactionSteps } from '../../../_internal';

type CreateListingState = BaseModalState & {
	collectibleId: string;
	collectionName: string;
	orderbookKind: OrderbookKind;
	collectionType: CollectionType | undefined;
	listingPrice: {
		amountRaw: string;
		currency: Currency;
	};
	quantity: string;
	invalidQuantity: boolean;
	expiry: Date;
	steps: TransactionSteps;
};

export type OpenCreateListingModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	orderbookKind: OrderbookKind;
	callbacks?: ModalCallbacks;
};

type Actions = {
	open: (args: OpenCreateListingModalArgs) => void;
	close: () => void;
};

const initialState: CreateListingState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: '',
	collectibleId: '',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionName: '',
	collectionType: undefined,
	listingPrice: {
		amountRaw: '0',
		currency: {} as Currency,
	},
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	callbacks: undefined as ModalCallbacks | undefined,
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
	},
};

export const createListingModal$ = observable<CreateListingState & Actions>({
	...initialState,
	...actions,
});
