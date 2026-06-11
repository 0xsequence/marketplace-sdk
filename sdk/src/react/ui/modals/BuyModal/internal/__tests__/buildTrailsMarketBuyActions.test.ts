import {
	MarketplaceKind,
	StepType,
	type BuyStep,
	type Order,
} from '@0xsequence/api-client';
import { describe, expect, it } from 'vitest';
import { zeroAddress, type Address } from 'viem';
import { buildTrailsMarketBuyActions } from '../buildTrailsMarketBuyActions';

const BUY_TARGET = '0x1000000000000000000000000000000000000001' as Address;
const ERC20_CURRENCY = '0x3000000000000000000000000000000000000003' as Address;

const createBuyStep = (overrides: Partial<BuyStep> = {}): BuyStep =>
	({
		id: StepType.buy,
		to: BUY_TARGET,
		data: '0xabcdef',
		value: 0n,
		price: 100n,
		...overrides,
	}) as BuyStep;

const createOrder = (overrides: Partial<Order> = {}): Order =>
	({
		orderId: 'order-1',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		tokenId: 7n,
		priceCurrencyAddress: ERC20_CURRENCY,
		priceAmount: 100n,
		...overrides,
	}) as Order;

describe('buildTrailsMarketBuyActions', () => {
	it('builds ERC20 approval and marketplace buy calls', () => {
		const calls = buildTrailsMarketBuyActions({
			buyStep: createBuyStep(),
			marketOrder: createOrder(),
		});

		expect(calls).toHaveLength(2);
		expect(calls[0]).toMatchObject({
			to: ERC20_CURRENCY,
		});
		expect(calls[0]?.data).toMatch(/^0x095ea7b3/);

		expect(calls[1]).toMatchObject({
			to: BUY_TARGET,
			data: '0xabcdef',
		});
		expect(calls[1]?.value).toBe(undefined);
	});

	it('uses native value for native currency buys and skips ERC20 approval', () => {
		const calls = buildTrailsMarketBuyActions({
			buyStep: createBuyStep({ value: 100n }),
			marketOrder: createOrder({ priceCurrencyAddress: zeroAddress }),
		});

		expect(calls).toHaveLength(1);
		expect(calls[0]).toMatchObject({
			to: BUY_TARGET,
			data: '0xabcdef',
			value: 100n,
		});
	});

	it('falls back to order price as native value when the buy step value is empty', () => {
		const calls = buildTrailsMarketBuyActions({
			buyStep: createBuyStep({ value: 0n }),
			marketOrder: createOrder({
				priceCurrencyAddress: zeroAddress,
				priceAmount: 123n,
			}),
		});

		expect(calls).toHaveLength(1);
		expect(calls[0]).toMatchObject({
			to: BUY_TARGET,
			data: '0xabcdef',
			value: 123n,
		});
	});
});
