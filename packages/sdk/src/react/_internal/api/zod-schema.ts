// generated with https://transform.tools/typescript-to-zod
//
//
import { z } from 'zod';
import { ChainIdSchema, CollectableIdSchema } from '../types';
import { AddressSchema } from '../types';
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
import { ChainId } from '@0xsequence/network';

export const assetSchema: z.ZodObject<{
    id: z.ZodNumber;
    collectionId: z.ZodNumber;
    tokenId: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
    metadataField: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    filesize: z.ZodOptional<z.ZodNumber>;
    mimeType: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip"> = z.object({
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

export const sortOrderSchema: z.ZodNativeEnum<typeof SortOrder> = z.nativeEnum(SortOrder);

export const propertyTypeSchema: z.ZodNativeEnum<typeof PropertyType> = z.nativeEnum(PropertyType);

export const marketplaceKindSchema: z.ZodNativeEnum<typeof MarketplaceKind> = z.nativeEnum(MarketplaceKind);

export const orderbookKindSchema: z.ZodNativeEnum<typeof OrderbookKind> = z.nativeEnum(OrderbookKind);

export const sourceKindSchema: z.ZodNativeEnum<typeof SourceKind> = z.nativeEnum(SourceKind);

export const orderSideSchema: z.ZodNativeEnum<typeof OrderSide> = z.nativeEnum(OrderSide);

export const orderStatusSchema: z.ZodNativeEnum<typeof OrderStatus> = z.nativeEnum(OrderStatus);

export const contractTypeSchema: z.ZodNativeEnum<typeof ContractType> = z.nativeEnum(ContractType);

export const collectionStatusSchema: z.ZodNativeEnum<typeof CollectionStatus> = z.nativeEnum(CollectionStatus);

export const projectStatusSchema: z.ZodNativeEnum<typeof ProjectStatus> = z.nativeEnum(ProjectStatus);

export const collectibleStatusSchema: z.ZodNativeEnum<typeof CollectibleStatus> = z.nativeEnum(CollectibleStatus);

export const walletKindSchema: z.ZodNativeEnum<typeof WalletKind> = z.nativeEnum(WalletKind);

export const stepTypeSchema: z.ZodNativeEnum<typeof StepType> = z.nativeEnum(StepType);

export const transactionCryptoSchema: z.ZodNativeEnum<typeof TransactionCrypto> = z.nativeEnum(TransactionCrypto);

export const transactionNFTCheckoutProviderSchema: z.ZodNativeEnum<typeof TransactionNFTCheckoutProvider> = z.nativeEnum(
	TransactionNFTCheckoutProvider,
);

export const transactionOnRampProviderSchema: z.ZodNativeEnum<typeof TransactionOnRampProvider> = z.nativeEnum(
	TransactionOnRampProvider,
);

export const transactionSwapProviderSchema: z.ZodNativeEnum<typeof TransactionSwapProvider> = z.nativeEnum(
	TransactionSwapProvider,
);

export const executeTypeSchema: z.ZodNativeEnum<typeof ExecuteType> = z.nativeEnum(ExecuteType);

export const sortBySchema: z.ZodObject<{
    column: z.ZodString;
    order: z.ZodNativeEnum<typeof SortOrder>;
}, "strip"> = z.object({
	column: z.string(),
	order: sortOrderSchema,
});

export const propertyFilterSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodNativeEnum<typeof PropertyType>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    values: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip"> = z.object({
	name: z.string(),
	type: propertyTypeSchema,
	min: z.number().optional(),
	max: z.number().optional(),
	values: z.array(z.any()).optional(),
});

export const collectiblesFilterSchema: z.ZodObject<{
    includeEmpty: z.ZodBoolean;
    searchText: z.ZodOptional<z.ZodString>;
    properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodNativeEnum<typeof PropertyType>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        values: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: PropertyType;
        name: string;
        values?: any[] | undefined;
        min?: number | undefined;
        max?: number | undefined;
    }, {
        type: PropertyType;
        name: string;
        values?: any[] | undefined;
        min?: number | undefined;
        max?: number | undefined;
    }>, "many">>;
    marketplaces: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
    inAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    notInAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    ordersCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    ordersNotCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip"> = z.object({
	includeEmpty: z.boolean(),
	searchText: z.string().optional(),
	properties: z.array(propertyFilterSchema).optional(),
	marketplaces: z.array(marketplaceKindSchema).optional(),
	inAccounts: z.array(z.string()).optional(),
	notInAccounts: z.array(z.string()).optional(),
	ordersCreatedBy: z.array(z.string()).optional(),
	ordersNotCreatedBy: z.array(z.string()).optional(),
});

export const feeBreakdownSchema: z.ZodObject<{
    kind: z.ZodString;
    recipientAddress: z.ZodString;
    bps: z.ZodNumber;
}, "strip"> = z.object({
	kind: z.string(),
	recipientAddress: z.string(),
	bps: z.number(),
});

export const orderFilterSchema: z.ZodObject<{
    createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
    currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip"> = z.object({
	createdBy: z.array(z.string()).optional(),
	marketplace: z.array(marketplaceKindSchema).optional(),
	currencies: z.array(z.string()).optional(),
});

export const collectionLastSyncedSchema: z.ZodObject<{
    allOrders: z.ZodString;
    newOrders: z.ZodString;
}, "strip"> = z.object({
	allOrders: z.string(),
	newOrders: z.string(),
});

export const projectSchema: z.ZodObject<{
    projectId: z.ZodNumber;
    chainId: z.ZodNumber;
    contractAddress: z.ZodString;
    status: z.ZodNativeEnum<typeof ProjectStatus>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deletedAt: z.ZodOptional<z.ZodString>;
}, "strip"> = z.object({
	projectId: z.number(),
	chainId: z.number(),
	contractAddress: z.string(),
	status: projectStatusSchema,
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export const collectibleSchema: z.ZodObject<{
    chainId: z.ZodNumber;
    contractAddress: z.ZodString;
    status: z.ZodNativeEnum<typeof CollectibleStatus>;
    tokenId: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deletedAt: z.ZodOptional<z.ZodString>;
}, "strip"> = z.object({
	chainId: z.number(),
	contractAddress: z.string(),
	status: collectibleStatusSchema,
	tokenId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	deletedAt: z.string().optional(),
});

export const currencySchema: z.ZodObject<{
    chainId: z.ZodNumber;
    contractAddress: z.ZodString;
    name: z.ZodString;
    symbol: z.ZodString;
    decimals: z.ZodNumber;
    imageUrl: z.ZodString;
    exchangeRate: z.ZodNumber;
    defaultChainCurrency: z.ZodBoolean;
    nativeCurrency: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deletedAt: z.ZodOptional<z.ZodString>;
}, "strip"> = z.object({
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

export const orderDataSchema: z.ZodObject<{
    orderId: z.ZodString;
    quantity: z.ZodString;
}, "strip"> = z.object({
	orderId: z.string(),
	quantity: z.string(),
});

export const additionalFeeSchema: z.ZodObject<{
    amount: z.ZodString;
    receiver: z.ZodString;
}, "strip"> = z.object({
	amount: z.string(),
	receiver: z.string(),
});

export const postRequestSchema: z.ZodObject<{
    endpoint: z.ZodString;
    method: z.ZodString;
    body: z.ZodAny;
}, "strip"> = z.object({
	endpoint: z.string(),
	method: z.string(),
	body: z.any(),
});

export const createReqSchema: z.ZodObject<{
    tokenId: z.ZodString;
    quantity: z.ZodString;
    expiry: z.ZodString;
    currencyAddress: z.ZodString;
    pricePerToken: z.ZodString;
}, "strip"> = z.object({
	tokenId: z.string(),
	quantity: z.string(),
	expiry: z.string(),
	currencyAddress: z.string(),
	pricePerToken: z.string(),
});

export const getOrdersInputSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    orderId: z.ZodString;
    marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	orderId: z.string(),
	marketplace: marketplaceKindSchema,
});

export const domainSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    chainId: z.ZodNumber;
    verifyingContract: z.ZodString;
}, "strip"> = z.object({
	name: z.string(),
	version: z.string(),
	chainId: z.number(),
	verifyingContract: z.string(),
});

export const checkoutOptionsMarketplaceOrderSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    orderId: z.ZodString;
    marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	orderId: z.string(),
	marketplace: marketplaceKindSchema,
});

