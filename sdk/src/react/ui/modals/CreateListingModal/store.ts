import { OrderbookKind } from '@0xsequence/api-client';
import { observable } from '@legendapp/state';
import { addDays } from 'date-fns/addDays';
import type { Address } from 'viem';
import type { Currency } from '../../../../types';
import {
	type CollectionType,
	CurrencyStatus,
	type TransactionSteps,
} from '../../../_internal';
import type { BaseModalState } from '../_internal/types';

type CreateListingState = BaseModalState & {
	tokenId: bigint;
	collectionName: string;
	orderbookKind?: OrderbookKind;
	collectionType: CollectionType | undefined;
	listingPrice: {
		amountRaw: bigint;
		currency: Currency;
	};
	quantity: bigint;
	invalidQuantity: boolean;
	expiry: Date;
	steps: TransactionSteps;
	listingIsBeingProcessed: boolean;
};

export type OpenCreateListingModalArgs = {
	collectionAddress: Address;
	chainId: number;
	tokenId: bigint;
	orderbookKind?: OrderbookKind;
};

type Actions = {
	open: (args: OpenCreateListingModalArgs) => void;
	close: () => void;
};

// Empty Currency object for initial state - will be set when modal opens
const emptyCurrency: Currency = {
	chainId: 0,
	contractAddress: '0x0000000000000000000000000000000000000000',
	status: CurrencyStatus.unknown,
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

const listingPrice = {
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

const initialState: CreateListingState = {
	isOpen: false,
	collectionAddress: '0x0000000000000000000000000000000000000000',
	chainId: 0,
	tokenId: 0n,
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionName: '',
	collectionType: undefined,
	listingPrice: { ...listingPrice },
	quantity: 1n,
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	steps: { ...steps },
	listingIsBeingProcessed: false,
};

const actions: Actions = {
	open: (args) => {
		createListingModal$.collectionAddress.set(args.collectionAddress);
		createListingModal$.chainId.set(args.chainId);
		createListingModal$.tokenId.set(args.tokenId);
		createListingModal$.orderbookKind.set(args.orderbookKind);
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
