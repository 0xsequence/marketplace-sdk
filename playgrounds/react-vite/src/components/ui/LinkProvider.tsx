'use client';

import type { ComponentType, ReactNode } from 'react';
import { createContext, useContext } from 'react';

export interface AppLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
}

interface LinkContextType {
	LinkComponent: ComponentType<AppLinkProps>;
}

const LinkContext = createContext<LinkContextType | null>(null);

export function LinkProvider({
	children,
	LinkComponent,
}: {
	children: ReactNode;
	LinkComponent: ComponentType<AppLinkProps>;
}) {
	return (
		<LinkContext.Provider value={{ LinkComponent }}>
			{children}
		</LinkContext.Provider>
	);
}

export function useLink() {
	const context = useContext(LinkContext);
	if (!context) {
		throw new Error('useLink must be used within a LinkProvider');
	}
	return context;
}