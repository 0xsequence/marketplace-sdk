'use client';

import { Button, Modal, Spinner, Text } from '@0xsequence/design-system';
import type React from 'react';
import type { ComponentProps } from 'react';
import { useAccount } from 'wagmi';
import { useEnsureCorrectChain } from '../../../../../hooks';
import { MODAL_CONTENT_PROPS, MODAL_OVERLAY_PROPS } from '../consts';

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
	const { status } = useAccount();
	const { ensureCorrectChain } = useEnsureCorrectChain();

	if (!isOpen) {
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

				{modalLoading || status !== 'connected' ? (
					<div
						className={`flex ${spinnerContainerClassname} w-full items-center justify-center`}
						data-testid="error-loading-wrapper"
					>
						<div data-testid="spinner">
							<Spinner size="lg" />
						</div>
					</div>
				) : (
					children
				)}

				{!hideCtas && status === 'connected' && (
					<div className="flex w-full flex-col gap-2">
						{ctas.map(
							(cta) =>
								!cta.hidden && (
									<Button
										className="w-full rounded-[12px] [&>div]:justify-center"
										key={cta.onClick.toString()}
										onClick={() =>
											ensureCorrectChain(Number(chainId), {
												onSuccess: cta.onClick,
											})
										}
										variant={cta.variant || 'primary'}
										disabled={cta.disabled || cta.pending}
										size="lg"
										data-testid={cta.testid}
									>
										<div className="flex items-center justify-center gap-2">
											{cta.pending && (
												<div data-testid={`${cta.testid}-spinner`}>
													<Spinner size="sm" />
												</div>
											)}
											{cta.label}
										</div>
									</Button>
								),
						)}
					</div>
				)}
			</div>
		</Modal>
	);
};
