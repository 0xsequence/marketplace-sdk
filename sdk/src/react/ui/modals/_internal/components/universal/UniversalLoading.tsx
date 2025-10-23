'use client';

import { Spinner } from '@0xsequence/design-system';
import { cn } from '../../../../../../utils';

export interface UniversalLoadingProps {
	/**
	 * Height class for the loading container
	 * @default "h-[104px]"
	 */
	height?: string;

	/**
	 * Custom className for additional styling
	 */
	className?: string;

	/**
	 * Size of the spinner
	 * @default "lg"
	 */
	size?: 'sm' | 'md' | 'lg';
}

/**
 * Universal loading component that provides consistent loading states
 * across all modals
 */
export function UniversalLoading({
	height = 'h-[104px]',
	className,
	size = 'lg',
}: UniversalLoadingProps) {
	return (
		<div
			className={cn(
				'flex w-full items-center justify-center',
				height,
				className,
			)}
			data-testid="universal-loading"
		>
			<Spinner size={size} />
		</div>
	);
}
