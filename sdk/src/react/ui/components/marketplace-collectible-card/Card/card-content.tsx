'use client';

import { forwardRef } from 'react';
import { cn } from '../../../../../utils';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
	fullWidth?: boolean;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'relative flex w-full flex-col items-start gap-2 whitespace-nowrap p-4',
					className || 'bg-background-primary',
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

CardContent.displayName = 'CardContent';
