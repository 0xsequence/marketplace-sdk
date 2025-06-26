import React from 'react';
import { Text } from '@0xsequence/design-system';

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex flex-col items-center justify-center py-12">
					<Text variant="xlarge" color="text80" className="mb-2">
						Something went wrong
					</Text>
					<Text variant="normal" color="text50" className="mb-4">
						{this.state.error?.message || 'An unexpected error occurred'}
					</Text>
					<button
						onClick={() => this.setState({ hasError: false, error: undefined })}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}