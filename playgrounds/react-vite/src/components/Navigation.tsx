import { Box } from '@0xsequence/design-system';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../lib/routes';

export function Navigation() {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<Box
			gap="3"
			flexDirection="row"
			background="backgroundBackdrop"
			padding="3"
			borderRadius="md"
		>
			{Object.values(ROUTES).map(({ label, path }) => (
				<Box
					as="button"
					key={path}
					onClick={() => navigate(`/${path}`)}
					background={
						location.pathname === `/${path}`
							? 'backgroundControl'
							: 'backgroundBackdrop'
					}
					padding="3"
					borderRadius="md"
					flexGrow="1"
					textAlign="center"
					border="none"
					color="text100"
					fontWeight="bold"
					cursor="pointer"
				>
					{label}
				</Box>
			))}
		</Box>
	);
}
