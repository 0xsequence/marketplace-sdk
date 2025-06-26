import { Link } from 'react-router';
import type { AppLinkProps } from './LinkProvider';

export function AppLink({ href, children, className }: AppLinkProps) {
	return (
		<Link to={href} className={className}>
			{children}
		</Link>
	);
}
