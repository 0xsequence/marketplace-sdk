import { execSync } from 'child_process';
import { createServer } from 'prool';
import { anvil } from 'prool/instances';

let server: any;

export default async function setup() {
	try {
		// Kill any existing process on port 8545
		try {
			execSync('lsof -ti:8545 | xargs kill -9', { stdio: 'ignore' });
		} catch {
			// Ignore if no process is running on port 8545
		}

		server = createServer({
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
		console.log('✅ Anvil server started on port 8545');

		return async () => {
			if (server) {
				try {
					await server.stop();
					console.log('✅ Anvil server stopped');
				} catch (error) {
					console.warn('Failed to stop Anvil server:', error);
				}
			}
		};
	} catch (error) {
		console.error('❌ Failed to start Anvil server:', error);
		throw error;
	}
}
