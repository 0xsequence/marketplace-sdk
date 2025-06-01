import { fireEvent, render, screen } from '@test';
import { describe, expect, it, vi } from 'vitest';
import { PrimarySaleErrorFallback } from '../PrimarySaleErrorFallback';

describe('PrimarySaleErrorFallback', () => {
	it('should render children when no error', () => {
		render(
			<PrimarySaleErrorFallback error={null}>
				<div>Content</div>
			</PrimarySaleErrorFallback>,
		);

		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('should display network error message', () => {
		const error = new Error('Network request failed');
		render(<PrimarySaleErrorFallback error={error} />);

		expect(screen.getByText('Connection Issue')).toBeInTheDocument();
		expect(
			screen.getByText('Please check your internet connection and try again.'),
		).toBeInTheDocument();
		expect(screen.getByText('🌐')).toBeInTheDocument();
	});

	it('should display contract error message', () => {
		const error = new Error('Contract call failed');
		render(<PrimarySaleErrorFallback error={error} />);

		expect(screen.getByText('Sales Contract Error')).toBeInTheDocument();
		expect(
			screen.getByText(
				'Unable to connect to the sales contract. Please refresh the page.',
			),
		).toBeInTheDocument();
		expect(screen.getByText('📄')).toBeInTheDocument();
	});

	it('should display not found error message', () => {
		const error = new Error('404 Not Found');
		render(<PrimarySaleErrorFallback error={error} />);

		expect(screen.getByText('Shop Not Found')).toBeInTheDocument();
		expect(
			screen.getByText('This shop may no longer be available.'),
		).toBeInTheDocument();
		expect(screen.getByText('🔍')).toBeInTheDocument();
	});

	it('should display timeout error message', () => {
		const error = new Error('Request timeout');
		render(<PrimarySaleErrorFallback error={error} />);

		expect(screen.getByText('Request Timeout')).toBeInTheDocument();
		expect(
			screen.getByText('The request took too long. Please try again.'),
		).toBeInTheDocument();
		expect(screen.getByText('⏰')).toBeInTheDocument();
	});

	it('should display generic error message for unknown errors', () => {
		const error = new Error('Unknown error');
		render(<PrimarySaleErrorFallback error={error} />);

		expect(screen.getByText('Unable to Load Shop Items')).toBeInTheDocument();
		expect(
			screen.getByText(
				'Something went wrong while loading the shop. Please try again.',
			),
		).toBeInTheDocument();
		expect(screen.getByText('⚠️')).toBeInTheDocument();
	});

	it('should show retry button when onRetry is provided', () => {
		const onRetry = vi.fn();
		const error = new Error('Test error');
		render(<PrimarySaleErrorFallback error={error} onRetry={onRetry} />);

		const retryButton = screen.getByText('Try Again');
		expect(retryButton).toBeInTheDocument();

		fireEvent.click(retryButton);
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('should show retry count when retries have been attempted', () => {
		const onRetry = vi.fn();
		const error = new Error('Test error');
		render(
			<PrimarySaleErrorFallback
				error={error}
				onRetry={onRetry}
				retryCount={2}
				maxRetries={3}
			/>,
		);

		expect(screen.getByText('Retry (2/3)')).toBeInTheDocument();
	});

	it('should disable retry button when max retries reached', () => {
		const onRetry = vi.fn();
		const error = new Error('Test error');
		render(
			<PrimarySaleErrorFallback
				error={error}
				onRetry={onRetry}
				retryCount={3}
				maxRetries={3}
			/>,
		);

		expect(screen.queryByText(/Retry/)).not.toBeInTheDocument();
	});

	it('should show loading state when retrying', () => {
		const onRetry = vi.fn();
		const error = new Error('Test error');
		render(
			<PrimarySaleErrorFallback
				error={error}
				onRetry={onRetry}
				isRetrying={true}
			/>,
		);

		const retryButton = screen.getByRole('button', { name: /retrying/i });
		expect(retryButton).toBeDisabled();
		expect(screen.getByText('Retrying...')).toBeInTheDocument();
	});

	it('should have refresh page button', () => {
		const error = new Error('Test error');
		// Mock window.location.reload
		const reloadMock = vi.fn();
		Object.defineProperty(window, 'location', {
			value: { reload: reloadMock },
			writable: true,
		});

		render(<PrimarySaleErrorFallback error={error} />);

		const refreshButton = screen.getByText('Refresh Page');
		fireEvent.click(refreshButton);

		expect(reloadMock).toHaveBeenCalledTimes(1);
	});

	it('should show technical details in development mode', () => {
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		const error = new Error('Test error with stack');
		error.stack = 'Error: Test error with stack\n    at TestComponent';

		render(<PrimarySaleErrorFallback error={error} />);

		const detailsElement = screen.getByText('Technical Details');
		expect(detailsElement).toBeInTheDocument();

		// Click to expand details
		fireEvent.click(detailsElement);

		expect(screen.getByText(/Test error with stack/)).toBeInTheDocument();

		process.env.NODE_ENV = originalEnv;
	});

	it('should not show technical details in production mode', () => {
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'production';

		const error = new Error('Test error');
		render(<PrimarySaleErrorFallback error={error} />);

		expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();

		process.env.NODE_ENV = originalEnv;
	});
});
