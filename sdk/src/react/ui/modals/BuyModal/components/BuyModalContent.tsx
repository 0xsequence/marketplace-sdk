'use client';

import type { ContractType } from '@0xsequence/api-client';
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	Modal,
	Spinner,
	Text,
} from '@0xsequence/design-system';
import { TrailsWidget } from '0xtrails/widget';
import { useRef, useState } from 'react';
import {
	getSequenceApiUrl,
	getSequenceIndexerUrl,
	getSequenceNodeGatewayUrl,
	getTrailsApiUrl,
} from '../../../../_internal/api/services';
import { ModalInitializationError } from '../../_internal/components/baseModal/errors/ModalInitializationError';
import { MODAL_OVERLAY_PROPS } from '../../_internal/components/consts';
import { useBuyModalContext } from '../internal/buyModalContext';
import { CollectibleMetadataSummary } from './CollectibleMetadataSummary';
import { CryptoPaymentModal } from './CryptoPaymentModal';
import SequenceCheckout from './sequence-checkout/SequenceCheckoutNew';
import { TRAILS_CUSTOM_CSS } from './TrailsCss';

export const BuyModalContent = () => {
	const {
		config,
		modalProps,
		close,
		steps,
		primarySaleItem,
		marketOrder,
		collectible,
		buyStep,
		destinationCalls,
		isLoading,
		collection,
		checkoutMode,
		formattedAmount,
		isShop,
		handleTrailsSuccess,
		handleTransactionSuccess,
		error,
		refetchAll,
	} = useBuyModalContext();
	const currencyAddress = isShop
		? primarySaleItem?.currencyAddress
		: marketOrder?.priceCurrencyAddress;

	const trailsApiUrl = getTrailsApiUrl(config);
	const sequenceIndexerUrl = getSequenceIndexerUrl(config);
	const sequenceNodeGatewayUrl = getSequenceNodeGatewayUrl(config);
	const sequenceApiUrl = getSequenceApiUrl(config);

	if (error) {
		return (
			<Modal
				isDismissible={true}
				onClose={close}
				overlayProps={MODAL_OVERLAY_PROPS}
				contentProps={{
					style: {
						width: '400px',
						height: 'auto',
					},
					className: 'overflow-y-auto',
				}}
			>
				<ModalInitializationError
					error={error}
					onTryAgain={refetchAll}
					onClose={close}
				/>
			</Modal>
		);
	}

	if (
		typeof checkoutMode === 'object' &&
		checkoutMode.mode === 'sequence-checkout'
	) {
		return (
			<SequenceCheckout
				steps={steps}
				contractType={collection?.type as ContractType}
				primarySaleItem={primarySaleItem}
			/>
		);
	}

	return (
		<Dialog open={true} onOpenChange={(open) => !open && close()}>
			<DialogOverlay style={MODAL_OVERLAY_PROPS.style} />

			<DialogContent className="h-auto w-[450px] overflow-y-auto overflow-x-hidden">
				<div className="relative flex grow flex-col items-center">
					<Text className="w-full text-center font-body font-bold text-large text-text-100">
						Complete Your Purchase
					</Text>

					{isLoading && (
						<div className="flex w-full items-center justify-center py-8">
							<div className="flex flex-col items-center gap-4">
								<Spinner size="lg" />
								<ProgressiveLoadingMessage />
							</div>
						</div>
					)}

					{!isLoading &&
						(checkoutMode === 'crypto' ||
							(isShop && primarySaleItem?.priceAmount === 0n)) &&
						steps &&
						steps.length > 0 && (
							<CryptoPaymentModal
								chainId={modalProps.chainId}
								steps={steps}
								onSuccess={handleTransactionSuccess}
							/>
						)}

					{!isLoading &&
						checkoutMode === 'trails' &&
						buyStep &&
						!(isShop && primarySaleItem?.priceAmount === 0n) && (
							<div className="pointer-events-auto w-full">
								{collectible && (
									<CollectibleMetadataSummary
										checkoutMode={'trails'}
										collectible={collectible}
										collection={collection}
									/>
								)}

								<TrailsWidget
									apiKey={config.projectAccessKey}
									trailsApiUrl={trailsApiUrl}
									sequenceIndexerUrl={sequenceIndexerUrl}
									sequenceNodeGatewayUrl={sequenceNodeGatewayUrl}
									sequenceApiUrl={sequenceApiUrl}
									walletConnectProjectId={config.walletConnectProjectId}
									toChainId={modalProps.chainId}
									toToken={currencyAddress}
									toAmount={formattedAmount}
									destinationCalls={destinationCalls}
									renderInline={true}
									theme="dark"
									mode="pay"
									customCss={TRAILS_CUSTOM_CSS}
									onDestinationConfirmation={handleTrailsSuccess}
									payMessage="{TO_TOKEN_IMAGE}{TO_AMOUNT}{TO_TOKEN_SYMBOL}{TO_AMOUNT_USD}"
								/>
							</div>
						)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

const ProgressiveLoadingMessage = () => {
	const [message, setMessage] = useState('Loading payment options...');
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	if (!timerRef.current) {
		timerRef.current = setTimeout(() => {
			setMessage('This is taking longer than expected. Please wait...');
		}, 3000);
	}

	return <Text className="text-text-80">{message}</Text>;
};
