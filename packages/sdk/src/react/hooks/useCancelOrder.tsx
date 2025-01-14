import { useEffect, useState } from 'react';
import { useCancelTransactionSteps } from './useCancelTransactionSteps';
import { useSwitchChainModal } from '../ui/modals/_internal/components/switchChainModal';
import { useWallet } from '../_internal/transaction-machine/useWallet';

interface UseCancelOrderArgs {
	collectionAddress: string;
	chainId: string;
	onSuccess?: ({ hash, orderId }: { hash?: string; orderId?: string }) => void;
	onError?: (error: Error) => void;
}

export type TransactionStep = {
	exist: boolean;
	isExecuting: boolean;
	execute: () => Promise<void>;
};

export type SwitchChainStatus = {
	walletChainId: number | null;
	mismatch: boolean;
	isSwitching: boolean;
};

export const useCancelOrder = ({
	collectionAddress,
	chainId,
	onSuccess,
	onError,
}: UseCancelOrderArgs) => {
	const { wallet } = useWallet();
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const [steps, setSteps] = useState<TransactionStep>({
		exist: false,
		isExecuting: false,
		execute: () => Promise.resolve(),
	});
	const [switchChainStatus, setSwitchChainStatus] = useState<SwitchChainStatus>(
		{
			walletChainId: null,
			mismatch: false,
			isSwitching: false,
		},
	);

	const getWalletChainId = async () => {
		return await wallet?.getChainId();
	};
	const switchChain = async () => {
		if (!wallet) return;

		await wallet.switchChain(Number(chainId));
	};

	useEffect(() => {
		const checkAndSwitchChain = async () => {
			const walletChainId = await getWalletChainId();
			const isWaaS = wallet?.isWaaS;

			if (walletChainId && walletChainId !== Number(chainId)) {
				setSwitchChainStatus({
					walletChainId,
					mismatch: true,
					isSwitching: false,
				});

				if (isWaaS) {
					await switchChain();
				} else {
					showSwitchChainModal({
						chainIdToSwitchTo: chainId,
						onError: () => {
							setSwitchChainStatus({
								walletChainId,
								mismatch: true,
								isSwitching: false,
							});
						},
						onClose: () => {
							setSwitchChainStatus({
								walletChainId,
								mismatch: true,
								isSwitching: false,
							});
						},
						onSuccess: () => {
							setSwitchChainStatus({
								walletChainId,
								mismatch: false,
								isSwitching: false,
							});
						},
					});
				}
			}
		};

		checkAndSwitchChain();
	}, [chainId, wallet]);

	const { cancelOrder } = useCancelTransactionSteps({
		collectionAddress,
		chainId,
		onSuccess,
		onError,
		setSteps,
		disabled:
			!wallet?.isWaaS &&
			!!switchChainStatus.walletChainId &&
			(switchChainStatus.mismatch || switchChainStatus.isSwitching),
	});

	return {
		cancelOrder,
		isExecuting: steps.isExecuting,
	};
};
