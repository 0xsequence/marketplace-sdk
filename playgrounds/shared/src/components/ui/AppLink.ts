import type React from 'react';

export interface AppLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}