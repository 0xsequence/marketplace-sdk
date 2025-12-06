'use client';

import { Button } from '@0xsequence/design-system';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Navigation, ROUTES, Settings } from 'shared-components';
import type { Address } from 'viem';

export function NextNavigation() {
	const pathname = usePathname();
	const { collectionAddress } = useParams<{
		collectionAddress: string;
	}>();

	return (
		<>
			<Settings collectionAddress={collectionAddress as Address} />
			<Navigation
				routes={ROUTES}
				pathname={pathname}
				showDebug={false}
				renderButton={({ route, isActive, onClick, children }) => (
					<Button
						key={route.path}
						variant={isActive ? 'primary' : 'ghost'}
						onClick={onClick}
						asChild
					>
						<Link href={`/${route.path}`}>{children}</Link>
					</Button>
				)}
			/>
		</>
	);
}
