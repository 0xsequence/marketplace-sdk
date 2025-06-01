import { fireEvent, render, screen } from '@test';
import { describe, expect, it, vi } from 'vitest';
import { PartialDataFallback } from '../PartialDataFallback';

describe('PartialDataFallback', () => {
	it('should display loaded and failed counts', () => {
		render(<PartialDataFallback loadedCount={10} failedCount={3} />);

		expect(
			screen.getByText("Some items couldn't be loaded"),
		).toBeInTheDocument();
		expect(
			screen.getByText('10 items loaded successfully, 3 failed to load.'),
		).toBeInTheDocument();
		expect(screen.getByText('⚠️')).toBeInTheDocument();
	});

	it('should show retry button when onRetryFailed provided', () => {
		const onRetryFailed = vi.fn();
		render(
			<PartialDataFallback
				loadedCount={5}
				failedCount={2}
				onRetryFailed={onRetryFailed}
			/>,
		);

		const retryButton = screen.getByText('Retry Failed');
		expect(retryButton).toBeInTheDocument();

		fireEvent.click(retryButton);
		expect(onRetryFailed).toHaveBeenCalledTimes(1);
	});

	it('should not show retry button when onRetryFailed not provided', () => {
		render(<PartialDataFallback loadedCount={5} failedCount={2} />);

		expect(screen.queryByText('Retry Failed')).not.toBeInTheDocument();
	});

	it('should dismiss when close button clicked', () => {
		const onDismiss = vi.fn();
		render(
			<PartialDataFallback
				loadedCount={5}
				failedCount={2}
				onDismiss={onDismiss}
			/>,
		);

		const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
		fireEvent.click(dismissButton);

		// Component should disappear
		expect(
			screen.queryByText("Some items couldn't be loaded"),
		).not.toBeInTheDocument();
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('should remain dismissed after clicking dismiss', () => {
		const { rerender } = render(
			<PartialDataFallback loadedCount={5} failedCount={2} />,
		);

		// Dismiss the component
		const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
		fireEvent.click(dismissButton);

		// Component should not be visible
		expect(
			screen.queryByText("Some items couldn't be loaded"),
		).not.toBeInTheDocument();

		// Re-render with new props
		rerender(<PartialDataFallback loadedCount={10} failedCount={5} />);

		// Should still be dismissed
		expect(
			screen.queryByText("Some items couldn't be loaded"),
		).not.toBeInTheDocument();
	});

	it('should have warning background styling', () => {
		const { container } = render(
			<PartialDataFallback loadedCount={5} failedCount={2} />,
		);

		const card = container.querySelector('.border-warning\\/20.bg-warning\\/5');
		expect(card).toBeInTheDocument();
	});
});
