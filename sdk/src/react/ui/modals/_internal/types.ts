import type { Address, Hash } from 'viem';
import type { Order } from '../../../_internal';

export interface ActionButton {
	label: string;
	action: () => void;
}

type OnSuccessCallback =
	| (({
			hash,
			orderId,
			offer,
	  }: {
			hash?: Hash;
			orderId?: string;
			offer?: Order | undefined;
	  }) => void)
	| {
			callback: ({
				hash,
				orderId,
				offer,
			}: {
				hash?: Hash;
				orderId?: string;
				offer?: Order | undefined;
			}) => void;
			showDefaultTxStatusModal?: boolean;
	  };

export type ModalCallbacks = {
	onSuccess?: OnSuccessCallback;
	onError?: (error: Error) => void;
	successActionButtons?: ActionButton[];
};

export type BaseModalState = {
	isOpen: boolean;
	chainId: number;
	collectionAddress: Address;
	callbacks?: ModalCallbacks;
};

export type WaasFeeOptionSelectionType = 'automatic' | 'manual';
