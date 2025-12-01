import { useAnalytics } from '../../../_internal/databeat';
import type { ModalCallbacks } from '../_internal/types';
import { type BuyModalProps, buyModalStore } from './store';

type UseBuyModalProps = {
	callbacks?: ModalCallbacks;
};

export const useBuyModal = ({ callbacks }: UseBuyModalProps = {}) => {
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
