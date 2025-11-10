'use client';

import { forwardRef } from 'react';
import { cn } from '../../../../../utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ children, onClick, onKeyDown, className, ...props }, ref) => {
		const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
			if (onClick && (e.key === 'Enter' || e.key === ' ')) {
				e.preventDefault();
				onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
			}
			onKeyDown?.(e);
		};

		const isInteractive = !!onClick;

		return (
			<div
				ref={ref}
				data-testid="collectible-card"
				className={cn(
					'group relative z-10 flex h-full w-full flex-col items-start overflow-hidden rounded-xl',
					'w-card-width min-w-card-min-width border border-border-base bg-background-primary',
					isInteractive && [
						'cursor-pointer',
						'focus-visible:border-border-focus focus-visible:shadow-focus-ring focus-visible:outline-focus',
						'active:border-border-focus active:shadow-active-ring',
					],
					className,
				)}
				{...(isInteractive && {
					onClick,
					onKeyDown: handleKeyDown,
					role: 'button',
					tabIndex: 0,
				})}
				{...(!isInteractive && onKeyDown && { onKeyDown })}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Card.displayName = 'Card';
