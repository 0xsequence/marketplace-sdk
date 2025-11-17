/**
 * Wrapped Marketplace Client
 *
 * Wraps the raw Marketplace client with transformation layer.
 * Provides normalized types (number for chainId, bigint for tokenId) to SDK consumers
 * while handling API type conversion (string for chainId).
 */

import type { ContractType } from '@0xsequence/indexer';
import type { ChainId, TokenId } from '../../types/primitives';
import * as Gen from './marketplace.gen';
import type { Step } from './types';

/**
 * Convert chainId from number to string for API requests
 */
function chainIdToString(chainId: ChainId): string {
	return chainId.toString();
}

/**
 * SDK-facing CheckoutOptionsItem type with bigint tokenId
 */
export interface CheckoutOptionsItem {
	tokenId: TokenId; // bigint
	quantity: bigint;
}

/**
 * Transform SDK CheckoutOptionsItem to API Gen.CheckoutOptionsItem
 */
function transformCheckoutItem(
	item: CheckoutOptionsItem,
): Gen.CheckoutOptionsItem {
	return {
		tokenId: item.tokenId,
		quantity: item.quantity,
	};
}

/**
 * SDK-facing CreateReq type with bigint tokenId
 */
export interface CreateReq {
	tokenId: TokenId; // bigint
	quantity: bigint;
	expiry: string;
	currencyAddress: string;
	pricePerToken: bigint;
}

/**
 * Transform SDK CreateReq to API Gen.CreateReq
 */
function transformCreateReq(req: CreateReq): Gen.CreateReq {
	return {
		...req,
		tokenId: req.tokenId,
		quantity: req.quantity,
	};
}

/**
 * Transform SDK OrderData to API Gen.OrderData
 */
function transformOrderData(data: OrderData): Gen.OrderData {
	return {
		orderId: data.orderId,
		quantity: data.quantity,
		tokenId: data.tokenId,
	};
}

/**
 * Enhanced response types with discriminated Step unions (SDK-facing)
 *
 * These types override the generated response types to replace the basic
 * `Step` interface with our enhanced discriminated union type from types.ts.
 *
 * Benefits over generated types:
 * - Type-safe discrimination by step.id
 * - Guaranteed post field on signature steps
 * - Separate TransactionStep and SignatureStep types
 * - Better IDE autocomplete and type narrowing
 *
 * @see {@link Step} for the discriminated union implementation
 * @public
 */

/**
 * Response for listing transaction generation with enhanced Step types
 */
export type GenerateListingTransactionResponse = Omit<
	Gen.GenerateListingTransactionResponse,
	'steps'
> & {
	steps: Step[];
};

/**
 * Response for offer transaction generation with enhanced Step types
 */
export type GenerateOfferTransactionResponse = Omit<
	Gen.GenerateOfferTransactionResponse,
	'steps'
> & {
	steps: Step[];
};

/**
 * Response for sell transaction generation with enhanced Step types
 */
export type GenerateSellTransactionResponse = Omit<
	Gen.GenerateSellTransactionResponse,
	'steps'
> & {
	steps: Step[];
};

/**
 * Response for cancel transaction generation with enhanced Step types
 */
export type GenerateCancelTransactionResponse = Omit<
	Gen.GenerateCancelTransactionResponse,
	'steps'
> & {
	steps: Step[];
};

/**
 * Response for buy transaction generation with enhanced Step types
 */
export type GenerateBuyTransactionResponse = Omit<
	Gen.GenerateBuyTransactionResponse,
	'steps'
> & {
	steps: Step[];
};

/**
 * Request types with number chainId (SDK-facing)
 * These types override the raw API types to use number for chainId
 * and accept indexer's ContractType (which includes NATIVE)
 */
export type GenerateListingTransactionRequest = Omit<
	Gen.GenerateListingTransactionRequest,
	'chainId' | 'contractType' | 'listing'
