import type { Hex } from 'viem';
import { type SellModalProps, sellModalStore } from './store';

type onErrorCallback = (error: Error) => void;
type onSuccessCallback = ({
	hash,
	orderId,
}: {
	hash?: Hex;
	orderId?: string;
}) => void;

export type ShowSellModalArgs = SellModalProps & {
	onError?: onErrorCallback;
	onSuccess?: onSuccessCallback;
};

export const useSellModal = () => {
	return {
		show: (args: ShowSellModalArgs) => {
			const { onError, onSuccess, ...props } = args;
			sellModalStore.send({
				type: 'open',
				...props,
				onError,
				onSuccess,
			});
		},
		close: () => sellModalStore.send({ type: 'close' }),
	};
};

export { SellModal } from './SellModal';