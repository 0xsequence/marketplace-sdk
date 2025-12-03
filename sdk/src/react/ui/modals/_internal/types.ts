import type { Address, Hash } from 'viem';

export interface ActionButton {
	label: string;
	action: () => void;
}

export type ModalCallbacks = {
	onSuccess?: ({ hash, orderId }: { hash?: Hash; orderId?: string }) => void;
	onError?: (error: Error) => void;
	successActionButtons?: ActionButton[];
};

export type BaseModalState = {
	isOpen: boolean;
	chainId: number;
	collectionAddress: Address;
	callbacks?: ModalCallbacks;
};
