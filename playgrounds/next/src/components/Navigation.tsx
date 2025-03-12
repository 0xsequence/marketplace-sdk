'use client';

import { usePlayground } from '@/lib/PlaygroundContext';
import type { Tab } from '@/lib/PlaygroundContext';
import { ROUTES } from '@/lib/routes';
import { Button } from '@0xsequence/design-system';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
	const pathname = usePathname();
	const { setActiveTab } = usePlayground();

	return (
		<div className="mb-2 flex flex-row gap-3 rounded-xl bg-background-raised p-3">
			{Object.values(ROUTES).map((route) => {
				const isActive = pathname === `/${route.path}`;
				return (
					<Button
						key={route.path}
						variant={isActive ? 'primary' : 'secondary'}
						onClick={() => {
							setActiveTab(route.path as Tab);
						}}
						asChild
					>
						<Link href={`/${route.path}`}>{route.label}</Link>
					</Button>
				);
			})}
		</div>
	);
}
