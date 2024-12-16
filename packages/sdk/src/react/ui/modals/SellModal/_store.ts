import { observable } from '@legendapp/state';
import type { Hex } from 'viem';
import type { Order } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type SellModalState = BaseModalState & {
	tokenId: string;
	order?: Order;
};

const initialState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: '',
	tokenId: '',
	order: undefined,
	callbacks: undefined,
} as const;

const state: SellModalState & {
	open: (args: {
		collectionAddress: Hex;
		chainId: string;
		tokenId: string;
		order: Order;
		callbacks?: ModalCallbacks;
	}) => void;
	close: () => void;
} = {
	...structuredClone(initialState),
	open: (args) => {
		sellModal$.collectionAddress.set(args.collectionAddress);
		sellModal$.chainId.set(args.chainId);
		sellModal$.tokenId.set(args.tokenId);
		sellModal$.order.set(args.order);
		sellModal$.callbacks.set(args.callbacks);
		sellModal$.isOpen.set(true);
	},
	close: () => {
		(Object.keys(initialState) as Array<keyof typeof initialState>).forEach((key) => {
			// @ts-expect-error
			sellModal$[key].set(initialState[key]);
		});
	},
} as const;

export const sellModal$ = observable(state);
