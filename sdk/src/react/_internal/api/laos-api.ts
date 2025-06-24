import type {
	GetTokenBalancesReturn,
	GetTokenSuppliesReturn,
} from '@0xsequence/indexer';

export type SortOption = {
	column: string;
	order: 'ASC' | 'DESC';
};

export type PaginationOptions = {
	sort: SortOption[];
};

export type TokenSuppliesParams = {
	chainId: string;
	contractAddress: string;
	includeMetadata?: boolean;
	page?: PaginationOptions;
};

export type TokenBalancesParams = {
	chainId: string;
	accountAddress: string;
	contractAddress: string;
	includeMetadata?: boolean;
	page?: PaginationOptions;
};

export class LaosAPI {
	private baseUrl = 'https://extensions.api.laosnetwork.io';

	constructor(baseUrl?: string) {
		if (baseUrl) {
			this.baseUrl = baseUrl;
		}
	}

	async getTokenSupplies({
		chainId,
		contractAddress,
		includeMetadata = true,
		page = {
			sort: [
				{
					column: 'CREATED_AT',
					order: 'DESC',
				},
			],
		},
	}: TokenSuppliesParams): Promise<GetTokenSuppliesReturn> {
		const response = await fetch(`${this.baseUrl}/token/GetTokenSupplies`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chainId,
				contractAddress,
				includeMetadata,
				page,
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to get token supplies: ${response.statusText}`);
		}

		return await response.json();
	}

	async getTokenBalances({
		chainId,
		accountAddress,
		contractAddress,
		includeMetadata = true,
		page = {
			sort: [
				{
					column: 'CREATED_AT',
					order: 'DESC',
				},
			],
		},
	}: TokenBalancesParams): Promise<GetTokenBalancesReturn> {
		const response = await fetch(`${this.baseUrl}/token/GetTokenBalances`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chainId,
				accountAddress,
				contractAddress,
				includeMetadata,
				page,
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to get token balances: ${response.statusText}`);
		}

		return await response.json();
	}
}