export const checkoutOptionsItemSchema: z.ZodObject<{
    tokenId: z.ZodString;
    quantity: z.ZodString;
}, "strip"> = z.object({
	tokenId: z.string(),
	quantity: z.string(),
});

export const checkoutOptionsSchema: z.ZodObject<{
    crypto: z.ZodNativeEnum<typeof TransactionCrypto>;
    swap: z.ZodArray<z.ZodNativeEnum<typeof TransactionSwapProvider>, "many">;
    nftCheckout: z.ZodArray<z.ZodNativeEnum<typeof TransactionNFTCheckoutProvider>, "many">;
    onRamp: z.ZodArray<z.ZodNativeEnum<typeof TransactionOnRampProvider>, "many">;
}, "strip"> = z.object({
	crypto: transactionCryptoSchema,
	swap: z.array(transactionSwapProviderSchema),
	nftCheckout: z.array(transactionNFTCheckoutProviderSchema),
	onRamp: z.array(transactionOnRampProviderSchema),
});

export const listCurrenciesArgsSchema: z.ZodObject<{}, "strip"> = z.object({});

export const listCurrenciesReturnSchema: z.ZodObject<{
    currencies: z.ZodArray<z.ZodObject<{
        chainId: z.ZodNumber;
        contractAddress: z.ZodString;
        name: z.ZodString;
        symbol: z.ZodString;
        decimals: z.ZodNumber;
        imageUrl: z.ZodString;
        exchangeRate: z.ZodNumber;
        defaultChainCurrency: z.ZodBoolean;
        nativeCurrency: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        name: string;
        nativeCurrency: boolean;
        chainId: number;
        contractAddress: string;
        decimals: number;
        updatedAt: string;
        createdAt: string;
        imageUrl: string;
        exchangeRate: number;
        defaultChainCurrency: boolean;
        deletedAt?: string | undefined;
    }, {
        symbol: string;
        name: string;
        nativeCurrency: boolean;
        chainId: number;
        contractAddress: string;
        decimals: number;
        updatedAt: string;
        createdAt: string;
        imageUrl: string;
        exchangeRate: number;
        defaultChainCurrency: boolean;
        deletedAt?: string | undefined;
    }>, "many">;
}, "strip"> = z.object({
	currencies: z.array(currencySchema),
});

export const getCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
});

export const getLowestPriceOfferForCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getHighestPriceOfferForCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getLowestPriceListingForCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getHighestPriceListingForCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getCollectibleLowestOfferArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getCollectibleHighestOfferArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const getCollectibleLowestListingArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filters: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filters: orderFilterSchema.optional(),
});

export const getCollectibleHighestListingArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const generateBuyTransactionArgsSchema: z.ZodObject<{
    collectionAddress: z.ZodString;
    buyer: z.ZodString;
    marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
    ordersData: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        quantity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        quantity: string;
    }, {
        orderId: string;
        quantity: string;
    }>, "many">;
    additionalFees: z.ZodArray<z.ZodObject<{
        amount: z.ZodString;
        receiver: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        receiver: string;
        amount: string;
    }, {
        receiver: string;
        amount: string;
    }>, "many">;
    walletType: z.ZodOptional<z.ZodNativeEnum<typeof WalletKind>>;
}, "strip"> = z.object({
	collectionAddress: z.string(),
	buyer: z.string(),
	marketplace: marketplaceKindSchema,
	ordersData: z.array(orderDataSchema),
	additionalFees: z.array(additionalFeeSchema),
	walletType: walletKindSchema.optional(),
});

export const generateSellTransactionArgsSchema: z.ZodObject<{
    collectionAddress: z.ZodString;
    seller: z.ZodString;
    marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
    ordersData: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        quantity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        quantity: string;
    }, {
        orderId: string;
        quantity: string;
    }>, "many">;
    additionalFees: z.ZodArray<z.ZodObject<{
        amount: z.ZodString;
        receiver: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        receiver: string;
        amount: string;
    }, {
        receiver: string;
        amount: string;
    }>, "many">;
    walletType: z.ZodOptional<z.ZodNativeEnum<typeof WalletKind>>;
}, "strip"> = z.object({
	collectionAddress: z.string(),
	seller: z.string(),
	marketplace: marketplaceKindSchema,
	ordersData: z.array(orderDataSchema),
	additionalFees: z.array(additionalFeeSchema),
	walletType: walletKindSchema.optional(),
});

export const generateListingTransactionArgsSchema: z.ZodObject<{
    collectionAddress: z.ZodString;
    owner: z.ZodString;
    contractType: z.ZodNativeEnum<typeof ContractType>;
    orderbook: z.ZodNativeEnum<typeof OrderbookKind>;
    listing: z.ZodObject<{
        tokenId: z.ZodString;
        quantity: z.ZodString;
        expiry: z.ZodString;
        currencyAddress: z.ZodString;
        pricePerToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        quantity: string;
        tokenId: string;
        pricePerToken: string;
        expiry: string;
        currencyAddress: string;
    }, {
        quantity: string;
        tokenId: string;
        pricePerToken: string;
        expiry: string;
        currencyAddress: string;
    }>;
    walletType: z.ZodOptional<z.ZodNativeEnum<typeof WalletKind>>;
}, "strip"> = z.object({
	collectionAddress: z.string(),
	owner: z.string(),
	contractType: contractTypeSchema,
	orderbook: orderbookKindSchema,
	listing: createReqSchema,
	walletType: walletKindSchema.optional(),
});

export const generateOfferTransactionArgsSchema: z.ZodObject<{
    collectionAddress: z.ZodString;
    maker: z.ZodString;
    contractType: z.ZodNativeEnum<typeof ContractType>;
    orderbook: z.ZodNativeEnum<typeof OrderbookKind>;
    offer: z.ZodObject<{
        tokenId: z.ZodString;
        quantity: z.ZodString;
        expiry: z.ZodString;
        currencyAddress: z.ZodString;
        pricePerToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        quantity: string;
        tokenId: string;
        pricePerToken: string;
        expiry: string;
        currencyAddress: string;
    }, {
        quantity: string;
        tokenId: string;
        pricePerToken: string;
        expiry: string;
        currencyAddress: string;
    }>;
    walletType: z.ZodOptional<z.ZodNativeEnum<typeof WalletKind>>;
}, "strip"> = z.object({
	collectionAddress: z.string(),
	maker: z.string(),
	contractType: contractTypeSchema,
	orderbook: orderbookKindSchema,
	offer: createReqSchema,
	walletType: walletKindSchema.optional(),
});

export const executeArgsSchema: z.ZodObject<{
    signature: z.ZodString;
    executeType: z.ZodNativeEnum<typeof ExecuteType>;
    body: z.ZodAny;
}, "strip"> = z.object({
	signature: z.string(),
	executeType: executeTypeSchema,
	body: z.any(),
});

export const executeReturnSchema: z.ZodObject<{
    orderId: z.ZodString;
}, "strip"> = z.object({
	orderId: z.string(),
});

export const getCountOfAllCollectiblesArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
}, "strip"> = z.object({
	contractAddress: z.string(),
});

export const getCountOfAllCollectiblesReturnSchema: z.ZodObject<{
    count: z.ZodNumber;
}, "strip"> = z.object({
	count: z.number(),
});

export const getCountOfFilteredCollectiblesArgsSchema: z.ZodObject<{
    side: z.ZodNativeEnum<typeof OrderSide>;
    contractAddress: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        includeEmpty: z.ZodBoolean;
        searchText: z.ZodOptional<z.ZodString>;
        properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodNativeEnum<typeof PropertyType>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            values: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }>, "many">>;
        marketplaces: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        inAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        notInAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersNotCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	side: orderSideSchema,
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
});

export const getCountOfFilteredCollectiblesReturnSchema: z.ZodObject<{
    count: z.ZodNumber;
}, "strip"> = z.object({
	count: z.number(),
});

