'use client';

import {
	ChevronDownIcon,
	ChevronUpIcon,
	CloseIcon,
	Text,
	WarningIcon,
} from '@0xsequence/design-system';
import { useState } from 'react';

export interface ErrorLogBoxProps {
	title: string;
	message: string;
	error?: Error;
	onDismiss?: () => void;
}

export const ErrorLogBox = ({
	title,
	message,
	error,
	onDismiss,
}: ErrorLogBoxProps) => {
	const [showFullError, setShowFullError] = useState(false);

	const toggleFullError = () => {
		setShowFullError(!showFullError);
	};

	return (
		<div className="relative max-h-96 overflow-y-auto rounded-lg border border-red-900 bg-[#2b0000] p-3">
			<div className="flex items-start gap-3">
				<WarningIcon
					className="absolute mt-0.5 flex-shrink-0 text-red-500"
					size="sm"
				/>
				<div className="min-w-0 flex-1">
					<div className="relative ml-10 flex flex-col">
						<Text className="font-bold text-red-400 text-sm">{title}</Text>
						<Text className="mt-1 text-red-300 text-xs">{message}</Text>
					</div>

					{error && (
						<div className="mt-2">
							<button
								onClick={toggleFullError}
								className="flex items-center gap-1 text-red-400 text-xs transition-colors hover:text-red-300"
								type="button"
							>
								{showFullError ? 'Hide full error' : 'Show full error'}
								{showFullError ? (
									<ChevronUpIcon className="h-3 w-3" />
								) : (
									<ChevronDownIcon className="h-3 w-3" />
								)}
							</button>

							{showFullError && <div className="mt-2 h-px bg-red-900" />}

							{showFullError && (
								<div className="mt-2 overflow-auto rounded-md bg-red-950 p-2">
									<Text className="whitespace-pre-wrap break-words font-mono text-red-100 text-xs">
										{error.message}
										{error.stack && (
											<>
												{'\n\nStack trace:\n'}
												{error.stack}
											</>
										)}
										{JSON.stringify(error, null, 2)}
									</Text>
								</div>
							)}
						</div>
					)}
				</div>

				{onDismiss && (
					<button
						onClick={onDismiss}
						className="absolute right-4 flex-shrink-0 text-red-400 transition-colors hover:text-red-300"
						type="button"
						aria-label="Dismiss error"
					>
						<CloseIcon className="h-3 w-3" />
					</button>
				)}
			</div>
		</div>
	);
};
