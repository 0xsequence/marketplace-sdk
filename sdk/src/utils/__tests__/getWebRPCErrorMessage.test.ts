import type { WebrpcError } from '@0xsequence/api-client';
import { describe, expect, test } from 'vitest';
import { getWebRPCErrorMessage } from '../getWebRPCErrorMessage';

	describe('getWebRPCErrorMessage', () => {
	test('maps OutOfFund endpoint errors to an insufficient balance message', () => {
		const message = getWebRPCErrorMessage({
			code: 0,
			status: 400,
			name: 'WebrpcEndpoint',
			message: 'endpoint error',
			cause: 'evm error: OutOfFund',
		} as WebrpcError);

		expect(message).toBe('Insufficient balance to complete this transaction.');
	});

	test('continues to map known WebRPC error codes', () => {
		const message = getWebRPCErrorMessage({
			code: 3000,
			status: 404,
			name: 'WebrpcNotFound',
			message: 'not found',
		} as WebrpcError);

		expect(message).toBe('Item not found or no longer available.');
	});
});
