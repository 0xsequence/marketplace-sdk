'use client';

import type { ContractType } from '@0xsequence/api-client';
import { Modal, Spinner, Text } from '@0xsequence/design-system';
import { TrailsWidget } from '0xtrails/widget';
import { MODAL_OVERLAY_PROPS } from '../../_internal/components/consts';
import { useBuyModalContext } from '../internal/buyModalContext';
import { CryptoPaymentModal } from './CryptoPaymentModal';
import SequenceCheckout from './sequence-checkout/SequenceCheckoutNew';
import { TRAILS_CUSTOM_CSS } from './TrailsCss';

export const BuyModalContent = () => {
	const {
		config,
		modalProps,
		close,
		steps,
		buyStep,
		isLoading,
		collection,
		checkoutMode,
		formattedAmount,
		salePrice,
		isShop,
		currencyAddress,
		handleTrailsSuccess,
		handleTransactionSuccess,
	} = useBuyModalContext();

	if (
		(isShop && salePrice?.amount === 0n) ||
		(typeof checkoutMode === 'object' &&
			checkoutMode.mode === 'sequence-checkout')
	) {
		return (
			<SequenceCheckout
				steps={steps}
				contractType={collection?.type as ContractType}
			/>
		);
	}

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
				className: 'overflow-y-auto',
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

				{checkoutMode === 'trails' && buyStep && (
					<div className="w-full">
						<TrailsWidget
							apiKey={config.projectAccessKey}
							toChainId={modalProps.chainId}
							toAddress={buyStep.to}
							toToken={currencyAddress}
							toCalldata={buyStep.data}
							toAmount={formattedAmount}
							renderInline={true}
							theme="dark"
							mode="pay"
							customCss={TRAILS_CUSTOM_CSS}
							onDestinationConfirmation={handleTrailsSuccess}
							payMessage="{TO_TOKEN_IMAGE}{TO_AMOUNT}{TO_TOKEN_SYMBOL}{TO_AMOUNT_USD}"
						/>
					</div>
				)}

				{checkoutMode === 'crypto' && steps && (
					<CryptoPaymentModal
						chainId={modalProps.chainId}
						steps={steps}
						onSuccess={handleTransactionSuccess}
					/>
				)}
			</div>
		</Modal>
	);
};
