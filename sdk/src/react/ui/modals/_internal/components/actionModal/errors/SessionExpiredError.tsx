'use client';

import { Button, Text, WarningIcon } from '@0xsequence/design-system';

// SessionExpiredError is a generic error for expired sessions

interface SessionExpiredErrorProps {
	error: Error;
	onSignIn?: () => void;
	onDismiss?: () => void;
}

export const SessionExpiredErrorComponent = ({
	error,
	onSignIn,
	onDismiss,
}: SessionExpiredErrorProps) => (
	<div className="session-expired-error w-full rounded-lg border border-red-900 bg-[#2b0000] p-4">
		<div className="flex items-start gap-3">
			<WarningIcon className="mt-0.5 flex-shrink-0 text-red-500" size="sm" />
			<div className="min-w-0 flex-1">
				<Text className="font-bold text-red-400 text-sm">Session Expired</Text>
				<Text className="mt-1 text-red-300 text-xs">{error.message}</Text>
			</div>
		</div>

		<div className="mt-3 flex gap-2">
			{onSignIn && (
				<Button
					onClick={onSignIn}
					variant="primary"
					size="sm"
					className="flex-1"
				>
					Sign In Again
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
