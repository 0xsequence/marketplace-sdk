// generated with https://transform.tools/typescript-to-zod
//
//
import { z } from 'zod';
import { AddressSchema, CollectableIdSchema } from '../types';
import {
	CollectibleStatus,
	CollectionStatus,
	ContractType,
	MarketplaceKind,
	OrderbookKind,
	OrderSide,
	OrderStatus,
	ProjectStatus,
	PropertyType,
	SortOrder,
	SourceKind,
	StepType,
	TransactionCrypto,
	TransactionNFTCheckoutProvider,
	TransactionOnRampProvider,
	TransactionSwapProvider,
	WalletKind,
} from './marketplace.gen';

export const assetSchema = z.object({
	id: z.number(),
	collectionId: z.number(),
	tokenId: z.string(),
	url: z.string().optional(),
	metadataField: z.string(),
	name: z.string().optional(),
	filesize: z.number().optional(),
	mimeType: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	updatedAt: z.string().optional(),
});

export const sortOrderSchema = z.nativeEnum(SortOrder);

export const propertyTypeSchema = z.nativeEnum(PropertyType);

export const marketplaceKindSchema = z.nativeEnum(MarketplaceKind);

export const orderbookKindSchema = z.nativeEnum(OrderbookKind);

export const sourceKindSchema = z.nativeEnum(SourceKind);

export const orderSideSchema = z.nativeEnum(OrderSide);

export const orderStatusSchema = z.nativeEnum(OrderStatus);

export const contractTypeSchema = z.nativeEnum(ContractType);

export const collectionStatusSchema = z.nativeEnum(CollectionStatus);

export const projectStatusSchema = z.nativeEnum(ProjectStatus);

export const collectibleStatusSchema = z.nativeEnum(CollectibleStatus);

export const walletKindSchema = z.nativeEnum(WalletKind);

export const stepTypeSchema = z.nativeEnum(StepType);

export const transactionCryptoSchema = z.nativeEnum(TransactionCrypto);

export const transactionNFTCheckoutProviderSchema = z.nativeEnum(
	TransactionNFTCheckoutProvider,
);

export const transactionOnRampProviderSchema = z.nativeEnum(
	TransactionOnRampProvider,
);

export const transactionSwapProviderSchema = z.nativeEnum(
	TransactionSwapProvider,
);

export const sortBySchema = z.object({
	column: z.string(),
	order: sortOrderSchema,
});

export const propertyFilterSchema = z.object({
	name: z.string(),
	type: propertyTypeSchema,
	min: z.number().optional(),
	max: z.number().optional(),
	values: z.array(z.any()).optional(),
});

export const collectiblesFilterSchema = z.object({
	includeEmpty: z.boolean(),
	searchText: z.string().optional(),
	properties: z.array(propertyFilterSchema).optional(),
	marketplaces: z.array(marketplaceKindSchema).optional(),
	inAccounts: z.array(z.string()).optional(),
	notInAccounts: z.array(z.string()).optional(),
	ordersCreatedBy: z.array(z.string()).optional(),
	ordersNotCreatedBy: z.array(z.string()).optional(),
});

export const feeBreakdownSchema = z.object({
	kind: z.string(),
	recipientAddress: z.string(),
	bps: z.number(),
});

export const orderFilterSchema = z.object({
	createdBy: z.array(z.string()).optional(),
	marketplace: z.array(marketplaceKindSchema).optional(),
	currencies: z.array(z.string()).optional(),
});

export const collectionLastSyncedSchema = z.object({
	allOrders: z.string(),
	newOrders: z.string(),
});

