/**
 * Wrapped Marketplace Client
 *
 * Wraps the raw Marketplace client with transformation layer.
 * Provides normalized types (number for chainId, bigint for tokenId) to SDK consumers
 * while handling API type conversion (string for chainId).
 */

import type { ContractType } from '@0xsequence/indexer';
import type { Address, ChainId, TokenId } from '../../types/primitives';
import {
	chainIdToString,
	passthrough,
	wrapBothTransform,
	wrapChainId,
	wrapCollectionAddress,
	wrapWithTransform,
} from '../../utils/client-proxy';
import * as Gen from './marketplace.gen';
import {
	toCollectibleOrder,
	toCollectibleOrders,
	toCurrencies,
	toOrder,
	toOrders,
	toSteps,
} from './transforms';
import type { CollectibleOrder, Currency, Order, Step } from './types';

/**
 * SDK-facing CheckoutOptionsItem type with bigint tokenId
 */
export interface CheckoutOptionsItem {
	tokenId: TokenId;
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
 * SDK-facing CreateReq type with bigint tokenId and Address type
 */
export interface CreateReq {
	tokenId: TokenId;
	quantity: bigint;
	expiry: string;
	currencyAddress: Address;
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
 * Response types with normalized Order types (Address instead of string for priceCurrencyAddress)
 *
 * These are fully redefined (not using Omit) to ensure TypeScript's .d.ts generator
 * can create portable type definitions without references to generated types.
 */
export interface GetCollectibleLowestListingResponse {
	order?: Order;
}

export interface GetCollectibleHighestOfferResponse {
	order?: Order;
}

export type GetFloorOrderResponse = Omit<
	Gen.GetFloorOrderResponse,
	'collectible'
> & {
	collectible: CollectibleOrder;
};

export type GetOrdersResponse = Omit<Gen.GetOrdersResponse, 'orders'> & {
	orders: Order[];
};

export type ListCollectibleListingsResponse = Omit<
	Gen.ListListingsForCollectibleResponse,
	'listings'
> & {
	listings: Order[];
};

export type ListCollectibleOffersResponse = Omit<
	Gen.ListOffersForCollectibleResponse,
	'offers'
> & {
	offers: Order[];
};

export type ListOrdersWithCollectiblesResponse = Omit<
	Gen.ListOrdersWithCollectiblesResponse,
	'collectibles'
> & {
	collectibles: CollectibleOrder[];
};

export type ListCollectiblesResponse = Omit<
	Gen.ListCollectiblesResponse,
	'collectibles'
> & {
	collectibles: CollectibleOrder[];
};

export type ListCurrenciesResponse = Omit<
	Gen.ListCurrenciesResponse,
	'currencies'
> & {
	currencies: Currency[];
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
	chainId: ChainId;
	contractType: ContractType;
	listing: CreateReq;
};

export type GenerateOfferTransactionRequest = Omit<
	Gen.GenerateOfferTransactionRequest,
	'chainId' | 'contractType' | 'offer'
> & {
	chainId: ChainId;
	contractType: ContractType;
	offer: CreateReq;
};

/**
 * SDK-facing OrderData type with bigint quantity
 */
export interface OrderData {
	orderId: string;
	quantity: bigint;
	tokenId?: TokenId;
}

export type GenerateSellTransactionRequest = Omit<
	Gen.GenerateSellTransactionRequest,
	'chainId' | 'ordersData'
> & {
	chainId: ChainId;
	ordersData: Array<OrderData>;
};

export type GenerateCancelTransactionRequest = Omit<
	Gen.GenerateCancelTransactionRequest,
	'chainId'
> & {
	chainId: ChainId;
};

export type GenerateBuyTransactionRequest = Omit<
	Gen.GenerateBuyTransactionRequest,
	'chainId' | 'ordersData'
> & {
	chainId: ChainId;
	ordersData: Array<OrderData>;
};

export type GetCollectionDetailRequest = Omit<
	Gen.GetCollectionDetailRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type ListCurrenciesRequest = Omit<
	Gen.ListCurrenciesRequest,
	'chainId'
> & {
	chainId: ChainId;
};

export type GetCollectibleRequest = Omit<
	Gen.GetCollectibleRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type GetLowestPriceListingForCollectibleRequest = Omit<
	Gen.GetLowestPriceListingForCollectibleRequest,
	'chainId' | 'contractAddress' | 'tokenId'
> & {
	chainId: ChainId;
	collectionAddress: Address;
	tokenId: TokenId;
};

export type GetHighestPriceOfferForCollectibleRequest = Omit<
	Gen.GetHighestPriceOfferForCollectibleRequest,
	'chainId' | 'contractAddress' | 'tokenId'
> & {
	chainId: ChainId;
	collectionAddress: Address;
	tokenId: TokenId;
};

export type ListListingsForCollectibleRequest = Omit<
	Gen.ListListingsForCollectibleRequest,
	'chainId' | 'contractAddress' | 'tokenId'
> & {
	chainId: ChainId;
	collectionAddress: Address;
	tokenId: TokenId;
};

export type ListOffersForCollectibleRequest = Omit<
	Gen.ListOffersForCollectibleRequest,
	'chainId' | 'contractAddress' | 'tokenId'
> & {
	chainId: ChainId;
	collectionAddress: Address;
	tokenId: TokenId;
};

export type ListOrdersWithCollectiblesRequest = Omit<
	Gen.ListOrdersWithCollectiblesRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type GetFloorOrderRequest = Omit<
	Gen.GetFloorOrderRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type ListCollectiblesRequest = Omit<
	Gen.ListCollectiblesRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type ListCollectibleActivitiesRequest = Omit<
	Gen.ListCollectibleActivitiesRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type ListCollectionActivitiesRequest = Omit<
	Gen.ListCollectionActivitiesRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type ListPrimarySaleItemsRequest = Omit<
	Gen.ListPrimarySaleItemsRequest,
	'chainId'
> & {
	chainId: ChainId;
};

export type GetCountOfPrimarySaleItemsRequest = Omit<
	Gen.GetCountOfPrimarySaleItemsRequest,
	'chainId'
> & {
	chainId: ChainId;
};

export type CheckoutOptionsMarketplaceRequest = Omit<
	Gen.CheckoutOptionsMarketplaceRequest,
	'chainId' | 'wallet'
> & {
	chainId: ChainId;
} & (
		| { wallet: string; walletAddress?: never }
		| { walletAddress: string; wallet?: never }
	);

export type GetCountOfFilteredCollectiblesRequest = Omit<
	Gen.GetCountOfFilteredCollectiblesRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type GetCountOfAllCollectiblesRequest = Omit<
	Gen.GetCountOfAllCollectiblesRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type GetCountOfListingsForCollectibleRequest = Omit<
	Gen.GetCountOfListingsForCollectibleRequest,
	'chainId' | 'contractAddress' | 'tokenId'
> & {
	chainId: ChainId;
	collectionAddress: Address;
	tokenId: TokenId;
};

export type GetCountOfOffersForCollectibleRequest = Omit<
	Gen.GetCountOfOffersForCollectibleRequest,
	'chainId' | 'contractAddress' | 'tokenId'
> & {
	chainId: ChainId;
	collectionAddress: Address;
	tokenId: TokenId;
};

export type GetCountOfFilteredOrdersRequest = Omit<
	Gen.GetCountOfFilteredOrdersRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type GetCountOfAllOrdersRequest = Omit<
	Gen.GetCountOfAllOrdersRequest,
	'chainId' | 'contractAddress'
> & {
	chainId: ChainId;
	collectionAddress: Address;
};

export type CheckoutOptionsSalesContractRequest = Omit<
	Gen.CheckoutOptionsSalesContractRequest,
	'chainId' | 'items'
> & {
	chainId: ChainId;
	items: Array<CheckoutOptionsItem>; // SDK-facing bigint tokenId
};

export type GetOrdersRequest = Omit<Gen.GetOrdersRequest, 'chainId'> & {
	chainId: ChainId;
};

/**
 * Wrapped Marketplace Client
 *
 * Wraps the raw Marketplace client with methods that accept normalized types (number chainId).
 * Uses proxy utilities to automatically convert chainId from number to string for API calls.
 * Methods are created using wrapper functions to eliminate repetitive conversion code.
 */
export class MarketplaceClient {
	private client: Gen.Marketplace;
	public queryKey: Gen.Marketplace['queryKey'];

