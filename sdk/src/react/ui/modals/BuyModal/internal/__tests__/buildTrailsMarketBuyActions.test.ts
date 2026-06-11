import {
	type BuyStep,
	ContractType,
	MarketplaceKind,
	type Order,
	StepType,
} from '@0xsequence/api-client';
import { encodeDestinationCalls } from '0xtrails';
import { type Address, decodeFunctionData, erc20Abi, zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { OPENSEA_SEAPORT_CONDUIT_ADDRESS } from '../../../../../../utils/getConduitAddressForOrderbook';
import { buildTrailsMarketBuyActions } from '../buildTrailsMarketBuyActions';

const BUY_TARGET = '0x1000000000000000000000000000000000000001' as Address;
const USER_WALLET = '0x2000000000000000000000000000000000000002' as Address;
const ERC20_CURRENCY = '0x3000000000000000000000000000000000000003' as Address;
const COLLECTION_ADDRESS =
	'0x4000000000000000000000000000000000000004' as Address;
const SEAPORT_ADDRESS = '0x0000000000000068F116a894984e2DB1123eB395' as Address;
const BASE_WETH = '0x4200000000000000000000000000000000000006' as Address;
const OPENSEA_FULFILL_BASIC_ORDER_SELECTOR = '0xfb0f3ee1';

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
		collectionContractAddress: COLLECTION_ADDRESS,
		tokenId: 7n,
		priceCurrencyAddress: ERC20_CURRENCY,
		priceAmount: 100n,
		...overrides,
	}) as Order;

const build = (
	overrides: {
		buyStep?: Partial<BuyStep>;
		marketOrder?: Partial<Order>;
		contractType?: ContractType.ERC721 | ContractType.ERC1155;
	} = {},
) =>
	buildTrailsMarketBuyActions({
		chainId: 8453,
		buyStep: createBuyStep(overrides.buyStep),
		marketOrder: createOrder(overrides.marketOrder),
		contractType: overrides.contractType ?? ContractType.ERC721,
		recipientAddress: USER_WALLET,
	});

describe('buildTrailsMarketBuyActions', () => {
	it('builds ERC20 approval and marketplace buy calls using the required payment amount', () => {
		const result = build();

		expect(result).toBeDefined();
		expect(result?.paymentTokenAddress).toBe(ERC20_CURRENCY);
		expect(result?.paymentAmount).toBe(100n);
		expect(result?.calls).toHaveLength(2);
		expect(result?.calls[0]).toMatchObject({
			to: ERC20_CURRENCY,
		});
		expect(result?.calls[0]?.data).toMatch(/^0x095ea7b3/);
		const approval = decodeFunctionData({
			abi: erc20Abi,
			data: result?.calls[0]?.data ?? '0x',
		});
		expect(approval.args[1]).toBe(100n);

		expect(result?.calls[1]).toMatchObject({
			to: BUY_TARGET,
			data: '0xabcdef',
		});
		expect(result?.calls[1]?.value).toBe(undefined);

		expect(() =>
			encodeDestinationCalls({
				calls: result?.calls ?? [],
				tokenAddress: ERC20_CURRENCY,
				sweepTarget: USER_WALLET,
			}),
		).not.toThrow();
	});

	it('encodes OpenSea ERC20 buys even when approval spender is the OpenSea conduit', () => {
		const result = build({
			buyStep: {
				to: SEAPORT_ADDRESS,
				data: OPENSEA_FULFILL_BASIC_ORDER_SELECTOR,
			},
			marketOrder: {
				marketplace: MarketplaceKind.opensea,
			},
		});

		expect(result).toBeDefined();
		expect(result?.calls).toHaveLength(3);
		const approval = decodeFunctionData({
			abi: erc20Abi,
			data: result?.calls[0]?.data ?? '0x',
		});
		expect(approval.args[0]).toBe(OPENSEA_SEAPORT_CONDUIT_ADDRESS);
		expect(approval.args[1]).toBe(100n);
		expect(result?.calls[1]).toMatchObject({
			to: SEAPORT_ADDRESS,
			data: OPENSEA_FULFILL_BASIC_ORDER_SELECTOR,
		});
		expect(result?.calls[2]?.to).toBe(COLLECTION_ADDRESS);
		expect(result?.calls[2]?.data).toMatch(/^0x23b872dd/);

		expect(() =>
			encodeDestinationCalls({
				calls: result?.calls ?? [],
				tokenAddress: result?.paymentTokenAddress ?? ERC20_CURRENCY,
				sweepTarget: USER_WALLET,
			}),
		).not.toThrow();
	});

	it('uses wrapped native currency for native marketplace buys', () => {
		const result = build({
			buyStep: {
				value: 123n,
				price: 0n,
			},
			marketOrder: {
				priceCurrencyAddress: zeroAddress,
				priceAmount: 123n,
			},
		});

		expect(result).toBeDefined();
		expect(result?.paymentTokenAddress).toBe(BASE_WETH);
		expect(result?.paymentAmount).toBe(123n);
		expect(result?.calls).toHaveLength(2);
		expect(result?.calls[0]).toMatchObject({
			to: BASE_WETH,
		});
		expect(result?.calls[0]?.data).toMatch(/^0x2e1a7d4d/);
		expect(result?.calls[1]).toMatchObject({
			to: BUY_TARGET,
			data: '0xabcdef',
			value: 123n,
			sweepTokens: [zeroAddress],
		});

		expect(() =>
			encodeDestinationCalls({
				calls: result?.calls ?? [],
				tokenAddress: result?.paymentTokenAddress ?? BASE_WETH,
				sweepTarget: USER_WALLET,
			}),
		).not.toThrow();
	});

	it('wraps native OpenSea buys through WETH and appends an NFT transfer', () => {
		const result = build({
			buyStep: {
				to: SEAPORT_ADDRESS,
				data: OPENSEA_FULFILL_BASIC_ORDER_SELECTOR,
				value: 123n,
				price: 0n,
			},
			marketOrder: {
				marketplace: MarketplaceKind.opensea,
				priceCurrencyAddress: zeroAddress,
				priceAmount: 123n,
			},
		});

		expect(result?.paymentTokenAddress).toBe(BASE_WETH);
		expect(result?.paymentAmount).toBe(123n);
		expect(result?.calls).toHaveLength(3);
		expect(result?.calls[0]?.data).toMatch(/^0x2e1a7d4d/);
		expect(result?.calls[1]).toMatchObject({
			to: SEAPORT_ADDRESS,
			value: 123n,
		});
		expect(result?.calls[2]?.to).toBe(COLLECTION_ADDRESS);

		expect(() =>
			encodeDestinationCalls({
				calls: result?.calls ?? [],
				tokenAddress: result?.paymentTokenAddress ?? BASE_WETH,
				sweepTarget: USER_WALLET,
			}),
		).not.toThrow();
	});

	it('falls back to order price as native value when the buy step value is empty', () => {
		const result = build({
			buyStep: { value: 0n, price: 0n },
			marketOrder: {
				priceCurrencyAddress: zeroAddress,
				priceAmount: 123n,
			},
		});

		expect(result?.paymentAmount).toBe(123n);
		expect(result?.calls[1]).toMatchObject({
			to: BUY_TARGET,
			data: '0xabcdef',
			value: 123n,
		});
	});
});