export const projectSchema = z.object({
	projectId: z.number(),
	chainId: z.number(),
	contractAddress: z.string(),
	status: projectStatusSchema,
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export const collectibleSchema = z.object({
	chainId: z.number(),
	contractAddress: z.string(),
	status: collectibleStatusSchema,
	tokenId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export const currencySchema = z.object({
	chainId: z.number(),
	contractAddress: z.string(),
	name: z.string(),
	symbol: z.string(),
	decimals: z.number(),
	imageUrl: z.string(),
	exchangeRate: z.number(),
	defaultChainCurrency: z.boolean(),
	nativeCurrency: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export const orderDataSchema = z.object({
	orderId: z.string(),
	quantity: z.string(),
});

export const additionalFeeSchema = z.object({
	amount: z.string(),
	receiver: z.string(),
});

export const postRequestSchema = z.object({
	endpoint: z.string(),
	method: z.string(),
	body: z.any(),
});

export const createReqSchema = z.object({
	tokenId: z.string(),
	quantity: z.string(),
	expiry: z.string(),
	currencyAddress: z.string(),
	pricePerToken: z.string(),
});

export const getOrdersInputSchema = z.object({
	contractAddress: z.string(),
	orderId: z.string(),
	marketplace: marketplaceKindSchema,
});

export const domainSchema = z.object({
	name: z.string(),
	version: z.string(),
	chainId: z.number(),
	verifyingContract: z.string(),
});

export const checkoutOptionsMarketplaceOrderSchema = z.object({
	contractAddress: z.string(),
	orderId: z.string(),
	marketplace: marketplaceKindSchema,
});

export const checkoutOptionsItemSchema = z.object({
	tokenId: z.string(),
	quantity: z.string(),
});

export const checkoutOptionsSchema = z.object({
	crypto: transactionCryptoSchema,
	swap: z.array(transactionSwapProviderSchema),
	nftCheckout: z.array(transactionNFTCheckoutProviderSchema),
	onRamp: z.array(transactionOnRampProviderSchema),
});

export const listCurrenciesArgsSchema = z.object({});

export const listCurrenciesReturnSchema = z.object({
	currencies: z.array(currencySchema),
});

export const getCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
});

export const getLowestPriceOfferForCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getHighestPriceOfferForCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getLowestPriceListingForCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getHighestPriceListingForCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getCollectibleLowestOfferArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getCollectibleHighestOfferArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getCollectibleLowestListingArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filters: orderFilterSchema.optional(),
});

export const getCollectibleHighestListingArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const generateBuyTransactionArgsSchema = z.object({
	collectionAddress: z.string(),
	buyer: z.string(),
	marketplace: marketplaceKindSchema,
	ordersData: z.array(orderDataSchema),
	additionalFees: z.array(additionalFeeSchema),
	walletType: walletKindSchema.optional(),
});

export const generateSellTransactionArgsSchema = z.object({
	collectionAddress: z.string(),
	seller: z.string(),
	marketplace: marketplaceKindSchema,
	ordersData: z.array(orderDataSchema),
	additionalFees: z.array(additionalFeeSchema),
	walletType: walletKindSchema.optional(),
});

export const generateListingTransactionArgsSchema = z.object({
	collectionAddress: z.string(),
	owner: z.string(),
	contractType: contractTypeSchema,
	orderbook: orderbookKindSchema,
	listing: createReqSchema,
	walletType: walletKindSchema.optional(),
});

export const generateOfferTransactionArgsSchema = z.object({
	collectionAddress: z.string(),
	maker: z.string(),
	contractType: contractTypeSchema,
	orderbook: orderbookKindSchema,
	offer: createReqSchema,
	walletType: walletKindSchema.optional(),
});

export const getCountOfAllCollectiblesArgsSchema = z.object({
	contractAddress: z.string(),
});

export const getCountOfAllCollectiblesReturnSchema = z.object({
	count: z.number(),
});

export const getCountOfFilteredCollectiblesArgsSchema = z.object({
	side: orderSideSchema,
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
});

export const getCountOfFilteredCollectiblesReturnSchema = z.object({
	count: z.number(),
});

export const getFloorOrderArgsSchema = z.object({
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
});

export const syncOrderReturnSchema = z.object({});

export const syncOrdersReturnSchema = z.object({});

export const checkoutOptionsMarketplaceArgsSchema = z.object({
	wallet: z.string(),
	orders: z.array(checkoutOptionsMarketplaceOrderSchema),
	additionalFee: z.number(),
});

export const checkoutOptionsMarketplaceReturnSchema = z.object({
	options: checkoutOptionsSchema,
});

export const checkoutOptionsSalesContractArgsSchema = z.object({
	wallet: z.string(),
	contractAddress: z.string(),
	collectionAddress: z.string(),
	items: z.array(checkoutOptionsItemSchema),
});

export const checkoutOptionsSalesContractReturnSchema = z.object({
	options: checkoutOptionsSchema,
});

export const countListingsForCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const countListingsForCollectibleReturnSchema = z.object({
	count: z.number(),
});

export const countOffersForCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const countOffersForCollectibleReturnSchema = z.object({
	count: z.number(),
});

export const tokenMetadataSchema = z.object({
	tokenId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	image: z.string().optional(),
	video: z.string().optional(),
	audio: z.string().optional(),
	properties: z.record(z.any()).optional(),
	attributes: z.array(z.record(z.any())),
	image_data: z.string().optional(),
	external_url: z.string().optional(),
	background_color: z.string().optional(),
	animation_url: z.string().optional(),
	decimals: z.number().optional(),
	updatedAt: z.string().optional(),
	assets: z.array(assetSchema).optional(),
});

export const pageSchema = z.object({
	page: z.number(),
	pageSize: z.number(),
	more: z.boolean().optional(),
	sort: z.array(sortBySchema).optional(),
});

export const filterSchema = z.object({
	text: z.string().optional(),
	properties: z.array(propertyFilterSchema).optional(),
});

export const orderSchema = z.object({
	orderId: z.string(),
	marketplace: marketplaceKindSchema,
	side: orderSideSchema,
	status: orderStatusSchema,
	chainId: z.number(),
	collectionContractAddress: z.string(),
	tokenId: z.string(),
	createdBy: z.string(),
	priceAmount: z.string(),
	priceAmountFormatted: z.string(),
	priceAmountNet: z.string(),
	priceAmountNetFormatted: z.string(),
	priceCurrencyAddress: z.string(),
	priceDecimals: z.number(),
	priceUSD: z.number(),
	quantityInitial: z.string(),
	quantityInitialFormatted: z.string(),
	quantityRemaining: z.string(),
	quantityRemainingFormatted: z.string(),
	quantityAvailable: z.string(),
	quantityAvailableFormatted: z.string(),
	quantityDecimals: z.number(),
	feeBps: z.number(),
	feeBreakdown: z.array(feeBreakdownSchema),
	validFrom: z.string(),
	validUntil: z.string(),
	blockNumber: z.number(),
	orderCreatedAt: z.string().optional(),
	orderUpdatedAt: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export const collectibleOrderSchema = z.object({
	metadata: tokenMetadataSchema,
	order: orderSchema.optional(),
});

export const activitySchema = z.object({
	type: z.string(),
	fromAddress: z.string(),
	toAddress: z.string(),
	txHash: z.string(),
	timestamp: z.number(),
	tokenId: z.string(),
	tokenImage: z.string(),
	tokenName: z.string(),
	currency: currencySchema.optional(),
});

export const collectionConfigSchema = z.object({
	lastSynced: z.record(collectionLastSyncedSchema),
	collectiblesSynced: z.string(),
});

export const signatureSchema = z.object({
	domain: domainSchema,
	types: z.any(),
	primaryType: z.string(),
	value: z.any(),
});

export const getCollectibleReturnSchema = z.object({
	metadata: tokenMetadataSchema,
});

export const getLowestPriceOfferForCollectibleReturnSchema = z.object({
	order: orderSchema,
});

export const getHighestPriceOfferForCollectibleReturnSchema = z.object({
	order: orderSchema,
});

export const getLowestPriceListingForCollectibleReturnSchema = z.object({
	order: orderSchema,
});

export const getHighestPriceListingForCollectibleReturnSchema = z.object({
	order: orderSchema,
});

export const listListingsForCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listListingsForCollectibleReturnSchema = z.object({
	listings: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const listOffersForCollectibleArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listOffersForCollectibleReturnSchema = z.object({
	offers: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const getListCollectibleActivitiesArgsSchema = z.object({
	chainId: z.number(),
	collectionAddress: AddressSchema,
	tokenId: CollectableIdSchema.pipe(z.coerce.string()),
	query: pageSchema
		.extend({
			enabled: z.boolean().optional(),
		})
		.optional(),
});

export const getListCollectibleActivitiesReturnSchema = z.object({
	activities: z.array(activitySchema),
	page: pageSchema.optional(),
});

export const getListCollectionActivitiesArgsSchema = z.object({
	chainId: z.number(),
	collectionAddress: AddressSchema,
	query: pageSchema
		.extend({
			enabled: z.boolean().optional(),
		})
		.optional(),
});

export const getListCollectionActivitiesReturnSchema = z.object({
	activities: z.array(activitySchema),
	page: pageSchema.optional(),
});

export const getCollectibleLowestOfferReturnSchema = z.object({
	order: orderSchema.optional(),
});

export const getCollectibleHighestOfferReturnSchema = z.object({
	order: orderSchema.optional(),
});

export const getCollectibleLowestListingReturnSchema = z.object({
	order: orderSchema.optional(),
});

export const getCollectibleHighestListingReturnSchema = z.object({
	order: orderSchema.optional(),
});

export const listCollectibleListingsArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectibleListingsReturnSchema = z.object({
	listings: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const listCollectibleOffersArgsSchema = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectibleOffersReturnSchema = z.object({
	offers: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const listCollectiblesArgsSchema = z.object({
	side: orderSideSchema,
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectiblesReturnSchema = z.object({
	collectibles: z.array(collectibleOrderSchema),
	page: pageSchema.optional(),
});

export const getFloorOrderReturnSchema = z.object({
	collectible: collectibleOrderSchema,
});

export const listCollectiblesWithLowestListingArgsSchema = z.object({
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectiblesWithLowestListingReturnSchema = z.object({
	collectibles: z.array(collectibleOrderSchema),
	page: pageSchema.optional(),
});

export const listCollectiblesWithHighestOfferArgsSchema = z.object({
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectiblesWithHighestOfferReturnSchema = z.object({
	collectibles: z.array(collectibleOrderSchema),
	page: pageSchema.optional(),
});

export const syncOrderArgsSchema = z.object({
	order: orderSchema,
});

export const syncOrdersArgsSchema = z.object({
	orders: z.array(orderSchema),
});

export const getOrdersArgsSchema = z.object({
	input: z.array(getOrdersInputSchema),
	page: pageSchema.optional(),
});

export const getOrdersReturnSchema = z.object({
	orders: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const collectionSchema = z.object({
	status: collectionStatusSchema,
	chainId: z.number(),
	contractAddress: z.string(),
	contractType: contractTypeSchema,
	tokenQuantityDecimals: z.number(),
	config: collectionConfigSchema,
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export const stepSchema = z.object({
	id: z.nativeEnum(StepType),
	data: z.string().optional(),
	to: z.string().optional(),
	value: z.string().optional(),
	price: z.string().optional(),
	signature: signatureSchema.optional(),
	post: postRequestSchema.optional(),
	method: z.string().optional(),
	endpoint: z.string().optional(),
});

export const generateBuyTransactionReturnSchema = z.object({
	steps: z.array(stepSchema),
});

export const generateSellTransactionReturnSchema = z.object({
	steps: z.array(stepSchema),
});

export const generateListingTransactionReturnSchema = z.object({
	steps: z.array(stepSchema),
});

export const generateOfferTransactionReturnSchema = z.object({
	steps: z.array(stepSchema),
});
