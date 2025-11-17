//#region src/react/_internal/api/marketplace.gen.ts
const WebrpcHeader = "Webrpc";
const WebrpcHeaderValue = "webrpc@v0.25.4;gen-typescript@v0.17.0;marketplace-api@v0.0.0-1ecb14ce28259b0a60c8b90d3e247aced7bcdfad;marketplace-sdk@v1.2.0";
const WebRPCVersion = "v1";
const WebRPCSchemaVersion = "";
const WebRPCSchemaHash = "1ecb14ce28259b0a60c8b90d3e247aced7bcdfad";
function VersionFromHeader(headers) {
	const headerValue = headers.get(WebrpcHeader);
	if (!headerValue) return {
		webrpcGenVersion: "",
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
		webrpcGenVersion: "",
		codeGenName: "",
		codeGenVersion: "",
		schemaName: "",
		schemaVersion: ""
	};
	const [_, webrpcGenVersion] = versions[0].split("@");
	const [codeGenName, codeGenVersion] = versions[1].split("@");
	const [schemaName, schemaVersion] = versions[2].split("@");
	return {
		webrpcGenVersion: webrpcGenVersion ?? "",
		codeGenName: codeGenName ?? "",
		codeGenVersion: codeGenVersion ?? "",
		schemaName: schemaName ?? "",
		schemaVersion: schemaVersion ?? ""
	};
}
let MetadataStatus = /* @__PURE__ */ function(MetadataStatus$1) {
	MetadataStatus$1["NOT_AVAILABLE"] = "NOT_AVAILABLE";
	MetadataStatus$1["REFRESHING"] = "REFRESHING";
	MetadataStatus$1["AVAILABLE"] = "AVAILABLE";
	return MetadataStatus$1;
}({});
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
	createCollection = (args, headers, signal) => {
		return this.fetch(this.url("CreateCollection"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { collection: _data.collection };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollection = (args, headers, signal) => {
		return this.fetch(this.url("GetCollection"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { collection: _data.collection };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	updateCollection = (args, headers, signal) => {
		return this.fetch(this.url("UpdateCollection"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { collection: _data.collection };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCollections = (args, headers, signal) => {
		return this.fetch(this.url("ListCollections"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					collections: _data.collections,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	deleteCollection = (args, headers, signal) => {
		return this.fetch(this.url("DeleteCollection"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { collection: _data.collection };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	syncCollection = (args, headers, signal) => {
		return this.fetch(this.url("SyncCollection"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	createPrimarySaleContract = (args, headers, signal) => {
		return this.fetch(this.url("CreatePrimarySaleContract"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { primarySaleContract: _data.primarySaleContract };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	deletePrimarySaleContract = (args, headers, signal) => {
		return this.fetch(this.url("DeletePrimarySaleContract"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	createCurrency = (args, headers, signal) => {
		return this.fetch(this.url("CreateCurrency"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { currency: _data.currency };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	createCurrencies = (args, headers, signal) => {
		return this.fetch(this.url("CreateCurrencies"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { currency: _data.currency };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	updateCurrency = (args, headers, signal) => {
		return this.fetch(this.url("UpdateCurrency"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { currency: _data.currency };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCurrencies = (args, headers, signal) => {
		return this.fetch(this.url("ListCurrencies"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { currencies: _data.currencies };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	deleteCurrency = (args, headers, signal) => {
		return this.fetch(this.url("DeleteCurrency"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { currency: _data.currency };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	addCollectibles = (args, headers, signal) => {
		return this.fetch(this.url("AddCollectibles"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
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
	listCurrencies = (args, headers, signal) => {
		return this.fetch(this.url("ListCurrencies"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { currencies: _data.currencies };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollectionDetail = (args, headers, signal) => {
		return this.fetch(this.url("GetCollectionDetail"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { collection: _data.collection };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollectionActiveListingsCurrencies = (args, headers, signal) => {
		return this.fetch(this.url("GetCollectionActiveListingsCurrencies"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { currencies: _data.currencies };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollectionActiveOffersCurrencies = (args, headers, signal) => {
		return this.fetch(this.url("GetCollectionActiveOffersCurrencies"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { currencies: _data.currencies };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollectible = (args, headers, signal) => {
		return this.fetch(this.url("GetCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { metadata: _data.metadata };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getLowestPriceOfferForCollectible = (args, headers, signal) => {
		return this.fetch(this.url("GetLowestPriceOfferForCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { order: _data.order };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getHighestPriceOfferForCollectible = (args, headers, signal) => {
		return this.fetch(this.url("GetHighestPriceOfferForCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { order: _data.order };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getLowestPriceListingForCollectible = (args, headers, signal) => {
		return this.fetch(this.url("GetLowestPriceListingForCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { order: _data.order };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getHighestPriceListingForCollectible = (args, headers, signal) => {
		return this.fetch(this.url("GetHighestPriceListingForCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { order: _data.order };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listListingsForCollectible = (args, headers, signal) => {
		return this.fetch(this.url("ListListingsForCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					listings: _data.listings,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listOffersForCollectible = (args, headers, signal) => {
		return this.fetch(this.url("ListOffersForCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					offers: _data.offers,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listOrdersWithCollectibles = (args, headers, signal) => {
		return this.fetch(this.url("ListOrdersWithCollectibles"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					collectibles: _data.collectibles,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCountOfAllOrders = (args, headers, signal) => {
		return this.fetch(this.url("GetCountOfAllOrders"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { count: _data.count };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCountOfFilteredOrders = (args, headers, signal) => {
		return this.fetch(this.url("GetCountOfFilteredOrders"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { count: _data.count };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listListings = (args, headers, signal) => {
		return this.fetch(this.url("ListListings"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					listings: _data.listings,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listOffers = (args, headers, signal) => {
		return this.fetch(this.url("ListOffers"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					offers: _data.offers,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCountOfListingsForCollectible = (args, headers, signal) => {
		return this.fetch(this.url("GetCountOfListingsForCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { count: _data.count };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCountOfOffersForCollectible = (args, headers, signal) => {
		return this.fetch(this.url("GetCountOfOffersForCollectible"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { count: _data.count };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollectibleLowestOffer = (args, headers, signal) => {
		return this.fetch(this.url("GetCollectibleLowestOffer"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { order: _data.order };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollectibleHighestOffer = (args, headers, signal) => {
		return this.fetch(this.url("GetCollectibleHighestOffer"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { order: _data.order };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollectibleLowestListing = (args, headers, signal) => {
		return this.fetch(this.url("GetCollectibleLowestListing"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { order: _data.order };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCollectibleHighestListing = (args, headers, signal) => {
		return this.fetch(this.url("GetCollectibleHighestListing"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { order: _data.order };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCollectibleListings = (args, headers, signal) => {
		return this.fetch(this.url("ListCollectibleListings"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					listings: _data.listings,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCollectibleOffers = (args, headers, signal) => {
		return this.fetch(this.url("ListCollectibleOffers"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					offers: _data.offers,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	generateBuyTransaction = (args, headers, signal) => {
		return this.fetch(this.url("GenerateBuyTransaction"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { steps: _data.steps };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	generateSellTransaction = (args, headers, signal) => {
		return this.fetch(this.url("GenerateSellTransaction"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { steps: _data.steps };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	generateListingTransaction = (args, headers, signal) => {
		return this.fetch(this.url("GenerateListingTransaction"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { steps: _data.steps };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	generateOfferTransaction = (args, headers, signal) => {
		return this.fetch(this.url("GenerateOfferTransaction"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { steps: _data.steps };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	generateCancelTransaction = (args, headers, signal) => {
		return this.fetch(this.url("GenerateCancelTransaction"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { steps: _data.steps };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	execute = (args, headers, signal) => {
		return this.fetch(this.url("Execute"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { orderId: _data.orderId };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCollectibles = (args, headers, signal) => {
		return this.fetch(this.url("ListCollectibles"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					collectibles: _data.collectibles,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCountOfAllCollectibles = (args, headers, signal) => {
		return this.fetch(this.url("GetCountOfAllCollectibles"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { count: _data.count };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCountOfFilteredCollectibles = (args, headers, signal) => {
		return this.fetch(this.url("GetCountOfFilteredCollectibles"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { count: _data.count };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getFloorOrder = (args, headers, signal) => {
		return this.fetch(this.url("GetFloorOrder"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { collectible: _data.collectible };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCollectionActivities = (args, headers, signal) => {
		return this.fetch(this.url("ListCollectionActivities"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					activities: _data.activities,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCollectibleActivities = (args, headers, signal) => {
		return this.fetch(this.url("ListCollectibleActivities"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					activities: _data.activities,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCollectiblesWithLowestListing = (args, headers, signal) => {
		return this.fetch(this.url("ListCollectiblesWithLowestListing"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					collectibles: _data.collectibles,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listCollectiblesWithHighestOffer = (args, headers, signal) => {
		return this.fetch(this.url("ListCollectiblesWithHighestOffer"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					collectibles: _data.collectibles,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	syncOrder = (args, headers, signal) => {
		return this.fetch(this.url("SyncOrder"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	syncOrders = (args, headers, signal) => {
		return this.fetch(this.url("SyncOrders"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getOrders = (args, headers, signal) => {
		return this.fetch(this.url("GetOrders"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					orders: _data.orders,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	checkoutOptionsMarketplace = (args, headers, signal) => {
		return this.fetch(this.url("CheckoutOptionsMarketplace"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { options: _data.options };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	checkoutOptionsSalesContract = (args, headers, signal) => {
		return this.fetch(this.url("CheckoutOptionsSalesContract"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { options: _data.options };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	supportedMarketplaces = (args, headers, signal) => {
		return this.fetch(this.url("SupportedMarketplaces"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { marketplaces: _data.marketplaces };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getPrimarySaleItem = (args, headers, signal) => {
		return this.fetch(this.url("GetPrimarySaleItem"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { item: _data.item };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	listPrimarySaleItems = (args, headers, signal) => {
		return this.fetch(this.url("ListPrimarySaleItems"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return {
					primarySaleItems: _data.primarySaleItems,
					page: _data.page
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
	getCountOfPrimarySaleItems = (args, headers, signal) => {
		return this.fetch(this.url("GetCountOfPrimarySaleItems"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return { count: _data.count };
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ""}` });
		});
	};
};
const createHTTPRequest = (body = {}, headers = {}, signal = null) => {
	const reqHeaders = {
		...headers,
		"Content-Type": "application/json"
	};
	reqHeaders[WebrpcHeader] = WebrpcHeaderValue;
	return {
		method: "POST",
		headers: reqHeaders,
		body: JSON.stringify(body || {}),
		signal
	};
};
const buildResponse = (res) => {
	return res.text().then((text) => {
		let data;
		try {
			data = JSON.parse(text);
		} catch (error) {
			let message = "";
			if (error instanceof Error) message = error.message;
			throw WebrpcBadResponseError.new({
				status: res.status,
				cause: `JSON.parse(): ${message}: response text: ${text}`
			});
		}
		if (!res.ok) throw (webrpcErrorByCode[typeof data.code === "number" ? data.code : 0] || WebrpcError).new(data);
		return data;
	});
};
var WebrpcError = class WebrpcError extends Error {
	name;
	code;
	message;
	status;
	cause;
	/** @deprecated Use message instead of msg. Deprecated in webrpc v0.11.0. */
	msg;
	constructor(name, code, message, status, cause) {
		super(message);
		this.name = name || "WebrpcError";
		this.code = typeof code === "number" ? code : 0;
		this.message = message || `endpoint error ${this.code}`;
		this.msg = this.message;
		this.status = typeof status === "number" ? status : 0;
		this.cause = cause;
		Object.setPrototypeOf(this, WebrpcError.prototype);
	}
	static new(payload) {
		return new this(payload.error, payload.code, payload.message || payload.msg, payload.status, payload.cause);
	}
};
var WebrpcEndpointError = class WebrpcEndpointError extends WebrpcError {
	constructor(name = "WebrpcEndpoint", code = 0, message = `endpoint error`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcEndpointError.prototype);
	}
};
var WebrpcRequestFailedError = class WebrpcRequestFailedError extends WebrpcError {
	constructor(name = "WebrpcRequestFailed", code = -1, message = `request failed`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcRequestFailedError.prototype);
	}
};
var WebrpcBadRouteError = class WebrpcBadRouteError extends WebrpcError {
	constructor(name = "WebrpcBadRoute", code = -2, message = `bad route`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcBadRouteError.prototype);
	}
};
var WebrpcBadMethodError = class WebrpcBadMethodError extends WebrpcError {
	constructor(name = "WebrpcBadMethod", code = -3, message = `bad method`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcBadMethodError.prototype);
	}
};
var WebrpcBadRequestError = class WebrpcBadRequestError extends WebrpcError {
	constructor(name = "WebrpcBadRequest", code = -4, message = `bad request`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcBadRequestError.prototype);
	}
};
var WebrpcBadResponseError = class WebrpcBadResponseError extends WebrpcError {
	constructor(name = "WebrpcBadResponse", code = -5, message = `bad response`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcBadResponseError.prototype);
	}
};
var WebrpcServerPanicError = class WebrpcServerPanicError extends WebrpcError {
	constructor(name = "WebrpcServerPanic", code = -6, message = `server panic`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcServerPanicError.prototype);
	}
};
var WebrpcInternalErrorError = class WebrpcInternalErrorError extends WebrpcError {
	constructor(name = "WebrpcInternalError", code = -7, message = `internal error`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcInternalErrorError.prototype);
	}
};
var WebrpcClientDisconnectedError = class WebrpcClientDisconnectedError extends WebrpcError {
	constructor(name = "WebrpcClientDisconnected", code = -8, message = `client disconnected`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcClientDisconnectedError.prototype);
	}
};
var WebrpcStreamLostError = class WebrpcStreamLostError extends WebrpcError {
	constructor(name = "WebrpcStreamLost", code = -9, message = `stream lost`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcStreamLostError.prototype);
	}
};
var WebrpcStreamFinishedError = class WebrpcStreamFinishedError extends WebrpcError {
	constructor(name = "WebrpcStreamFinished", code = -10, message = `stream finished`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcStreamFinishedError.prototype);
	}
};
var UnauthorizedError = class UnauthorizedError extends WebrpcError {
	constructor(name = "Unauthorized", code = 1e3, message = `Unauthorized access`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}
};
var PermissionDeniedError = class PermissionDeniedError extends WebrpcError {
	constructor(name = "PermissionDenied", code = 1001, message = `Permission denied`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, PermissionDeniedError.prototype);
	}
};
var SessionExpiredError = class SessionExpiredError extends WebrpcError {
	constructor(name = "SessionExpired", code = 1002, message = `Session expired`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, SessionExpiredError.prototype);
	}
};
var MethodNotFoundError = class MethodNotFoundError extends WebrpcError {
	constructor(name = "MethodNotFound", code = 1003, message = `Method not found`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, MethodNotFoundError.prototype);
	}
};
var TimeoutError = class TimeoutError extends WebrpcError {
	constructor(name = "Timeout", code = 2e3, message = `Request timed out`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, TimeoutError.prototype);
	}
};
var InvalidArgumentError = class InvalidArgumentError extends WebrpcError {
	constructor(name = "InvalidArgument", code = 2001, message = `Invalid argument`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, InvalidArgumentError.prototype);
	}
};
var NotFoundError = class NotFoundError extends WebrpcError {
	constructor(name = "NotFound", code = 3e3, message = `Resource not found`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
};
var UserNotFoundError = class UserNotFoundError extends WebrpcError {
	constructor(name = "UserNotFound", code = 3001, message = `User not found`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, UserNotFoundError.prototype);
	}
};
var ProjectNotFoundError = class ProjectNotFoundError extends WebrpcError {
	constructor(name = "ProjectNotFound", code = 3002, message = `Project not found`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, ProjectNotFoundError.prototype);
	}
};
var InvalidTierError = class InvalidTierError extends WebrpcError {
	constructor(name = "InvalidTier", code = 3003, message = `Invalid subscription tier`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, InvalidTierError.prototype);
	}
};
var ProjectLimitReachedError = class ProjectLimitReachedError extends WebrpcError {
	constructor(name = "ProjectLimitReached", code = 3005, message = `Project limit reached`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, ProjectLimitReachedError.prototype);
	}
};
var NotImplementedError = class NotImplementedError extends WebrpcError {
	constructor(name = "NotImplemented", code = 9999, message = `Not Implemented`, status = 0, cause) {
		super(name, code, message, status, cause);
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
	errors$1["WebrpcClientDisconnected"] = "WebrpcClientDisconnected";
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
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["WebrpcClientDisconnected"] = -8] = "WebrpcClientDisconnected";
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
	[-8]: WebrpcClientDisconnectedError,
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

//#endregion
export { WebrpcError as $, PropertyType as A, UnauthorizedError as B, PermissionDeniedError as C, ProjectLimitReachedError as D, PrimarySaleVersion as E, TimeoutError as F, WebRPCSchemaVersion as G, VersionFromHeader as H, TransactionCrypto as I, WebrpcBadRequestError as J, WebRPCVersion as K, TransactionNFTCheckoutProvider as L, SortOrder as M, SourceKind as N, ProjectNotFoundError as O, StepType as P, WebrpcEndpointError as Q, TransactionOnRampProvider as R, OrderbookKind as S, PrimarySaleItemDetailType as T, WalletKind as U, UserNotFoundError as V, WebRPCSchemaHash as W, WebrpcBadRouteError as X, WebrpcBadResponseError as Y, WebrpcClientDisconnectedError as Z, NotFoundError as _, CollectionPriority as a, WebrpcServerPanicError as at, OrderSide as b, CurrencyStatus as c, errors as ct, InvalidTierError as d, WebrpcErrorCodes as et, ItemsContractStatus as f, MethodNotFoundError as g, MetadataStatus as h, CollectibleStatus as i, WebrpcRequestFailedError as it, SessionExpiredError as j, ProjectStatus as k, ExecuteType as l, webrpcErrorByCode as lt, MarketplaceKind as m, Admin as n, WebrpcHeaderValue as nt, CollectionStatus as o, WebrpcStreamFinishedError as ot, Marketplace as p, WebrpcBadMethodError as q, CollectibleSource as r, WebrpcInternalErrorError as rt, ContractType as s, WebrpcStreamLostError as st, ActivityAction as t, WebrpcHeader as tt, InvalidArgumentError as u, NotImplementedError as v, PrimarySaleContractStatus as w, OrderStatus as x, OfferType as y, TransactionSwapProvider as z };
//# sourceMappingURL=marketplace.gen-tQfigxXM.js.map