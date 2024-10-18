// Common types, need to be copy-pasted from the generated webrpc client
// TODO: Find a better way to do this

export interface TokenMetadata {
	tokenId: string;
	name: string;
	description?: string;
	image?: string;
	video?: string;
	audio?: string;
	properties?: { [key: string]: any };
	attributes: Array<{ [key: string]: any }>;
	image_data?: string;
	external_url?: string;
	background_color?: string;
	animation_url?: string;
	decimals?: number;
	updatedAt?: string;
	assets?: Array<Asset>;
}

export interface Asset {
	id: number;
	collectionId: number;
	tokenId: string;
	url?: string;
	metadataField: string;
	name?: string;
	filesize?: number;
	mimeType?: string;
	width?: number;
	height?: number;
	updatedAt?: string;
}

export enum SortOrder {
	DESC = 'DESC',
	ASC = 'ASC',
}

export enum PropertyType {
	INT = 'INT',
	STRING = 'STRING',
	ARRAY = 'ARRAY',
	GENERIC = 'GENERIC',
}

export enum MarketplaceKind {
	unknown = 'unknown',
	sequence_marketplace_v1 = 'sequence_marketplace_v1',
	sequence_marketplace_v2 = 'sequence_marketplace_v2',
	opensea = 'opensea',
	magic_eden = 'magic_eden',
	mintify = 'mintify',
	looks_rare = 'looks_rare',
	x2y2 = 'x2y2',
	sudo_swap = 'sudo_swap',
	coinbase = 'coinbase',
	rarible = 'rarible',
	nftx = 'nftx',
	foundation = 'foundation',
	manifold = 'manifold',
	zora = 'zora',
	blur = 'blur',
	super_rare = 'super_rare',
	okx = 'okx',
	element = 'element',
	aqua_xyz = 'aqua_xyz',
	auranft_co = 'auranft_co',
}

export enum OrderbookKind {
	unknown = 'unknown',
	sequence_marketplace_v1 = 'sequence_marketplace_v1',
	sequence_marketplace_v2 = 'sequence_marketplace_v2',
	blur = 'blur',
	opensea = 'opensea',
	looks_rare = 'looks_rare',
	reservoir = 'reservoir',
	x2y2 = 'x2y2',
}

export enum SourceKind {
	unknown = 'unknown',
	external = 'external',
	sequence_marketplace_v1 = 'sequence_marketplace_v1',
	sequence_marketplace_v2 = 'sequence_marketplace_v2',
}

export enum OrderSide {
	unknown = 'unknown',
	listing = 'listing',
	offer = 'offer',
}

export enum OrderStatus {
	unknown = 'unknown',
	active = 'active',
	inactive = 'inactive',
	expired = 'expired',
	cancelled = 'cancelled',
	filled = 'filled',
}

export enum ContractType {
	UNKNOWN = 'UNKNOWN',
	ERC20 = 'ERC20',
	ERC721 = 'ERC721',
	ERC1155 = 'ERC1155',
}

export enum CollectionStatus {
	unknown = 'unknown',
	created = 'created',
	syncing_metadata = 'syncing_metadata',
	synced_metadata = 'synced_metadata',
	syncing_tokens = 'syncing_tokens',
	synced_tokens = 'synced_tokens',
	syncing_orders = 'syncing_orders',
	active = 'active',
	failed = 'failed',
	inactive = 'inactive',
}

export enum ProjectStatus {
	unknown = 'unknown',
	active = 'active',
	inactive = 'inactive',
}

export enum CollectibleStatus {
	unknown = 'unknown',
	active = 'active',
	inactive = 'inactive',
}

export enum WalletKind {
	unknown = 'unknown',
	sequence = 'sequence',
}

export enum StepType {
	unknown = 'unknown',
	tokenApproval = 'tokenApproval',
	buy = 'buy',
	sell = 'sell',
	createListing = 'createListing',
	createOffer = 'createOffer',
	signEIP712 = 'signEIP712',
	signEIP191 = 'signEIP191',
}

export enum TransactionProvider {
	unknown = 'unknown',
	sardine = 'sardine',
	transak = 'transak',
	zerox = 'zerox',
}

export enum TransactionCrypto {
	none = 'none',
	partially = 'partially',
	all = 'all',
}

export enum ExecuteType {
	unknown = 'unknown',
	order = 'order',
}

export interface Page {
	page: number;
	pageSize: number;
	more?: boolean;
	sort?: Array<SortBy>;
}

