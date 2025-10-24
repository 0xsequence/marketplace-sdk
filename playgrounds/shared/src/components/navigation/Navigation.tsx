'use client';

import { Button } from '@0xsequence/design-system';
import type { ReactNode } from 'react';
import { useMarketplace } from '../../store';
import type { Tab } from '../../types';

export interface NavigationProps {
	routes: Record<string, { path: string; label: string }>;
	pathname: string;
	showDebug?: boolean;
	onNavigate?: (path: string) => void;
	renderButton?: (props: {
		route: { path: string; label: string };
		isActive: boolean;
		onClick: () => void;
		children: ReactNode;
	}) => ReactNode;
}

export function Navigation({
	routes,
	pathname,
	showDebug = false,
	onNavigate,
	renderButton,
}: NavigationProps) {
	const { setActiveTab } = useMarketplace();

	const handleNavigation = (path: string) => {
		setActiveTab(path as Tab);
		if (onNavigate) {
			onNavigate(path);
		}
	};

	return (
		<div className="mb-2 flex w-full flex-row gap-3 rounded-xl bg-background-raised p-3">
			{Object.values(routes).map((route) => {
				// Skip debug tab if not enabled
				if (route.path === 'debug' && !showDebug) {
					return null;
				}

				const isActive = pathname === `/${route.path}`;
				const onClick = () => handleNavigation(route.path);

				if (renderButton) {
					return renderButton({
						route,
						isActive,
						onClick,
						children: route.label,
					});
				}

				return (
					<Button
						key={route.path}
						variant={isActive ? 'primary' : 'secondary'}
						onClick={onClick}
					>
						{route.label}
					</Button>
				);
			})}
		</div>
	);
}
