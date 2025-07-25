import type { Address } from 'viem';
import { anvil } from 'viem/chains';
import type { Currency } from '../src';
import { CurrencyStatus } from '../src/react/_internal';

export const TEST_CHAIN = {
	...anvil,
	rpcUrls: {
		default: { http: ['http://127.0.0.1:8545/1'] },
	},
};

export const USDC_ADDRESS =
	'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address;

export const USDC_HOLDER = '0x5414d89a8bf7e99d732bc52f3e6a3ef461c0c078';

// Deafault accounts for Anvil
export const TEST_ACCOUNTS = [
	'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	'0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
	'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
	'0x90F79bf6EB2c4f870365E785982E1f101E93b906',
	'0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
	'0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
	'0x976EA74026E726554dB657fA54763abd0C3a0aa9',
	'0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
	'0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
	'0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
] as const;

export const TEST_PRIVATE_KEYS = [
	'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
	'0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
	'0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
	'0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
	'0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
	'0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
	'0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
	'0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356',
	'0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
	'0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
] as const;

export const TEST_COLLECTIBLE = {
	collectionAddress: '0xbabafdd8045740449a42b788a26e9b3a32f88ac1',
	chainId: 1,
	collectibleId: '7602',
} as const;

export const TEST_CURRENCY: Currency = {
	chainId: 1,
	contractAddress: USDC_ADDRESS,
	status: CurrencyStatus.active,
	name: 'Test Token',
	symbol: 'TEST',
	decimals: 18,
	imageUrl: 'https://example.com/test.png',
	exchangeRate: 1,
	defaultChainCurrency: false,
	nativeCurrency: false,
	createdAt: '2021-01-01T00:00:00.000Z',
	updatedAt: '2021-01-01T00:00:00.000Z',
};

export const TEST_CURRENCY_2: Currency = {
	...TEST_CURRENCY,
	symbol: 'TEST2',
};

export const TEST_CURRENCIES = [TEST_CURRENCY, TEST_CURRENCY_2];
