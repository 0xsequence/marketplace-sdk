import { fireEvent, render, screen } from '@test';
import { describe, expect, it, vi } from 'vitest';
import { FailedCardPlaceholder } from '../FailedCardPlaceholder';

describe('FailedCardPlaceholder', () => {
	it('should display token ID', () => {
		render(<FailedCardPlaceholder tokenId="123" />);

		expect(screen.getByText('Item #123')).toBeInTheDocument();
		expect(screen.getByText('Failed to load')).toBeInTheDocument();
		expect(screen.getByText('❌')).toBeInTheDocument();
	});

	it('should display error message when provided', () => {
		render(<FailedCardPlaceholder tokenId="456" error="Network timeout" />);

		expect(screen.getByText('Item #456')).toBeInTheDocument();
		expect(screen.getByText('Network timeout')).toBeInTheDocument();
	});

	it('should not display error message when not provided', () => {
		render(<FailedCardPlaceholder tokenId="789" />);

		expect(screen.getByText('Item #789')).toBeInTheDocument();
		expect(screen.queryByText('Network timeout')).not.toBeInTheDocument();
	});

	it('should show retry button when onRetry provided', () => {
		const onRetry = vi.fn();
		render(<FailedCardPlaceholder tokenId="123" onRetry={onRetry} />);

		const retryButton = screen.getByText('Retry');
		expect(retryButton).toBeInTheDocument();

		fireEvent.click(retryButton);
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it('should not show retry button when onRetry not provided', () => {
		render(<FailedCardPlaceholder tokenId="123" />);

		expect(screen.queryByText('Retry')).not.toBeInTheDocument();
	});

	it('should have error styling', () => {
		const { container } = render(<FailedCardPlaceholder tokenId="123" />);

		const card = container.querySelector(
			'.border-negative\\/20.bg-negative\\/5',
		);
		expect(card).toBeInTheDocument();
	});

	it('should maintain aspect ratio for image placeholder', () => {
		const { container } = render(<FailedCardPlaceholder tokenId="123" />);

		const imageBox = container.querySelector('.aspect-square');
		expect(imageBox).toBeInTheDocument();
	});

	it('should truncate long error messages', () => {
		const longError =
			'This is a very long error message that should be truncated to prevent the card from becoming too tall and disrupting the grid layout';

		render(<FailedCardPlaceholder tokenId="123" error={longError} />);

		const errorElement = screen.getByText(longError);
		expect(errorElement).toHaveClass('line-clamp-2');
	});
});
