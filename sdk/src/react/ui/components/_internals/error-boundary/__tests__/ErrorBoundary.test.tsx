import { render, screen } from '@test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
	if (shouldThrow) {
		throw new Error('Test error message');
	}
	return <div>No error</div>;
};

describe('ErrorBoundary', () => {
	// Suppress console.error for these tests
	const originalError = console.error;
	beforeEach(() => {
		console.error = vi.fn();
	});

	afterEach(() => {
		console.error = originalError;
	});

	it('should render children when there is no error', () => {
		render(
			<ErrorBoundary>
				<div>Test content</div>
			</ErrorBoundary>,
		);

		expect(screen.getByText('Test content')).toBeInTheDocument();
	});

	it('should display error modal when error is thrown', () => {
		render(
			<ErrorBoundary chainId={1}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		expect(screen.getByText('Test error message')).toBeInTheDocument();
	});

	it('should use custom fallback when provided', () => {
		const customFallback = (error: Error, resetError: () => void) => (
			<div>
				<p>Custom error: {error.message}</p>
				<button type="button" onClick={resetError}>
					Reset
				</button>
			</div>
		);

		render(
			<ErrorBoundary fallback={customFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(
			screen.getByText('Custom error: Test error message'),
		).toBeInTheDocument();
		expect(screen.getByText('Reset')).toBeInTheDocument();
	});

	it('should call onError callback when error occurs', () => {
		const onError = vi.fn();

		render(
			<ErrorBoundary onError={onError}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(onError).toHaveBeenCalledWith(
			expect.objectContaining({ message: 'Test error message' }),
			expect.any(Object),
		);
	});

	it('should reset error state when close is clicked', () => {
		const { rerender } = render(
			<ErrorBoundary chainId={1}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.getByText('Something went wrong')).toBeInTheDocument();

		// Click close button (X icon)
		const closeButton = screen.getByRole('button', { name: /close/i });
		closeButton.click();

		// Re-render with no error
		rerender(
			<ErrorBoundary chainId={1}>
				<ThrowError shouldThrow={false} />
			</ErrorBoundary>,
		);

		expect(screen.getByText('No error')).toBeInTheDocument();
	});

	it('should use default chainId when not provided', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		// ErrorModal should still render with default chainId
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
	});
});
