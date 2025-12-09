import {
	BuilderMocks,
	IndexerMocks,
	MarketplaceMocks,
	MetadataMocks,
} from '@0xsequence/api-client';
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