	// Transaction generation methods (with custom transformations)
	public readonly generateListingTransaction: (
		req: GenerateListingTransactionRequest,
	) => Promise<GenerateListingTransactionResponse>;
	public readonly generateOfferTransaction: (
		req: GenerateOfferTransactionRequest,
	) => Promise<GenerateOfferTransactionResponse>;
	public readonly generateSellTransaction: (
		req: GenerateSellTransactionRequest,
	) => Promise<GenerateSellTransactionResponse>;
	public readonly generateCancelTransaction: (
		req: GenerateCancelTransactionRequest,
	) => Promise<GenerateCancelTransactionResponse>;
	public readonly generateBuyTransaction: (
		req: GenerateBuyTransactionRequest,
	) => Promise<GenerateBuyTransactionResponse>;

	// Collection and currency methods (chainId only)
	public readonly getCollectionDetail: (
		req: GetCollectionDetailRequest,
	) => Promise<Gen.GetCollectionDetailResponse>;
	public readonly listCurrencies: (
		req: ListCurrenciesRequest,
	) => Promise<ListCurrenciesResponse>;

	// Collectible methods (chainId + optional tokenId)
	public readonly getCollectible: (
		req: GetCollectibleRequest,
	) => Promise<Gen.GetCollectibleResponse>;
	public readonly getLowestPriceListingForCollectible: (
		req: GetLowestPriceListingForCollectibleRequest,
	) => Promise<GetCollectibleLowestListingResponse>;
	public readonly getHighestPriceOfferForCollectible: (
		req: GetHighestPriceOfferForCollectibleRequest,
	) => Promise<GetCollectibleHighestOfferResponse>;
	public readonly listListingsForCollectible: (
		req: ListListingsForCollectibleRequest,
	) => Promise<ListCollectibleListingsResponse>;
	public readonly listOffersForCollectible: (
		req: ListOffersForCollectibleRequest,
	) => Promise<ListCollectibleOffersResponse>;

