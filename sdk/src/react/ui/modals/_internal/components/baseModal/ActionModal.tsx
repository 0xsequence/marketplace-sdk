'use client';

import { Button, Spinner } from '@0xsequence/design-system';
import type { UseQueryResult } from '@tanstack/react-query';
import type React from 'react';
import type { ComponentProps } from 'react';
import { useEnsureCorrectChain } from '../../../../../hooks';
import { BaseModal, type BaseModalProps } from './BaseModal';
import type { ErrorAction } from './errors/errorActionType';
import { SmartErrorHandler } from './SmartErrorHandler';

export interface CtaAction {
	label: React.ReactNode;
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
	) => React.ReactNode;
}

function MultiQueryWrapper<T extends Record<string, UseQueryResult>>({
	queries,
	children,
}: MultiQueryWrapperProps<T>) {
	// Check if any query is loading
	const isLoading = Object.values(queries).some((q) => q.isLoading);
	const errors = Object.values(queries)
		.filter((q) => q.isError)
		.map((q) => q.error);
	const firstError = errors[0];

	// Check if all queries have data (not undefined)
	const hasAllData = Object.values(queries).every((q) => q.data !== undefined);

	if (isLoading || !hasAllData) {
		return (
			<div
				className="flex w-full items-center justify-center"
				data-testid="error-loading-wrapper"
			>
				<div data-testid="spinner">
					<Spinner size="lg" />
				</div>
			</div>
		);
	}

	// Build data object from all queries - now we know all data exists
	const data = Object.entries(queries).reduce(
		(acc, [key, query]) => {
			(acc as any)[key] = query.data!; // Safe to use ! since we checked hasAllData
			return acc;
		},
		{} as { [K in keyof T]: NonNullable<T[K]['data']> },
	);

	return <>{children(data, firstError)}</>;
}

export interface ActionModalProps<T extends Record<string, UseQueryResult>>
	extends Omit<BaseModalProps, 'children'> {
	primaryAction?: CtaAction;
	secondaryAction?: CtaAction;
	additionalActions?: CtaAction[];
	queries: T;
	children: (
		data: { [K in keyof T]: NonNullable<T[K]['data']> },
		error?: Error,
	) => React.ReactNode;
	externalError?: Error | null;
	onErrorDismiss?: () => void;
	onErrorAction?: (error: Error, action: ErrorAction) => void;
	errorComponent?: (error: Error) => React.ReactNode;
}

export function ActionModal<T extends Record<string, UseQueryResult>>({
	children,
	chainId,
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

	return (
		<BaseModal {...baseProps} chainId={chainId}>
			<MultiQueryWrapper queries={queries}>
				{(data, error) => (
					<>
						{children(data)}

						{externalError ||
							(error && (
								<SmartErrorHandler
									error={externalError || error}
									onDismiss={onErrorDismiss}
									onAction={onErrorAction}
									customComponent={errorComponent}
								/>
							))}

						{ctas.length > 0 && <CtaActions ctas={ctas} chainId={chainId} />}
					</>
				)}
			</MultiQueryWrapper>
		</BaseModal>
	);
}

function CtaActions({ ctas, chainId }: { ctas: CtaAction[]; chainId: number }) {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	return (
		<div className="flex w-full flex-col gap-2">
			{ctas.map((cta, index) => (
				<Button
					className="flex w-full items-center justify-center rounded-[12px] [&>div]:justify-center"
					key={`cta-${index}-${cta.onClick.toString()}`}
					onClick={() =>
						ensureCorrectChain(Number(chainId), {
							onSuccess: cta.onClick,
						})
					}
					variant={cta.variant || (index === 0 ? 'primary' : 'ghost')}
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
		</div>
	);
}
