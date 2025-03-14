import type { Hex } from 'viem';
import type { Order } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';
import { buyModalStore } from './store';

export type ShowBuyModalArgs = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	order: Order;
};

export const useBuyModal = (callbacks?: ModalCallbacks) => {
	// TODO: Add callbacks
	return {
		show: (args: ShowBuyModalArgs) => buyModalStore.trigger.open({ ...args }),
		close: () => buyModalStore.trigger.close(),
	};
};
