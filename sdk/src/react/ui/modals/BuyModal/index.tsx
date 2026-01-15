import { useAnalytics } from '../../../_internal/databeat';
import { type BuyModalProps, buyModalStore } from './store';

export const useBuyModal = () => {
	const analyticsFn = useAnalytics();

	return {
		show: (args: BuyModalProps) =>
			buyModalStore.send({
				type: 'open',
				props: args,
				analyticsFn,
			}),
		close: () => buyModalStore.send({ type: 'close' }),
	};
};

export {
	type BuyModalContext,
	useBuyModalContext,
} from './internal/buyModalContext';
