'use client';

import { usePlayground } from '@/lib/PlaygroundContext';
import type { Tab } from '@/lib/PlaygroundContext';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
	const pathname = usePathname();
	const { setActiveTab } = usePlayground();

	return (
		<nav className="flex gap-4 p-2 bg-gray-800 rounded-lg">
			{Object.values(ROUTES).map((route) => {
				const isActive = pathname === `/${route.path}`;
				return (
					<Link
						key={route.path}
						href={`/${route.path}`}
						onClick={() => setActiveTab(route.path as Tab)}
						className={`px-4 py-2 rounded-md transition-colors ${
							isActive
								? 'bg-blue-600 text-white'
								: 'text-gray-300 hover:bg-gray-700'
						}`}
					>
						{route.label}
					</Link>
				);
			})}
		</nav>
	);
}
