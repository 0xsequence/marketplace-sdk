import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Address } from 'viem';
import type { Currency, OrderbookKind, Price } from '../../../../types';
import type { CollectionType, TransactionSteps } from '../../../_internal';
import type {
	BaseModalState,
	ModalCallbacks,
	WaasFeeOptionSelectionType,
} from '../_internal/types';

type MakeOfferState = BaseModalState & {
	orderbookKind?: OrderbookKind;
	collectibleId: string;
	offerPrice: Price;
	offerPriceChanged: boolean;
	quantity: string;
	expiry: Date;
	invalidQuantity: boolean;
	collectionType?: CollectionType;
	steps: TransactionSteps;
	offerIsBeingProcessed: boolean;
};

export type OpenMakeOfferModalArgs = {
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	waasFeeOptionSelectionType?: WaasFeeOptionSelectionType;
};

type Actions = {
	open: (args: OpenMakeOfferModalArgs) => void;
	close: () => void;
};

const offerPrice = {
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

const initialState: MakeOfferState = {
	isOpen: false,
	collectionAddress: '' as Address,
	chainId: 0,
	collectibleId: '',
	orderbookKind: undefined,
	callbacks: undefined,
	offerPrice: { ...offerPrice },
	offerPriceChanged: false,
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	collectionType: undefined,
	steps: { ...steps },
	offerIsBeingProcessed: false,
	waasFeeOptionSelectionType: 'automatic',
};

const actions: Actions = {
	open: (args) => {
		makeOfferModal$.collectionAddress.set(args.collectionAddress);
		makeOfferModal$.chainId.set(args.chainId);
		makeOfferModal$.collectibleId.set(args.collectibleId);
		makeOfferModal$.orderbookKind.set(args.orderbookKind);
		makeOfferModal$.callbacks.set(args.callbacks);
		makeOfferModal$.waasFeeOptionSelectionType.set(
			args.waasFeeOptionSelectionType || 'automatic',
		);
		makeOfferModal$.isOpen.set(true);
	},
	close: () => {
		makeOfferModal$.isOpen.set(false);
		makeOfferModal$.set({ ...initialState, ...actions });
		makeOfferModal$.steps.set({ ...steps });
		makeOfferModal$.offerPrice.set({ ...offerPrice });
		makeOfferModal$.offerIsBeingProcessed.set(false);
	},
};

export const makeOfferModal$ = observable<MakeOfferState & Actions>({
	...initialState,
	...actions,
});
