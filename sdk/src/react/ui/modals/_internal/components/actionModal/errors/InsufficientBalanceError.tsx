'use client';

import { Button, Text, WarningIcon } from '@0xsequence/design-system';
import type { InsufficientBalanceError } from '../../../../../../../utils/errors';

interface InsufficientBalanceErrorProps {
	error: InsufficientBalanceError;
	onTopUp?: () => void;
	onDismiss?: () => void;
}

export const InsufficientBalanceErrorComponent = ({
	error,
	onTopUp,
	onDismiss,
}: InsufficientBalanceErrorProps) => (
	<div className="insufficient-balance-error w-full rounded-lg border border-yellow-900 bg-[#2b2b00] p-4">
		<div className="flex items-start gap-3">
			<WarningIcon className="mt-0.5 flex-shrink-0 text-yellow-500" size="sm" />
			<div className="min-w-0 flex-1">
				<Text className="font-bold text-sm text-yellow-400">
					Insufficient Balance
				</Text>
				<Text className="mt-1 text-xs text-yellow-300">
					You need {error.required} {error.token} but only have{' '}
					{error.available}
				</Text>
			</div>
		</div>

		<div className="mt-3 flex gap-2">
			{onTopUp && (
				<Button
					onClick={onTopUp}
					variant="primary"
					size="sm"
					className="flex-1"
				>
					Add Funds
				</Button>
			)}
			{onDismiss && (
				<Button
					onClick={onDismiss}
					variant="ghost"
					size="sm"
					className="flex-1"
				>
					Cancel
				</Button>
			)}
		</div>
	</div>
);
