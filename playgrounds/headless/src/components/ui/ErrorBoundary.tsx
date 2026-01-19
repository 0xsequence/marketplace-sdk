import { Component, type ReactNode } from 'react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onReset?: () => void;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
		this.props.onReset?.();
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="rounded-lg bg-red-900/20 p-4 text-center">
					<p className="mb-2 text-red-400">Something went wrong</p>
					<p className="mb-4 text-gray-400 text-sm">
						{this.state.error?.message || 'An unexpected error occurred'}
					</p>
					<button
						onClick={this.handleReset}
						className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
						type="button"
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

interface ModalErrorFallbackProps {
	error: Error | null;
	onClose: () => void;
}

export function ModalErrorFallback({
	error,
	onClose,
}: ModalErrorFallbackProps) {
	return (
		<div className="py-8 text-center">
			<p className="mb-2 text-red-400">Failed to load modal</p>
			<p className="mb-4 text-gray-400 text-sm">
				{error?.message || 'An unexpected error occurred'}
			</p>
			<button
				onClick={onClose}
				className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
				type="button"
			>
				Close
			</button>
		</div>
	);
}