> & {
	chainId: ChainId; // number instead of string
	contractType: ContractType; // Accept indexer's ContractType
	listing: CreateReq; // SDK-facing bigint tokenId
};

export type GenerateOfferTransactionRequest = Omit<
	Gen.GenerateOfferTransactionRequest,
	'chainId' | 'contractType' | 'offer'
> & {
	chainId: ChainId; // number instead of string
	contractType: ContractType; // Accept indexer's ContractType
	offer: CreateReq; // SDK-facing bigint tokenId
};

/**
 * SDK-facing OrderData type with bigint quantity
 */
export interface OrderData {
	orderId: string;
	quantity: bigint; // bigint instead of string
	tokenId?: TokenId; // bigint (already bigint in Gen type)
}

export type GenerateSellTransactionRequest = Omit<
	Gen.GenerateSellTransactionRequest,
	'chainId' | 'ordersData'
> & {
	chainId: ChainId; // number instead of string
	ordersData: Array<OrderData>; // SDK-facing bigint quantity
};

export type GenerateCancelTransactionRequest = Omit<
	Gen.GenerateCancelTransactionRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GenerateBuyTransactionRequest = Omit<
	Gen.GenerateBuyTransactionRequest,
	'chainId' | 'ordersData'
> & {
	chainId: ChainId; // number instead of string
	ordersData: Array<OrderData>; // SDK-facing bigint quantity and tokenId
};

export type GetCollectionDetailRequest = Omit<
	Gen.GetCollectionDetailRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type ListCurrenciesRequest = Omit<
	Gen.ListCurrenciesRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GetCollectibleRequest = Omit<
	Gen.GetCollectibleRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GetLowestPriceListingForCollectibleRequest = Omit<
	Gen.GetLowestPriceListingForCollectibleRequest,
	'chainId' | 'tokenId'
> & {
	chainId: ChainId; // number instead of string
	tokenId: TokenId; // bigint instead of string
};

export type GetHighestPriceOfferForCollectibleRequest = Omit<
	Gen.GetHighestPriceOfferForCollectibleRequest,
	'chainId' | 'tokenId'
> & {
	chainId: ChainId; // number instead of string
	tokenId: TokenId; // bigint instead of string
};

export type ListListingsForCollectibleRequest = Omit<
	Gen.ListListingsForCollectibleRequest,
	'chainId' | 'tokenId'
> & {
	chainId: ChainId; // number instead of string
	tokenId: TokenId; // bigint instead of string
};

export type ListOffersForCollectibleRequest = Omit<
	Gen.ListOffersForCollectibleRequest,
	'chainId' | 'tokenId'
> & {
	chainId: ChainId; // number instead of string
	tokenId: TokenId; // bigint instead of string
};

export type ListOrdersWithCollectiblesRequest = Omit<
	Gen.ListOrdersWithCollectiblesRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GetFloorOrderRequest = Omit<Gen.GetFloorOrderRequest, 'chainId'> & {
	chainId: ChainId; // number instead of string
};

export type ListCollectiblesRequest = Omit<
	Gen.ListCollectiblesRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type ListCollectibleActivitiesRequest = Omit<
	Gen.ListCollectibleActivitiesRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type ListCollectionActivitiesRequest = Omit<
	Gen.ListCollectionActivitiesRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type ListPrimarySaleItemsRequest = Omit<
	Gen.ListPrimarySaleItemsRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GetCountOfPrimarySaleItemsRequest = Omit<
	Gen.GetCountOfPrimarySaleItemsRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type CheckoutOptionsMarketplaceRequest = Omit<
	Gen.CheckoutOptionsMarketplaceRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GetCountOfFilteredCollectiblesRequest = Omit<
	Gen.GetCountOfFilteredCollectiblesRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GetCountOfAllCollectiblesRequest = Omit<
	Gen.GetCountOfAllCollectiblesRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GetCountOfListingsForCollectibleRequest = Omit<
	Gen.GetCountOfListingsForCollectibleRequest,
	'chainId' | 'tokenId'
