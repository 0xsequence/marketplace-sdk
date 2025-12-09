'use client';

import { type Theme, ThemeProvider } from '@0xsequence/design-system';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { styles } from '../../styles/styles';

let sheet: CSSStyleSheet;
const getCSSStyleSheet = (customCSS?: string) => {
	if (!sheet) {
		sheet = new CSSStyleSheet();
		sheet.replaceSync(styles + (customCSS ? `\n\n${customCSS}` : ''));
	}

	return sheet;
};

interface ShadowRootProps {
	theme?: Theme;
	children: ReactNode;
	customCSS?: string;
	enabled: boolean;
}

export const ShadowRoot = (props: ShadowRootProps) => {
	const { theme, children, customCSS, enabled } = props;
	const hostRef = useRef<HTMLDivElement>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [windowDocument, setWindowDocument] = useState<Document | null>(null);

	useEffect(() => {
		setWindowDocument(document);
	}, []);

	useEffect(() => {
		if (hostRef.current && !hostRef.current.shadowRoot) {
			const shadowRoot = hostRef.current.attachShadow({ mode: 'open' });
			shadowRoot.adoptedStyleSheets = [getCSSStyleSheet(customCSS)];
			const container = document.createElement('div');
			container.id = 'marketplace-sdk-shadow-root';
			shadowRoot.appendChild(container);

			setContainer(container);
		}
	}, [windowDocument]);

	if (!enabled) {
		return children;
	}

	return windowDocument
		? createPortal(
				<div data-shadow-host ref={hostRef}>
					{container && (
						<ThemeProvider defaultTheme={theme} root={container}>
							{children}
						</ThemeProvider>
					)}
				</div>,
				document.body,
			)
		: null;
};