	// Order methods (chainId only)
	public readonly listOrdersWithCollectibles: (
		req: ListOrdersWithCollectiblesRequest,
	) => Promise<ListOrdersWithCollectiblesResponse>;
	public readonly getFloorOrder: (
		req: GetFloorOrderRequest,
	) => Promise<GetFloorOrderResponse>;
	public readonly getOrders: (
		req: GetOrdersRequest,
	) => Promise<GetOrdersResponse>;

	// List methods (chainId only)
	public readonly listCollectibles: (
		req: ListCollectiblesRequest,
	) => Promise<ListCollectiblesResponse>;
	public readonly listCollectibleActivities: (
		req: ListCollectibleActivitiesRequest,
	) => Promise<Gen.ListCollectibleActivitiesResponse>;
	public readonly listCollectionActivities: (
		req: ListCollectionActivitiesRequest,
	) => Promise<Gen.ListCollectionActivitiesResponse>;
	public readonly listPrimarySaleItems: (
		req: ListPrimarySaleItemsRequest,
	) => Promise<Gen.ListPrimarySaleItemsResponse>;

	// Count methods (chainId + optional tokenId)
	public readonly getCountOfPrimarySaleItems: (
		req: GetCountOfPrimarySaleItemsRequest,
	) => Promise<Gen.GetCountOfPrimarySaleItemsResponse>;
	public readonly getCountOfFilteredCollectibles: (
		req: GetCountOfFilteredCollectiblesRequest,
	) => Promise<Gen.GetCountOfFilteredCollectiblesResponse>;
	public readonly getCountOfAllCollectibles: (
		req: GetCountOfAllCollectiblesRequest,
	) => Promise<Gen.GetCountOfAllCollectiblesResponse>;
	public readonly getCountOfListingsForCollectible: (
		req: GetCountOfListingsForCollectibleRequest,
	) => Promise<Gen.GetCountOfListingsForCollectibleResponse>;
	public readonly getCountOfOffersForCollectible: (
		req: GetCountOfOffersForCollectibleRequest,
	) => Promise<Gen.GetCountOfOffersForCollectibleResponse>;
	public readonly getCountOfFilteredOrders: (
		req: GetCountOfFilteredOrdersRequest,
	) => Promise<Gen.GetCountOfFilteredOrdersResponse>;
	public readonly getCountOfAllOrders: (
		req: GetCountOfAllOrdersRequest,
	) => Promise<Gen.GetCountOfAllOrdersResponse>;

