import { createServer } from 'prool';
import { anvil } from 'prool/instances';

export default async function setup() {
	await createServer({
		instance: anvil(),
	}).start();
}
