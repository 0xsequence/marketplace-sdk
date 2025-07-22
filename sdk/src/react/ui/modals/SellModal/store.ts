import { useSelector } from '@xstate/store/react';
import type { Hex } from 'viem';
import type { Order } from '../../../_internal';
import { sellModalStore } from './store/sellModalStore';

// Re-export from new store
export {
	type SellModalContext,
	type SellModalStatus,
	sellModalStore,
} from './store/sellModalStore';

// Legacy types for backward compatibility
export type SellModalProps = {
	collectionAddress: Hex;
	chainId: number;
	tokenId: string;
	order: Order;
};

// Selector hooks
export const useSellModalProps = () => {
	const collectionAddress = useSelector(
		sellModalStore,
		(state) => state.context.collectionAddress,
	);
	const chainId = useSelector(sellModalStore, (state) => state.context.chainId);
	const tokenId = useSelector(sellModalStore, (state) => state.context.tokenId);
	const order = useSelector(sellModalStore, (state) => state.context.order);

	return {
		collectionAddress: collectionAddress!,
		chainId: chainId!,
		tokenId: tokenId!,
		order: order!,
	};
};

export const useIsOpen = () =>
	useSelector(sellModalStore, (state) => state.context.isOpen);

export const useOnError = () =>
	useSelector(sellModalStore, (state) => state.context.onError);

export const useOnSuccess = () =>
	useSelector(sellModalStore, (state) => state.context.onSuccess);

export const useSellIsProcessing = () =>
	useSelector(sellModalStore, (state) => state.context.status === 'executing');

export const useSellModalStatus = () =>
	useSelector(sellModalStore, (state) => state.context.status);

export const useApprovalRequired = () =>
	useSelector(sellModalStore, (state) => state.context.approvalRequired);

export const useFeeOptionsVisible = () =>
	useSelector(sellModalStore, (state) => state.context.feeOptionsVisible);

export const useSelectedFeeOption = () =>
	useSelector(sellModalStore, (state) => state.context.selectedFeeOption);

export const useSellModalError = () =>
	useSelector(sellModalStore, (state) => state.context.error);
