'use client';

import { Button, InfoIcon, Text } from '@0xsequence/design-system';
import type { UserRejectedError } from '../../../../../../../utils/errors';

interface UserRejectedErrorProps {
	error: UserRejectedError;
	onRetry?: () => void;
	onDismiss?: () => void;
}

export const UserRejectedErrorComponent = ({
	error,
	onRetry,
	onDismiss,
}: UserRejectedErrorProps) => (
	<div className="user-rejected-error w-full rounded-lg border border-blue-900 bg-[#001a2b] p-4">
		<div className="flex items-start gap-3">
			<InfoIcon className="mt-0.5 flex-shrink-0 text-blue-500" size="sm" />
			<div className="min-w-0 flex-1">
				<Text className="font-bold text-blue-400 text-sm">
					Transaction Canceled
				</Text>
				<Text className="mt-1 text-blue-300 text-xs">{error.message}</Text>
			</div>
		</div>

		<div className="mt-3 flex gap-2">
			{onRetry && (
				<Button
					onClick={onRetry}
					variant="primary"
					size="sm"
					className="flex-1"
				>
					Try Again
				</Button>
			)}
			{onDismiss && (
				<Button
					onClick={onDismiss}
					variant="ghost"
					size="sm"
					className="flex-1"
				>
					Close
				</Button>
			)}
		</div>
	</div>
);
