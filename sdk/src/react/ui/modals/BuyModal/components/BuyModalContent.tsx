'use client';

import { Modal, Spinner, Text } from '@0xsequence/design-system';
import { useSupportedChains } from '0xtrails';
import { TrailsWidget } from '0xtrails/widget';
import {
	MODAL_CONTENT_PROPS,
	MODAL_OVERLAY_PROPS,
} from '../../_internal/components/consts';
import { useBuyModal } from '..';
import { useBuyModalProps } from '../store';
import { FallbackPurchaseUI } from './FallbackPurchaseUI';
import { useBuyTransaction } from '../../../../hooks/transactions/useBuyTransaction';
import { useBuyModalData } from '../hooks/useBuyModalData';

export const BuyModalContent = () => {
	const modalProps = useBuyModalProps();
	const { close } = useBuyModal();
	const { supportedChains, isLoadingChains } = useSupportedChains();
	const { data: steps, isLoading: isLoadingSteps } = useBuyTransaction(modalProps);
	const { currencyAddress, isLoading: isBuyModalDataLoading } = useBuyModalData();

	const isChainSupported = supportedChains.some(
		(chain) => chain.id === modalProps.chainId,
	);

	const isLoading = isLoadingSteps || isLoadingChains || isBuyModalDataLoading;

	const buyStep = steps?.find((step) => step.id === 'buy');

	return (
		<Modal
			isDismissible
			onClose={close}
			overlayProps={MODAL_OVERLAY_PROPS}
			contentProps={MODAL_CONTENT_PROPS}
		>
			<div className="relative flex grow flex-col items-center gap-4 p-6">
				<Text className="w-full text-center font-body font-bold text-large text-text-100">
					Complete Your Purchase
				</Text>

				{isLoading && (
					<div className="flex w-full items-center justify-center py-8">
						<div className="flex flex-col items-center gap-4">
							<Spinner size="lg" />
							<Text className="text-text-80">Loading payment options...</Text>
						</div>
					</div>
				)}

				{isChainSupported && buyStep && (
					<div className="w-full">
						<TrailsWidget
							appId="marketplace-sdk"
							toChainId={modalProps.chainId}
							toAddress={buyStep.to}
							toToken={currencyAddress}
							toCalldata={buyStep.data}
							toAmount={buyStep.price}
							renderInline={true}
							theme="dark"
						/>
					</div>
				)}

				{!isChainSupported && steps && (
					<FallbackPurchaseUI
						chainId={modalProps.chainId}
						steps={steps}
					/>
				)}
			</div>
		</Modal>
	);
};
