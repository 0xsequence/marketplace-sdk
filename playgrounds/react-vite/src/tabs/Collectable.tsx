import { useNavigate, useParams } from 'react-router';
import { CollectiblePageController, createRoute } from 'shared-components';

export function Collectible() {
	const navigate = useNavigate();
	const { collectionAddress } = useParams();
	const route = createRoute.collectibles(collectionAddress as string);

	return (
		<CollectiblePageController
			onCollectionClick={() => {
				navigate(route);
			}}
			showFullLayout={true}
		/>
	);
}
