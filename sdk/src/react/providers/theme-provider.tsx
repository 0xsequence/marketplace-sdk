'use client';

import {
	ThemeProvider as SequenceThemeProvider,
	type Theme,
} from '@0xsequence/design-system';
import { useConfig } from '../hooks';

export const ThemeProvider = ({
	children,
	theme,
	root,
}: {
	children: React.ReactNode;
	theme?: Theme;
	root?: HTMLElement;
}) => {
	const { shadowDom } = useConfig();

	if (!shadowDom) {
		return (
			<SequenceThemeProvider defaultTheme={theme} root={root}>
				{children}
			</SequenceThemeProvider>
		);
	}

	return children;
};
