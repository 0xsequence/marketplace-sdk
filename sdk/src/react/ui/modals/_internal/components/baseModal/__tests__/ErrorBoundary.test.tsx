'use client';

import { cleanup, render, screen, waitFor } from '@test';
import type { ErrorInfo } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock the SmartErrorHandler component
vi.mock('../SmartErrorHandler', () => ({
	SmartErrorHandler: vi.fn(({ error, onDismiss, onAction }) => (
		<div data-testid="smart-error-handler">
			<div data-testid="error-message">{error.message}</div>
			<button data-testid="dismiss-button" onClick={onDismiss} type="button">
				Dismiss
			</button>
			<button
				data-testid="action-button"
				onClick={() => onAction?.(error, { type: 'retry', label: 'Retry' })}
				type="button"
			>
				Action
			</button>
		</div>
	)),
}));

// Component that throws an error for testing
interface ThrowErrorProps {
	shouldThrow?: boolean;
	errorMessage?: string;
}

const ThrowError = ({
	shouldThrow = false,
	errorMessage = 'Test error',
}: ThrowErrorProps) => {
	if (shouldThrow) {
		throw new Error(errorMessage);
	}
	return <div data-testid="child-component">No error</div>;
};

// Component that throws an error on mount
interface ThrowOnMountProps {
	errorMessage?: string;
}

const ThrowOnMount = ({ errorMessage = 'Mount error' }: ThrowOnMountProps) => {
	throw new Error(errorMessage);
};

