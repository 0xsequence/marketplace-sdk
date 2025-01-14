import type { Hash, Hex } from 'viem';

export type ModalCallbacks = {
	onSuccess?: ({ hash, orderId }: { hash?: Hash; orderId?: string }) => void;
	onError?: (error: Error) => void;
};

export type BaseModalState = {
	isOpen: boolean;
	chainId: string;
	collectionAddress: Hex;
	callbacks?: ModalCallbacks;
};
