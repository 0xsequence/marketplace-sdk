import type { Address } from '@0xsequence/api-client';

export type ActionButton = {
	label: string;
	action: () => void;
};

export type BaseModalState = {
	isOpen: boolean;
	chainId: number;
	collectionAddress: Address;
};