export interface SortBy {
	column: string;
	order: SortOrder;
}

export interface Filter {
	text?: string;
	properties?: Array<PropertyFilter>;
}

export interface PropertyFilter {
	name: string;
	type: PropertyType;
	min?: number;
	max?: number;
	values?: Array<any>;
}

export interface CollectiblesFilter {
	includeEmpty: boolean;
	searchText?: string;
	properties?: Array<PropertyFilter>;
	marketplaces?: Array<MarketplaceKind>;
	inAccounts?: Array<string>;
	notInAccounts?: Array<string>;
	ordersCreatedBy?: Array<string>;
	ordersNotCreatedBy?: Array<string>;
}

export interface Order {
	orderId: string;
	marketplace: MarketplaceKind;
	side: OrderSide;
	status: OrderStatus;
	chainId: number;
	collectionContractAddress: string;
	tokenId: string;
	createdBy: string;
	priceAmount: string;
	priceAmountFormatted: string;
	priceAmountNet: string;
	priceAmountNetFormatted: string;
	priceCurrencyAddress: string;
	priceDecimals: number;
	priceUSD: number;
	quantityInitial: string;
	quantityInitialFormatted: string;
	quantityRemaining: string;
	quantityRemainingFormatted: string;
	quantityAvailable: string;
	quantityAvailableFormatted: string;
	quantityDecimals: number;
	feeBps: number;
	feeBreakdown: Array<FeeBreakdown>;
	validFrom: string;
	validUntil: string;
	orderCreatedAt?: string;
	orderUpdatedAt?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

export interface FeeBreakdown {
	kind: string;
	recipientAddress: string;
	bps: number;
}

export interface CollectibleOrder {
	metadata: TokenMetadata;
	order?: Order;
}

export interface OrderFilter {
	createdBy?: Array<string>;
	marketplace?: Array<MarketplaceKind>;
	currencies?: Array<string>;
}

export interface Activity {
	type: string;
	fromAddress: string;
	toAddress: string;
	txHash: string;
	timestamp: number;
	tokenId: string;
	tokenImage: string;
	tokenName: string;
	currency?: Currency;
}

export interface Collection {
	status: CollectionStatus;
	chainId: number;
	contractAddress: string;
	contractType: ContractType;
	tokenQuantityDecimals: number;
	config: CollectionConfig;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

export interface CollectionConfig {
	lastSynced: { [key: string]: CollectionLastSynced };
	collectiblesSynced: string;
}

export interface CollectionLastSynced {
	allOrders: string;
	newOrders: string;
}

export interface Project {
	projectId: number;
	chainId: number;
	contractAddress: string;
	status: ProjectStatus;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

export interface Collectible {
	chainId: number;
	contractAddress: string;
	status: CollectibleStatus;
	tokenId: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

export interface Currency {
	chainId: number;
	contractAddress: string;
	name: string;
	symbol: string;
	decimals: number;
	imageUrl: string;
	exchangeRate: number;
	defaultChainCurrency: boolean;
	nativeCurrency: boolean;
	sardineSupported: boolean;
	transakSupported: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

export interface OrderData {
	orderId: string;
	quantity: string;
}

export interface AdditionalFee {
	amount: string;
	receiver: string;
}

export interface Step {
	id: StepType;
	data: string;
	to: string;
	value: string;
	signature?: Signature;
	post?: PostRequest;
	executeType?: ExecuteType;
}

export interface PostRequest {
	endpoint: string;
	method: string;
	body: any;
}

export interface CreateReq {
	tokenId: string;
	quantity: string;
	expiry: string;
	currencyAddress: string;
	pricePerToken: string;
}

export interface GetOrdersInput {
	contractAddress: string;
	orderId: string;
	marketplace: MarketplaceKind;
}

export interface Signature {
	domain: Domain;
	types: any;
	primaryType: string;
	value: any;
}

export interface Domain {
	name: string;
	version: string;
	chainId: number;
	verifyingContract: string;
}

export interface CheckoutOptionsMarketplaceOrder {
	contractAddress: string;
	orderId: string;
	marketplace: MarketplaceKind;
}

export interface CheckoutOptionsItem {
	tokenId: string;
	quantity: string;
}

export interface CheckoutOptions {
	crypto: TransactionCrypto;
	swap: Array<TransactionProvider>;
	nftCheckout: Array<TransactionProvider>;
	onRamp: Array<TransactionProvider>;
}
