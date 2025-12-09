import type { Address } from 'viem';

export interface ActionButton {
	label: string;
	action: () => void;
}

export type BaseModalState = {
	isOpen: boolean;
	chainId: number;
	collectionAddress: Address;
};
