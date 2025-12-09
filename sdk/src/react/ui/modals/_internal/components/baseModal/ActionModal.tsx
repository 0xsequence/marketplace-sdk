'use client';

import { Button, Spinner, Text } from '@0xsequence/design-system';
import type { UseQueryResult } from '@tanstack/react-query';
import type React from 'react';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { useEnsureCorrectChain } from '../../../../../hooks';
import { BaseModal, type BaseModalProps } from './BaseModal';
import type { ErrorAction } from './errors/errorActionType';
import { ModalInitializationError } from './errors/ModalInitializationError';
import { SmartErrorHandler } from './SmartErrorHandler';

type ActionModalType = 'listing' | 'offer' | 'sell' | 'buy' | 'transfer';

export interface CtaAction {
	label: React.ReactNode;
	actionName?: string;
	onClick: (() => Promise<void>) | (() => void);
	loading?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	variant?: ComponentProps<typeof Button>['variant'];
	testid?: string;
}

export interface MultiQueryWrapperProps<
	T extends Record<string, UseQueryResult>,
> {
	queries: T;
	children: (
		data: { [K in keyof T]: NonNullable<T[K]['data']> },
		error?: Error,
		refetchFailedQueries?: () => Promise<void>,
	) => React.ReactNode;
	type: ActionModalType;
}

function MultiQueryWrapper<T extends Record<string, UseQueryResult>>({
	queries,
	children,
	type,
}: MultiQueryWrapperProps<T>) {
	// Check if any query is loading
	const isLoading = Object.values(queries).some((q) => q.isLoading);
	const errors = Object.values(queries)
		.filter((q) => q.isError)
		.map((q) => q.error);
	const firstError = errors[0];
	const hasErrors = errors.length > 0;

	// Check if all queries have data (not undefined)
	const hasAllData = Object.values(queries).every((q) => q.data !== undefined);

	const failedQueries = Object.entries(queries)
		.filter(([, query]) => query.isError)
		.map(([key, query]) => ({ key, query }));

	const refetchFailedQueries = async () => {
		const refetchPromises = failedQueries.map(({ query }) => query.refetch());
		await Promise.all(refetchPromises);
	};

	// Show spinner only if loading and no errors
	if (isLoading && !hasErrors) {
		const loadingText =
			type === 'listing'
				? 'Preparing listing data...'
				: type === 'offer'
					? 'Preparing offer data...'
					: type === 'sell'
						? 'Preparing sale data...'
						: type === 'transfer'
							? 'Preparing transfer data...'
							: 'Preparing checkout data...';

		return (
			<div
				className="flex h-64 w-full flex-col items-center justify-center gap-8"
				data-testid="error-loading-wrapper"
			>
				<div
					data-testid="spinner"
					style={{
						scale: 1.5,
					}}
				>
					<Spinner size="lg" />
				</div>

				<Text
					fontWeight="medium"
					className="animate-pulse text-sm"
					color="white"
				>
					{loadingText}
				</Text>
			</div>
		);
	}

	// If we have errors or not all data is loaded (but not loading), proceed to error handling
	if (hasErrors || (!hasAllData && !isLoading)) {
		// Build partial data object from queries that have loaded
		// Type assertion is safe here because we're building the object entry by entry
		// and the final type matches our expected shape
		const data = Object.entries(queries).reduce<Record<string, unknown>>(
			(acc, [key, query]) => {
				if (query.data !== undefined) {
					acc[key] = query.data;
				}
				return acc;
			},
			{},
		) as { [K in keyof T]: NonNullable<T[K]['data']> };

		return <>{children(data, firstError, refetchFailedQueries)}</>;
	}

	// Build data object from all queries - now we know all data exists
	// Type assertion is safe here because we've verified hasAllData above
	const data = Object.entries(queries).reduce<Record<string, unknown>>(
		(acc, [key, query]) => {
			// hasAllData guarantees query.data is defined
			if (query.data !== undefined) {
				acc[key] = query.data;
			}
			return acc;
		},
		{},
	) as { [K in keyof T]: NonNullable<T[K]['data']> };

	return <>{children(data, firstError, refetchFailedQueries)}</>;
}

export interface ActionModalProps<T extends Record<string, UseQueryResult>>
	extends Omit<BaseModalProps, 'children'> {
	primaryAction?: CtaAction;
	secondaryAction?: CtaAction;
	additionalActions?: CtaAction[];
	type: ActionModalType;
	queries: T;
	children: (
		data: { [K in keyof T]: NonNullable<T[K]['data']> },
		error?: Error,
		refetchFailedQueries?: () => Promise<void>,
	) => React.ReactNode;
	externalError?: Error | null;
	onErrorDismiss?: () => void;
	onErrorAction?: (error: Error, action: ErrorAction) => void;
	errorComponent?: (error: Error) => React.ReactNode;
}

