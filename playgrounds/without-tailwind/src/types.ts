import type { useListCollections } from '../../../sdk/src/react';

//TODO: Unify collection types in SDK
export type Collection = NonNullable<
	ReturnType<typeof useListCollections>['data']
>[number];
