'use client';

import { CollectiblePageController } from 'shared-components';

export default function CollectiblePage() {
	return (
		<CollectiblePageController 
			showFullLayout={false}
			mediaClassName="h-[168px] w-[168px] overflow-hidden rounded-xl"
		/>
	);
}
