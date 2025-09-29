'use client';

import { Button, Modal, Spinner, Text } from '@0xsequence/design-system';
import type { UseQueryResult } from '@tanstack/react-query';
import type React from 'react';
import type { ComponentProps } from 'react';
import { useEnsureCorrectChain } from '../../../../../hooks';
import { MODAL_CONTENT_PROPS, MODAL_OVERLAY_PROPS } from '../consts';
import { QueryWrapper } from './query-wrapper';

export interface CtaAction {
	label: React.ReactNode;
	onClick: (() => Promise<void>) | (() => void);
	pending?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	variant?: ComponentProps<typeof Button>['variant'];
	testid?: string;
}

export interface ActionModalProps<T extends Record<string, UseQueryResult>> {
	onClose: () => void;
	title: string;
	ctas: CtaAction[];
	chainId: number;
	queries: T;
	children: (
		data: { [K in keyof T]: NonNullable<T[K]['data']> },
	) => React.ReactNode;
}

export function ActionModal<T extends Record<string, UseQueryResult>>({
	onClose,
	title,
	children,
	ctas,
	chainId,
	queries,
}: ActionModalProps<T>) {
	return (
		<Modal
			isDismissible={true}
			onClose={onClose}
			overlayProps={MODAL_OVERLAY_PROPS}
			contentProps={MODAL_CONTENT_PROPS}
			disableAnimation={true}
		>
			<div className="relative flex grow flex-col items-center gap-4 p-6">
				<Text className="w-full text-center font-body font-bold text-large text-text-100">
					{title}
				</Text>

				<QueryWrapper queries={queries}>
					{(data) => (
						<>
							{children(data)}
							<Ctas ctas={ctas} chainId={chainId} />
						</>
					)}
				</QueryWrapper>
			</div>
		</Modal>
	);
}

function Ctas({ ctas, chainId }: { ctas: CtaAction[]; chainId: number }) {
	const { ensureCorrectChain } = useEnsureCorrectChain();
	return (
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
	);
}
