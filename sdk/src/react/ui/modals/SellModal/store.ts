import { observable } from '@legendapp/state';
import type { Hex } from 'viem';
import type { Order, TransactionSteps } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

export type OpenSellModalArgs = {
	collectionAddress: Hex;
	chainId: string;
	tokenId: string;
	order: Order;
	callbacks?: ModalCallbacks;
};

type SellModalState = BaseModalState & {
	tokenId: string;
	order?: Order;
	steps: TransactionSteps;
	sellIsBeingProcessed: boolean;
};

type Actions = {
	open: (args: OpenSellModalArgs) => void;
	close: () => void;
};

const initialState: SellModalState & Actions = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: '',
	tokenId: '',
	order: undefined,
	callbacks: undefined,
	sellIsBeingProcessed: false,
	open: (args) => {
		sellModal$.collectionAddress.set(args.collectionAddress);
		sellModal$.chainId.set(args.chainId);
		sellModal$.tokenId.set(args.tokenId);
		sellModal$.order.set(args.order);
		sellModal$.callbacks.set(args.callbacks);
		sellModal$.isOpen.set(true);
	},

	close: () => {
		sellModal$.isOpen.set(false);
		sellModal$.callbacks.set(undefined);
		sellModal$.sellIsBeingProcessed.set(false);
	},
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

export const sellModal$ = observable(initialState);
