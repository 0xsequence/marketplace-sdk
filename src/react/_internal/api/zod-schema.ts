// generated with https://transform.tools/typescript-to-zod
//
//
import { z } from 'zod';
import {
	CollectibleStatus,
	CollectionStatus,
	ContractType,
	ExecuteType,
	MarketplaceKind,
	OrderSide,
	OrderStatus,
	OrderbookKind,
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

export const executeTypeSchema = z.nativeEnum(ExecuteType);

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
	id: stepTypeSchema,
	data: z.string(),
	to: z.string(),
	value: z.string(),
	signature: signatureSchema.optional(),
	post: postRequestSchema.optional(),
	executeType: executeTypeSchema.optional(),
});
