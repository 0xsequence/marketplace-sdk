'use client';

import { Button, Spinner } from '@0xsequence/design-system';
import type { ReactNode } from 'react';

interface ActionCellProps<T> {
	item: T;
	onAction: (item: T) => void;
	label: ReactNode | ((item: T) => ReactNode);
	disabled?: boolean;
}

export function ActionCell<T>({
	item,
	onAction,
	label,
	disabled = false,
}: ActionCellProps<T>) {
	const actionLabel = typeof label === 'function' ? label(item) : label;

	if (!actionLabel) {
		return null;
	}

	const isLoading =
		actionLabel === 'loading' || actionLabel === <Spinner size="sm" />;

	return (
		<Button
			size="xs"
			variant="glass"
			onClick={() => onAction(item)}
			disabled={disabled || isLoading}
			label={isLoading ? undefined : actionLabel}
			leftIcon={isLoading ? () => <Spinner size="sm" /> : undefined}
		/>
	);
}
