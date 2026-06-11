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
import { cn } from '../../../../ssr';
import { ModalInitializationError } from '../../_internal/components/baseModal/errors/ModalInitializationError';
import { MODAL_OVERLAY_PROPS } from '../../_internal/components/consts';
import { useBuyModalContext } from '../internal/buyModalContext';
import { CollectibleMetadataSummary } from './CollectibleMetadataSummary';
import { CryptoPaymentModal } from './CryptoPaymentModal';
import SequenceCheckout from './sequence-checkout/SequenceCheckoutNew';
import { TRAILS_CUSTOM_CSS } from './TrailsCss';

export const BuyModalContent = () => {
	const {
		modalProps,
		close,
		steps,
		primarySaleItem,
		marketOrder,
		collectible,
		buyStep,
		trailsDestination,
		isLoading,
		collection,
		checkoutMode,
		formattedAmount,
		isMarket,
		isShop,
		handleTrailsSuccess,
		handleTransactionSuccess,
		error,
		refetchAll,
	} = useBuyModalContext();
	const currencyAddress = isShop
		? primarySaleItem?.currencyAddress
		: marketOrder?.priceCurrencyAddress;

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
							<ProgressiveLoadingMessage />
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
						(!isMarket || trailsDestination) &&
						!(isShop && primarySaleItem?.priceAmount === 0n) && (
							<div className="pointer-events-auto w-full">
								{collectible && (
									<CollectibleMetadataSummary
										checkoutMode={'trails'}
										collectible={collectible}
										collection={collection}
									/>
								)}

								{isMarket && trailsDestination ? (
									<TrailsWidget
										key={`market-${marketOrder?.orderId}-${trailsDestination.destinationCalldata}`}
										toChainId={modalProps.chainId}
										toAddress={trailsDestination.recipient}
										toToken={currencyAddress}
										toAmount={formattedAmount}
										toCalldata={trailsDestination.destinationCalldata}
										renderInline={true}
										theme="dark"
										mode="pay"
										customCss={TRAILS_CUSTOM_CSS}
										onDestinationConfirmation={handleTrailsSuccess}
										payMessage="{TO_TOKEN_IMAGE}{TO_AMOUNT}{TO_TOKEN_SYMBOL}{TO_AMOUNT_USD}"
									/>
								) : (
									<TrailsWidget
										key={`direct-${buyStep.to}-${buyStep.data}`}
										toChainId={modalProps.chainId}
										toAddress={buyStep.to}
										toToken={currencyAddress}
										toAmount={formattedAmount}
										toCalldata={buyStep.data}
										renderInline={true}
										theme="dark"
										mode="pay"
										customCss={TRAILS_CUSTOM_CSS}
										onDestinationConfirmation={handleTrailsSuccess}
										payMessage="{TO_TOKEN_IMAGE}{TO_AMOUNT}{TO_TOKEN_SYMBOL}{TO_AMOUNT_USD}"
									/>
								)}
							</div>
						)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

const ProgressiveLoadingMessage = () => {
	const [showSecondaryMessage, setShowSecondaryMessage] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	if (!timerRef.current) {
		timerRef.current = setTimeout(() => {
			setShowSecondaryMessage(true);
		}, 3000);
	}

	return (
		<div className="flex items-center gap-4">
			<div
				className={cn(
					'transition-all duration-300',
					showSecondaryMessage ? 'h-10 w-10' : 'h-5 w-5',
				)}
			>
				<Spinner className="h-full w-full transition-all duration-150" />
			</div>

			<div className="flex flex-col gap-2">
				<p className="animate-pulse text-text-100">
					Loading payment options...
				</p>
				{showSecondaryMessage && (
					<p className="text-small text-text-50">
						This is taking longer than expected.
					</p>
				)}
			</div>
		</div>
	);
};
