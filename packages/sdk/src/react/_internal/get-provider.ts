export const PROVIDER_ID = 'sdk-provider';

export function getProviderEl(): HTMLElement | null {
	if (!globalThis.document) return null;
	return document.getElementById(PROVIDER_ID);
}
