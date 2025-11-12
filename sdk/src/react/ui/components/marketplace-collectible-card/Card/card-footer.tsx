'use client';

import { forwardRef } from 'react';
import { cn } from '../../../../../utils';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	show?: boolean;
}

/**
 * CardFooter - Generic animated action container for card buttons
 * Provides slide-up animation on card hover. Content is provided via children.
 *
 * @example
 * <Card.Footer>
 *   <ActionButton action="buy" {...props} />
 * </Card.Footer>
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
	({ children, show = true, className, ...props }, ref) => {
		if (!show) return null;

		return (
			<div
				ref={ref}
				className={cn(
					'-bottom-16 absolute flex w-full origin-bottom items-center justify-center bg-overlay-light p-2 backdrop-blur transition-transform duration-200 ease-in-out group-hover:translate-y-[-64px]',
					className ?? '',
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

CardFooter.displayName = 'CardFooter';
