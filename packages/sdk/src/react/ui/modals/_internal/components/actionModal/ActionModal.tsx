'use client';

import type React from 'react';
import { type ComponentProps, useState } from 'react';

import {
	Button,
	CloseIcon,
	IconButton,
	Spinner,
	Text,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import {
	Close,
	Content,
	Overlay,
	Portal,
	Root,
	Title,
} from '@radix-ui/react-dialog';
import { getProviderEl } from '../../../../../_internal';
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
}

export const ActionModal = observer(
	({ isOpen, onClose, title, children, ctas, chainId }: ActionModalProps) => {
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

		return (
			<Root open={isOpen && !!chainId}>
				<Portal container={getProviderEl()}>
					<Overlay className="fixed inset-0 z-20 bg-background-backdrop" />
					<Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-20 flex w-[360px] rounded-2xl bg-background-primary p-6 max-sm:top-auto max-sm:bottom-0 max-sm:left-auto max-sm:w-full max-sm:transform-none max-sm:rounded-b-none">
						<div className="relative flex grow flex-col items-center gap-4">
							<Title asChild>
								<Text
									className="w-full text-center font-body text-large"
									fontWeight="bold"
									color="text100"
								>
									{title}
								</Text>
							</Title>

							{children}

							<div className="flex w-full flex-col gap-2">
								{ctas.map(
									(cta) =>
										!cta.hidden && (
											<Button
												className="cn(w-full rounded-[12px] [&>div]:justify-center"
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

						<Close className="absolute top-6 right-6" asChild onClick={onClose}>
							<IconButton size="xs" aria-label="Close modal" icon={CloseIcon} />
						</Close>
					</Content>
				</Portal>
			</Root>
		);
	},
);