	// Checkout methods (chainId + optional items with bigint tokenId)
	public readonly checkoutOptionsMarketplace: (
		req: CheckoutOptionsMarketplaceRequest,
	) => Promise<Gen.CheckoutOptionsMarketplaceResponse>;
	public readonly checkoutOptionsSalesContract: (
		req: CheckoutOptionsSalesContractRequest,
	) => Promise<Gen.CheckoutOptionsSalesContractResponse>;

	// Passthrough methods (no chainId normalization)
	public readonly execute: (
		req: Gen.ExecuteRequest,
	) => Promise<Gen.ExecuteResponse>;

	constructor(hostname: string, fetch: typeof globalThis.fetch) {
		this.client = new Gen.Marketplace(hostname, fetch);
		this.queryKey = this.client.queryKey;

		// Transaction generation methods (require custom transformations)
		this.generateListingTransaction = wrapBothTransform(
			(req) => this.client.generateListingTransaction(req),
			(req: GenerateListingTransactionRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractType: req.contractType as Gen.ContractType,
				listing: transformCreateReq(req.listing),
			}),
			(res) => ({ ...res, steps: toSteps(res.steps) }),
		);

		this.generateOfferTransaction = wrapBothTransform(
			(req) => this.client.generateOfferTransaction(req),
			(req: GenerateOfferTransactionRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractType: req.contractType as Gen.ContractType,
				offer: transformCreateReq(req.offer),
			}),
			(res) => ({ ...res, steps: toSteps(res.steps) }),
		);

		this.generateSellTransaction = wrapBothTransform(
			(req) => this.client.generateSellTransaction(req),
			(req: GenerateSellTransactionRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				ordersData: req.ordersData.map(transformOrderData),
			}),
			(res) => ({ ...res, steps: toSteps(res.steps) }),
		);

