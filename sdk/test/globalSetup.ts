import { createServer } from 'prool';
import { anvil } from 'prool/instances';

export default async function setup() {
	const server = createServer({
		host: '127.0.0.1',
		port: 8545,
		instance: anvil({
			chainId: 1,
			forkUrl: 'https://nodes.sequence.app/mainnet',
			forkBlockNumber: 19868020n,
			noMining: true,
		}),
	});
	await server.start();
}
