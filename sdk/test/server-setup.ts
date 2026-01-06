import * as BuilderMocks from '@0xsequence/api-client/mocks/builder';
import * as IndexerMocks from '@0xsequence/api-client/mocks/indexer';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import * as MetadataMocks from '@0xsequence/api-client/mocks/metadata';
import { HttpResponse, http as mswHttp } from 'msw';
import { setupServer } from 'msw/node';

const tickHandler = mswHttp.post(
	'https://nodes.sequence.app/rpc/Databeat/Tick',
	() => {
		return HttpResponse.json({});
	},
);

export const server = setupServer(
	...MarketplaceMocks.handlers,
	...MetadataMocks.handlers,
	...IndexerMocks.handlers,
	...BuilderMocks.handlers,
	tickHandler,
);
