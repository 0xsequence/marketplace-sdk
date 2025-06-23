'use client';

import { InventoryPageController } from 'shared-components';
import { useRouter } from 'next/navigation';

export default function InventoryPage() {
	const router = useRouter();

	const handleNavigate = (path: string) => {
		router.push(path);
	};

	return <InventoryPageController onNavigate={handleNavigate} />;
}