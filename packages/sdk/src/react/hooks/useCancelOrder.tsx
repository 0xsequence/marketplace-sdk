import { useState } from 'react';
import { useCancelTransactionSteps } from './useCancelTransactionSteps';
import { MarketplaceKind } from '../_internal';
interface UseCancelOrderArgs {
	collectionAddress: string;
	chainId: string;
	marketplace: MarketplaceKind;
	orderId: string;
	onSuccess?: ({hash, orderId}: {hash?: string, orderId?: string}) => void;
	onError?: (error: Error) => void;
}

export type TransactionStep = {
	exist: boolean;
	isExecuting: boolean;
	execute: () => Promise<void>;
};

export const useCancelOrder = ({
	collectionAddress,
	chainId,
	marketplace,
	orderId,
	onSuccess,
	onError,
}: UseCancelOrderArgs) => {
	const [steps, setSteps] = useState<TransactionStep>({
		exist: false,
		isExecuting: false,
		execute: () => Promise.resolve(),
	});

	const { cancelOrder } = useCancelTransactionSteps({
		collectionAddress,
		chainId,
		marketplace,
		orderId,
		onSuccess,
		onError,
		setSteps,
	});

	return {
		cancelOrder,
		isExecuting: steps.isExecuting,
	};
};
