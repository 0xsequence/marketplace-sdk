'use client';

import { Button } from '@0xsequence/design-system';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navigation } from 'shared-components';
import { ROUTES } from '@/lib/routes';

export function ClientNavigation() {
	const pathname = usePathname();

	return (
		<Navigation
			routes={ROUTES}
			pathname={pathname}
			showDebug={false}
			renderButton={({ route, isActive, onClick, children }) => (
				<Button
					key={route.path}
					variant={isActive ? 'primary' : 'secondary'}
					onClick={onClick}
					asChild
				>
					<Link href={`/${route.path}`}>{children}</Link>
				</Button>
			)}
		/>
	);
}
