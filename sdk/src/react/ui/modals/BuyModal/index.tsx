import { useAnalytics } from '../../../_internal/databeat';
import type { ModalCallbacks } from '../_internal/types';
import { type BuyModalProps, buyModalStore, CheckoutMode } from './store';

type UseBuyModalProps = {
	checkoutMode?: CheckoutMode;
	callbacks?: ModalCallbacks;
};

export const useBuyModal = ({
	checkoutMode = CheckoutMode.trails,
	callbacks,
}: UseBuyModalProps = {}) => {
	const analyticsFn = useAnalytics();

	return {
		show: (args: BuyModalProps) =>
			buyModalStore.send({
				type: 'open',
				props: args,
				checkoutMode,
				...callbacks,
				analyticsFn,
			}),
		close: () => buyModalStore.send({ type: 'close' }),
	};
};
