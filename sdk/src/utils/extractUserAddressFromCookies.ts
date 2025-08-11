import type { Address } from 'viem';

/**
 * Extracts the user address from the cookies string
 * @param dataString - The cookies string
 * @returns The user address
 */
export function extractUserAddressFromCookies(
	dataString: string,
): Address | undefined {
	const parts = dataString.split(';').map((part) => part.trim());
	const wagmiStorePart = parts.find((part) => part.startsWith('wagmi.store='));

	if (!wagmiStorePart) {
		return;
	}

	const jsonString = wagmiStorePart.substring('wagmi.store='.length);
	const wagmiStore = JSON.parse(jsonString);
	const connections = wagmiStore.state.connections.value;

	if (connections.length > 0) {
		const firstConnection = connections[0];
		const accounts = firstConnection[1].accounts;

		if (accounts && accounts.length > 0) {
			return accounts[0] as Address; // Return the first account
		}
	}
}
