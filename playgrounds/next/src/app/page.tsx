'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DEFAULT_ROUTE } from '@/lib/routes';

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		router.replace(DEFAULT_ROUTE);
	}, [router]);

	return null;
}
