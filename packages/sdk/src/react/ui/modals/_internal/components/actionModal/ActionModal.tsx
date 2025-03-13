'use client';

import type React from 'react';
import { type ComponentProps, useState } from 'react';

import { Button, Modal, Spinner, Text } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import { useSwitchChainModal } from '../switchChainModal';
import WaasFeeOptionsBox from '../waasFeeOptionsBox';

export interface ActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	ctas: {
		label: string;
		onClick: (() => Promise<void>) | (() => void);
		pending?: boolean;
		disabled?: boolean;
		hidden?: boolean;
		variant?: ComponentProps<typeof Button>['variant'];
		testid?: string;
	}[];
	chainId: number;
	modalLoading?: boolean;
}

export const ActionModal = observer(
	({
		isOpen,
		onClose,
		title,
		children,
		ctas,
		chainId,
		modalLoading,
	}: ActionModalProps) => {
		const [isSelectingFees, setIsSelectingFees] = useState(false);
		const { show: showSwitchChainModal } = useSwitchChainModal();
		const { wallet } = useWallet();

		const checkChain = async ({ onSuccess }: { onSuccess: () => void }) => {
			const walletChainId = await wallet?.getChainId();
			const chainMismatch = walletChainId !== Number(chainId);
			if (chainMismatch) {
				showSwitchChainModal({
					chainIdToSwitchTo: Number(chainId),
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
				size="sm"
				backdropColor="backgroundBackdrop"
			>
				<div className="relative flex grow flex-col items-center gap-4 p-6">
					<Text
						className="w-full text-center font-body text-large"
						fontWeight="bold"
						color="text100"
					>
						{title}
					</Text>

					{modalLoading ? (
						<div className="flex h-full w-full items-center justify-center">
							<Spinner size="lg" />
						</div>
					) : (
						children
					)}

					<div className="flex w-full flex-col gap-2">
						{ctas.map(
							(cta) =>
								!cta.hidden && (
									<Button
										className="w-full rounded-[12px] [&>div]:justify-center"
										key={cta.label}
										onClick={async () => {
											await checkChain({
												onSuccess: () => {
													cta.onClick();
												},
											});
										}}
										variant={cta.variant || 'primary'}
										pending={cta.pending}
										disabled={cta.disabled || isSelectingFees}
										size="lg"
										data-testid={cta.testid}
										label={
											<div className="flex items-center justify-center gap-2">
												{cta.pending && <Spinner size="sm" />}

												{cta.label}
											</div>
										}
									/>
								),
						)}
					</div>
				</div>

				<WaasFeeOptionsBox
					chainId={chainId}
					onFeeOptionsLoaded={() => setIsSelectingFees(true)}
					onFeeOptionConfirmed={() => setIsSelectingFees(false)}
				/>
			</Modal>
		);
	},
);
