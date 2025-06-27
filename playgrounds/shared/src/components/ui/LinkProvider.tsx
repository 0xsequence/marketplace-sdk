import type React from 'react';
import { createContext, useContext } from 'react';
import type { AppLinkProps } from './AppLink';

type LinkComponent = React.ComponentType<AppLinkProps>;

const LinkContext = createContext<LinkComponent | null>(null);

interface LinkProviderProps {
	LinkComponent: LinkComponent;
	children: React.ReactNode;
}

export function LinkProvider({ LinkComponent, children }: LinkProviderProps) {
	return (
		<LinkContext.Provider value={LinkComponent}>
			{children}
		</LinkContext.Provider>
	);
}

export function useLink(): LinkComponent {
	const Link = useContext(LinkContext);
	if (!Link) {
		throw new Error('useLink must be used within a LinkProvider');
	}
	return Link;
}
