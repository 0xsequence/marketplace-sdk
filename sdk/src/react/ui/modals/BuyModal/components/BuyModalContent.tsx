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
import { useBuyModalProps } from '../store';
import { FallbackPurchaseUI } from './FallbackPurchaseUI';

export const BuyModalContent = () => {
	const modalProps = useBuyModalProps();
	const { close } = useBuyModal();
	const { calldata } = useBuyModalData();

	const { sendTransaction } = useSendTransaction();
	const { supportedChains, isLoadingChains } = useSupportedChains();

	const isChainSupported = supportedChains.some(
		(chain) => chain.id === modalProps.chainId,
	);

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

				{isLoadingChains && (
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

				{!isChainSupported && calldata && (
					<FallbackPurchaseUI
						chainId={modalProps.chainId}
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
