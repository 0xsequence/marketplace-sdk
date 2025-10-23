'use client';

import { Button, Text, WarningIcon } from '@0xsequence/design-system';
import type { ChainMismatchError } from '../../../../../../../utils/errors';

interface ChainMismatchErrorProps {
	error: ChainMismatchError;
	onSwitchChain?: () => void;
	onDismiss?: () => void;
}

export const ChainMismatchErrorComponent = ({
	error,
	onSwitchChain,
	onDismiss,
}: ChainMismatchErrorProps) => (
	<div className="chain-mismatch-error w-full rounded-lg border border-orange-900 bg-[#2b1a00] p-4">
		<div className="flex items-start gap-3">
			<WarningIcon className="mt-0.5 flex-shrink-0 text-orange-500" size="sm" />
			<div className="min-w-0 flex-1">
				<Text className="font-bold text-orange-400 text-sm">Wrong Network</Text>
				<Text className="mt-1 text-orange-300 text-xs">
					Please switch to Chain {error.expected} to continue. You're currently
					on Chain {error.actual}.
				</Text>
			</div>
		</div>

		<div className="mt-3 flex gap-2">
			{onSwitchChain && (
				<Button
					onClick={onSwitchChain}
					variant="primary"
					size="sm"
					className="flex-1"
				>
					Switch Network
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
