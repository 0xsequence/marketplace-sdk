import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { server } from './server-setup';

// https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scrollIntoView = () => {};

// Add BigInt serialization support for JSON.stringify
declare global {
	interface BigInt {
		toJSON(): string;
	}
}

BigInt.prototype.toJSON = function () {
	return this.toString();
};

// jsdom does not support replaceSync yet, so we need to polyfill it for web-sdk
if (!('replaceSync' in CSSStyleSheet.prototype)) {
	Object.defineProperty(CSSStyleSheet.prototype, 'replaceSync', {
		value(cssText: string) {
			this.cssText = cssText;
			return cssText;
		},
	});
}

beforeAll(async () => {
	server.listen({
		onUnhandledRequest(request, print) {
			// Ignore requests to the local anvil node
			if (request.url.includes('127.0.0.1:8545')) {
				return;
			}
			print.warning();
		},
	});
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => {
	server.close();
});