> & {
	chainId: ChainId; // number instead of string
	tokenId: TokenId; // bigint instead of string
};

export type GetCountOfOffersForCollectibleRequest = Omit<
	Gen.GetCountOfOffersForCollectibleRequest,
	'chainId' | 'tokenId'
> & {
	chainId: ChainId; // number instead of string
	tokenId: TokenId; // bigint instead of string
};

export type GetCountOfFilteredOrdersRequest = Omit<
	Gen.GetCountOfFilteredOrdersRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type GetCountOfAllOrdersRequest = Omit<
	Gen.GetCountOfAllOrdersRequest,
	'chainId'
> & {
	chainId: ChainId; // number instead of string
};

export type CheckoutOptionsSalesContractRequest = Omit<
	Gen.CheckoutOptionsSalesContractRequest,
	'chainId' | 'items'
> & {
	chainId: ChainId; // number instead of string
	items: Array<CheckoutOptionsItem>; // SDK-facing bigint tokenId
};

export type GetOrdersRequest = Omit<Gen.GetOrdersRequest, 'chainId'> & {
	chainId: ChainId; // number instead of string
};

/**
 * Wrapped Marketplace Client
 *
 * Wraps the raw Marketplace client with methods that accept normalized types (number chainId).
 * Automatically converts chainId from number to string for API calls.
 * Uses composition rather than inheritance to avoid type conflicts.
 */
export class MarketplaceClient {
	private client: Gen.Marketplace;
	public queryKey: Gen.Marketplace['queryKey'];

	constructor(hostname: string, fetch: typeof globalThis.fetch) {
		this.client = new Gen.Marketplace(hostname, fetch);

		// Expose queryKey for React Query integration
		// Note: QueryKeys will have string chainId, but that's okay for cache keys
		this.queryKey = this.client.queryKey;
	}

	/**
	 * Generate listing transaction with normalized chainId (number) and bigint tokenId
	 */
	async generateListingTransaction(
		req: GenerateListingTransactionRequest,
	): Promise<GenerateListingTransactionResponse> {
		return this.client.generateListingTransaction({
			...req,
			chainId: chainIdToString(req.chainId),
			// Cast ContractType - marketplace API accepts subset of indexer's ContractType
			contractType: req.contractType as Gen.ContractType,
			listing: transformCreateReq(req.listing),
		}) as Promise<GenerateListingTransactionResponse>;
	}

	/**
	 * Generate offer transaction with normalized chainId (number) and bigint tokenId
	 */
	async generateOfferTransaction(
		req: GenerateOfferTransactionRequest,
	): Promise<GenerateOfferTransactionResponse> {
		return this.client.generateOfferTransaction({
			...req,
			chainId: chainIdToString(req.chainId),
			// Cast ContractType - marketplace API accepts subset of indexer's ContractType
			contractType: req.contractType as Gen.ContractType,
			offer: transformCreateReq(req.offer),
		}) as Promise<GenerateOfferTransactionResponse>;
	}

	/**
	 * Generate sell transaction with normalized chainId (number) and bigint quantity
	 */
	async generateSellTransaction(
		req: GenerateSellTransactionRequest,
	): Promise<GenerateSellTransactionResponse> {
		return this.client.generateSellTransaction({
			...req,
			chainId: chainIdToString(req.chainId),
			ordersData: req.ordersData.map(transformOrderData),
		}) as Promise<GenerateSellTransactionResponse>;
	}

	/**
	 * Generate cancel transaction with normalized chainId (number)
	 */
	async generateCancelTransaction(
		req: GenerateCancelTransactionRequest,
	): Promise<GenerateCancelTransactionResponse> {
		return this.client.generateCancelTransaction({
			...req,
			chainId: chainIdToString(req.chainId),
		}) as Promise<GenerateCancelTransactionResponse>;
	}

