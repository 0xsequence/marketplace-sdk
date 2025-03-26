import type { Hex } from 'viem';
import type { Order } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';
import { buyModal$ } from './store';

export type ShowBuyModalArgs = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	order: Order;
	customProviderCallback?: (args: { data: string; value: string }) => void;
};

export const useBuyModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowBuyModalArgs) =>
			buyModal$.open({ ...args, defaultCallbacks: callbacks }),
		close: () => buyModal$.close(),
	};
};
