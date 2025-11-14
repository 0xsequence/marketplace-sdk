//#region src/react/_internal/api/marketplace.gen.ts
const WebrpcVersion = "v1";
const WebrpcSchemaVersion = "";
const WebrpcSchemaHash = "449bbd3abca8b0fc38376c11d82c94413000a0d6";
let SortOrder = /* @__PURE__ */ function(SortOrder$1) {
	SortOrder$1["ASC"] = "ASC";
	SortOrder$1["DESC"] = "DESC";
	return SortOrder$1;
}({});
let PropertyType = /* @__PURE__ */ function(PropertyType$1) {
	PropertyType$1["INT"] = "INT";
	PropertyType$1["STRING"] = "STRING";
	PropertyType$1["ARRAY"] = "ARRAY";
	PropertyType$1["GENERIC"] = "GENERIC";
	return PropertyType$1;
}({});
let MarketplaceKind = /* @__PURE__ */ function(MarketplaceKind$1) {
	MarketplaceKind$1["unknown"] = "unknown";
	MarketplaceKind$1["sequence_marketplace_v1"] = "sequence_marketplace_v1";
	MarketplaceKind$1["sequence_marketplace_v2"] = "sequence_marketplace_v2";
	MarketplaceKind$1["blur"] = "blur";
	MarketplaceKind$1["zerox"] = "zerox";
	MarketplaceKind$1["opensea"] = "opensea";
	MarketplaceKind$1["looks_rare"] = "looks_rare";
	MarketplaceKind$1["x2y2"] = "x2y2";
	MarketplaceKind$1["alienswap"] = "alienswap";
	MarketplaceKind$1["payment_processor"] = "payment_processor";
	MarketplaceKind$1["mintify"] = "mintify";
	MarketplaceKind$1["magic_eden"] = "magic_eden";
	return MarketplaceKind$1;
}({});
let OrderbookKind = /* @__PURE__ */ function(OrderbookKind$1) {
	OrderbookKind$1["unknown"] = "unknown";
	OrderbookKind$1["sequence_marketplace_v1"] = "sequence_marketplace_v1";
	OrderbookKind$1["sequence_marketplace_v2"] = "sequence_marketplace_v2";
	OrderbookKind$1["blur"] = "blur";
	OrderbookKind$1["opensea"] = "opensea";
	OrderbookKind$1["looks_rare"] = "looks_rare";
	OrderbookKind$1["reservoir"] = "reservoir";
	OrderbookKind$1["x2y2"] = "x2y2";
	OrderbookKind$1["magic_eden"] = "magic_eden";
	return OrderbookKind$1;
}({});
let SourceKind = /* @__PURE__ */ function(SourceKind$1) {
	SourceKind$1["unknown"] = "unknown";
	SourceKind$1["external"] = "external";
	SourceKind$1["sequence_marketplace_v1"] = "sequence_marketplace_v1";
	SourceKind$1["sequence_marketplace_v2"] = "sequence_marketplace_v2";
	SourceKind$1["opensea"] = "opensea";
	SourceKind$1["magic_eden"] = "magic_eden";
	return SourceKind$1;
}({});
let OrderSide = /* @__PURE__ */ function(OrderSide$1) {
	OrderSide$1["unknown"] = "unknown";
	OrderSide$1["listing"] = "listing";
	OrderSide$1["offer"] = "offer";
	return OrderSide$1;
}({});
let OfferType = /* @__PURE__ */ function(OfferType$1) {
	OfferType$1["unknown"] = "unknown";
	OfferType$1["item"] = "item";
	OfferType$1["collection"] = "collection";
	return OfferType$1;
}({});
let OrderStatus = /* @__PURE__ */ function(OrderStatus$1) {
	OrderStatus$1["unknown"] = "unknown";
	OrderStatus$1["active"] = "active";
	OrderStatus$1["inactive"] = "inactive";
	OrderStatus$1["expired"] = "expired";
	OrderStatus$1["cancelled"] = "cancelled";
	OrderStatus$1["filled"] = "filled";
	OrderStatus$1["decimals_missing"] = "decimals_missing";
	return OrderStatus$1;
}({});
let ContractType = /* @__PURE__ */ function(ContractType$1) {
	ContractType$1["UNKNOWN"] = "UNKNOWN";
	ContractType$1["ERC20"] = "ERC20";
	ContractType$1["ERC721"] = "ERC721";
	ContractType$1["ERC1155"] = "ERC1155";
	return ContractType$1;
}({});
let CollectionPriority = /* @__PURE__ */ function(CollectionPriority$1) {
	CollectionPriority$1["unknown"] = "unknown";
	CollectionPriority$1["low"] = "low";
	CollectionPriority$1["normal"] = "normal";
	CollectionPriority$1["high"] = "high";
	return CollectionPriority$1;
}({});
let CollectionStatus = /* @__PURE__ */ function(CollectionStatus$1) {
	CollectionStatus$1["unknown"] = "unknown";
	CollectionStatus$1["created"] = "created";
	CollectionStatus$1["syncing_orders"] = "syncing_orders";
	CollectionStatus$1["active"] = "active";
	CollectionStatus$1["failed"] = "failed";
	CollectionStatus$1["inactive"] = "inactive";
	CollectionStatus$1["incompatible_type"] = "incompatible_type";
	return CollectionStatus$1;
}({});
let ProjectStatus = /* @__PURE__ */ function(ProjectStatus$1) {
	ProjectStatus$1["unknown"] = "unknown";
	ProjectStatus$1["active"] = "active";
	ProjectStatus$1["inactive"] = "inactive";
	return ProjectStatus$1;
}({});
let ItemsContractStatus = /* @__PURE__ */ function(ItemsContractStatus$1) {
	ItemsContractStatus$1["unknown"] = "unknown";
	ItemsContractStatus$1["created"] = "created";
	ItemsContractStatus$1["syncing_contract_metadata"] = "syncing_contract_metadata";
	ItemsContractStatus$1["synced_contract_metadata"] = "synced_contract_metadata";
	ItemsContractStatus$1["syncing_tokens"] = "syncing_tokens";
	ItemsContractStatus$1["synced_tokens"] = "synced_tokens";
	ItemsContractStatus$1["active"] = "active";
	ItemsContractStatus$1["inactive"] = "inactive";
	ItemsContractStatus$1["incompatible_type"] = "incompatible_type";
	return ItemsContractStatus$1;
}({});
let CollectibleStatus = /* @__PURE__ */ function(CollectibleStatus$1) {
	CollectibleStatus$1["unknown"] = "unknown";
	CollectibleStatus$1["active"] = "active";
	CollectibleStatus$1["inactive"] = "inactive";
	return CollectibleStatus$1;
}({});
let CollectibleSource = /* @__PURE__ */ function(CollectibleSource$1) {
	CollectibleSource$1["unknown"] = "unknown";
	CollectibleSource$1["indexer"] = "indexer";
	CollectibleSource$1["manual"] = "manual";
	return CollectibleSource$1;
}({});
let CurrencyStatus = /* @__PURE__ */ function(CurrencyStatus$1) {
	CurrencyStatus$1["unknown"] = "unknown";
	CurrencyStatus$1["created"] = "created";
	CurrencyStatus$1["syncing_metadata"] = "syncing_metadata";
	CurrencyStatus$1["active"] = "active";
	CurrencyStatus$1["failed"] = "failed";
	return CurrencyStatus$1;
}({});
let WalletKind = /* @__PURE__ */ function(WalletKind$1) {
	WalletKind$1["unknown"] = "unknown";
	WalletKind$1["sequence"] = "sequence";
	return WalletKind$1;
}({});
let StepType = /* @__PURE__ */ function(StepType$1) {
	StepType$1["unknown"] = "unknown";
	StepType$1["tokenApproval"] = "tokenApproval";
	StepType$1["buy"] = "buy";
	StepType$1["sell"] = "sell";
	StepType$1["createListing"] = "createListing";
	StepType$1["createOffer"] = "createOffer";
	StepType$1["signEIP712"] = "signEIP712";
	StepType$1["signEIP191"] = "signEIP191";
	StepType$1["cancel"] = "cancel";
	return StepType$1;
}({});
let TransactionCrypto = /* @__PURE__ */ function(TransactionCrypto$1) {
	TransactionCrypto$1["none"] = "none";
	TransactionCrypto$1["partially"] = "partially";
	TransactionCrypto$1["all"] = "all";
	return TransactionCrypto$1;
}({});
let TransactionNFTCheckoutProvider = /* @__PURE__ */ function(TransactionNFTCheckoutProvider$1) {
	TransactionNFTCheckoutProvider$1["unknown"] = "unknown";
	TransactionNFTCheckoutProvider$1["transak"] = "transak";
	TransactionNFTCheckoutProvider$1["sardine"] = "sardine";
	return TransactionNFTCheckoutProvider$1;
}({});
let TransactionOnRampProvider = /* @__PURE__ */ function(TransactionOnRampProvider$1) {
	TransactionOnRampProvider$1["unknown"] = "unknown";
	TransactionOnRampProvider$1["transak"] = "transak";
	TransactionOnRampProvider$1["sardine"] = "sardine";
	return TransactionOnRampProvider$1;
}({});
let TransactionSwapProvider = /* @__PURE__ */ function(TransactionSwapProvider$1) {
	TransactionSwapProvider$1["unknown"] = "unknown";
	TransactionSwapProvider$1["lifi"] = "lifi";
	return TransactionSwapProvider$1;
}({});
let ExecuteType = /* @__PURE__ */ function(ExecuteType$1) {
	ExecuteType$1["unknown"] = "unknown";
	ExecuteType$1["order"] = "order";
	ExecuteType$1["createListing"] = "createListing";
	ExecuteType$1["createItemOffer"] = "createItemOffer";
	ExecuteType$1["createTraitOffer"] = "createTraitOffer";
	return ExecuteType$1;
}({});
let ActivityAction = /* @__PURE__ */ function(ActivityAction$1) {
	ActivityAction$1["unknown"] = "unknown";
	ActivityAction$1["listing"] = "listing";
	ActivityAction$1["offer"] = "offer";
	ActivityAction$1["mint"] = "mint";
	ActivityAction$1["sale"] = "sale";
	ActivityAction$1["listingCancel"] = "listingCancel";
	ActivityAction$1["offerCancel"] = "offerCancel";
	ActivityAction$1["transfer"] = "transfer";
	return ActivityAction$1;
}({});
let PrimarySaleContractStatus = /* @__PURE__ */ function(PrimarySaleContractStatus$1) {
	PrimarySaleContractStatus$1["unknown"] = "unknown";
	PrimarySaleContractStatus$1["created"] = "created";
	PrimarySaleContractStatus$1["syncing_items"] = "syncing_items";
	PrimarySaleContractStatus$1["active"] = "active";
	PrimarySaleContractStatus$1["inactive"] = "inactive";
	PrimarySaleContractStatus$1["incompatible_type"] = "incompatible_type";
	PrimarySaleContractStatus$1["failed"] = "failed";
	return PrimarySaleContractStatus$1;
}({});
let PrimarySaleVersion = /* @__PURE__ */ function(PrimarySaleVersion$1) {
	PrimarySaleVersion$1["v0"] = "v0";
	PrimarySaleVersion$1["v1"] = "v1";
	return PrimarySaleVersion$1;
}({});
let PrimarySaleItemDetailType = /* @__PURE__ */ function(PrimarySaleItemDetailType$1) {
	PrimarySaleItemDetailType$1["unknown"] = "unknown";
	PrimarySaleItemDetailType$1["global"] = "global";
	PrimarySaleItemDetailType$1["individual"] = "individual";
	return PrimarySaleItemDetailType$1;
}({});
let MetadataStatus = /* @__PURE__ */ function(MetadataStatus$1) {
	MetadataStatus$1["NOT_AVAILABLE"] = "NOT_AVAILABLE";
	MetadataStatus$1["REFRESHING"] = "REFRESHING";
	MetadataStatus$1["AVAILABLE"] = "AVAILABLE";
	return MetadataStatus$1;
}({});
var Admin = class {
	hostname;
	fetch;
	path = "/rpc/Admin/";
	constructor(hostname, fetch) {
		this.hostname = hostname.replace(/\/*$/, "");
		this.fetch = (input, init) => fetch(input, init);
	}
	url(name) {
		return this.hostname + this.path + name;
	}
	queryKey = {
		createCollection: (req) => [
			"Admin",
			"createCollection",
			req
		],
		getCollection: (req) => [
			"Admin",
			"getCollection",
			req
		],
		updateCollection: (req) => [
			"Admin",
			"updateCollection",
			req
		],
		listCollections: (req) => [
			"Admin",
			"listCollections",
			req
		],
		deleteCollection: (req) => [
			"Admin",
			"deleteCollection",
			req
		],
		syncCollection: (req) => [
			"Admin",
			"syncCollection",
			req
		],
		createPrimarySaleContract: (req) => [
			"Admin",
			"createPrimarySaleContract",
			req
		],
		deletePrimarySaleContract: (req) => [
			"Admin",
			"deletePrimarySaleContract",
			req
		],
		createCurrency: (req) => [
			"Admin",
			"createCurrency",
			req
		],
		createCurrencies: (req) => [
			"Admin",
			"createCurrencies",
			req
		],
		updateCurrency: (req) => [
			"Admin",
			"updateCurrency",
			req
		],
		listCurrencies: (req) => [
			"Admin",
			"listCurrencies",
			req
		],
		deleteCurrency: (req) => [
			"Admin",
			"deleteCurrency",
			req
		],
		addCollectibles: (req) => [
			"Admin",
			"addCollectibles",
			req
		]
	};
	createCollection = (req, headers, signal) => {
		return this.fetch(this.url("CreateCollection"), createHttpRequest(JsonEncode(req, "CreateCollectionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "CreateCollectionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollection = (req, headers, signal) => {
		return this.fetch(this.url("GetCollection"), createHttpRequest(JsonEncode(req, "GetCollectionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	updateCollection = (req, headers, signal) => {
		return this.fetch(this.url("UpdateCollection"), createHttpRequest(JsonEncode(req, "UpdateCollectionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "UpdateCollectionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollections = (req, headers, signal) => {
		return this.fetch(this.url("ListCollections"), createHttpRequest(JsonEncode(req, "ListCollectionsRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectionsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	deleteCollection = (req, headers, signal) => {
		return this.fetch(this.url("DeleteCollection"), createHttpRequest(JsonEncode(req, "DeleteCollectionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "DeleteCollectionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	syncCollection = (req, headers, signal) => {
		return this.fetch(this.url("SyncCollection"), createHttpRequest(JsonEncode(req, "SyncCollectionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "SyncCollectionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	createPrimarySaleContract = (req, headers, signal) => {
		return this.fetch(this.url("CreatePrimarySaleContract"), createHttpRequest(JsonEncode(req, "CreatePrimarySaleContractRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "CreatePrimarySaleContractResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	deletePrimarySaleContract = (req, headers, signal) => {
		return this.fetch(this.url("DeletePrimarySaleContract"), createHttpRequest(JsonEncode(req, "DeletePrimarySaleContractRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "DeletePrimarySaleContractResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	createCurrency = (req, headers, signal) => {
		return this.fetch(this.url("CreateCurrency"), createHttpRequest(JsonEncode(req, "CreateCurrencyRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "CreateCurrencyResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	createCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("CreateCurrencies"), createHttpRequest(JsonEncode(req, "CreateCurrenciesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "CreateCurrenciesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	updateCurrency = (req, headers, signal) => {
		return this.fetch(this.url("UpdateCurrency"), createHttpRequest(JsonEncode(req, "UpdateCurrencyRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "UpdateCurrencyResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("ListCurrencies"), createHttpRequest(JsonEncode(req, "ListCurrenciesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCurrenciesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	deleteCurrency = (req, headers, signal) => {
		return this.fetch(this.url("DeleteCurrency"), createHttpRequest(JsonEncode(req, "DeleteCurrencyRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "DeleteCurrencyResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	addCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("AddCollectibles"), createHttpRequest(JsonEncode(req, "AddCollectiblesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "AddCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
};
var Marketplace = class {
	hostname;
	fetch;
	path = "/rpc/Marketplace/";
	constructor(hostname, fetch) {
		this.hostname = hostname.replace(/\/*$/, "");
		this.fetch = (input, init) => fetch(input, init);
	}
	url(name) {
		return this.hostname + this.path + name;
	}
	queryKey = {
		listCurrencies: (req) => [
			"Marketplace",
			"listCurrencies",
			req
		],
		getCollectionDetail: (req) => [
			"Marketplace",
			"getCollectionDetail",
			req
		],
		getCollectionActiveListingsCurrencies: (req) => [
			"Marketplace",
			"getCollectionActiveListingsCurrencies",
			req
		],
		getCollectionActiveOffersCurrencies: (req) => [
			"Marketplace",
			"getCollectionActiveOffersCurrencies",
			req
		],
		getCollectible: (req) => [
			"Marketplace",
			"getCollectible",
			req
		],
		getLowestPriceOfferForCollectible: (req) => [
			"Marketplace",
			"getLowestPriceOfferForCollectible",
			req
		],
		getHighestPriceOfferForCollectible: (req) => [
			"Marketplace",
			"getHighestPriceOfferForCollectible",
			req
		],
		getLowestPriceListingForCollectible: (req) => [
			"Marketplace",
			"getLowestPriceListingForCollectible",
			req
		],
		getHighestPriceListingForCollectible: (req) => [
			"Marketplace",
			"getHighestPriceListingForCollectible",
			req
		],
		listListingsForCollectible: (req) => [
			"Marketplace",
			"listListingsForCollectible",
			req
		],
		listOffersForCollectible: (req) => [
			"Marketplace",
			"listOffersForCollectible",
			req
		],
		listOrdersWithCollectibles: (req) => [
			"Marketplace",
			"listOrdersWithCollectibles",
			req
		],
		getCountOfAllOrders: (req) => [
			"Marketplace",
			"getCountOfAllOrders",
			req
		],
		getCountOfFilteredOrders: (req) => [
			"Marketplace",
			"getCountOfFilteredOrders",
			req
		],
		listListings: (req) => [
			"Marketplace",
			"listListings",
			req
		],
		listOffers: (req) => [
			"Marketplace",
			"listOffers",
			req
		],
		getCountOfListingsForCollectible: (req) => [
			"Marketplace",
			"getCountOfListingsForCollectible",
			req
		],
		getCountOfOffersForCollectible: (req) => [
			"Marketplace",
			"getCountOfOffersForCollectible",
			req
		],
		getCollectibleLowestOffer: (req) => [
			"Marketplace",
			"getCollectibleLowestOffer",
			req
		],
		getCollectibleHighestOffer: (req) => [
			"Marketplace",
			"getCollectibleHighestOffer",
			req
		],
		getCollectibleLowestListing: (req) => [
			"Marketplace",
			"getCollectibleLowestListing",
			req
		],
		getCollectibleHighestListing: (req) => [
			"Marketplace",
			"getCollectibleHighestListing",
			req
		],
		listCollectibleListings: (req) => [
			"Marketplace",
			"listCollectibleListings",
			req
		],
		listCollectibleOffers: (req) => [
			"Marketplace",
			"listCollectibleOffers",
			req
		],
		generateBuyTransaction: (req) => [
			"Marketplace",
			"generateBuyTransaction",
			req
		],
		generateSellTransaction: (req) => [
			"Marketplace",
			"generateSellTransaction",
			req
		],
		generateListingTransaction: (req) => [
			"Marketplace",
			"generateListingTransaction",
			req
		],
		generateOfferTransaction: (req) => [
			"Marketplace",
			"generateOfferTransaction",
			req
		],
		generateCancelTransaction: (req) => [
			"Marketplace",
			"generateCancelTransaction",
			req
		],
		execute: (req) => [
			"Marketplace",
			"execute",
			req
		],
		listCollectibles: (req) => [
			"Marketplace",
			"listCollectibles",
			req
		],
		getCountOfAllCollectibles: (req) => [
			"Marketplace",
			"getCountOfAllCollectibles",
			req
		],
		getCountOfFilteredCollectibles: (req) => [
			"Marketplace",
			"getCountOfFilteredCollectibles",
			req
		],
		getFloorOrder: (req) => [
			"Marketplace",
			"getFloorOrder",
			req
		],
		listCollectionActivities: (req) => [
			"Marketplace",
			"listCollectionActivities",
			req
		],
		listCollectibleActivities: (req) => [
			"Marketplace",
			"listCollectibleActivities",
			req
		],
		listCollectiblesWithLowestListing: (req) => [
			"Marketplace",
			"listCollectiblesWithLowestListing",
			req
		],
		listCollectiblesWithHighestOffer: (req) => [
			"Marketplace",
			"listCollectiblesWithHighestOffer",
			req
		],
		syncOrder: (req) => [
			"Marketplace",
			"syncOrder",
			req
		],
		syncOrders: (req) => [
			"Marketplace",
			"syncOrders",
			req
		],
		getOrders: (req) => [
			"Marketplace",
			"getOrders",
			req
		],
		checkoutOptionsMarketplace: (req) => [
			"Marketplace",
			"checkoutOptionsMarketplace",
			req
		],
		checkoutOptionsSalesContract: (req) => [
			"Marketplace",
			"checkoutOptionsSalesContract",
			req
		],
		supportedMarketplaces: (req) => [
			"Marketplace",
			"supportedMarketplaces",
			req
		],
		getPrimarySaleItem: (req) => [
			"Marketplace",
			"getPrimarySaleItem",
			req
		],
		listPrimarySaleItems: (req) => [
			"Marketplace",
			"listPrimarySaleItems",
			req
		],
		getCountOfPrimarySaleItems: (req) => [
			"Marketplace",
			"getCountOfPrimarySaleItems",
			req
		]
	};
	listCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("ListCurrencies"), createHttpRequest(JsonEncode(req, "ListCurrenciesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCurrenciesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectionDetail = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionDetail"), createHttpRequest(JsonEncode(req, "GetCollectionDetailRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionDetailResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectionActiveListingsCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionActiveListingsCurrencies"), createHttpRequest(JsonEncode(req, "GetCollectionActiveListingsCurrenciesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionActiveListingsCurrenciesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectionActiveOffersCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionActiveOffersCurrencies"), createHttpRequest(JsonEncode(req, "GetCollectionActiveOffersCurrenciesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionActiveOffersCurrenciesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectible"), createHttpRequest(JsonEncode(req, "GetCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getLowestPriceOfferForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetLowestPriceOfferForCollectible"), createHttpRequest(JsonEncode(req, "GetLowestPriceOfferForCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetLowestPriceOfferForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getHighestPriceOfferForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetHighestPriceOfferForCollectible"), createHttpRequest(JsonEncode(req, "GetHighestPriceOfferForCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetHighestPriceOfferForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getLowestPriceListingForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetLowestPriceListingForCollectible"), createHttpRequest(JsonEncode(req, "GetLowestPriceListingForCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetLowestPriceListingForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getHighestPriceListingForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetHighestPriceListingForCollectible"), createHttpRequest(JsonEncode(req, "GetHighestPriceListingForCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetHighestPriceListingForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listListingsForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("ListListingsForCollectible"), createHttpRequest(JsonEncode(req, "ListListingsForCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListListingsForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listOffersForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("ListOffersForCollectible"), createHttpRequest(JsonEncode(req, "ListOffersForCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListOffersForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listOrdersWithCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("ListOrdersWithCollectibles"), createHttpRequest(JsonEncode(req, "ListOrdersWithCollectiblesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListOrdersWithCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfAllOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfAllOrders"), createHttpRequest(JsonEncode(req, "GetCountOfAllOrdersRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfAllOrdersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfFilteredOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfFilteredOrders"), createHttpRequest(JsonEncode(req, "GetCountOfFilteredOrdersRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfFilteredOrdersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listListings = (req, headers, signal) => {
		return this.fetch(this.url("ListListings"), createHttpRequest(JsonEncode(req, "ListListingsRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListListingsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listOffers = (req, headers, signal) => {
		return this.fetch(this.url("ListOffers"), createHttpRequest(JsonEncode(req, "ListOffersRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListOffersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfListingsForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfListingsForCollectible"), createHttpRequest(JsonEncode(req, "GetCountOfListingsForCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfListingsForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfOffersForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfOffersForCollectible"), createHttpRequest(JsonEncode(req, "GetCountOfOffersForCollectibleRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfOffersForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectibleLowestOffer = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleLowestOffer"), createHttpRequest(JsonEncode(req, "GetCollectibleLowestOfferRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleLowestOfferResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectibleHighestOffer = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleHighestOffer"), createHttpRequest(JsonEncode(req, "GetCollectibleHighestOfferRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleHighestOfferResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectibleLowestListing = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleLowestListing"), createHttpRequest(JsonEncode(req, "GetCollectibleLowestListingRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleLowestListingResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectibleHighestListing = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleHighestListing"), createHttpRequest(JsonEncode(req, "GetCollectibleHighestListingRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleHighestListingResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectibleListings = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibleListings"), createHttpRequest(JsonEncode(req, "ListCollectibleListingsRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectibleListingsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectibleOffers = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibleOffers"), createHttpRequest(JsonEncode(req, "ListCollectibleOffersRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectibleOffersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateBuyTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateBuyTransaction"), createHttpRequest(JsonEncode(req, "GenerateBuyTransactionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateBuyTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateSellTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateSellTransaction"), createHttpRequest(JsonEncode(req, "GenerateSellTransactionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateSellTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateListingTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateListingTransaction"), createHttpRequest(JsonEncode(req, "GenerateListingTransactionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateListingTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateOfferTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateOfferTransaction"), createHttpRequest(JsonEncode(req, "GenerateOfferTransactionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateOfferTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateCancelTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateCancelTransaction"), createHttpRequest(JsonEncode(req, "GenerateCancelTransactionRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateCancelTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	execute = (req, headers, signal) => {
		return this.fetch(this.url("Execute"), createHttpRequest(JsonEncode(req, "ExecuteRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ExecuteResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibles"), createHttpRequest(JsonEncode(req, "ListCollectiblesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfAllCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfAllCollectibles"), createHttpRequest(JsonEncode(req, "GetCountOfAllCollectiblesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfAllCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfFilteredCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfFilteredCollectibles"), createHttpRequest(JsonEncode(req, "GetCountOfFilteredCollectiblesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfFilteredCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getFloorOrder = (req, headers, signal) => {
		return this.fetch(this.url("GetFloorOrder"), createHttpRequest(JsonEncode(req, "GetFloorOrderRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetFloorOrderResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectionActivities = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectionActivities"), createHttpRequest(JsonEncode(req, "ListCollectionActivitiesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectionActivitiesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectibleActivities = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibleActivities"), createHttpRequest(JsonEncode(req, "ListCollectibleActivitiesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectibleActivitiesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectiblesWithLowestListing = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectiblesWithLowestListing"), createHttpRequest(JsonEncode(req, "ListCollectiblesWithLowestListingRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesWithLowestListingResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectiblesWithHighestOffer = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectiblesWithHighestOffer"), createHttpRequest(JsonEncode(req, "ListCollectiblesWithHighestOfferRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesWithHighestOfferResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	syncOrder = (req, headers, signal) => {
		return this.fetch(this.url("SyncOrder"), createHttpRequest(JsonEncode(req, "SyncOrderRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "SyncOrderResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	syncOrders = (req, headers, signal) => {
		return this.fetch(this.url("SyncOrders"), createHttpRequest(JsonEncode(req, "SyncOrdersRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "SyncOrdersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetOrders"), createHttpRequest(JsonEncode(req, "GetOrdersRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetOrdersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	checkoutOptionsMarketplace = (req, headers, signal) => {
		return this.fetch(this.url("CheckoutOptionsMarketplace"), createHttpRequest(JsonEncode(req, "CheckoutOptionsMarketplaceRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "CheckoutOptionsMarketplaceResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	checkoutOptionsSalesContract = (req, headers, signal) => {
		return this.fetch(this.url("CheckoutOptionsSalesContract"), createHttpRequest(JsonEncode(req, "CheckoutOptionsSalesContractRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "CheckoutOptionsSalesContractResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	supportedMarketplaces = (req, headers, signal) => {
		return this.fetch(this.url("SupportedMarketplaces"), createHttpRequest(JsonEncode(req, "SupportedMarketplacesRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "SupportedMarketplacesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getPrimarySaleItem = (req, headers, signal) => {
		return this.fetch(this.url("GetPrimarySaleItem"), createHttpRequest(JsonEncode(req, "GetPrimarySaleItemRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetPrimarySaleItemResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listPrimarySaleItems = (req, headers, signal) => {
		return this.fetch(this.url("ListPrimarySaleItems"), createHttpRequest(JsonEncode(req, "ListPrimarySaleItemsRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListPrimarySaleItemsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfPrimarySaleItems = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfPrimarySaleItems"), createHttpRequest(JsonEncode(req, "GetCountOfPrimarySaleItemsRequest"), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfPrimarySaleItemsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
};
const createHttpRequest = (body = "{}", headers = {}, signal = null) => {
	return {
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json"
		},
		body,
		signal
	};
};
const buildResponse = (res) => {
	return res.text().then((text) => {
		let data;
		try {
			data = JSON.parse(text);
		} catch (error) {
			throw WebrpcBadResponseError.new({
				status: res.status,
				cause: `JSON.parse(): ${error instanceof Error ? error.message : String(error)}: response text: ${text}`
			});
		}
		if (!res.ok) throw (webrpcErrorByCode[typeof data.code === "number" ? data.code : 0] || WebrpcError).new(data);
		return data;
	});
};
const JsonEncode = (obj, _typ = "") => {
	return JSON.stringify(obj);
};
const JsonDecode = (data, _typ = "") => {
	let parsed = data;
	if (typeof data === "string") try {
		parsed = JSON.parse(data);
	} catch (err) {
		throw WebrpcBadResponseError.new({ cause: `JsonDecode: JSON.parse failed: ${err.message}` });
	}
	return parsed;
};
var WebrpcError = class WebrpcError extends Error {
	code;
	status;
	constructor(error = {}) {
		super(error.message);
		this.name = error.name || "WebrpcEndpointError";
		this.code = typeof error.code === "number" ? error.code : 0;
		this.message = error.message || `endpoint error`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcError.prototype);
	}
	static new(payload) {
		return new this({
			message: payload.message,
			code: payload.code,
			status: payload.status,
			cause: payload.cause
		});
	}
};
var WebrpcEndpointError = class WebrpcEndpointError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcEndpoint";
		this.code = typeof error.code === "number" ? error.code : 0;
		this.message = error.message || `endpoint error`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcEndpointError.prototype);
	}
};
var WebrpcRequestFailedError = class WebrpcRequestFailedError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcRequestFailed";
		this.code = typeof error.code === "number" ? error.code : -1;
		this.message = error.message || `request failed`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcRequestFailedError.prototype);
	}
};
var WebrpcBadRouteError = class WebrpcBadRouteError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcBadRoute";
		this.code = typeof error.code === "number" ? error.code : -2;
		this.message = error.message || `bad route`;
		this.status = typeof error.status === "number" ? error.status : 404;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcBadRouteError.prototype);
	}
};
var WebrpcBadMethodError = class WebrpcBadMethodError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcBadMethod";
		this.code = typeof error.code === "number" ? error.code : -3;
		this.message = error.message || `bad method`;
		this.status = typeof error.status === "number" ? error.status : 405;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcBadMethodError.prototype);
	}
};
var WebrpcBadRequestError = class WebrpcBadRequestError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcBadRequest";
		this.code = typeof error.code === "number" ? error.code : -4;
		this.message = error.message || `bad request`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcBadRequestError.prototype);
	}
};
var WebrpcBadResponseError = class WebrpcBadResponseError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcBadResponse";
		this.code = typeof error.code === "number" ? error.code : -5;
		this.message = error.message || `bad response`;
		this.status = typeof error.status === "number" ? error.status : 500;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcBadResponseError.prototype);
	}
};
var WebrpcServerPanicError = class WebrpcServerPanicError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcServerPanic";
		this.code = typeof error.code === "number" ? error.code : -6;
		this.message = error.message || `server panic`;
		this.status = typeof error.status === "number" ? error.status : 500;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcServerPanicError.prototype);
	}
};
var WebrpcInternalErrorError = class WebrpcInternalErrorError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcInternalError";
		this.code = typeof error.code === "number" ? error.code : -7;
		this.message = error.message || `internal error`;
		this.status = typeof error.status === "number" ? error.status : 500;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcInternalErrorError.prototype);
	}
};
var WebrpcClientAbortedError = class WebrpcClientAbortedError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcClientAborted";
		this.code = typeof error.code === "number" ? error.code : -8;
		this.message = error.message || `request aborted by client`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcClientAbortedError.prototype);
	}
};
var WebrpcStreamLostError = class WebrpcStreamLostError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcStreamLost";
		this.code = typeof error.code === "number" ? error.code : -9;
		this.message = error.message || `stream lost`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcStreamLostError.prototype);
	}
};
var WebrpcStreamFinishedError = class WebrpcStreamFinishedError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcStreamFinished";
		this.code = typeof error.code === "number" ? error.code : -10;
		this.message = error.message || `stream finished`;
		this.status = typeof error.status === "number" ? error.status : 200;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcStreamFinishedError.prototype);
	}
};
var UnauthorizedError = class UnauthorizedError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "Unauthorized";
		this.code = typeof error.code === "number" ? error.code : 1e3;
		this.message = error.message || `Unauthorized access`;
		this.status = typeof error.status === "number" ? error.status : 401;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}
};
var PermissionDeniedError = class PermissionDeniedError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "PermissionDenied";
		this.code = typeof error.code === "number" ? error.code : 1001;
		this.message = error.message || `Permission denied`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, PermissionDeniedError.prototype);
	}
};
var SessionExpiredError = class SessionExpiredError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "SessionExpired";
		this.code = typeof error.code === "number" ? error.code : 1002;
		this.message = error.message || `Session expired`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, SessionExpiredError.prototype);
	}
};
var MethodNotFoundError = class MethodNotFoundError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "MethodNotFound";
		this.code = typeof error.code === "number" ? error.code : 1003;
		this.message = error.message || `Method not found`;
		this.status = typeof error.status === "number" ? error.status : 404;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, MethodNotFoundError.prototype);
	}
};
var TimeoutError = class TimeoutError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "Timeout";
		this.code = typeof error.code === "number" ? error.code : 2e3;
		this.message = error.message || `Request timed out`;
		this.status = typeof error.status === "number" ? error.status : 408;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, TimeoutError.prototype);
	}
};
var InvalidArgumentError = class InvalidArgumentError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "InvalidArgument";
		this.code = typeof error.code === "number" ? error.code : 2001;
		this.message = error.message || `Invalid argument`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, InvalidArgumentError.prototype);
	}
};
var NotFoundError = class NotFoundError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "NotFound";
		this.code = typeof error.code === "number" ? error.code : 3e3;
		this.message = error.message || `Resource not found`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
};
var UserNotFoundError = class UserNotFoundError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "UserNotFound";
		this.code = typeof error.code === "number" ? error.code : 3001;
		this.message = error.message || `User not found`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, UserNotFoundError.prototype);
	}
};
var ProjectNotFoundError = class ProjectNotFoundError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "ProjectNotFound";
		this.code = typeof error.code === "number" ? error.code : 3002;
		this.message = error.message || `Project not found`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, ProjectNotFoundError.prototype);
	}
};
var InvalidTierError = class InvalidTierError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "InvalidTier";
		this.code = typeof error.code === "number" ? error.code : 3003;
		this.message = error.message || `Invalid subscription tier`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, InvalidTierError.prototype);
	}
};
var ProjectLimitReachedError = class ProjectLimitReachedError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "ProjectLimitReached";
		this.code = typeof error.code === "number" ? error.code : 3005;
		this.message = error.message || `Project limit reached`;
		this.status = typeof error.status === "number" ? error.status : 402;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, ProjectLimitReachedError.prototype);
	}
};
var NotImplementedError = class NotImplementedError extends WebrpcError {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "NotImplemented";
		this.code = typeof error.code === "number" ? error.code : 9999;
		this.message = error.message || `Not Implemented`;
		this.status = typeof error.status === "number" ? error.status : 500;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, NotImplementedError.prototype);
	}
};
let errors = /* @__PURE__ */ function(errors$1) {
	errors$1["WebrpcEndpoint"] = "WebrpcEndpoint";
	errors$1["WebrpcRequestFailed"] = "WebrpcRequestFailed";
	errors$1["WebrpcBadRoute"] = "WebrpcBadRoute";
	errors$1["WebrpcBadMethod"] = "WebrpcBadMethod";
	errors$1["WebrpcBadRequest"] = "WebrpcBadRequest";
	errors$1["WebrpcBadResponse"] = "WebrpcBadResponse";
	errors$1["WebrpcServerPanic"] = "WebrpcServerPanic";
	errors$1["WebrpcInternalError"] = "WebrpcInternalError";
	errors$1["WebrpcClientAborted"] = "WebrpcClientAborted";
	errors$1["WebrpcStreamLost"] = "WebrpcStreamLost";
	errors$1["WebrpcStreamFinished"] = "WebrpcStreamFinished";
	errors$1["Unauthorized"] = "Unauthorized";
	errors$1["PermissionDenied"] = "PermissionDenied";
	errors$1["SessionExpired"] = "SessionExpired";
	errors$1["MethodNotFound"] = "MethodNotFound";
	errors$1["Timeout"] = "Timeout";
	errors$1["InvalidArgument"] = "InvalidArgument";
	errors$1["NotFound"] = "NotFound";
	errors$1["UserNotFound"] = "UserNotFound";
	errors$1["ProjectNotFound"] = "ProjectNotFound";
	errors$1["InvalidTier"] = "InvalidTier";
	errors$1["ProjectLimitReached"] = "ProjectLimitReached";
	errors$1["NotImplemented"] = "NotImplemented";
	return errors$1;
}({});
let WebrpcErrorCodes = /* @__PURE__ */ function(WebrpcErrorCodes$1) {
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcEndpoint"] = 0] = "WebrpcEndpoint";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcRequestFailed"] = -1] = "WebrpcRequestFailed";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcBadRoute"] = -2] = "WebrpcBadRoute";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcBadMethod"] = -3] = "WebrpcBadMethod";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcBadRequest"] = -4] = "WebrpcBadRequest";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcBadResponse"] = -5] = "WebrpcBadResponse";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcServerPanic"] = -6] = "WebrpcServerPanic";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcInternalError"] = -7] = "WebrpcInternalError";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcClientAborted"] = -8] = "WebrpcClientAborted";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcStreamLost"] = -9] = "WebrpcStreamLost";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcStreamFinished"] = -10] = "WebrpcStreamFinished";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["Unauthorized"] = 1e3] = "Unauthorized";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["PermissionDenied"] = 1001] = "PermissionDenied";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["SessionExpired"] = 1002] = "SessionExpired";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["MethodNotFound"] = 1003] = "MethodNotFound";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["Timeout"] = 2e3] = "Timeout";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["InvalidArgument"] = 2001] = "InvalidArgument";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["NotFound"] = 3e3] = "NotFound";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["UserNotFound"] = 3001] = "UserNotFound";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["ProjectNotFound"] = 3002] = "ProjectNotFound";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["InvalidTier"] = 3003] = "InvalidTier";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["ProjectLimitReached"] = 3005] = "ProjectLimitReached";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["NotImplemented"] = 9999] = "NotImplemented";
	return WebrpcErrorCodes$1;
}({});
const webrpcErrorByCode = {
	[0]: WebrpcEndpointError,
	[-1]: WebrpcRequestFailedError,
	[-2]: WebrpcBadRouteError,
	[-3]: WebrpcBadMethodError,
	[-4]: WebrpcBadRequestError,
	[-5]: WebrpcBadResponseError,
	[-6]: WebrpcServerPanicError,
	[-7]: WebrpcInternalErrorError,
	[-8]: WebrpcClientAbortedError,
	[-9]: WebrpcStreamLostError,
	[-10]: WebrpcStreamFinishedError,
	[1e3]: UnauthorizedError,
	[1001]: PermissionDeniedError,
	[1002]: SessionExpiredError,
	[1003]: MethodNotFoundError,
	[2e3]: TimeoutError,
	[2001]: InvalidArgumentError,
	[3e3]: NotFoundError,
	[3001]: UserNotFoundError,
	[3002]: ProjectNotFoundError,
	[3003]: InvalidTierError,
	[3005]: ProjectLimitReachedError,
	[9999]: NotImplementedError
};
const WebrpcHeader = "Webrpc";
const WebrpcHeaderValue = "webrpc@v0.30.1;gen-typescript@v0.22.0;@v0.0.0-449bbd3abca8b0fc38376c11d82c94413000a0d6";
function VersionFromHeader(headers) {
	const headerValue = headers.get(WebrpcHeader);
	if (!headerValue) return {
		WebrpcGenVersion: "",
		codeGenName: "",
		codeGenVersion: "",
		schemaName: "",
		schemaVersion: ""
	};
	return parseWebrpcGenVersions(headerValue);
}
function parseWebrpcGenVersions(header) {
	const versions = header.split(";");
	if (versions.length < 3) return {
		WebrpcGenVersion: "",
		codeGenName: "",
		codeGenVersion: "",
		schemaName: "",
		schemaVersion: ""
	};
	const [_, WebrpcGenVersion] = versions[0].split("@");
	const [codeGenName, codeGenVersion] = versions[1].split("@");
	const [schemaName, schemaVersion] = versions[2].split("@");
	return {
		WebrpcGenVersion: WebrpcGenVersion ?? "",
		codeGenName: codeGenName ?? "",
		codeGenVersion: codeGenVersion ?? "",
		schemaName: schemaName ?? "",
		schemaVersion: schemaVersion ?? ""
	};
}

