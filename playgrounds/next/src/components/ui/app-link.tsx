import Link from 'next/link';
import type { AppLinkProps } from 'shared-components';

export function AppLink({ href, children, className, onClick }: AppLinkProps) {
	return (
		<Link href={href} className={className} onClick={onClick}>
			{children}
		</Link>
	);
}
