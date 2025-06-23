import type { ReactNode } from 'react';

export interface AppLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

// This is a placeholder component that each playground will override
// with their own framework-specific implementation
export function AppLink({ href, children, className, onClick }: AppLinkProps) {
	return (
		<a href={href} className={className} onClick={onClick}>
			{children}
		</a>
	);
}
