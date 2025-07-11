import { HttpResponse, http as mswHttp } from 'msw';
import { setupServer } from 'msw/node';
import { handlers as marketplaceConfigHandlers } from '../src/react/_internal/api/__mocks__/builder.msw';
import { handlers as indexerHandlers } from '../src/react/_internal/api/__mocks__/indexer.msw';
import { laosHandlers } from '../src/react/_internal/api/__mocks__/laos.msw';
import { handlers as marketplaceHandlers } from '../src/react/_internal/api/__mocks__/marketplace.msw';
import { handlers as metadataHandlers } from '../src/react/_internal/api/__mocks__/metadata.msw';

const tickHandler = mswHttp.post(
	'https://nodes.sequence.app/rpc/Databeat/Tick',
	() => {
		return HttpResponse.json({});
	},
);

export const server = setupServer(
	...marketplaceHandlers,
	...metadataHandlers,
	...indexerHandlers,
	...marketplaceConfigHandlers,
	...laosHandlers,
	tickHandler,
);