/**
 * AnimatedHeightWrapper - Provides smooth height transitions for modal content
 */
function AnimatedHeightWrapper({ children }: { children: React.ReactNode }) {
	const contentRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (!contentRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const newHeight = entry.contentRect.height;
				setHeight(newHeight);
			}
		});

		resizeObserver.observe(contentRef.current);

		// Set initial height
		setHeight(contentRef.current.scrollHeight);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div
			className="w-full overflow-hidden"
			style={{
				height: height ? `${height}px` : 'auto',
				transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
			}}
		>
			<div ref={contentRef} className="flex w-full flex-col gap-4">
				{children}
			</div>
		</div>
	);
}

export function ActionModal<T extends Record<string, UseQueryResult>>({
	children,
	chainId,
	type,
	primaryAction,
	secondaryAction,
	additionalActions = [],
	queries,
	externalError,
	onErrorDismiss,
	onErrorAction,
	errorComponent,
	...baseProps
}: ActionModalProps<T>) {
	const ctas: CtaAction[] = [
		...(primaryAction ? [primaryAction] : []),
		...(secondaryAction ? [secondaryAction] : []),
		...additionalActions,
	].filter((cta) => !cta.hidden);
	const [actionError, setActionError] = useState<Error | undefined>(
		undefined as Error | undefined,
	);

	return (
		<BaseModal {...baseProps} chainId={chainId}>
			<AnimatedHeightWrapper>
				<MultiQueryWrapper queries={queries} type={type}>
					{(data, error, refetchFailedQueries) => {
						const modalInitializationError = externalError || error;

						return (
							<>
								{!modalInitializationError &&
									children(data, error, refetchFailedQueries)}

								{(modalInitializationError || actionError) &&
									(() => {
										const error = modalInitializationError ?? actionError;
										if (!error) return null;

										return (
											// If there is an error occured for queries that are required to load the modal, we just display the error component in view.
											<SmartErrorHandler
												error={error}
												onHide={() => {
													setActionError(undefined);
												}}
												onAction={onErrorAction}
												customComponent={
													modalInitializationError
														? (error: Error) => (
																<ModalInitializationError
																	error={error}
																	onTryAgain={refetchFailedQueries}
																	onClose={() => {
																		onErrorDismiss?.();
																	}}
																/>
															)
														: errorComponent
												}
											/>
										);
									})()}

								{!modalInitializationError && ctas.length > 0 && (
									<CtaActions
										ctas={ctas}
										chainId={chainId}
										onActionError={setActionError}
									/>
								)}
							</>
						);
					}}
				</MultiQueryWrapper>
			</AnimatedHeightWrapper>
		</BaseModal>
	);
}

function CtaActions({
	ctas,
	chainId,
	onActionError,
}: {
	ctas: CtaAction[];
	chainId: number;
	onActionError: (error: Error | undefined) => void;
}) {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	const ctasInProgress = ctas.filter((cta) => cta.loading);
	const ctaInProgress = ctasInProgress[0];

	return (
		<div className="flex w-full flex-col gap-2">
			{ctas.map((cta, index) => (
				<Button
					className="flex w-full items-center justify-center rounded-[12px] [&>div]:justify-center"
					key={`cta-${index}-${cta.onClick.toString()}`}
					onClick={() =>
						ensureCorrectChain(Number(chainId), {
							onSuccess: async () => {
								try {
									const result = cta.onClick();
									if (result instanceof Promise) {
										await result;
									}
									onActionError(undefined);
								} catch (error: unknown) {
									onActionError(error as Error);
								}
							},
						})
					}
					variant={cta.variant || (index === 0 ? 'primary' : 'secondary')}
					disabled={cta.disabled || cta.loading}
					size="lg"
					data-testid={cta.testid}
				>
					<div className="flex items-center justify-center gap-2">
						{cta.loading && (
							<div data-testid={`${cta.testid}-spinner`}>
								<Spinner
									className="flex items-center justify-center text-white"
									size="sm"
								/>
							</div>
						)}
						{cta.label}
					</div>
				</Button>
			))}

			{ctaInProgress?.actionName && (
				<div className="flex w-full items-center justify-center">
					<Text className="text-sm text-text-50">
						Complete the {ctaInProgress?.actionName} in your wallet
					</Text>
				</div>
			)}
		</div>
	);
}
