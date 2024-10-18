export const PROVIDER_ID = 'sdk-provider';

export function getProviderEl() {
	if (!globalThis.document) return null;
	return document.getElementById(PROVIDER_ID);
}
