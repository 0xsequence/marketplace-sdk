'use client';

import { DEFAULT_ROUTE } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		router.replace(DEFAULT_ROUTE);
	}, [router]);

	return null;
}
