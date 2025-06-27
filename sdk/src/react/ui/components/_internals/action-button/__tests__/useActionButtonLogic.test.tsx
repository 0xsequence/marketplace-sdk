'use client';

import { renderHook, waitFor } from '@test';
import { createMockWallet } from '@test/mocks/wallet';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectibleCardAction } from '../../../../../../types';
import * as walletModule from '../../../../../_internal/wallet/useWallet';
import { useActionButtonLogic } from '../hooks/useActionButtonLogic';
import { actionButtonStore } from '../store';

describe('useActionButtonLogic', () => {
	const onCannotPerformActionMock = vi.fn();
	const defaultProps = {
		tokenId: '123',
		action:
			(CollectibleCardAction.BUY as CollectibleCardAction.BUY) ||
			CollectibleCardAction.OFFER,
		owned: false,
		onCannotPerformAction: onCannotPerformActionMock,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.clearAllMocks();
		vi.restoreAllMocks();
		actionButtonStore.send({ type: 'clearPendingAction' });

		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: createMockWallet(),
			isError: false,
			isLoading: false,
		});
	});

	it('restricts owners from performing buy/offer actions', async () => {
		actionButtonStore.send({
			type: 'setPendingAction',
			action: defaultProps.action,
			onPendingActionExecuted: vi.fn(),
			tokenId: '123',
		});

		const { result } = renderHook(() =>
			useActionButtonLogic({
				...defaultProps,
				owned: true,
			}),
		);

		// Callback should be called with the action
		expect(result.current.isOwnerAction).toBe(false);
		expect(onCannotPerformActionMock).toHaveBeenCalledWith(
			CollectibleCardAction.BUY,
		);
	});

	it('executes pending action when user becomes connected', async () => {
		const executePendingActionMock = vi.fn();

		actionButtonStore.send({
			type: 'setPendingAction',
			action: CollectibleCardAction.BUY,
			onPendingActionExecuted: executePendingActionMock,
			tokenId: defaultProps.tokenId,
		});

		renderHook(() =>
			useActionButtonLogic({
				...defaultProps,
				owned: false,
			}),
		);

		waitFor(
			() => {
				expect(executePendingActionMock).toHaveBeenCalled();
			},
			{
				timeout: 1000,
			},
		);
	});
});
