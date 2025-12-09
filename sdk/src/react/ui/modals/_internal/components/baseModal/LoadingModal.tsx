'use client';

import { Spinner } from '@0xsequence/design-system';
import { BaseModal, type BaseModalProps } from './BaseModal';

interface LoadingModalProps
	extends Pick<
		BaseModalProps,
		'onClose' | 'title' | 'chainId' | 'disableAnimation'
	> {
	message?: string;
}

export const LoadingModal = ({
	onClose,
	title,
	chainId,
	disableAnimation = true,
	message,
}: LoadingModalProps) => (
	<BaseModal
		onClose={onClose}
		title={title}
		chainId={chainId}
		disableAnimation={disableAnimation}
	>
		<div
			className="flex flex-col items-center justify-center gap-4 p-4"
			data-testid="loading-modal"
		>
			<Spinner size="lg" />
			{message && <p className="text-center text-sm text-text-80">{message}</p>}
		</div>
	</BaseModal>
);
