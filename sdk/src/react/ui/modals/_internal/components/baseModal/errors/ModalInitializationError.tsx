'use client';

import { Button, WarningIcon } from '@0xsequence/design-system';
import { useState } from 'react';

interface ModalInitializationErrorProps {
	onTryAgain?: () => void;
	onClose?: () => void;
	error: Error;
}

export const ModalInitializationError = ({
	onTryAgain,
	onClose,
	error,
}: ModalInitializationErrorProps) => {
	const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-white">
			<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
				<WarningIcon className="h-8 w-8 text-white" />
			</div>

			<h1 className="mb-4 text-center font-semibold text-xl">Failed to Load</h1>

			<p className="mb-8 max-w-md text-center text-gray-300 text-sm leading-relaxed">
				Something went wrong while loading this item. Please try again later or
				refresh the page.
			</p>

			{(error.cause as string) && (
				<button
					type="button"
					onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
					className="mb-4 flex items-center text-gray-400 text-sm transition-colors hover:text-gray-300"
				>
					<svg
						className={`mr-2 h-4 w-4 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-label="Toggle technical details"
					>
						<title>Toggle technical details</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
					{showTechnicalDetails
						? 'Hide technical details'
						: 'Show technical details'}
				</button>
			)}

			{showTechnicalDetails && (error.cause as string) && (
				<div className="mb-8 max-h-64 w-full max-w-md overflow-y-auto rounded-lg border border-red-900 bg-[#2b0000] p-4">
					<pre className="whitespace-pre-wrap break-words text-red-100 text-xs">
						{error.cause as string}
					</pre>
				</div>
			)}

			<div className="flex w-full flex-col space-y-3">
				{onTryAgain && (
					<Button
						onClick={onTryAgain}
						variant="primary"
						size="md"
						className="flex justify-center"
						shape="square"
					>
						Try Again
					</Button>
				)}
				{onClose && (
					<Button
						onClick={onClose}
						variant="secondary"
						size="md"
						className="flex justify-center"
						shape="square"
					>
						Close
					</Button>
				)}
			</div>
		</div>
	);
};
