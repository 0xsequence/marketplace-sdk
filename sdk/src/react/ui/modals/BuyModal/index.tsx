import { useAnalytics } from '../../../_internal/databeat';
import type { ModalCallbacks } from '../_internal/types';
import { type BuyModalProps, buyModalStore } from './store';

export type {
	BuyModalProps,
	MarketplaceBuyModalProps,
	ShopBuyModalProps,
} from './store';

export const useBuyModal = (callbacks?: ModalCallbacks) => {
	const analyticsFn = useAnalytics();

	return {
		show: (args: BuyModalProps) =>
			buyModalStore.send({
				type: 'open',
				props: args,
				...callbacks,
				analyticsFn,
			}),
		close: () => buyModalStore.send({ type: 'close' }),
	};
};