describe('ErrorBoundary', () => {
	const mockOnError = vi.fn();
	const mockOnAction = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		// Suppress console.error for cleaner test output
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	describe('Normal rendering (no errors)', () => {
		it('should render children normally when there are no errors', () => {
			render(
				<ErrorBoundary>
					<div data-testid="child">Child content</div>
				</ErrorBoundary>,
			);

			expect(screen.getByTestId('child')).toBeInTheDocument();
			expect(screen.getByText('Child content')).toBeInTheDocument();
		});

		it('should not render error boundary UI when no errors occur', () => {
			render(
				<ErrorBoundary>
					<ThrowError shouldThrow={false} />
				</ErrorBoundary>,
			);

			expect(screen.getByTestId('child-component')).toBeInTheDocument();
			expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
		});
	});

	describe('Error catching and handling', () => {
		it('should catch errors thrown by child components', () => {
			render(
				<ErrorBoundary onError={mockOnError}>
					<ThrowError shouldThrow={true} errorMessage="Child component error" />
				</ErrorBoundary>,
			);

			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
			expect(screen.getByTestId('smart-error-handler')).toBeInTheDocument();
			expect(screen.getByTestId('error-message')).toHaveTextContent(
				'Child component error',
			);
		});

		it('should call onError callback when an error is caught', () => {
			render(
				<ErrorBoundary onError={mockOnError}>
					<ThrowOnMount errorMessage="Mount error" />
				</ErrorBoundary>,
			);

			expect(mockOnError).toHaveBeenCalledTimes(1);
			expect(mockOnError).toHaveBeenCalledWith(
				expect.any(Error),
				expect.objectContaining({
					componentStack: expect.any(String),
				}),
			);

			const [error, errorInfo] = mockOnError.mock.calls[0];
			expect(error.message).toBe('Mount error');
			expect(errorInfo).toHaveProperty('componentStack');
		});

		it('should log errors to console', () => {
			const consoleSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			render(
				<ErrorBoundary>
					<ThrowOnMount errorMessage="Console log test" />
				</ErrorBoundary>,
			);

			expect(consoleSpy).toHaveBeenCalledWith(
				'ErrorBoundary caught an error:',
				expect.any(Error),
				expect.objectContaining({
					componentStack: expect.any(String),
				}),
			);
		});
	});

	describe('Custom fallback rendering', () => {
		it('should render custom fallback when provided', () => {
			const customFallback = (error: Error, errorInfo: ErrorInfo) => (
				<div data-testid="custom-fallback">
					<div data-testid="custom-error-message">{error.message}</div>
					<div data-testid="custom-error-info">{errorInfo.componentStack}</div>
				</div>
			);

			render(
				<ErrorBoundary fallback={customFallback}>
					<ThrowOnMount errorMessage="Custom fallback test" />
				</ErrorBoundary>,
			);

			expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
			expect(screen.getByTestId('custom-error-message')).toHaveTextContent(
				'Custom fallback test',
			);
			expect(
				screen.queryByTestId('smart-error-handler'),
			).not.toBeInTheDocument();
		});

		it('should pass error and errorInfo to custom fallback', () => {
			const customFallback = vi.fn((_error: Error, _errorInfo: ErrorInfo) => (
				<div data-testid="custom-fallback">Custom error UI</div>
			));

			render(
				<ErrorBoundary fallback={customFallback}>
					<ThrowOnMount errorMessage="Fallback props test" />
				</ErrorBoundary>,
			);

			expect(customFallback).toHaveBeenCalledTimes(1);
			expect(customFallback).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Fallback props test',
				}),
				expect.objectContaining({
					componentStack: expect.any(String),
				}),
			);
		});
	});

	describe('Default SmartErrorHandler fallback', () => {
		it('should render SmartErrorHandler when no custom fallback is provided', () => {
			render(
				<ErrorBoundary>
					<ThrowOnMount errorMessage="Smart handler test" />
				</ErrorBoundary>,
			);

			expect(screen.getByTestId('smart-error-handler')).toBeInTheDocument();
			expect(screen.getByTestId('error-message')).toHaveTextContent(
				'Smart handler test',
			);
		});

		it('should pass onAction callback to SmartErrorHandler', async () => {
			render(
				<ErrorBoundary onAction={mockOnAction}>
					<ThrowOnMount errorMessage="Action test" />
				</ErrorBoundary>,
			);

			const actionButton = screen.getByTestId('action-button');
			actionButton.click();

			expect(mockOnAction).toHaveBeenCalledTimes(1);
			expect(mockOnAction).toHaveBeenCalledWith(
				expect.objectContaining({
					message: 'Action test',
				}),
				expect.objectContaining({
					type: 'retry',
					label: 'Retry',
				}),
			);
		});
	});

	describe('Error recovery and state management', () => {
		it('should reset error state when onDismiss is called', async () => {
			const { rerender } = render(
				<ErrorBoundary>
					<ThrowError shouldThrow={true} errorMessage="Recovery test" />
				</ErrorBoundary>,
			);

			// Error boundary should be showing
			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

			// Click dismiss button
			const dismissButton = screen.getByTestId('dismiss-button');
			dismissButton.click();

			// Rerender with non-throwing component
			rerender(
				<ErrorBoundary>
					<ThrowError shouldThrow={false} />
				</ErrorBoundary>,
			);

			// Should show normal content again
			await waitFor(() => {
				expect(screen.getByTestId('child-component')).toBeInTheDocument();
				expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
			});
		});
	});

	describe('Props and configuration', () => {
		it('should apply className to error boundary container', () => {
			render(
				<ErrorBoundary className="custom-error-class">
					<ThrowOnMount />
				</ErrorBoundary>,
			);

			const errorBoundary = screen.getByTestId('error-boundary');
			expect(errorBoundary).toHaveClass('custom-error-class');
		});

		it('should handle multiple error types', () => {
			const ThrowCustomError = () => {
				throw new TypeError('Type error occurred');
			};

			render(
				<ErrorBoundary onError={mockOnError}>
					<ThrowCustomError />
				</ErrorBoundary>,
			);

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({
					name: 'TypeError',
					message: 'Type error occurred',
				}),
				expect.any(Object),
			);
		});
	});

	describe('Edge cases', () => {
		it('should handle errors with empty messages', () => {
			render(
				<ErrorBoundary>
					<ThrowOnMount errorMessage="" />
				</ErrorBoundary>,
			);

			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
			expect(screen.getByTestId('smart-error-handler')).toBeInTheDocument();
		});

		it('should handle null/undefined error scenarios gracefully', () => {
			// This tests the internal state management
			const { rerender } = render(
				<ErrorBoundary>
					<div>Normal content</div>
				</ErrorBoundary>,
			);

			expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();

			rerender(
				<ErrorBoundary>
					<ThrowOnMount />
				</ErrorBoundary>,
			);

			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
		});

		it('should not call onError if callback is not provided', () => {
			// Should not throw even without onError callback
			expect(() => {
				render(
					<ErrorBoundary>
						<ThrowOnMount />
					</ErrorBoundary>,
				);
			}).not.toThrow();

			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
		});

		it('should not call onAction if callback is not provided', () => {
			render(
				<ErrorBoundary>
					<ThrowOnMount />
				</ErrorBoundary>,
			);

			// Should not throw when action button is clicked without onAction callback
			expect(() => {
				const actionButton = screen.getByTestId('action-button');
				actionButton.click();
			}).not.toThrow();
		});
	});

	describe('Component lifecycle', () => {
		it('should catch errors during component mounting', () => {
			render(
				<ErrorBoundary onError={mockOnError}>
					<ThrowOnMount errorMessage="Mount phase error" />
				</ErrorBoundary>,
			);

			expect(mockOnError).toHaveBeenCalled();
			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
		});

		it('should catch errors during component updating', () => {
			const UpdatingComponent = ({ shouldError }: { shouldError: boolean }) => {
				if (shouldError) {
					throw new Error('Update phase error');
				}
				return <div>Updated content</div>;
			};

			const { rerender } = render(
				<ErrorBoundary onError={mockOnError}>
					<UpdatingComponent shouldError={false} />
				</ErrorBoundary>,
			);

			// Trigger update that causes error
			rerender(
				<ErrorBoundary onError={mockOnError}>
					<UpdatingComponent shouldError={true} />
				</ErrorBoundary>,
			);

			expect(mockOnError).toHaveBeenCalled();
			expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
		});
	});
});
