import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { collectionKeys } from '../../_internal';
import { type UseCollectionArgs, fetchCollection } from '../useCollection';

export const collectionOptions = (
	args: UseCollectionArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectionKeys.detail, args, config],
		queryFn: () => fetchCollection(args, config),
	});
};