	/**
	 * Generate buy transaction with normalized chainId (number)
	 */
	async generateBuyTransaction(
		req: GenerateBuyTransactionRequest,
	): Promise<GenerateBuyTransactionResponse> {
		return this.client.generateBuyTransaction({
			...req,
			chainId: chainIdToString(req.chainId),
			ordersData: req.ordersData.map(transformOrderData),
		}) as Promise<GenerateBuyTransactionResponse>;
	}

	/**
	 * Get collection detail with normalized chainId (number)
	 */
	async getCollectionDetail(
		req: GetCollectionDetailRequest,
	): Promise<Gen.GetCollectionDetailResponse> {
		return this.client.getCollectionDetail({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * List currencies with normalized chainId (number)
	 */
	async listCurrencies(
		req: ListCurrenciesRequest,
	): Promise<Gen.ListCurrenciesResponse> {
		return this.client.listCurrencies({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get collectible with normalized chainId (number)
	 */
	async getCollectible(
		req: GetCollectibleRequest,
	): Promise<Gen.GetCollectibleResponse> {
		return this.client.getCollectible({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get lowest price listing for collectible with normalized chainId (number)
	 */
	async getLowestPriceListingForCollectible(
		req: GetLowestPriceListingForCollectibleRequest,
	): Promise<Gen.GetCollectibleLowestListingResponse> {
		return this.client.getLowestPriceListingForCollectible({
			...req,
			chainId: chainIdToString(req.chainId),
			tokenId: req.tokenId,
		});
	}

	/**
	 * Get highest price offer for collectible with normalized chainId (number)
	 */
	async getHighestPriceOfferForCollectible(
		req: GetHighestPriceOfferForCollectibleRequest,
	): Promise<Gen.GetCollectibleHighestOfferResponse> {
		return this.client.getHighestPriceOfferForCollectible({
			...req,
			chainId: chainIdToString(req.chainId),
			tokenId: req.tokenId,
		});
	}

	/**
	 * List listings for collectible with normalized chainId (number)
	 */
	async listListingsForCollectible(
		req: ListListingsForCollectibleRequest,
	): Promise<Gen.ListCollectibleListingsResponse> {
		return this.client.listListingsForCollectible({
			...req,
			chainId: chainIdToString(req.chainId),
			tokenId: req.tokenId,
		});
	}

	/**
	 * List offers for collectible with normalized chainId (number)
	 */
	async listOffersForCollectible(
		req: ListOffersForCollectibleRequest,
	): Promise<Gen.ListCollectibleOffersResponse> {
		return this.client.listOffersForCollectible({
			...req,
			chainId: chainIdToString(req.chainId),
			tokenId: req.tokenId,
		});
	}

	/**
	 * List orders with collectibles with normalized chainId (number)
	 */
	async listOrdersWithCollectibles(
		req: ListOrdersWithCollectiblesRequest,
	): Promise<Gen.ListOrdersWithCollectiblesResponse> {
		return this.client.listOrdersWithCollectibles({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get floor order with normalized chainId (number)
	 */
	async getFloorOrder(
		req: GetFloorOrderRequest,
	): Promise<Gen.GetFloorOrderResponse> {
		return this.client.getFloorOrder({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * List collectibles with normalized chainId (number)
	 */
	async listCollectibles(
		req: ListCollectiblesRequest,
	): Promise<Gen.ListCollectiblesResponse> {
		return this.client.listCollectibles({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * List collectible activities with normalized chainId (number)
	 */
	async listCollectibleActivities(
		req: ListCollectibleActivitiesRequest,
	): Promise<Gen.ListCollectibleActivitiesResponse> {
		return this.client.listCollectibleActivities({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * List collection activities with normalized chainId (number)
	 */
	async listCollectionActivities(
		req: ListCollectionActivitiesRequest,
	): Promise<Gen.ListCollectionActivitiesResponse> {
		return this.client.listCollectionActivities({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * List primary sale items with normalized chainId (number)
	 */
	async listPrimarySaleItems(
		req: ListPrimarySaleItemsRequest,
	): Promise<Gen.ListPrimarySaleItemsResponse> {
		return this.client.listPrimarySaleItems({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get count of primary sale items with normalized chainId (number)
	 */
	async getCountOfPrimarySaleItems(
		req: GetCountOfPrimarySaleItemsRequest,
	): Promise<Gen.GetCountOfPrimarySaleItemsResponse> {
		return this.client.getCountOfPrimarySaleItems({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get checkout options for marketplace with normalized chainId (number)
	 */
	async checkoutOptionsMarketplace(
		req: CheckoutOptionsMarketplaceRequest,
	): Promise<Gen.CheckoutOptionsMarketplaceResponse> {
		return this.client.checkoutOptionsMarketplace({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get count of filtered collectibles with normalized chainId (number)
	 */
	async getCountOfFilteredCollectibles(
		req: GetCountOfFilteredCollectiblesRequest,
	): Promise<Gen.GetCountOfFilteredCollectiblesResponse> {
		return this.client.getCountOfFilteredCollectibles({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get count of all collectibles with normalized chainId (number)
	 */
	async getCountOfAllCollectibles(
		req: GetCountOfAllCollectiblesRequest,
	): Promise<Gen.GetCountOfAllCollectiblesResponse> {
		return this.client.getCountOfAllCollectibles({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get count of listings for collectible with normalized chainId (number) and tokenId (bigint)
	 */
	async getCountOfListingsForCollectible(
		req: GetCountOfListingsForCollectibleRequest,
	): Promise<Gen.GetCountOfListingsForCollectibleResponse> {
		return this.client.getCountOfListingsForCollectible({
			...req,
			chainId: chainIdToString(req.chainId),
			tokenId: req.tokenId,
		});
	}

	/**
	 * Get count of offers for collectible with normalized chainId (number)
	 */
	async getCountOfOffersForCollectible(
		req: GetCountOfOffersForCollectibleRequest,
	): Promise<Gen.GetCountOfOffersForCollectibleResponse> {
		return this.client.getCountOfOffersForCollectible({
			...req,
			chainId: chainIdToString(req.chainId),
			tokenId: req.tokenId,
		});
	}

	/**
	 * Get count of filtered orders with normalized chainId (number)
	 */
	async getCountOfFilteredOrders(
		req: GetCountOfFilteredOrdersRequest,
	): Promise<Gen.GetCountOfFilteredOrdersResponse> {
		return this.client.getCountOfFilteredOrders({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get count of all orders with normalized chainId (number)
	 */
	async getCountOfAllOrders(
		req: GetCountOfAllOrdersRequest,
	): Promise<Gen.GetCountOfAllOrdersResponse> {
		return this.client.getCountOfAllOrders({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Get checkout options for sales contract with normalized chainId (number) and bigint tokenId
	 */
	async checkoutOptionsSalesContract(
		req: CheckoutOptionsSalesContractRequest,
	): Promise<Gen.CheckoutOptionsSalesContractResponse> {
		return this.client.checkoutOptionsSalesContract({
			...req,
			chainId: chainIdToString(req.chainId),
			items: req.items.map(transformCheckoutItem),
		});
	}

	/**
	 * Get orders with normalized chainId (number)
	 */
	async getOrders(req: GetOrdersRequest): Promise<Gen.GetOrdersResponse> {
		return this.client.getOrders({
			...req,
			chainId: chainIdToString(req.chainId),
		});
	}

	/**
	 * Execute transaction step (pass-through, no chainId conversion needed)
	 */
	async execute(req: Gen.ExecuteRequest): Promise<Gen.ExecuteResponse> {
		return this.client.execute(req);
	}

	/**
	 * Access the underlying raw client for any methods not wrapped
	 */
	get raw(): Gen.Marketplace {
		return this.client;
	}
}