export const getFloorOrderArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        includeEmpty: z.ZodBoolean;
        searchText: z.ZodOptional<z.ZodString>;
        properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodNativeEnum<typeof PropertyType>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            values: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }>, "many">>;
        marketplaces: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        inAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        notInAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersNotCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
});

export const syncOrderReturnSchema: z.ZodObject<{}, "strip"> = z.object({});

export const syncOrdersReturnSchema: z.ZodObject<{}, "strip"> = z.object({});

export const checkoutOptionsMarketplaceArgsSchema: z.ZodObject<{
    wallet: z.ZodString;
    orders: z.ZodArray<z.ZodObject<{
        contractAddress: z.ZodString;
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        contractAddress: string;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        contractAddress: string;
    }>, "many">;
    additionalFee: z.ZodNumber;
}, "strip"> = z.object({
	wallet: z.string(),
	orders: z.array(checkoutOptionsMarketplaceOrderSchema),
	additionalFee: z.number(),
});

export const checkoutOptionsMarketplaceReturnSchema: z.ZodObject<{
    options: z.ZodObject<{
        crypto: z.ZodNativeEnum<typeof TransactionCrypto>;
        swap: z.ZodArray<z.ZodNativeEnum<typeof TransactionSwapProvider>, "many">;
        nftCheckout: z.ZodArray<z.ZodNativeEnum<typeof TransactionNFTCheckoutProvider>, "many">;
        onRamp: z.ZodArray<z.ZodNativeEnum<typeof TransactionOnRampProvider>, "many">;
    }, "strip", z.ZodTypeAny, {
        crypto: TransactionCrypto;
        swap: TransactionSwapProvider[];
        nftCheckout: TransactionNFTCheckoutProvider[];
        onRamp: TransactionOnRampProvider[];
    }, {
        crypto: TransactionCrypto;
        swap: TransactionSwapProvider[];
        nftCheckout: TransactionNFTCheckoutProvider[];
        onRamp: TransactionOnRampProvider[];
    }>;
}, "strip"> = z.object({
	options: checkoutOptionsSchema,
});

export const checkoutOptionsSalesContractArgsSchema: z.ZodObject<{
    wallet: z.ZodString;
    contractAddress: z.ZodString;
    collectionAddress: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        tokenId: z.ZodString;
        quantity: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        quantity: string;
        tokenId: string;
    }, {
        quantity: string;
        tokenId: string;
    }>, "many">;
}, "strip"> = z.object({
	wallet: z.string(),
	contractAddress: z.string(),
	collectionAddress: z.string(),
	items: z.array(checkoutOptionsItemSchema),
});

export const checkoutOptionsSalesContractReturnSchema: z.ZodObject<{
    options: z.ZodObject<{
        crypto: z.ZodNativeEnum<typeof TransactionCrypto>;
        swap: z.ZodArray<z.ZodNativeEnum<typeof TransactionSwapProvider>, "many">;
        nftCheckout: z.ZodArray<z.ZodNativeEnum<typeof TransactionNFTCheckoutProvider>, "many">;
        onRamp: z.ZodArray<z.ZodNativeEnum<typeof TransactionOnRampProvider>, "many">;
    }, "strip", z.ZodTypeAny, {
        crypto: TransactionCrypto;
        swap: TransactionSwapProvider[];
        nftCheckout: TransactionNFTCheckoutProvider[];
        onRamp: TransactionOnRampProvider[];
    }, {
        crypto: TransactionCrypto;
        swap: TransactionSwapProvider[];
        nftCheckout: TransactionNFTCheckoutProvider[];
        onRamp: TransactionOnRampProvider[];
    }>;
}, "strip"> = z.object({
	options: checkoutOptionsSchema,
});

export const countListingsForCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const countListingsForCollectibleReturnSchema: z.ZodObject<{
    count: z.ZodNumber;
}, "strip"> = z.object({
	count: z.number(),
});

export const countOffersForCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
});

export const countOffersForCollectibleReturnSchema: z.ZodObject<{
    count: z.ZodNumber;
}, "strip"> = z.object({
	count: z.number(),
});

export const tokenMetadataSchema: z.ZodObject<{
    tokenId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    video: z.ZodOptional<z.ZodString>;
    audio: z.ZodOptional<z.ZodString>;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    attributes: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, "many">;
    image_data: z.ZodOptional<z.ZodString>;
    external_url: z.ZodOptional<z.ZodString>;
    background_color: z.ZodOptional<z.ZodString>;
    animation_url: z.ZodOptional<z.ZodString>;
    decimals: z.ZodOptional<z.ZodNumber>;
    updatedAt: z.ZodOptional<z.ZodString>;
    assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        collectionId: z.ZodNumber;
        tokenId: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        metadataField: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        filesize: z.ZodOptional<z.ZodNumber>;
        mimeType: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        updatedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: number;
        tokenId: string;
        collectionId: number;
        metadataField: string;
        name?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        url?: string | undefined;
        filesize?: number | undefined;
        mimeType?: string | undefined;
        updatedAt?: string | undefined;
    }, {
        id: number;
        tokenId: string;
        collectionId: number;
        metadataField: string;
        name?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        url?: string | undefined;
        filesize?: number | undefined;
        mimeType?: string | undefined;
        updatedAt?: string | undefined;
    }>, "many">>;
}, "strip"> = z.object({
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

export const pageSchema: z.ZodObject<{
    page: z.ZodNumber;
    pageSize: z.ZodNumber;
    more: z.ZodOptional<z.ZodBoolean>;
    sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
        column: z.ZodString;
        order: z.ZodNativeEnum<typeof SortOrder>;
    }, "strip", z.ZodTypeAny, {
        order: SortOrder;
        column: string;
    }, {
        order: SortOrder;
        column: string;
    }>, "many">>;
}, "strip"> = z.object({
	page: z.number(),
	pageSize: z.number(),
	more: z.boolean().optional(),
	sort: z.array(sortBySchema).optional(),
});

export const filterSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodString>;
    properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodNativeEnum<typeof PropertyType>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        values: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: PropertyType;
        name: string;
        values?: any[] | undefined;
        min?: number | undefined;
        max?: number | undefined;
    }, {
        type: PropertyType;
        name: string;
        values?: any[] | undefined;
        min?: number | undefined;
        max?: number | undefined;
    }>, "many">>;
}, "strip"> = z.object({
	text: z.string().optional(),
	properties: z.array(propertyFilterSchema).optional(),
});

