import { useNavigate, useLocation } from 'react-router';
import { ROUTES } from '../lib/routes';

export function Navigation() {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<div className="flex gap-3 flex-row bg-background-backdrop p-3 rounded-xl">
			{Object.values(ROUTES).map(({ label, path }) => (
				<button
					className="p-3 rounded-xl grow text-center border-none text-text100 font-bold cursor-pointer"
					key={path}
					onClick={() => navigate(`/${path}`)}
				>
					{label}
				</button>
			))}
		</div>
	);
}
