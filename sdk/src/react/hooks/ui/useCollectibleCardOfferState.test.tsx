import { renderHook } from '@test';
import { TEST_ACCOUNTS } from '@test/const';
import { describe, expect, it } from 'vitest';
import type { Order } from '../../_internal';
import { useCollectibleCardOfferState } from './useCollectibleCardOfferState';

describe('useCollectibleCardOfferState', () => {
	const userAddress = TEST_ACCOUNTS[0];
	const otherAddress = TEST_ACCOUNTS[1];

	const mockOffer = {
		createdBy: otherAddress,
	} as Order;

	it('should return null if no highest offer is provided', () => {
		const { result } = renderHook(() =>
			useCollectibleCardOfferState(undefined, '0'),
		);
		expect(result.current).toBeNull();
	});

	it('should allow accepting offer if user owns token and did not make the offer', () => {
		const { result } = renderHook(() =>
			useCollectibleCardOfferState(mockOffer, '1'),
		);

		expect(result.current).toEqual({
			show: true,
			canAcceptOffer: true,
			isOfferMadeBySelf: false,
			userOwnsToken: true,
		});
	});

	it('should NOT allow accepting offer if user does not own token', () => {
		const { result } = renderHook(() =>
			useCollectibleCardOfferState(mockOffer, '0'),
		);

		expect(result.current).toEqual({
			show: true,
			canAcceptOffer: false, // User has no balance
			isOfferMadeBySelf: false,
			userOwnsToken: false,
		});
	});

	it('should NOT allow accepting offer if user made the offer themselves', () => {
		const selfOffer = { ...mockOffer, createdBy: userAddress } as Order;

		const { result } = renderHook(() =>
			useCollectibleCardOfferState(selfOffer, '1'),
		);

		expect(result.current).toEqual({
			show: true,
			canAcceptOffer: false, // Cannot accept own offer
			isOfferMadeBySelf: true,
			userOwnsToken: true,
		});
	});

	it('should handle undefined balance as 0', () => {
		const { result } = renderHook(() =>
			useCollectibleCardOfferState(mockOffer, undefined),
		);

		expect(result.current).toEqual({
			show: true,
			canAcceptOffer: false,
			isOfferMadeBySelf: false,
			userOwnsToken: false,
		});
	});
});
