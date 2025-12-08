'use client';

import { Modal, Text } from '@0xsequence/design-system';
import type React from 'react';
import type { TransactionType } from '../../../../../_internal';
import { MODAL_CONTENT_PROPS, MODAL_OVERLAY_PROPS } from '../consts';

export interface BaseModalProps {
	onClose: () => void;
	title: string;
	transactionType?: TransactionType;
	children: React.ReactNode;
	chainId: number;
	disableAnimation?: boolean;
}

/**
 * BaseModal - Simplified modal foundation without complex state management
 *
 * This component provides the basic modal structure without:
 * - isOpen prop (controlled by parent component conditional rendering)
 * - CTA system (handled by ActionModal or custom implementations)
 * - Error handling (can be composed separately)
 *
 * Use this when you need a simple modal shell with full control over content.
 */
export const BaseModal = ({
	onClose,
	title,
	children,
	disableAnimation,
	transactionType,
}: BaseModalProps) => {
	return (
		<Modal
			isDismissible={true}
			onClose={onClose}
			overlayProps={MODAL_OVERLAY_PROPS}
			contentProps={MODAL_CONTENT_PROPS(transactionType)}
			disableAnimation={disableAnimation}
		>
			<div className="relative flex grow flex-col items-center gap-4 p-6">
				<Text className="w-full text-center font-body font-bold text-large text-text-100">
					{title}
				</Text>

				{children}
			</div>
		</Modal>
	);
};
