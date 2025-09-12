'use client';

import { Modal, Spinner, Text } from '@0xsequence/design-system';
import { useSupportedChains } from '0xtrails';
import { TrailsWidget } from '0xtrails/widget';
import { useConfig } from '../../../../hooks';
import { useBuyTransaction } from '../../../../hooks/transactions/useBuyTransaction';
import { MODAL_OVERLAY_PROPS } from '../../_internal/components/consts';
import { useBuyModal } from '..';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useBuyModalProps } from '../store';
import { FallbackPurchaseUI } from './FallbackPurchaseUI';
import { TRAILS_CUSTOM_CSS } from './TrailsCss';

export const BuyModalContent = () => {
	const modalProps = useBuyModalProps();
	const { close } = useBuyModal();
	const { supportedChains, isLoadingChains } = useSupportedChains();
	const { data: steps, isLoading: isLoadingSteps } =
		useBuyTransaction(modalProps);
	const { currencyAddress, isLoading: isBuyModalDataLoading } =
		useBuyModalData();

	const isChainSupported = supportedChains.some(
		(chain) => chain.id === modalProps.chainId,
	);

	const isLoading = isLoadingSteps || isLoadingChains || isBuyModalDataLoading;

	const buyStep = steps?.find((step) => step.id === 'buy');

	const useTrailsModal = isChainSupported && buyStep && !isLoading;
	const useFallbackPurchaseUI = !useTrailsModal && steps && !isLoading;

	const config = useConfig();

	console.log('buyStep', buyStep);
	return (
		<Modal
			isDismissible
			onClose={close}
			overlayProps={MODAL_OVERLAY_PROPS}
			contentProps={{
				style: {
					width: '450px',
					height: 'auto',
				},
			}}
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

				{useTrailsModal && (
					<div className="w-full">
						<TrailsWidget
							appId={config.projectAccessKey}
							toChainId={modalProps.chainId}
							toAddress={buyStep.to}
							toToken={currencyAddress}
							toCalldata={buyStep.data}
							toAmount={buyStep.price}
							renderInline={true}
							theme="dark"
							customCss={TRAILS_CUSTOM_CSS}
						/>
					</div>
				)}

				{useFallbackPurchaseUI && (
					<FallbackPurchaseUI chainId={modalProps.chainId} steps={steps} />
				)}
			</div>
		</Modal>
	);
};
