'use client';

import { useSelector } from '@xstate/store/react';
import type { FeeOption } from '../../../../../types/waas-types';
import { useConnectorMetadata } from '../../../../hooks/config/useConnectorMetadata';
import type { ActionModalProps } from '../../_internal/components/actionModal';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import { useSelectWaasFeeOptions } from '../../_internal/hooks/useSelectWaasFeeOptions';
import { useSellFlow } from '../queries/sellQueries';
import { sellModalStore } from '../store/sellModalStore';
import { useLoadData } from './useLoadData';

export const useCtas = () => {
	const order = useSelector(sellModalStore, (state) => state.context.order);

	const status = useSelector(sellModalStore, (state) => state.context.status);
	const { currency } = useLoadData();
	const { approval, sell } = useSellFlow();
	const { isWaaS } = useConnectorMetadata();

	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();

	const isProcessing = status === 'executing' || status === 'approving';
	const generatingSteps = status === 'checking_approval';

	const { shouldHideActionButton } = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	const shouldHideSellButton = selectedFeeOption
		? shouldHideActionButton
		: false;

	const handleSell = async () => {
		try {
			if (isWaaS && status === 'ready_to_sell') {
				selectWaasFeeOptionsStore.send({ type: 'show' });
				sellModalStore.send({ type: 'showFeeOptions' });
			} else {
				sellModalStore.send({ type: 'startSell' });
				sell.execute();
			}
		} catch (error) {
			console.error('Sell failed:', error);
			sellModalStore.send({ type: 'errorOccurred', error: error as Error });
		}
	};

	const executeApproval = async () => {
		if (approval.step) {
			sellModalStore.send({ type: 'startApproval' });
			approval.execute(approval.step);
		}
	};

	const sellCtaLabel = isProcessing
		? isWaaS
			? 'Loading fee options'
			: 'Accept'
		: 'Accept';

	return [
		{
			label: `Approve ${currency?.symbol || 'TOKEN'}`,
			onClick: executeApproval,
			hidden: !approval.isRequired || status !== 'awaiting_approval',
			pending: approval.isExecuting,
			variant: 'glass' as const,
			disabled: generatingSteps || order?.quantityRemaining === '0',
		},
		{
			label: sellCtaLabel,
			onClick: handleSell,
			pending: sell.isExecuting || isProcessing,
			disabled:
				generatingSteps ||
				approval.isExecuting ||
				(approval.isRequired && status === 'awaiting_approval') ||
				order?.quantityRemaining === '0' ||
				shouldHideSellButton,
		},
	] satisfies ActionModalProps['ctas'];
};
