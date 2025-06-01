import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorModal } from '../../../modals/_internal/components/actionModal/ErrorModal';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: (error: Error, resetError: () => void) => ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	chainId?: number;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log error details for debugging
		console.error('ErrorBoundary caught an error:', error, errorInfo);

		// Call the optional onError callback
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	resetError = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError && this.state.error) {
			// Use custom fallback if provided
			if (this.props.fallback) {
				return this.props.fallback(this.state.error, this.resetError);
			}

			// Default fallback UI
			return (
				<ErrorModal
					isOpen={true}
					chainId={this.props.chainId || 1}
					onClose={this.resetError}
					title="Something went wrong"
					message={
						this.state.error.message ||
						'An unexpected error occurred. Please try again.'
					}
				/>
			);
		}

		return this.props.children;
	}
}
