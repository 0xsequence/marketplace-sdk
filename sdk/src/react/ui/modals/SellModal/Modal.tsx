'use client';

import {
	ActionModal,
	type CtaAction,
} from '../_internal/components/baseModal/ActionModal';
import { selectWaasFeeOptionsStore } from '../_internal/components/selectWaasFeeOptions/store';
import { type SellStep, useSellModalContext } from './internal/context';

export function SellModal() {
	const { item, offer, flow, error, close, isOpen, loading } =
		useSellModalContext();

	// Only render if modal is open
	if (!isOpen) {
		return null;
	}

	const approvalStep = flow.steps.find((s) => s.id === 'approve');
	const sellStep = flow.steps.find((s) => s.id === 'sell') as SellStep;
	const showApprovalButton = approvalStep && approvalStep.status === 'idle';

	// Build approval action if needed
	const approvalAction: CtaAction | undefined = showApprovalButton
		? {
				label: approvalStep.label,
				actionName: 'token approval',
				onClick: approvalStep.run,
				loading: approvalStep.isPending,
				disabled: !flow.nextStep || !!error || flow.isPending,
				variant: 'ghost',
				testid: 'sell-modal-approve-button',
			}
		: undefined;

	// Build sell action
	const sellAction: CtaAction = {
		label: sellStep.label,
		actionName: 'offer acceptance',
		onClick: sellStep.run,
		loading: sellStep.isPending && !showApprovalButton,
		disabled:
			!flow.nextStep || !!error || (showApprovalButton && flow.isPending),
		testid: 'sell-modal-accept-button',
	};

	// Create queries object for ActionModal v2
	// These are already loaded in the context, so we create mock queries that are always successful
	const queries = {
		collection: {
			data: item.collection,
			isLoading: loading.collection,
			isError: false,
			error: null,
		},
		currency: {
			data: offer.currency,
			isLoading: loading.currency,
			isError: false,
			error: null,
		},
	};

	return (
		<ActionModal
			chainId={item.chainId}
			onClose={() => {
				close();
				selectWaasFeeOptionsStore.send({ type: 'hide' });
			}}
			title="You have an offer"
			type="sell"
			primaryAction={sellAction}
			secondaryAction={approvalAction}
			queries={queries as any}
			externalError={error}
		>
			{() => <>{/* UI components in next commit */}</>}
		</ActionModal>
	);
}
