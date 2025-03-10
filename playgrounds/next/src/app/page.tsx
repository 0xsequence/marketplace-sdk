import { DEFAULT_ROUTE } from '@/lib/routes';
import { redirect } from 'next/navigation';

export default function HomePage() {
	redirect(DEFAULT_ROUTE);
}
