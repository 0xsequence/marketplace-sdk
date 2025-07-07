import { Link } from 'react-router';
import type { AppLinkProps } from 'shared-components';

export function AppLink({ href, children, className, onClick }: AppLinkProps) {
	return (
		<Link to={href} className={className} onClick={onClick}>
			{children}
		</Link>
	);
}
