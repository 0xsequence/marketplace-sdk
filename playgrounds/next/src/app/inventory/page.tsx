'use client';

import { useRouter } from 'next/navigation';
import { InventoryPageController } from 'shared-components';

export default function InventoryPage() {
	const router = useRouter();

	const handleNavigate = (path: string) => {
		router.push(path);
	};

	return <InventoryPageController onNavigate={handleNavigate} />;
}
