'use client';

import { fireEvent, render, screen } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ActionButtons from '../_components/ActionButtons';

describe('ActionButtons', () => {
	const mockOnCancel = vi.fn();
	const mockOnConfirm = vi.fn();

	const defaultProps = {
		onCancel: mockOnCancel,
		onConfirm: mockOnConfirm,
		disabled: false,
		loading: false,
		confirmed: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render both buttons', () => {
		render(<ActionButtons {...defaultProps} />);

		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Continue with')).toBeInTheDocument();
	});

	it('should call onCancel when cancel button is clicked', () => {
		render(<ActionButtons {...defaultProps} />);

		const cancelButton = screen.getByText('Cancel');
		fireEvent.click(cancelButton);

		expect(mockOnCancel).toHaveBeenCalledTimes(1);
	});

	it('should call onConfirm when confirm button is clicked', () => {
		render(<ActionButtons {...defaultProps} />);

		const confirmButton = screen.getByText('Continue with');
		fireEvent.click(confirmButton);

		expect(mockOnConfirm).toHaveBeenCalledTimes(1);
	});

	it('should disable confirm button when disabled prop is true', () => {
		render(<ActionButtons {...defaultProps} disabled={true} />);

		const confirmButton = screen.getByText('Continue with').closest('button');
		expect(confirmButton).toBeDisabled();

		if (confirmButton) {
			fireEvent.click(confirmButton);
		}
		expect(mockOnConfirm).not.toHaveBeenCalled();
	});

	it('should display token symbol when provided', () => {
		render(<ActionButtons {...defaultProps} tokenSymbol="ETH" />);

		expect(screen.getByText('Continue with ETH')).toBeInTheDocument();
	});

	it('should show skeleton loading when tokenSymbol is not provided', () => {
		render(<ActionButtons {...defaultProps} />);

		expect(screen.getByText('Continue with')).toBeInTheDocument();
		expect(document.querySelector('.animate-shimmer')).toBeInTheDocument();
	});
});
