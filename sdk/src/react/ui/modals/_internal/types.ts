import type { Hash, Hex } from 'viem';
import type { SdkError } from '../../../../utils/_internal/error';

export type ModalCallbacks = {
	onSuccess?: ({ hash, orderId }: { hash?: Hash; orderId?: string }) => void;
	onError?: (error: SdkError | Error) => void;
	onBuyAtFloorPrice?: () => void;
};

export type BaseModalState = {
	isOpen: boolean;
	chainId: number;
	collectionAddress: Hex;
	callbacks?: ModalCallbacks;
};
