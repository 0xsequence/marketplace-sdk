'use client';

import { Button, Modal, Spinner, Text } from '@0xsequence/design-system';
import type React from 'react';
import type { ComponentProps } from 'react';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import { MODAL_CONTENT_PROPS, MODAL_OVERLAY_PROPS } from '../consts';
import { useSwitchChainModal } from '../switchChainModal';

export interface ActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	ctas: {
		label: React.ReactNode;
		onClick: (() => Promise<void>) | (() => void);
		pending?: boolean;
		disabled?: boolean;
		hidden?: boolean;
		variant?: ComponentProps<typeof Button>['variant'];
		testid?: string;
	}[];
	chainId: number;
	modalLoading?: boolean;
	spinnerContainerClassname?: string;
	disableAnimation?: boolean;
	hideCtas?: boolean;
}

export const ActionModal = ({
	isOpen,
	onClose,
	title,
	children,
	ctas,
	chainId,
	disableAnimation,
	modalLoading,
	spinnerContainerClassname,
	hideCtas,
}: ActionModalProps) => {
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { wallet, isLoading, isError } = useWallet();

	const checkChain = async ({ onSuccess }: { onSuccess: () => void }) => {
		const walletChainId = await wallet?.getChainId();
		const chainMismatch = walletChainId !== Number(chainId);
		if (chainMismatch) {
			showSwitchChainModal({
				chainIdToSwitchTo: chainId,
				onSuccess,
			});
		} else {
			onSuccess();
		}
	};

	if (wallet?.isWaaS) {
		wallet.switchChain(Number(chainId));
	}

	if (!isOpen || !chainId) {
		return null;
	}

	return (
		<Modal
			isDismissible={true}
			onClose={onClose}
			overlayProps={MODAL_OVERLAY_PROPS}
			contentProps={MODAL_CONTENT_PROPS}
			disableAnimation={disableAnimation}
		>
			<div className="relative flex grow flex-col items-center gap-4 p-6">
				<Text className="w-full text-center font-body font-bold text-large text-text-100">
					{title}
				</Text>

				{modalLoading || isLoading || isError ? (
					<div
						className={`flex ${spinnerContainerClassname} w-full items-center justify-center`}
						data-testid="error-loading-wrapper"
					>
						{isError && (
							<Text
								data-testid="error-loading-text"
								className="text-center font-body text-error100 text-small"
							>
								Error loading modal
							</Text>
						)}
						{(isLoading || modalLoading) && (
							<div data-testid="spinner">
								<Spinner size="lg" />
							</div>
						)}
					</div>
				) : (
					children
				)}

				{!hideCtas && !isLoading && !isError && (
					<div className="flex w-full flex-col gap-2">
						{ctas.map(
							(cta) =>
								!cta.hidden && (
									<Button
										className="w-full rounded-[12px] [&>div]:justify-center"
										key={cta.onClick.toString()}
										onClick={async () => {
											await checkChain({
												onSuccess: () => {
													cta.onClick();
												},
											});
										}}
										variant={cta.variant || 'primary'}
										pending={cta.pending}
										disabled={cta.disabled}
										size="lg"
										data-testid={cta.testid}
										label={
											<div className="flex items-center justify-center gap-2">
												{cta.pending && (
													<div data-testid={`${cta.testid}-spinner`}>
														<Spinner size="sm" />
													</div>
												)}

												{cta.label}
											</div>
										}
									/>
								),
						)}
					</div>
				)}
			</div>
		</Modal>
	);
};
