'use client';

import { renderHook, waitFor } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as wagmi from 'wagmi';
import { CollectibleCardAction } from '../../../../../../types';
import { useActionButtonLogic } from '../hooks/useActionButtonLogic';
import { actionButtonStore } from '../store';

vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
	};
});

describe('useActionButtonLogic', () => {
	const onCannotPerformActionMock = vi.fn();
	const defaultProps = {
		tokenId: 123n,
		action: CollectibleCardAction.BUY as CollectibleCardAction.BUY,
		owned: false,
		onCannotPerformAction: onCannotPerformActionMock,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		actionButtonStore.send({ type: 'clearPendingAction' });

		// Default to connected state
		vi.mocked(wagmi.useAccount).mockReturnValue({
			address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
			addresses: [
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			],
			chain: undefined,
			chainId: 1,
			connector: {} as any,
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
		});
	});

	it('restricts owners from performing buy/offer actions', async () => {
		actionButtonStore.send({
			type: 'setPendingAction',
			action: defaultProps.action,
			onPendingActionExecuted: vi.fn(),
			tokenId: 123n,
		});

		const { result } = renderHook(() =>
			useActionButtonLogic({
				...defaultProps,
				owned: true,
			}),
		);

		// When owned is true and action is BUY, isOwnerAction should be false
		// because BUY is not in the list of owner actions (LIST, TRANSFER, SELL)
		expect(result.current.isOwnerAction).toBe(false);

		// Wait for the effect to run
		await waitFor(() => {
			expect(onCannotPerformActionMock).toHaveBeenCalledWith(
				CollectibleCardAction.BUY,
			);
		});
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

		await waitFor(
			() => {
				expect(executePendingActionMock).toHaveBeenCalled();
			},
			{
				timeout: 1000,
			},
		);
	});
});
