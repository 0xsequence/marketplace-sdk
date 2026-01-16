import type { CheckoutOptions } from '@0xsequence/api-client';
import { describe, expect, it } from 'vitest';
import { determineCheckoutMode } from '../determineCheckoutMode';

describe('determineCheckoutMode', () => {
	describe('trails mode', () => {
		it('returns trails when config is trails, chain is supported, and order supports trails', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: 'trails',
				isChainSupported: true,
				canBeUsedWithTrails: true,
			});

			expect(result).toBe('trails');
		});

		it('falls back to crypto when config is trails, chain is supported, but order does not support trails', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: 'trails',
				isChainSupported: true,
				canBeUsedWithTrails: false,
			});

			expect(result).toBe('crypto');
		});

		it('falls back to crypto when config is trails but chain is not supported', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: 'trails',
				isChainSupported: false,
				canBeUsedWithTrails: true,
			});

			expect(result).toBe('crypto');
		});

		it('falls back to crypto when config is trails, chain not supported, and order does not support trails', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: 'trails',
				isChainSupported: false,
				canBeUsedWithTrails: false,
			});

			expect(result).toBe('crypto');
		});
	});

	describe('sequence-checkout mode', () => {
		const mockCheckoutOptions = {
			creditCardCheckout: { defaultPaymentMethodType: 'cc' },
		} as unknown as CheckoutOptions;

		it('returns sequence-checkout config when mode is sequence-checkout', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: {
					mode: 'sequence-checkout',
					options: mockCheckoutOptions,
				},
				isChainSupported: true,
				canBeUsedWithTrails: true,
			});

			expect(result).toEqual({
				mode: 'sequence-checkout',
				options: mockCheckoutOptions,
			});
		});

		it('returns sequence-checkout regardless of chain/trails support', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: {
					mode: 'sequence-checkout',
					options: mockCheckoutOptions,
				},
				isChainSupported: false,
				canBeUsedWithTrails: false,
			});

			expect(result).toEqual({
				mode: 'sequence-checkout',
				options: mockCheckoutOptions,
			});
		});
	});

	describe('crypto mode', () => {
		it('returns crypto when config is explicitly crypto', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: 'crypto',
				isChainSupported: true,
				canBeUsedWithTrails: true,
			});

			expect(result).toBe('crypto');
		});

		it('returns crypto regardless of chain/trails support', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: 'crypto',
				isChainSupported: false,
				canBeUsedWithTrails: false,
			});

			expect(result).toBe('crypto');
		});
	});

	describe('undefined config', () => {
		it('returns undefined when config is undefined', () => {
			const result = determineCheckoutMode({
				checkoutModeConfig: undefined,
				isChainSupported: true,
				canBeUsedWithTrails: true,
			});

			expect(result).toBeUndefined();
		});
	});
});
