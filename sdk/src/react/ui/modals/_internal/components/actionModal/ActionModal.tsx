'use client';

import { Button, Modal, Spinner, Text } from '@0xsequence/design-system';
import type React from 'react';
import type { ComponentProps } from 'react';
import { useAccount } from 'wagmi';
import { useEnsureCorrectChain } from '../../../../../hooks';
import { MODAL_CONTENT_PROPS, MODAL_OVERLAY_PROPS } from '../consts';
import { SmartErrorHandler } from './SmartErrorHandler';

export interface ErrorAction {
	type: 'retry' | 'topUp' | 'switchChain' | 'signIn' | 'custom';
	label: string;
	data?: unknown;
}

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

	// 🆕 Enhanced Error Handling
	error?: Error | null;
	onErrorDismiss?: () => void;
	onErrorAction?: (error: Error, action: ErrorAction) => void;
	errorComponent?: (error: Error) => React.ReactNode;
	errorPosition?: 'top' | 'bottom' | 'inline';
}

/**
 * @deprecated Use BaseModal or the new ActionModal from '_internal/components/baseModal' instead.
 * This component will be removed in the next major version.
 *
 * Migration guide:
 * - Remove isOpen prop and use conditional rendering
 * - Use primaryAction/secondaryAction instead of ctas array
 * - Import from '_internal/components/baseModal'
 */
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
	// 🆕 Enhanced Error Handling props
	error,
	onErrorDismiss,
	onErrorAction,
	errorComponent,
	errorPosition = 'bottom',
}: ActionModalProps) => {
	// Deprecation warning in development
	if (process.env.NODE_ENV === 'development') {
		console.warn(
			'[ActionModal] This component is deprecated. Use BaseModal or the new ActionModal from "_internal/components/baseModal" instead. ' +
				'Migration: Remove isOpen prop, use primaryAction/secondaryAction instead of ctas array.',
		);
	}
	const { status } = useAccount();
	const { ensureCorrectChain } = useEnsureCorrectChain();

	// 🆕 Smart error rendering function
	const renderError = () => {
		if (!error) return null;

		return (
			<SmartErrorHandler
				error={error}
				onDismiss={onErrorDismiss}
				onAction={onErrorAction}
				customComponent={errorComponent}
			/>
		);
	};

	if (!isOpen) {
		return null;
	}

	const errorElement = renderError();

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

				{/* 🆕 Error display at top position */}
				{errorPosition === 'top' && errorElement}

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
					<>
						{children}
						{/* 🆕 Error display at inline position */}
						{errorPosition === 'inline' && errorElement}
					</>
				)}

				{/* 🆕 Error display at bottom position (default) */}
				{errorPosition === 'bottom' && errorElement}

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