//#endregion
export { WebrpcErrorCodes as $, ProjectNotFoundError as A, TransactionOnRampProvider as B, OrderStatus as C, PrimarySaleItemDetailType as D, PrimarySaleContractStatus as E, SourceKind as F, WalletKind as G, UnauthorizedError as H, StepType as I, WebrpcBadResponseError as J, WebrpcBadMethodError as K, TimeoutError as L, PropertyType as M, SessionExpiredError as N, PrimarySaleVersion as O, SortOrder as P, WebrpcError as Q, TransactionCrypto as R, OrderSide as S, PermissionDeniedError as T, UserNotFoundError as U, TransactionSwapProvider as V, VersionFromHeader as W, WebrpcClientAbortedError as X, WebrpcBadRouteError as Y, WebrpcEndpointError as Z, MetadataStatus as _, CollectionPriority as a, WebrpcSchemaVersion as at, NotImplementedError as b, CurrencyStatus as c, WebrpcStreamLostError as ct, InvalidTierError as d, webrpcErrorByCode as dt, WebrpcHeader as et, ItemsContractStatus as f, MarketplaceKind as g, Marketplace as h, CollectibleStatus as i, WebrpcSchemaHash as it, ProjectStatus as j, ProjectLimitReachedError as k, ExecuteType as l, WebrpcVersion as lt, JsonEncode as m, Admin as n, WebrpcInternalErrorError as nt, CollectionStatus as o, WebrpcServerPanicError as ot, JsonDecode as p, WebrpcBadRequestError as q, CollectibleSource as r, WebrpcRequestFailedError as rt, ContractType as s, WebrpcStreamFinishedError as st, ActivityAction as t, WebrpcHeaderValue as tt, InvalidArgumentError as u, errors as ut, MethodNotFoundError as v, OrderbookKind as w, OfferType as x, NotFoundError as y, TransactionNFTCheckoutProvider as z };
//# sourceMappingURL=marketplace.gen-CbSVdSOZ.js.map