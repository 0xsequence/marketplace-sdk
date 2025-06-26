import { useNavigate, useParams } from 'react-router';
import { CollectiblePageController } from 'shared-components';

export function Collectible() {
	const navigate = useNavigate();
	const { collectionAddress } = useParams();

	return (
		<CollectiblePageController
			onCollectionClick={() => {
				navigate(`/${collectionAddress}/collectibles`);
			}}
			showFullLayout={true}
		/>
	);
}
