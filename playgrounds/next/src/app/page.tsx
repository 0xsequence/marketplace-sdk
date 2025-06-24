'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DEFAULT_ROUTE } from 'shared-components';

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		router.replace(DEFAULT_ROUTE);
	}, [router]);

	return null;
}