		this.generateCancelTransaction = wrapBothTransform(
			(req) => this.client.generateCancelTransaction(req),
			(req: GenerateCancelTransactionRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
			}),
			(res) => ({ ...res, steps: toSteps(res.steps) }),
		);

		this.generateBuyTransaction = wrapBothTransform(
			(req) => this.client.generateBuyTransaction(req),
			(req: GenerateBuyTransactionRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				ordersData: req.ordersData.map(transformOrderData),
			}),
			(res) => ({ ...res, steps: toSteps(res.steps) }),
		);

		// Collection and currency methods (chainId only)
		this.getCollectionDetail = wrapCollectionAddress((req) =>
			this.client.getCollectionDetail(req),
		);
		this.listCurrencies = wrapBothTransform(
			(req) => this.client.listCurrencies(req),
			(req: ListCurrenciesRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
			}),
			(res: Gen.ListCurrenciesResponse) => ({
				...res,
				currencies: toCurrencies(res.currencies),
			}),
		);

		// Collectible methods (chainId + contractAddress + tokenId passthrough since already bigint)
		this.getCollectible = wrapCollectionAddress((req) =>
			this.client.getCollectible(req),
		);
		this.getLowestPriceListingForCollectible = wrapBothTransform(
			(req) => this.client.getLowestPriceListingForCollectible(req),
			(req: GetLowestPriceListingForCollectibleRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractAddress: req.collectionAddress,
			}),
			(res) => ({
				...res,
				order: res.order ? toOrder(res.order) : undefined,
			}),
		);
		this.getHighestPriceOfferForCollectible = wrapBothTransform(
			(req) => this.client.getHighestPriceOfferForCollectible(req),
			(req: GetHighestPriceOfferForCollectibleRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractAddress: req.collectionAddress,
			}),
			(res) => ({
				...res,
				order: res.order ? toOrder(res.order) : undefined,
			}),
		);
		this.listListingsForCollectible = wrapBothTransform(
			(req) => this.client.listListingsForCollectible(req),
			(req: ListListingsForCollectibleRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractAddress: req.collectionAddress,
			}),
			(res) => ({
				...res,
				listings: toOrders(res.listings),
			}),
		);
		this.listOffersForCollectible = wrapBothTransform(
			(req) => this.client.listOffersForCollectible(req),
			(req: ListOffersForCollectibleRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractAddress: req.collectionAddress,
			}),
			(res) => ({
				...res,
				offers: toOrders(res.offers),
			}),
		);

		// Order methods (chainId + contractAddress)
		this.listOrdersWithCollectibles = wrapBothTransform(
			(req) => this.client.listOrdersWithCollectibles(req),
			(req: ListOrdersWithCollectiblesRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractAddress: req.collectionAddress,
			}),
			(res) => ({
				...res,
				collectibles: toCollectibleOrders(res.collectibles),
			}),
		);
		this.getFloorOrder = wrapBothTransform(
			(req) => this.client.getFloorOrder(req),
			(req: GetFloorOrderRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractAddress: req.collectionAddress,
			}),
			(res) => ({
				...res,
				collectible: toCollectibleOrder(res.collectible),
			}),
		);
		this.getOrders = wrapBothTransform(
			(req) => this.client.getOrders(req),
			(req: GetOrdersRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
			}),
			(res) => ({
				...res,
				orders: toOrders(res.orders),
			}),
		);

		// List methods (chainId + contractAddress)
		this.listCollectibles = wrapBothTransform(
			(req) => this.client.listCollectibles(req),
			(req: ListCollectiblesRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				contractAddress: req.collectionAddress,
			}),
			(res) => ({
				...res,
				collectibles: toCollectibleOrders(res.collectibles),
			}),
		);
		this.listCollectibleActivities = wrapCollectionAddress((req) =>
			this.client.listCollectibleActivities(req),
		);
		this.listCollectionActivities = wrapCollectionAddress((req) =>
			this.client.listCollectionActivities(req),
		);
		this.listPrimarySaleItems = wrapChainId((req) =>
			this.client.listPrimarySaleItems(req),
		);

		// Count methods (chainId + contractAddress + optional tokenId)
		this.getCountOfPrimarySaleItems = wrapChainId((req) =>
			this.client.getCountOfPrimarySaleItems(req),
		);
		this.getCountOfFilteredCollectibles = wrapCollectionAddress((req) =>
			this.client.getCountOfFilteredCollectibles(req),
		);
		this.getCountOfAllCollectibles = wrapCollectionAddress((req) =>
			this.client.getCountOfAllCollectibles(req),
		);
		this.getCountOfListingsForCollectible = wrapCollectionAddress((req) =>
			this.client.getCountOfListingsForCollectible(req),
		);
		this.getCountOfOffersForCollectible = wrapCollectionAddress((req) =>
			this.client.getCountOfOffersForCollectible(req),
		);
		this.getCountOfFilteredOrders = wrapCollectionAddress((req) =>
			this.client.getCountOfFilteredOrders(req),
		);
		this.getCountOfAllOrders = wrapCollectionAddress((req) =>
			this.client.getCountOfAllOrders(req),
		);

		// Checkout methods
		this.checkoutOptionsMarketplace = wrapWithTransform(
			(req) => this.client.checkoutOptionsMarketplace(req),
			(req: CheckoutOptionsMarketplaceRequest) => {
				const wallet =
					'walletAddress' in req && req.walletAddress
						? req.walletAddress
						: 'wallet' in req && req.wallet
							? req.wallet
							: '';

				return {
					...req,
					chainId: chainIdToString(req.chainId),
					wallet,
				};
			},
		);
		this.checkoutOptionsSalesContract = wrapWithTransform(
			(req) => this.client.checkoutOptionsSalesContract(req),
			(req: CheckoutOptionsSalesContractRequest) => ({
				...req,
				chainId: chainIdToString(req.chainId),
				items: req.items.map(transformCheckoutItem),
			}),
		);

		// Passthrough methods
		this.execute = passthrough((req) => this.client.execute(req));
	}

	/**
	 * Access the underlying raw client for any methods not wrapped
	 */
	get raw(): Gen.Marketplace {
		return this.client;
	}
}
