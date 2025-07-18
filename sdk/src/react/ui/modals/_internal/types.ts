import type { Address, Hash } from 'viem';

export type ModalCallbacks = {
	onSuccess?: ({ hash, orderId }: { hash?: Hash; orderId?: string }) => void;
	onError?: (error: Error) => void;
	onBuyAtFloorPrice?: () => void;
};

export type BaseModalState = {
	isOpen: boolean;
	chainId: number;
	collectionAddress: Address;
	callbacks?: ModalCallbacks;
};