export const orderSchema: z.ZodObject<{
    orderId: z.ZodString;
    marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
    side: z.ZodNativeEnum<typeof OrderSide>;
    status: z.ZodNativeEnum<typeof OrderStatus>;
    chainId: z.ZodNumber;
    collectionContractAddress: z.ZodString;
    tokenId: z.ZodString;
    createdBy: z.ZodString;
    priceAmount: z.ZodString;
    priceAmountFormatted: z.ZodString;
    priceAmountNet: z.ZodString;
    priceAmountNetFormatted: z.ZodString;
    priceCurrencyAddress: z.ZodString;
    priceDecimals: z.ZodNumber;
    priceUSD: z.ZodNumber;
    quantityInitial: z.ZodString;
    quantityInitialFormatted: z.ZodString;
    quantityRemaining: z.ZodString;
    quantityRemainingFormatted: z.ZodString;
    quantityAvailable: z.ZodString;
    quantityAvailableFormatted: z.ZodString;
    quantityDecimals: z.ZodNumber;
    feeBps: z.ZodNumber;
    feeBreakdown: z.ZodArray<z.ZodObject<{
        kind: z.ZodString;
        recipientAddress: z.ZodString;
        bps: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: string;
        recipientAddress: string;
        bps: number;
    }, {
        kind: string;
        recipientAddress: string;
        bps: number;
    }>, "many">;
    validFrom: z.ZodString;
    validUntil: z.ZodString;
    blockNumber: z.ZodNumber;
    orderCreatedAt: z.ZodOptional<z.ZodString>;
    orderUpdatedAt: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deletedAt: z.ZodOptional<z.ZodString>;
}, "strip"> = z.object({
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

export const collectibleOrderSchema: z.ZodObject<{
    metadata: z.ZodObject<{
        tokenId: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        video: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        attributes: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, "many">;
        image_data: z.ZodOptional<z.ZodString>;
        external_url: z.ZodOptional<z.ZodString>;
        background_color: z.ZodOptional<z.ZodString>;
        animation_url: z.ZodOptional<z.ZodString>;
        decimals: z.ZodOptional<z.ZodNumber>;
        updatedAt: z.ZodOptional<z.ZodString>;
        assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            collectionId: z.ZodNumber;
            tokenId: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            metadataField: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            filesize: z.ZodOptional<z.ZodNumber>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: number;
            tokenId: string;
            collectionId: number;
            metadataField: string;
            name?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
            filesize?: number | undefined;
            mimeType?: string | undefined;
            updatedAt?: string | undefined;
        }, {
            id: number;
            tokenId: string;
            collectionId: number;
            metadataField: string;
            name?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
            filesize?: number | undefined;
            mimeType?: string | undefined;
            updatedAt?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        tokenId: string;
        attributes: Record<string, any>[];
        description?: string | undefined;
        decimals?: number | undefined;
        audio?: string | undefined;
        video?: string | undefined;
        image?: string | undefined;
        updatedAt?: string | undefined;
        properties?: Record<string, any> | undefined;
        image_data?: string | undefined;
        external_url?: string | undefined;
        background_color?: string | undefined;
        animation_url?: string | undefined;
        assets?: {
            id: number;
            tokenId: string;
            collectionId: number;
            metadataField: string;
            name?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
            filesize?: number | undefined;
            mimeType?: string | undefined;
            updatedAt?: string | undefined;
        }[] | undefined;
    }, {
        name: string;
        tokenId: string;
        attributes: Record<string, any>[];
        description?: string | undefined;
        decimals?: number | undefined;
        audio?: string | undefined;
        video?: string | undefined;
        image?: string | undefined;
        updatedAt?: string | undefined;
        properties?: Record<string, any> | undefined;
        image_data?: string | undefined;
        external_url?: string | undefined;
        background_color?: string | undefined;
        animation_url?: string | undefined;
        assets?: {
            id: number;
            tokenId: string;
            collectionId: number;
            metadataField: string;
            name?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
            filesize?: number | undefined;
            mimeType?: string | undefined;
            updatedAt?: string | undefined;
        }[] | undefined;
    }>;
    order: z.ZodOptional<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>>;
}, "strip"> = z.object({
	metadata: tokenMetadataSchema,
	order: orderSchema.optional(),
});

export const activitySchema: z.ZodObject<{
    type: z.ZodString;
    fromAddress: z.ZodString;
    toAddress: z.ZodString;
    txHash: z.ZodString;
    timestamp: z.ZodNumber;
    tokenId: z.ZodString;
    tokenImage: z.ZodString;
    tokenName: z.ZodString;
    currency: z.ZodOptional<z.ZodObject<{
        chainId: z.ZodNumber;
        contractAddress: z.ZodString;
        name: z.ZodString;
        symbol: z.ZodString;
        decimals: z.ZodNumber;
        imageUrl: z.ZodString;
        exchangeRate: z.ZodNumber;
        defaultChainCurrency: z.ZodBoolean;
        nativeCurrency: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        name: string;
        nativeCurrency: boolean;
        chainId: number;
        contractAddress: string;
        decimals: number;
        updatedAt: string;
        createdAt: string;
        imageUrl: string;
        exchangeRate: number;
        defaultChainCurrency: boolean;
        deletedAt?: string | undefined;
    }, {
        symbol: string;
        name: string;
        nativeCurrency: boolean;
        chainId: number;
        contractAddress: string;
        decimals: number;
        updatedAt: string;
        createdAt: string;
        imageUrl: string;
        exchangeRate: number;
        defaultChainCurrency: boolean;
        deletedAt?: string | undefined;
    }>>;
}, "strip"> = z.object({
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

export const collectionConfigSchema: z.ZodObject<{
    lastSynced: z.ZodRecord<z.ZodString, z.ZodObject<{
        allOrders: z.ZodString;
        newOrders: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        allOrders: string;
        newOrders: string;
    }, {
        allOrders: string;
        newOrders: string;
    }>>;
    collectiblesSynced: z.ZodString;
}, "strip"> = z.object({
	lastSynced: z.record(collectionLastSyncedSchema),
	collectiblesSynced: z.string(),
});

export const signatureSchema: z.ZodObject<{
    domain: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        chainId: z.ZodNumber;
        verifyingContract: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        chainId: number;
        version: string;
        verifyingContract: string;
    }, {
        name: string;
        chainId: number;
        version: string;
        verifyingContract: string;
    }>;
    types: z.ZodAny;
    primaryType: z.ZodString;
    value: z.ZodAny;
}, "strip"> = z.object({
	domain: domainSchema,
	types: z.any(),
	primaryType: z.string(),
	value: z.any(),
});

export const getCollectibleReturnSchema: z.ZodObject<{
    metadata: z.ZodObject<{
        tokenId: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        video: z.ZodOptional<z.ZodString>;
        audio: z.ZodOptional<z.ZodString>;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        attributes: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, "many">;
        image_data: z.ZodOptional<z.ZodString>;
        external_url: z.ZodOptional<z.ZodString>;
        background_color: z.ZodOptional<z.ZodString>;
        animation_url: z.ZodOptional<z.ZodString>;
        decimals: z.ZodOptional<z.ZodNumber>;
        updatedAt: z.ZodOptional<z.ZodString>;
        assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            collectionId: z.ZodNumber;
            tokenId: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            metadataField: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            filesize: z.ZodOptional<z.ZodNumber>;
            mimeType: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: number;
            tokenId: string;
            collectionId: number;
            metadataField: string;
            name?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
            filesize?: number | undefined;
            mimeType?: string | undefined;
            updatedAt?: string | undefined;
        }, {
            id: number;
            tokenId: string;
            collectionId: number;
            metadataField: string;
            name?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
            filesize?: number | undefined;
            mimeType?: string | undefined;
            updatedAt?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        tokenId: string;
        attributes: Record<string, any>[];
        description?: string | undefined;
        decimals?: number | undefined;
        audio?: string | undefined;
        video?: string | undefined;
        image?: string | undefined;
        updatedAt?: string | undefined;
        properties?: Record<string, any> | undefined;
        image_data?: string | undefined;
        external_url?: string | undefined;
        background_color?: string | undefined;
        animation_url?: string | undefined;
        assets?: {
            id: number;
            tokenId: string;
            collectionId: number;
            metadataField: string;
            name?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
            filesize?: number | undefined;
            mimeType?: string | undefined;
            updatedAt?: string | undefined;
        }[] | undefined;
    }, {
        name: string;
        tokenId: string;
        attributes: Record<string, any>[];
        description?: string | undefined;
        decimals?: number | undefined;
        audio?: string | undefined;
        video?: string | undefined;
        image?: string | undefined;
        updatedAt?: string | undefined;
        properties?: Record<string, any> | undefined;
        image_data?: string | undefined;
        external_url?: string | undefined;
        background_color?: string | undefined;
        animation_url?: string | undefined;
        assets?: {
            id: number;
            tokenId: string;
            collectionId: number;
            metadataField: string;
            name?: string | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
            filesize?: number | undefined;
            mimeType?: string | undefined;
            updatedAt?: string | undefined;
        }[] | undefined;
    }>;
}, "strip"> = z.object({
	metadata: tokenMetadataSchema,
});

export const getLowestPriceOfferForCollectibleReturnSchema: z.ZodObject<{
    order: z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>;
}, "strip"> = z.object({
	order: orderSchema,
});

export const getHighestPriceOfferForCollectibleReturnSchema: z.ZodObject<{
    order: z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>;
}, "strip"> = z.object({
	order: orderSchema,
});

export const getLowestPriceListingForCollectibleReturnSchema: z.ZodObject<{
    order: z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>;
}, "strip"> = z.object({
	order: orderSchema,
});

export const getHighestPriceListingForCollectibleReturnSchema: z.ZodObject<{
    order: z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>;
}, "strip"> = z.object({
	order: orderSchema,
});

export const listListingsForCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listListingsForCollectibleReturnSchema: z.ZodObject<{
    listings: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	listings: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const listOffersForCollectibleArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listOffersForCollectibleReturnSchema: z.ZodObject<{
    offers: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	offers: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const getListCollectibleActivitiesArgsSchema: z.ZodObject<{
    chainId: z.ZodPipeline<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, z.ZodString>;
    collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
    tokenId: z.ZodPipeline<z.ZodUnion<[z.ZodString, z.ZodNumber]>, z.ZodString>;
    query: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, {
        enabled: z.ZodOptional<z.ZodBoolean>;
    }>, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        enabled?: boolean | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        enabled?: boolean | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	tokenId: CollectableIdSchema.pipe(z.coerce.string()),
	query: pageSchema
		.extend({
			enabled: z.boolean().optional(),
		})
		.optional(),
});

export const getListCollectibleActivitiesReturnSchema: z.ZodObject<{
    activities: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        fromAddress: z.ZodString;
        toAddress: z.ZodString;
        txHash: z.ZodString;
        timestamp: z.ZodNumber;
        tokenId: z.ZodString;
        tokenImage: z.ZodString;
        tokenName: z.ZodString;
        currency: z.ZodOptional<z.ZodObject<{
            chainId: z.ZodNumber;
            contractAddress: z.ZodString;
            name: z.ZodString;
            symbol: z.ZodString;
            decimals: z.ZodNumber;
            imageUrl: z.ZodString;
            exchangeRate: z.ZodNumber;
            defaultChainCurrency: z.ZodBoolean;
            nativeCurrency: z.ZodBoolean;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            name: string;
            nativeCurrency: boolean;
            chainId: number;
            contractAddress: string;
            decimals: number;
            updatedAt: string;
            createdAt: string;
            imageUrl: string;
            exchangeRate: number;
            defaultChainCurrency: boolean;
            deletedAt?: string | undefined;
        }, {
            symbol: string;
            name: string;
            nativeCurrency: boolean;
            chainId: number;
            contractAddress: string;
            decimals: number;
            updatedAt: string;
            createdAt: string;
            imageUrl: string;
            exchangeRate: number;
            defaultChainCurrency: boolean;
            deletedAt?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        timestamp: number;
        tokenId: string;
        fromAddress: string;
        toAddress: string;
        txHash: string;
        tokenImage: string;
        tokenName: string;
        currency?: {
            symbol: string;
            name: string;
            nativeCurrency: boolean;
            chainId: number;
            contractAddress: string;
            decimals: number;
            updatedAt: string;
            createdAt: string;
            imageUrl: string;
            exchangeRate: number;
            defaultChainCurrency: boolean;
            deletedAt?: string | undefined;
        } | undefined;
    }, {
        type: string;
        timestamp: number;
        tokenId: string;
        fromAddress: string;
        toAddress: string;
        txHash: string;
        tokenImage: string;
        tokenName: string;
        currency?: {
            symbol: string;
            name: string;
            nativeCurrency: boolean;
            chainId: number;
            contractAddress: string;
            decimals: number;
            updatedAt: string;
            createdAt: string;
            imageUrl: string;
            exchangeRate: number;
            defaultChainCurrency: boolean;
            deletedAt?: string | undefined;
        } | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	activities: z.array(activitySchema),
	page: pageSchema.optional(),
});

export const getListCollectionActivitiesArgsSchema: z.ZodObject<{
    chainId: z.ZodPipeline<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>, z.ZodString>;
    collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
    query: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, {
        enabled: z.ZodOptional<z.ZodBoolean>;
    }>, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        enabled?: boolean | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        enabled?: boolean | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	query: pageSchema
		.extend({
			enabled: z.boolean().optional(),
		})
		.optional(),
});

export const getListCollectionActivitiesReturnSchema: z.ZodObject<{
    activities: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        fromAddress: z.ZodString;
        toAddress: z.ZodString;
        txHash: z.ZodString;
        timestamp: z.ZodNumber;
        tokenId: z.ZodString;
        tokenImage: z.ZodString;
        tokenName: z.ZodString;
        currency: z.ZodOptional<z.ZodObject<{
            chainId: z.ZodNumber;
            contractAddress: z.ZodString;
            name: z.ZodString;
            symbol: z.ZodString;
            decimals: z.ZodNumber;
            imageUrl: z.ZodString;
            exchangeRate: z.ZodNumber;
            defaultChainCurrency: z.ZodBoolean;
            nativeCurrency: z.ZodBoolean;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            name: string;
            nativeCurrency: boolean;
            chainId: number;
            contractAddress: string;
            decimals: number;
            updatedAt: string;
            createdAt: string;
            imageUrl: string;
            exchangeRate: number;
            defaultChainCurrency: boolean;
            deletedAt?: string | undefined;
        }, {
            symbol: string;
            name: string;
            nativeCurrency: boolean;
            chainId: number;
            contractAddress: string;
            decimals: number;
            updatedAt: string;
            createdAt: string;
            imageUrl: string;
            exchangeRate: number;
            defaultChainCurrency: boolean;
            deletedAt?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        timestamp: number;
        tokenId: string;
        fromAddress: string;
        toAddress: string;
        txHash: string;
        tokenImage: string;
        tokenName: string;
        currency?: {
            symbol: string;
            name: string;
            nativeCurrency: boolean;
            chainId: number;
            contractAddress: string;
            decimals: number;
            updatedAt: string;
            createdAt: string;
            imageUrl: string;
            exchangeRate: number;
            defaultChainCurrency: boolean;
            deletedAt?: string | undefined;
        } | undefined;
    }, {
        type: string;
        timestamp: number;
        tokenId: string;
        fromAddress: string;
        toAddress: string;
        txHash: string;
        tokenImage: string;
        tokenName: string;
        currency?: {
            symbol: string;
            name: string;
            nativeCurrency: boolean;
            chainId: number;
            contractAddress: string;
            decimals: number;
            updatedAt: string;
            createdAt: string;
            imageUrl: string;
            exchangeRate: number;
            defaultChainCurrency: boolean;
            deletedAt?: string | undefined;
        } | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	activities: z.array(activitySchema),
	page: pageSchema.optional(),
});

export const getCollectibleLowestOfferReturnSchema: z.ZodObject<{
    order: z.ZodOptional<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>>;
}, "strip"> = z.object({
	order: orderSchema.optional(),
});

export const getCollectibleHighestOfferReturnSchema: z.ZodObject<{
    order: z.ZodOptional<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>>;
}, "strip"> = z.object({
	order: orderSchema.optional(),
});

export const getCollectibleLowestListingReturnSchema: z.ZodObject<{
    order: z.ZodOptional<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>>;
}, "strip"> = z.object({
	order: orderSchema.optional(),
});

export const getCollectibleHighestListingReturnSchema: z.ZodObject<{
    order: z.ZodOptional<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>>;
}, "strip"> = z.object({
	order: orderSchema.optional(),
});

export const listCollectibleListingsArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectibleListingsReturnSchema: z.ZodObject<{
    listings: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	listings: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const listCollectibleOffersArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    tokenId: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        createdBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        marketplace: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        currencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }, {
        currencies?: string[] | undefined;
        marketplace?: MarketplaceKind[] | undefined;
        createdBy?: string[] | undefined;
    }>>;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	tokenId: z.string(),
	filter: orderFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectibleOffersReturnSchema: z.ZodObject<{
    offers: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	offers: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const listCollectiblesArgsSchema: z.ZodObject<{
    side: z.ZodNativeEnum<typeof OrderSide>;
    contractAddress: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        includeEmpty: z.ZodBoolean;
        searchText: z.ZodOptional<z.ZodString>;
        properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodNativeEnum<typeof PropertyType>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            values: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }>, "many">>;
        marketplaces: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        inAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        notInAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersNotCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }>>;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	side: orderSideSchema,
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectiblesReturnSchema: z.ZodObject<{
    collectibles: z.ZodArray<z.ZodObject<{
        metadata: z.ZodObject<{
            tokenId: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
            video: z.ZodOptional<z.ZodString>;
            audio: z.ZodOptional<z.ZodString>;
            properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            attributes: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, "many">;
            image_data: z.ZodOptional<z.ZodString>;
            external_url: z.ZodOptional<z.ZodString>;
            background_color: z.ZodOptional<z.ZodString>;
            animation_url: z.ZodOptional<z.ZodString>;
            decimals: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodString>;
            assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                collectionId: z.ZodNumber;
                tokenId: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
                metadataField: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                filesize: z.ZodOptional<z.ZodNumber>;
                mimeType: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
                updatedAt: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }, {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        }, {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        }>;
        order: z.ZodOptional<z.ZodObject<{
            orderId: z.ZodString;
            marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
            side: z.ZodNativeEnum<typeof OrderSide>;
            status: z.ZodNativeEnum<typeof OrderStatus>;
            chainId: z.ZodNumber;
            collectionContractAddress: z.ZodString;
            tokenId: z.ZodString;
            createdBy: z.ZodString;
            priceAmount: z.ZodString;
            priceAmountFormatted: z.ZodString;
            priceAmountNet: z.ZodString;
            priceAmountNetFormatted: z.ZodString;
            priceCurrencyAddress: z.ZodString;
            priceDecimals: z.ZodNumber;
            priceUSD: z.ZodNumber;
            quantityInitial: z.ZodString;
            quantityInitialFormatted: z.ZodString;
            quantityRemaining: z.ZodString;
            quantityRemainingFormatted: z.ZodString;
            quantityAvailable: z.ZodString;
            quantityAvailableFormatted: z.ZodString;
            quantityDecimals: z.ZodNumber;
            feeBps: z.ZodNumber;
            feeBreakdown: z.ZodArray<z.ZodObject<{
                kind: z.ZodString;
                recipientAddress: z.ZodString;
                bps: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                kind: string;
                recipientAddress: string;
                bps: number;
            }, {
                kind: string;
                recipientAddress: string;
                bps: number;
            }>, "many">;
            validFrom: z.ZodString;
            validUntil: z.ZodString;
            blockNumber: z.ZodNumber;
            orderCreatedAt: z.ZodOptional<z.ZodString>;
            orderUpdatedAt: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        }, {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        metadata: {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        };
        order?: {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        } | undefined;
    }, {
        metadata: {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        };
        order?: {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        } | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	collectibles: z.array(collectibleOrderSchema),
	page: pageSchema.optional(),
});

export const getFloorOrderReturnSchema: z.ZodObject<{
    collectible: z.ZodObject<{
        metadata: z.ZodObject<{
            tokenId: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
            video: z.ZodOptional<z.ZodString>;
            audio: z.ZodOptional<z.ZodString>;
            properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            attributes: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, "many">;
            image_data: z.ZodOptional<z.ZodString>;
            external_url: z.ZodOptional<z.ZodString>;
            background_color: z.ZodOptional<z.ZodString>;
            animation_url: z.ZodOptional<z.ZodString>;
            decimals: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodString>;
            assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                collectionId: z.ZodNumber;
                tokenId: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
                metadataField: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                filesize: z.ZodOptional<z.ZodNumber>;
                mimeType: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
                updatedAt: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }, {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        }, {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        }>;
        order: z.ZodOptional<z.ZodObject<{
            orderId: z.ZodString;
            marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
            side: z.ZodNativeEnum<typeof OrderSide>;
            status: z.ZodNativeEnum<typeof OrderStatus>;
            chainId: z.ZodNumber;
            collectionContractAddress: z.ZodString;
            tokenId: z.ZodString;
            createdBy: z.ZodString;
            priceAmount: z.ZodString;
            priceAmountFormatted: z.ZodString;
            priceAmountNet: z.ZodString;
            priceAmountNetFormatted: z.ZodString;
            priceCurrencyAddress: z.ZodString;
            priceDecimals: z.ZodNumber;
            priceUSD: z.ZodNumber;
            quantityInitial: z.ZodString;
            quantityInitialFormatted: z.ZodString;
            quantityRemaining: z.ZodString;
            quantityRemainingFormatted: z.ZodString;
            quantityAvailable: z.ZodString;
            quantityAvailableFormatted: z.ZodString;
            quantityDecimals: z.ZodNumber;
            feeBps: z.ZodNumber;
            feeBreakdown: z.ZodArray<z.ZodObject<{
                kind: z.ZodString;
                recipientAddress: z.ZodString;
                bps: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                kind: string;
                recipientAddress: string;
                bps: number;
            }, {
                kind: string;
                recipientAddress: string;
                bps: number;
            }>, "many">;
            validFrom: z.ZodString;
            validUntil: z.ZodString;
            blockNumber: z.ZodNumber;
            orderCreatedAt: z.ZodOptional<z.ZodString>;
            orderUpdatedAt: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        }, {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        metadata: {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        };
        order?: {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        } | undefined;
    }, {
        metadata: {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        };
        order?: {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        } | undefined;
    }>;
}, "strip"> = z.object({
	collectible: collectibleOrderSchema,
});

export const listCollectiblesWithLowestListingArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        includeEmpty: z.ZodBoolean;
        searchText: z.ZodOptional<z.ZodString>;
        properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodNativeEnum<typeof PropertyType>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            values: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }>, "many">>;
        marketplaces: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        inAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        notInAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersNotCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }>>;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectiblesWithLowestListingReturnSchema: z.ZodObject<{
    collectibles: z.ZodArray<z.ZodObject<{
        metadata: z.ZodObject<{
            tokenId: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
            video: z.ZodOptional<z.ZodString>;
            audio: z.ZodOptional<z.ZodString>;
            properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            attributes: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, "many">;
            image_data: z.ZodOptional<z.ZodString>;
            external_url: z.ZodOptional<z.ZodString>;
            background_color: z.ZodOptional<z.ZodString>;
            animation_url: z.ZodOptional<z.ZodString>;
            decimals: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodString>;
            assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                collectionId: z.ZodNumber;
                tokenId: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
                metadataField: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                filesize: z.ZodOptional<z.ZodNumber>;
                mimeType: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
                updatedAt: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }, {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        }, {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        }>;
        order: z.ZodOptional<z.ZodObject<{
            orderId: z.ZodString;
            marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
            side: z.ZodNativeEnum<typeof OrderSide>;
            status: z.ZodNativeEnum<typeof OrderStatus>;
            chainId: z.ZodNumber;
            collectionContractAddress: z.ZodString;
            tokenId: z.ZodString;
            createdBy: z.ZodString;
            priceAmount: z.ZodString;
            priceAmountFormatted: z.ZodString;
            priceAmountNet: z.ZodString;
            priceAmountNetFormatted: z.ZodString;
            priceCurrencyAddress: z.ZodString;
            priceDecimals: z.ZodNumber;
            priceUSD: z.ZodNumber;
            quantityInitial: z.ZodString;
            quantityInitialFormatted: z.ZodString;
            quantityRemaining: z.ZodString;
            quantityRemainingFormatted: z.ZodString;
            quantityAvailable: z.ZodString;
            quantityAvailableFormatted: z.ZodString;
            quantityDecimals: z.ZodNumber;
            feeBps: z.ZodNumber;
            feeBreakdown: z.ZodArray<z.ZodObject<{
                kind: z.ZodString;
                recipientAddress: z.ZodString;
                bps: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                kind: string;
                recipientAddress: string;
                bps: number;
            }, {
                kind: string;
                recipientAddress: string;
                bps: number;
            }>, "many">;
            validFrom: z.ZodString;
            validUntil: z.ZodString;
            blockNumber: z.ZodNumber;
            orderCreatedAt: z.ZodOptional<z.ZodString>;
            orderUpdatedAt: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        }, {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        metadata: {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        };
        order?: {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        } | undefined;
    }, {
        metadata: {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        };
        order?: {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        } | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	collectibles: z.array(collectibleOrderSchema),
	page: pageSchema.optional(),
});

export const listCollectiblesWithHighestOfferArgsSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    filter: z.ZodOptional<z.ZodObject<{
        includeEmpty: z.ZodBoolean;
        searchText: z.ZodOptional<z.ZodString>;
        properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodNativeEnum<typeof PropertyType>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            values: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }, {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }>, "many">>;
        marketplaces: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof MarketplaceKind>, "many">>;
        inAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        notInAccounts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        ordersNotCreatedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }, {
        includeEmpty: boolean;
        searchText?: string | undefined;
        properties?: {
            type: PropertyType;
            name: string;
            values?: any[] | undefined;
            min?: number | undefined;
            max?: number | undefined;
        }[] | undefined;
        marketplaces?: MarketplaceKind[] | undefined;
        inAccounts?: string[] | undefined;
        notInAccounts?: string[] | undefined;
        ordersCreatedBy?: string[] | undefined;
        ordersNotCreatedBy?: string[] | undefined;
    }>>;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	contractAddress: z.string(),
	filter: collectiblesFilterSchema.optional(),
	page: pageSchema.optional(),
});

export const listCollectiblesWithHighestOfferReturnSchema: z.ZodObject<{
    collectibles: z.ZodArray<z.ZodObject<{
        metadata: z.ZodObject<{
            tokenId: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodString>;
            video: z.ZodOptional<z.ZodString>;
            audio: z.ZodOptional<z.ZodString>;
            properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            attributes: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, "many">;
            image_data: z.ZodOptional<z.ZodString>;
            external_url: z.ZodOptional<z.ZodString>;
            background_color: z.ZodOptional<z.ZodString>;
            animation_url: z.ZodOptional<z.ZodString>;
            decimals: z.ZodOptional<z.ZodNumber>;
            updatedAt: z.ZodOptional<z.ZodString>;
            assets: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                collectionId: z.ZodNumber;
                tokenId: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
                metadataField: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                filesize: z.ZodOptional<z.ZodNumber>;
                mimeType: z.ZodOptional<z.ZodString>;
                width: z.ZodOptional<z.ZodNumber>;
                height: z.ZodOptional<z.ZodNumber>;
                updatedAt: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }, {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        }, {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        }>;
        order: z.ZodOptional<z.ZodObject<{
            orderId: z.ZodString;
            marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
            side: z.ZodNativeEnum<typeof OrderSide>;
            status: z.ZodNativeEnum<typeof OrderStatus>;
            chainId: z.ZodNumber;
            collectionContractAddress: z.ZodString;
            tokenId: z.ZodString;
            createdBy: z.ZodString;
            priceAmount: z.ZodString;
            priceAmountFormatted: z.ZodString;
            priceAmountNet: z.ZodString;
            priceAmountNetFormatted: z.ZodString;
            priceCurrencyAddress: z.ZodString;
            priceDecimals: z.ZodNumber;
            priceUSD: z.ZodNumber;
            quantityInitial: z.ZodString;
            quantityInitialFormatted: z.ZodString;
            quantityRemaining: z.ZodString;
            quantityRemainingFormatted: z.ZodString;
            quantityAvailable: z.ZodString;
            quantityAvailableFormatted: z.ZodString;
            quantityDecimals: z.ZodNumber;
            feeBps: z.ZodNumber;
            feeBreakdown: z.ZodArray<z.ZodObject<{
                kind: z.ZodString;
                recipientAddress: z.ZodString;
                bps: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                kind: string;
                recipientAddress: string;
                bps: number;
            }, {
                kind: string;
                recipientAddress: string;
                bps: number;
            }>, "many">;
            validFrom: z.ZodString;
            validUntil: z.ZodString;
            blockNumber: z.ZodNumber;
            orderCreatedAt: z.ZodOptional<z.ZodString>;
            orderUpdatedAt: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            deletedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        }, {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        metadata: {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        };
        order?: {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        } | undefined;
    }, {
        metadata: {
            name: string;
            tokenId: string;
            attributes: Record<string, any>[];
            description?: string | undefined;
            decimals?: number | undefined;
            audio?: string | undefined;
            video?: string | undefined;
            image?: string | undefined;
            updatedAt?: string | undefined;
            properties?: Record<string, any> | undefined;
            image_data?: string | undefined;
            external_url?: string | undefined;
            background_color?: string | undefined;
            animation_url?: string | undefined;
            assets?: {
                id: number;
                tokenId: string;
                collectionId: number;
                metadataField: string;
                name?: string | undefined;
                width?: number | undefined;
                height?: number | undefined;
                url?: string | undefined;
                filesize?: number | undefined;
                mimeType?: string | undefined;
                updatedAt?: string | undefined;
            }[] | undefined;
        };
        order?: {
            orderId: string;
            marketplace: MarketplaceKind;
            status: OrderStatus;
            blockNumber: number;
            chainId: number;
            tokenId: string;
            quantityRemaining: string;
            updatedAt: string;
            createdBy: string;
            createdAt: string;
            side: OrderSide;
            collectionContractAddress: string;
            priceAmount: string;
            priceAmountFormatted: string;
            priceAmountNet: string;
            priceAmountNetFormatted: string;
            priceCurrencyAddress: string;
            priceDecimals: number;
            priceUSD: number;
            quantityInitial: string;
            quantityInitialFormatted: string;
            quantityRemainingFormatted: string;
            quantityAvailable: string;
            quantityAvailableFormatted: string;
            quantityDecimals: number;
            feeBps: number;
            feeBreakdown: {
                kind: string;
                recipientAddress: string;
                bps: number;
            }[];
            validFrom: string;
            validUntil: string;
            deletedAt?: string | undefined;
            orderCreatedAt?: string | undefined;
            orderUpdatedAt?: string | undefined;
        } | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	collectibles: z.array(collectibleOrderSchema),
	page: pageSchema.optional(),
});

export const syncOrderArgsSchema: z.ZodObject<{
    order: z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>;
}, "strip"> = z.object({
	order: orderSchema,
});

export const syncOrdersArgsSchema: z.ZodObject<{
    orders: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>, "many">;
}, "strip"> = z.object({
	orders: z.array(orderSchema),
});

export const getOrdersArgsSchema: z.ZodObject<{
    input: z.ZodArray<z.ZodObject<{
        contractAddress: z.ZodString;
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        contractAddress: string;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        contractAddress: string;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	input: z.array(getOrdersInputSchema),
	page: pageSchema.optional(),
});

export const getOrdersReturnSchema: z.ZodObject<{
    orders: z.ZodArray<z.ZodObject<{
        orderId: z.ZodString;
        marketplace: z.ZodNativeEnum<typeof MarketplaceKind>;
        side: z.ZodNativeEnum<typeof OrderSide>;
        status: z.ZodNativeEnum<typeof OrderStatus>;
        chainId: z.ZodNumber;
        collectionContractAddress: z.ZodString;
        tokenId: z.ZodString;
        createdBy: z.ZodString;
        priceAmount: z.ZodString;
        priceAmountFormatted: z.ZodString;
        priceAmountNet: z.ZodString;
        priceAmountNetFormatted: z.ZodString;
        priceCurrencyAddress: z.ZodString;
        priceDecimals: z.ZodNumber;
        priceUSD: z.ZodNumber;
        quantityInitial: z.ZodString;
        quantityInitialFormatted: z.ZodString;
        quantityRemaining: z.ZodString;
        quantityRemainingFormatted: z.ZodString;
        quantityAvailable: z.ZodString;
        quantityAvailableFormatted: z.ZodString;
        quantityDecimals: z.ZodNumber;
        feeBps: z.ZodNumber;
        feeBreakdown: z.ZodArray<z.ZodObject<{
            kind: z.ZodString;
            recipientAddress: z.ZodString;
            bps: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }, {
            kind: string;
            recipientAddress: string;
            bps: number;
        }>, "many">;
        validFrom: z.ZodString;
        validUntil: z.ZodString;
        blockNumber: z.ZodNumber;
        orderCreatedAt: z.ZodOptional<z.ZodString>;
        orderUpdatedAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        deletedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }, {
        orderId: string;
        marketplace: MarketplaceKind;
        status: OrderStatus;
        blockNumber: number;
        chainId: number;
        tokenId: string;
        quantityRemaining: string;
        updatedAt: string;
        createdBy: string;
        createdAt: string;
        side: OrderSide;
        collectionContractAddress: string;
        priceAmount: string;
        priceAmountFormatted: string;
        priceAmountNet: string;
        priceAmountNetFormatted: string;
        priceCurrencyAddress: string;
        priceDecimals: number;
        priceUSD: number;
        quantityInitial: string;
        quantityInitialFormatted: string;
        quantityRemainingFormatted: string;
        quantityAvailable: string;
        quantityAvailableFormatted: string;
        quantityDecimals: number;
        feeBps: number;
        feeBreakdown: {
            kind: string;
            recipientAddress: string;
            bps: number;
        }[];
        validFrom: string;
        validUntil: string;
        deletedAt?: string | undefined;
        orderCreatedAt?: string | undefined;
        orderUpdatedAt?: string | undefined;
    }>, "many">;
    page: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        pageSize: z.ZodNumber;
        more: z.ZodOptional<z.ZodBoolean>;
        sort: z.ZodOptional<z.ZodArray<z.ZodObject<{
            column: z.ZodString;
            order: z.ZodNativeEnum<typeof SortOrder>;
        }, "strip", z.ZodTypeAny, {
            order: SortOrder;
            column: string;
        }, {
            order: SortOrder;
            column: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }, {
        page: number;
        pageSize: number;
        sort?: {
            order: SortOrder;
            column: string;
        }[] | undefined;
        more?: boolean | undefined;
    }>>;
}, "strip"> = z.object({
	orders: z.array(orderSchema),
	page: pageSchema.optional(),
});

export const collectionSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof CollectionStatus>;
    chainId: z.ZodNumber;
    contractAddress: z.ZodString;
    contractType: z.ZodNativeEnum<typeof ContractType>;
    tokenQuantityDecimals: z.ZodNumber;
    config: z.ZodObject<{
        lastSynced: z.ZodRecord<z.ZodString, z.ZodObject<{
            allOrders: z.ZodString;
            newOrders: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            allOrders: string;
            newOrders: string;
        }, {
            allOrders: string;
            newOrders: string;
        }>>;
        collectiblesSynced: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        lastSynced: Record<string, {
            allOrders: string;
            newOrders: string;
        }>;
        collectiblesSynced: string;
    }, {
        lastSynced: Record<string, {
            allOrders: string;
            newOrders: string;
        }>;
        collectiblesSynced: string;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    deletedAt: z.ZodOptional<z.ZodString>;
}, "strip"> = z.object({
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

export const stepSchema: z.ZodObject<{
    id: z.ZodNativeEnum<typeof StepType>;
    data: z.ZodString;
    to: z.ZodString;
    value: z.ZodString;
    signature: z.ZodOptional<z.ZodObject<{
        domain: z.ZodObject<{
            name: z.ZodString;
            version: z.ZodString;
            chainId: z.ZodNumber;
            verifyingContract: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            chainId: number;
            version: string;
            verifyingContract: string;
        }, {
            name: string;
            chainId: number;
            version: string;
            verifyingContract: string;
        }>;
        types: z.ZodAny;
        primaryType: z.ZodString;
        value: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        domain: {
            name: string;
            chainId: number;
            version: string;
            verifyingContract: string;
        };
        primaryType: string;
        value?: any;
        types?: any;
    }, {
        domain: {
            name: string;
            chainId: number;
            version: string;
            verifyingContract: string;
        };
        primaryType: string;
        value?: any;
        types?: any;
    }>>;
    post: z.ZodOptional<z.ZodObject<{
        endpoint: z.ZodString;
        method: z.ZodString;
        body: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        method: string;
        endpoint: string;
        body?: any;
    }, {
        method: string;
        endpoint: string;
        body?: any;
    }>>;
    executeType: z.ZodOptional<z.ZodNativeEnum<typeof ExecuteType>>;
}, "strip"> = z.object({
	id: stepTypeSchema,
	data: z.string(),
	to: z.string(),
	value: z.string(),
	signature: signatureSchema.optional(),
	post: postRequestSchema.optional(),
	executeType: executeTypeSchema.optional(),
});

export const generateBuyTransactionReturnSchema: z.ZodObject<{
    steps: z.ZodArray<z.ZodObject<{
        id: z.ZodNativeEnum<typeof StepType>;
        data: z.ZodString;
        to: z.ZodString;
        value: z.ZodString;
        signature: z.ZodOptional<z.ZodObject<{
            domain: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
                chainId: z.ZodNumber;
                verifyingContract: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }>;
            types: z.ZodAny;
            primaryType: z.ZodString;
            value: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }>>;
        post: z.ZodOptional<z.ZodObject<{
            endpoint: z.ZodString;
            method: z.ZodString;
            body: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            method: string;
            endpoint: string;
            body?: any;
        }, {
            method: string;
            endpoint: string;
            body?: any;
        }>>;
        executeType: z.ZodOptional<z.ZodNativeEnum<typeof ExecuteType>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }>, "many">;
}, "strip"> = z.object({
	steps: z.array(stepSchema),
});

export const generateSellTransactionReturnSchema: z.ZodObject<{
    steps: z.ZodArray<z.ZodObject<{
        id: z.ZodNativeEnum<typeof StepType>;
        data: z.ZodString;
        to: z.ZodString;
        value: z.ZodString;
        signature: z.ZodOptional<z.ZodObject<{
            domain: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
                chainId: z.ZodNumber;
                verifyingContract: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }>;
            types: z.ZodAny;
            primaryType: z.ZodString;
            value: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }>>;
        post: z.ZodOptional<z.ZodObject<{
            endpoint: z.ZodString;
            method: z.ZodString;
            body: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            method: string;
            endpoint: string;
            body?: any;
        }, {
            method: string;
            endpoint: string;
            body?: any;
        }>>;
        executeType: z.ZodOptional<z.ZodNativeEnum<typeof ExecuteType>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }>, "many">;
}, "strip"> = z.object({
	steps: z.array(stepSchema),
});

export const generateListingTransactionReturnSchema: z.ZodObject<{
    steps: z.ZodArray<z.ZodObject<{
        id: z.ZodNativeEnum<typeof StepType>;
        data: z.ZodString;
        to: z.ZodString;
        value: z.ZodString;
        signature: z.ZodOptional<z.ZodObject<{
            domain: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
                chainId: z.ZodNumber;
                verifyingContract: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }>;
            types: z.ZodAny;
            primaryType: z.ZodString;
            value: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }>>;
        post: z.ZodOptional<z.ZodObject<{
            endpoint: z.ZodString;
            method: z.ZodString;
            body: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            method: string;
            endpoint: string;
            body?: any;
        }, {
            method: string;
            endpoint: string;
            body?: any;
        }>>;
        executeType: z.ZodOptional<z.ZodNativeEnum<typeof ExecuteType>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }>, "many">;
}, "strip"> = z.object({
	steps: z.array(stepSchema),
});

export const generateOfferTransactionReturnSchema: z.ZodObject<{
    steps: z.ZodArray<z.ZodObject<{
        id: z.ZodNativeEnum<typeof StepType>;
        data: z.ZodString;
        to: z.ZodString;
        value: z.ZodString;
        signature: z.ZodOptional<z.ZodObject<{
            domain: z.ZodObject<{
                name: z.ZodString;
                version: z.ZodString;
                chainId: z.ZodNumber;
                verifyingContract: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }, {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            }>;
            types: z.ZodAny;
            primaryType: z.ZodString;
            value: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }, {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        }>>;
        post: z.ZodOptional<z.ZodObject<{
            endpoint: z.ZodString;
            method: z.ZodString;
            body: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            method: string;
            endpoint: string;
            body?: any;
        }, {
            method: string;
            endpoint: string;
            body?: any;
        }>>;
        executeType: z.ZodOptional<z.ZodNativeEnum<typeof ExecuteType>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }, {
        value: string;
        id: StepType;
        to: string;
        data: string;
        signature?: {
            domain: {
                name: string;
                chainId: number;
                version: string;
                verifyingContract: string;
            };
            primaryType: string;
            value?: any;
            types?: any;
        } | undefined;
        executeType?: ExecuteType | undefined;
        post?: {
            method: string;
            endpoint: string;
            body?: any;
        } | undefined;
    }>, "many">;
}, "strip"> = z.object({
	steps: z.array(stepSchema),
});
