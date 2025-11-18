import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Address } from 'viem';
import type { Currency, OrderbookKind, Price } from '../../../../types';
import type { CollectionType, TransactionSteps } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type MakeOfferState = BaseModalState & {
	orderbookKind?: OrderbookKind;
	tokenId: bigint;
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
	tokenId: bigint;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
};

type Actions = {
	open: (args: OpenMakeOfferModalArgs) => void;
	close: () => void;
};

// Empty Currency object for initial state - will be set when modal opens
const emptyCurrency: Currency = {
	chainId: 0,
	contractAddress: '0x0000000000000000000000000000000000000000',
	status: 0 as any, // CurrencyStatus enum
	name: '',
	symbol: '',
	decimals: 0,
	imageUrl: '',
	exchangeRate: 0,
	defaultChainCurrency: false,
	nativeCurrency: false,
	openseaListing: false,
	openseaOffer: false,
	createdAt: '',
	updatedAt: '',
};

const offerPrice = {
	amountRaw: 0n,
	currency: emptyCurrency,
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
	collectionAddress: '0x0000000000000000000000000000000000000000' as Address,
	chainId: 0,
	tokenId: 0n,
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
};

const actions: Actions = {
	open: (args) => {
		makeOfferModal$.collectionAddress.set(args.collectionAddress);
		makeOfferModal$.chainId.set(args.chainId);
		makeOfferModal$.tokenId.set(args.tokenId);
		makeOfferModal$.orderbookKind.set(args.orderbookKind);
		makeOfferModal$.callbacks.set(args.callbacks);
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
