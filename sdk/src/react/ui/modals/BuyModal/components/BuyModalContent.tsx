'use client';

import { Modal, Spinner, Text } from '@0xsequence/design-system';
import { useSupportedChains } from '0xtrails';
import { TrailsWidget } from '0xtrails/widget';
import type { Address } from 'viem';
import { useSendTransaction } from 'wagmi';
import {
	MODAL_CONTENT_PROPS,
	MODAL_OVERLAY_PROPS,
} from '../../_internal/components/consts';
import { useBuyModal } from '..';
import { useMarketOrderData } from '../hooks/useMarketOrderData';
import { type MarketplaceBuyModalProps, useBuyModalProps } from '../store';
import { FallbackPurchaseUI } from './FallbackPurchaseUI';

export const BuyModalContent = () => {
	const modalProps = useBuyModalProps() as MarketplaceBuyModalProps;
	const { close } = useBuyModal();
	const { calldata } = useBuyModalData();

	const { sendTransaction } = useSendTransaction();
	const { supportedChains, isLoadingChains } = useSupportedChains();

	const isChainSupported = supportedChains.some(
		(chain) => chain.id === modalProps.chainId,
	);
	// if chain is not supported, we will show the fallback purchase UI
	const {
		collectible,
		currency,
		order,
		isLoading: isLoadingMarketOrderData,
	} = useMarketOrderData({
		enabled: !isChainSupported,
	});

	const isLoading = isLoadingChains || isLoadingMarketOrderData;

	return (
		<Modal
			isDismissible={true}
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

				{isChainSupported && !isLoadingChains && calldata && (
					<div className="w-full">
						<TrailsWidget
							appId="marketplace-sdk"
							toChainId={modalProps.chainId}
							toAddress={calldata.to}
							toCalldata={calldata.data}
							toAmount={calldata.value || '0'}
							renderInline={true}
							theme="dark"
						/>
					</div>
				)}

				{!isChainSupported && collectible && order && currency && calldata && (
					<FallbackPurchaseUI
						chainId={modalProps.chainId}
						collectible={collectible}
						order={order}
						currency={currency}
						calldata={calldata}
						onExecute={async () => {
							sendTransaction({
								to: calldata.to as Address,
								data: calldata.data as `0x${string}`,
								value: BigInt(calldata.value || 0),
							});
						}}
					/>
				)}
			</div>
		</Modal>
	);
};
