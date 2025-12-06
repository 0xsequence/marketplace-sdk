'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { ErrorAction } from './errors/errorActionType';
import { SmartErrorHandler } from './SmartErrorHandler';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	onAction?: (error: Error, action: ErrorAction) => void;
	className?: string;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	resetErrorBoundary = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);

		this.setState({
			errorInfo,
		});

		this.props.onError?.(error, errorInfo);
	}

	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) {
				// Wait for errorInfo to be available from componentDidCatch
				if (this.state.errorInfo) {
					return this.props.fallback(this.state.error, this.state.errorInfo);
				}

				return null;
			}

			// Default fallback using SmartErrorHandler
			return (
				<div className={this.props.className} data-testid="error-boundary">
					<SmartErrorHandler
						error={this.state.error}
						onAction={this.props.onAction}
					/>
				</div>
			);
		}

		return this.props.children;
	}
}
