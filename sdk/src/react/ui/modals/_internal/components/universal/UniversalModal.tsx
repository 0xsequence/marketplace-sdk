'use client';

import { cn } from '../../../../../../utils';
import { ActionModal, type ActionModalProps } from '../actionModal/ActionModal';

export interface UniversalModalProps extends Omit<ActionModalProps, 'ctas'> {
	/**
	 * Optional custom className for the modal content
	 */
	className?: string;

	/**
	 * Custom CTA buttons - if not provided, children should handle their own actions
	 */
	ctas?: ActionModalProps['ctas'];
}

/**
 * Universal modal wrapper that provides consistent ActionModal integration
 * with enhanced props for external developers
 */
export function UniversalModal({
	children,
	className,
	ctas = [],
	...props
}: UniversalModalProps) {
	return (
		<ActionModal {...props} ctas={ctas}>
			<div className={cn('flex flex-col gap-4', className)}>{children}</div>
		</ActionModal>
	);
}
