import { ContractType, ContractType as ContractType$2, ResourceStatus, SequenceIndexer, TransactionStatus, TransactionType } from "@0xsequence/indexer";
import { SequenceMetadata } from "@0xsequence/metadata";

//#region ../api/dist/chunk.js
var __defProp = Object.defineProperty;
var __export = (all, symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};

//#endregion
//#region ../api/dist/builder.gen.js
var builder_gen_exports = /* @__PURE__ */ __export({
	AlreadyCollaboratorError: () => AlreadyCollaboratorError,
	EmailTemplateExistsError: () => EmailTemplateExistsError,
	FeatureNotIncludedError: () => FeatureNotIncludedError,
	FilterCondition: () => FilterCondition,
	InvalidArgumentError: () => InvalidArgumentError$1,
	InvalidNetworkError: () => InvalidNetworkError,
	InvalidTierError: () => InvalidTierError,
	InvitationExpiredError: () => InvitationExpiredError,
	MarketplaceService: () => MarketplaceService,
	MarketplaceWalletType: () => MarketplaceWalletType,
	MethodNotFoundError: () => MethodNotFoundError$1,
	NotFoundError: () => NotFoundError$1,
	PermissionDeniedError: () => PermissionDeniedError$1,
	ProjectNotFoundError: () => ProjectNotFoundError$1,
	RequestConflictError: () => RequestConflictError$1,
	ServiceDisabledError: () => ServiceDisabledError,
	SessionExpiredError: () => SessionExpiredError$1,
	SubscriptionLimitError: () => SubscriptionLimitError,
	TimeoutError: () => TimeoutError$1,
	UnauthorizedError: () => UnauthorizedError$1,
	UserNotFoundError: () => UserNotFoundError,
	WebrpcBadMethodError: () => WebrpcBadMethodError,
	WebrpcBadRequestError: () => WebrpcBadRequestError,
	WebrpcBadResponseError: () => WebrpcBadResponseError,
	WebrpcBadRouteError: () => WebrpcBadRouteError,
	WebrpcClientDisconnectedError: () => WebrpcClientDisconnectedError,
	WebrpcEndpointError: () => WebrpcEndpointError,
	WebrpcError: () => WebrpcError,
	WebrpcErrorCodes: () => WebrpcErrorCodes,
	WebrpcHeader: () => WebrpcHeader$1,
	WebrpcHeaderValue: () => WebrpcHeaderValue$1,
	WebrpcInternalErrorError: () => WebrpcInternalErrorError,
	WebrpcRequestFailedError: () => WebrpcRequestFailedError,
	WebrpcServerPanicError: () => WebrpcServerPanicError,
	WebrpcStreamFinishedError: () => WebrpcStreamFinishedError,
	WebrpcStreamLostError: () => WebrpcStreamLostError,
	errors: () => errors,
	webrpcErrorByCode: () => webrpcErrorByCode$1
});
const WebrpcHeader$1 = "Webrpc";
const WebrpcHeaderValue$1 = "webrpc@v0.26.0;gen-typescript@v0.17.0;sequence-builder@v0.1.0";
let MarketplaceWalletType = /* @__PURE__ */ function(MarketplaceWalletType$1) {
	MarketplaceWalletType$1["UNIVERSAL"] = "UNIVERSAL";
	MarketplaceWalletType$1["EMBEDDED"] = "EMBEDDED";
	MarketplaceWalletType$1["ECOSYSTEM"] = "ECOSYSTEM";
	return MarketplaceWalletType$1;
}({});
let FilterCondition = /* @__PURE__ */ function(FilterCondition$1) {
	FilterCondition$1["ENTIRE_KEY"] = "ENTIRE_KEY";
	FilterCondition$1["SPECIFIC_VALUE"] = "SPECIFIC_VALUE";
	return FilterCondition$1;
}({});
var WebrpcError = class WebrpcError$2 extends Error {
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
		Object.setPrototypeOf(this, WebrpcError$2.prototype);
	}
	static new(payload) {
		return new WebrpcError$2(payload.error, payload.code, payload.message || payload.msg, payload.status, payload.cause);
	}
};
var WebrpcEndpointError = class WebrpcEndpointError$2 extends WebrpcError {
	constructor(name = "WebrpcEndpoint", code = 0, message = "endpoint error", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcEndpointError$2.prototype);
	}
};
var WebrpcRequestFailedError = class WebrpcRequestFailedError$2 extends WebrpcError {
	constructor(name = "WebrpcRequestFailed", code = -1, message = "request failed", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcRequestFailedError$2.prototype);
	}
};
var WebrpcBadRouteError = class WebrpcBadRouteError$2 extends WebrpcError {
	constructor(name = "WebrpcBadRoute", code = -2, message = "bad route", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcBadRouteError$2.prototype);
	}
};
var WebrpcBadMethodError = class WebrpcBadMethodError$2 extends WebrpcError {
	constructor(name = "WebrpcBadMethod", code = -3, message = "bad method", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcBadMethodError$2.prototype);
	}
};
var WebrpcBadRequestError = class WebrpcBadRequestError$2 extends WebrpcError {
	constructor(name = "WebrpcBadRequest", code = -4, message = "bad request", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcBadRequestError$2.prototype);
	}
};
var WebrpcBadResponseError = class WebrpcBadResponseError$2 extends WebrpcError {
	constructor(name = "WebrpcBadResponse", code = -5, message = "bad response", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcBadResponseError$2.prototype);
	}
};
var WebrpcServerPanicError = class WebrpcServerPanicError$2 extends WebrpcError {
	constructor(name = "WebrpcServerPanic", code = -6, message = "server panic", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcServerPanicError$2.prototype);
	}
};
var WebrpcInternalErrorError = class WebrpcInternalErrorError$2 extends WebrpcError {
	constructor(name = "WebrpcInternalError", code = -7, message = "internal error", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcInternalErrorError$2.prototype);
	}
};
var WebrpcClientDisconnectedError = class WebrpcClientDisconnectedError$1 extends WebrpcError {
	constructor(name = "WebrpcClientDisconnected", code = -8, message = "client disconnected", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcClientDisconnectedError$1.prototype);
	}
};
var WebrpcStreamLostError = class WebrpcStreamLostError$2 extends WebrpcError {
	constructor(name = "WebrpcStreamLost", code = -9, message = "stream lost", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcStreamLostError$2.prototype);
	}
};
var WebrpcStreamFinishedError = class WebrpcStreamFinishedError$2 extends WebrpcError {
	constructor(name = "WebrpcStreamFinished", code = -10, message = "stream finished", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, WebrpcStreamFinishedError$2.prototype);
	}
};
var UnauthorizedError$1 = class UnauthorizedError$2 extends WebrpcError {
	constructor(name = "Unauthorized", code = 1e3, message = "Unauthorized access", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, UnauthorizedError$2.prototype);
	}
};
var PermissionDeniedError$1 = class PermissionDeniedError$2 extends WebrpcError {
	constructor(name = "PermissionDenied", code = 1001, message = "Permission denied", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, PermissionDeniedError$2.prototype);
	}
};
var SessionExpiredError$1 = class SessionExpiredError$2 extends WebrpcError {
	constructor(name = "SessionExpired", code = 1002, message = "Session expired", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, SessionExpiredError$2.prototype);
	}
};
var MethodNotFoundError$1 = class MethodNotFoundError$2 extends WebrpcError {
	constructor(name = "MethodNotFound", code = 1003, message = "Method not found", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, MethodNotFoundError$2.prototype);
	}
};
var RequestConflictError$1 = class RequestConflictError$2 extends WebrpcError {
	constructor(name = "RequestConflict", code = 1004, message = "Conflict with target resource", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, RequestConflictError$2.prototype);
	}
};
var ServiceDisabledError = class ServiceDisabledError$1 extends WebrpcError {
	constructor(name = "ServiceDisabled", code = 1005, message = "Service disabled", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, ServiceDisabledError$1.prototype);
	}
};
var TimeoutError$1 = class TimeoutError$2 extends WebrpcError {
	constructor(name = "Timeout", code = 2e3, message = "Request timed out", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, TimeoutError$2.prototype);
	}
};
var InvalidArgumentError$1 = class InvalidArgumentError$2 extends WebrpcError {
	constructor(name = "InvalidArgument", code = 2001, message = "Invalid argument", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, InvalidArgumentError$2.prototype);
	}
};
var NotFoundError$1 = class NotFoundError$2 extends WebrpcError {
	constructor(name = "NotFound", code = 3e3, message = "Resource not found", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, NotFoundError$2.prototype);
	}
};
var UserNotFoundError = class UserNotFoundError$1 extends WebrpcError {
	constructor(name = "UserNotFound", code = 3001, message = "User not found", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, UserNotFoundError$1.prototype);
	}
};
var ProjectNotFoundError$1 = class ProjectNotFoundError$2 extends WebrpcError {
	constructor(name = "ProjectNotFound", code = 3002, message = "Project not found", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, ProjectNotFoundError$2.prototype);
	}
};
var InvalidTierError = class InvalidTierError$1 extends WebrpcError {
	constructor(name = "InvalidTier", code = 3003, message = "Invalid subscription tier", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, InvalidTierError$1.prototype);
	}
};
var EmailTemplateExistsError = class EmailTemplateExistsError$1 extends WebrpcError {
	constructor(name = "EmailTemplateExists", code = 3004, message = "Email Template exists", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, EmailTemplateExistsError$1.prototype);
	}
};
var SubscriptionLimitError = class SubscriptionLimitError$1 extends WebrpcError {
	constructor(name = "SubscriptionLimit", code = 3005, message = "Subscription limit reached", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, SubscriptionLimitError$1.prototype);
	}
};
var FeatureNotIncludedError = class FeatureNotIncludedError$1 extends WebrpcError {
	constructor(name = "FeatureNotIncluded", code = 3006, message = "Feature not included", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, FeatureNotIncludedError$1.prototype);
	}
};
var InvalidNetworkError = class InvalidNetworkError$1 extends WebrpcError {
	constructor(name = "InvalidNetwork", code = 3007, message = "Invalid network", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, InvalidNetworkError$1.prototype);
	}
};
var InvitationExpiredError = class InvitationExpiredError$1 extends WebrpcError {
	constructor(name = "InvitationExpired", code = 4e3, message = "Invitation code is expired", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, InvitationExpiredError$1.prototype);
	}
};
var AlreadyCollaboratorError = class AlreadyCollaboratorError$1 extends WebrpcError {
	constructor(name = "AlreadyCollaborator", code = 4001, message = "Already a collaborator", status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, AlreadyCollaboratorError$1.prototype);
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
	errors$1["RequestConflict"] = "RequestConflict";
	errors$1["ServiceDisabled"] = "ServiceDisabled";
	errors$1["Timeout"] = "Timeout";
	errors$1["InvalidArgument"] = "InvalidArgument";
	errors$1["NotFound"] = "NotFound";
	errors$1["UserNotFound"] = "UserNotFound";
	errors$1["ProjectNotFound"] = "ProjectNotFound";
	errors$1["InvalidTier"] = "InvalidTier";
	errors$1["EmailTemplateExists"] = "EmailTemplateExists";
	errors$1["SubscriptionLimit"] = "SubscriptionLimit";
	errors$1["FeatureNotIncluded"] = "FeatureNotIncluded";
	errors$1["InvalidNetwork"] = "InvalidNetwork";
	errors$1["InvitationExpired"] = "InvitationExpired";
	errors$1["AlreadyCollaborator"] = "AlreadyCollaborator";
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
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["RequestConflict"] = 1004] = "RequestConflict";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["ServiceDisabled"] = 1005] = "ServiceDisabled";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["Timeout"] = 2e3] = "Timeout";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["InvalidArgument"] = 2001] = "InvalidArgument";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["NotFound"] = 3e3] = "NotFound";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["UserNotFound"] = 3001] = "UserNotFound";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["ProjectNotFound"] = 3002] = "ProjectNotFound";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["InvalidTier"] = 3003] = "InvalidTier";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["EmailTemplateExists"] = 3004] = "EmailTemplateExists";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["SubscriptionLimit"] = 3005] = "SubscriptionLimit";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["FeatureNotIncluded"] = 3006] = "FeatureNotIncluded";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["InvalidNetwork"] = 3007] = "InvalidNetwork";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["InvitationExpired"] = 4e3] = "InvitationExpired";
	WebrpcErrorCodes$1[WebrpcErrorCodes$1["AlreadyCollaborator"] = 4001] = "AlreadyCollaborator";
	return WebrpcErrorCodes$1;
}({});
const webrpcErrorByCode$1 = {
	0: WebrpcEndpointError,
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
	1e3: UnauthorizedError$1,
	1001: PermissionDeniedError$1,
	1002: SessionExpiredError$1,
	1003: MethodNotFoundError$1,
	1004: RequestConflictError$1,
	1005: ServiceDisabledError,
	2e3: TimeoutError$1,
	2001: InvalidArgumentError$1,
	3e3: NotFoundError$1,
	3001: UserNotFoundError,
	3002: ProjectNotFoundError$1,
	3003: InvalidTierError,
	3004: EmailTemplateExistsError,
	3005: SubscriptionLimitError,
	3006: FeatureNotIncludedError,
	3007: InvalidNetworkError,
	4e3: InvitationExpiredError,
	4001: AlreadyCollaboratorError
};
var MarketplaceService = class {
	hostname;
	fetch;
	path = "/rpc/MarketplaceService/";
	constructor(hostname, fetch) {
		this.hostname = hostname.replace(/\/*$/, "");
		this.fetch = (input, init) => fetch(input, init);
	}
	url(name) {
		return this.hostname + this.path + name;
	}
	lookupMarketplace = (args, headers, signal) => {
		return this.fetch(this.url("LookupMarketplace"), createHTTPRequest(args, headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return {
					marketplace: _data.marketplace,
					marketCollections: _data.marketCollections,
					shopCollections: _data.shopCollections
				};
			});
		}, (error) => {
			throw WebrpcRequestFailedError.new({ cause: `lookupMarketplace(): ${error.message || ""}` });
		});
	};
};
const createHTTPRequest = (body = {}, headers = {}, signal = null) => {
	const reqHeaders = {
		...headers,
		"Content-Type": "application/json"
	};
	reqHeaders[WebrpcHeader$1] = WebrpcHeaderValue$1;
	return {
		method: "POST",
		headers: reqHeaders,
		body: JSON.stringify(body || {}),
		signal
	};
};
const buildResponse$1 = (res) => {
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
		if (!res.ok) throw (webrpcErrorByCode$1[typeof data.code === "number" ? data.code : 0] || WebrpcError).new(data);
		return data;
	});
};

//#endregion
//#region ../api/dist/transform.js
function normalizeAddress(address) {
	if (!address) throw new Error("Address cannot be empty");
	if (!address.startsWith("0x")) throw new Error(`Invalid address format: missing 0x prefix - ${address}`);
	if (address.length !== 42) throw new Error(`Invalid address length: expected 42 characters, got ${address.length} - ${address}`);
	if (!/^0x[0-9a-fA-F]{40}$/.test(address)) throw new Error(`Invalid address format: contains non-hex characters - ${address}`);
	return address;
}
function normalizeChainId(chainId) {
	if (typeof chainId === "number") return chainId;
	if (typeof chainId === "bigint") return Number(chainId);
	return Number(chainId);
}
function toMetadataChainId(chainId) {
	return chainId.toString();
}
function normalizeTokenId(tokenId) {
	if (typeof tokenId === "bigint") return tokenId;
	if (typeof tokenId === "string") return BigInt(tokenId);
	return BigInt(tokenId);
}
function toApiTokenId(tokenId) {
	return tokenId.toString();
}
function transformOptional(value, transformer) {
	return value !== void 0 ? transformer(value) : void 0;
}
function transformArray(items, transformer) {
	return items.map(transformer);
}
function transformOptionalArray(items, transformer) {
	return items !== void 0 ? items.map(transformer) : void 0;
}
function transformRecord(record, transformer) {
	return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, transformer(value, key)]));
}
function spreadWith(obj, overrides) {
	return {
		...obj,
		...overrides
	};
}

//#endregion
//#region ../api/dist/transforms.js
function toContractInfo(raw) {
	if (!raw.address || !raw.address.startsWith("0x") || raw.address.length !== 42) return;
	return spreadWith(raw, {
		chainId: normalizeChainId(raw.chainId),
		address: normalizeAddress(raw.address),
		extensions: transformOptional(raw.extensions, (ext) => {
			const result = { ...ext };
			if (ext.originChainId !== void 0) result.originChainId = normalizeChainId(ext.originChainId);
			if (ext.originAddress?.startsWith("0x") && ext.originAddress.length === 42) result.originAddress = normalizeAddress(ext.originAddress);
			return result;
		})
	});
}
function toTokenMetadata(raw) {
	return spreadWith(raw, {
		tokenId: normalizeTokenId(raw.tokenId),
		attributes: raw.attributes
	});
}
function toNativeTokenBalance(raw) {
	const result = {
		accountAddress: normalizeAddress(raw.accountAddress),
		chainId: normalizeChainId(raw.chainId),
		balance: BigInt(raw.balance)
	};
	if (raw.errorReason) result.errorReason = raw.errorReason;
	return result;
}
function toTokenBalance(raw) {
	const { tokenID, contractType, ...rest } = raw;
	return spreadWith(rest, {
		contractType,
		contractAddress: normalizeAddress(raw.contractAddress),
		accountAddress: normalizeAddress(raw.accountAddress),
		tokenId: raw.tokenID ? normalizeTokenId(raw.tokenID) : 0n,
		balance: BigInt(raw.balance),
		chainId: normalizeChainId(raw.chainId),
		contractInfo: transformOptional(raw.contractInfo, toContractInfo),
		tokenMetadata: transformOptional(raw.tokenMetadata, toTokenMetadata),
		uniqueCollectibles: transformOptional(raw.uniqueCollectibles, BigInt)
	});
}
function toTokenSupply(raw, contractAddress) {
	return {
		tokenId: normalizeTokenId(raw.tokenID),
		supply: BigInt(raw.supply),
		chainId: normalizeChainId(raw.chainId),
		contractAddress,
		contractInfo: transformOptional(raw.contractInfo, toContractInfo),
		tokenMetadata: transformOptional(raw.tokenMetadata, toTokenMetadata)
	};
}
function toTransactionReceipt(raw) {
	return spreadWith(raw, {
		effectiveGasPrice: BigInt(raw.effectiveGasPrice),
		from: raw.from?.startsWith("0x") && raw.from.length === 42 ? normalizeAddress(raw.from) : void 0,
		to: raw.to?.startsWith("0x") && raw.to.length === 42 ? normalizeAddress(raw.to) : void 0,
		logs: transformArray(raw.logs, (log) => {
			const { contractAddress, index, ...rest } = log;
			return spreadWith(rest, {
				address: normalizeAddress(contractAddress),
				logIndex: index
			});
		})
	});
}
function toTokenIDRange(raw) {
	return {
		startTokenId: normalizeTokenId(raw.start),
		endTokenId: normalizeTokenId(raw.end)
	};
}
function toPage(raw) {
	if (!raw) return {
		page: 0,
		pageSize: 0,
		more: false
	};
	return spreadWith(raw, {
		page: raw.page || 0,
		pageSize: raw.pageSize || 0,
		more: raw.more || false
	});
}
function toGetTokenBalancesResponse(raw) {
	return spreadWith(raw, {
		balances: transformArray(raw.balances, toTokenBalance),
		page: toPage(raw.page)
	});
}
function toGetTokenSuppliesResponse(raw, contractAddress) {
	const tokenIDs = transformOptionalArray(raw.tokenIDs, (tokenSupply) => toTokenSupply(tokenSupply, contractAddress)) || [];
	return spreadWith(raw, {
		contractAddress,
		tokenIDs,
		supplies: tokenIDs,
		page: toPage(raw.page)
	});
}
function toGetTokenIDRangesResponse(raw, contractAddress) {
	const tokenIDRanges = transformOptionalArray(raw.tokenIDRanges, toTokenIDRange) || [];
	return spreadWith(raw, {
		contractAddress,
		tokenIDRanges,
		ranges: tokenIDRanges
	});
}
function toGetTokenBalancesDetailsResponse(raw) {
	return spreadWith(raw, {
		page: toPage(raw.page),
		nativeBalances: (raw.nativeBalances || []).map(toNativeTokenBalance),
		balances: raw.balances.map(toTokenBalance)
	});
}
function toGetTokenBalancesByContractResponse(raw) {
	return spreadWith(raw, {
		page: toPage(raw.page),
		balances: raw.balances.map(toTokenBalance)
	});
}
function toGetNativeTokenBalanceResponse(raw) {
	return spreadWith(raw, { balance: toNativeTokenBalance(raw.balance) });
}
function toGetTokenBalancesArgs(req) {
	const { tokenId, ...rest } = req;
	const accountAddress = "userAddress" in req && req.userAddress ? req.userAddress : "accountAddress" in req ? req.accountAddress : void 0;
	const contractAddress = "collectionAddress" in req && req.collectionAddress ? req.collectionAddress : "contractAddress" in req && req.contractAddress ? req.contractAddress : void 0;
	return {
		...rest,
		...accountAddress && { accountAddress },
		...contractAddress && { contractAddress },
		...tokenId !== void 0 && { tokenID: tokenId.toString() }
	};
}
function toGetUserCollectionBalancesArgs(req) {
	return {
		filter: {
			accountAddresses: [req.userAddress],
			contractAddresses: [req.collectionAddress]
		},
		omitMetadata: req.includeMetadata === false ? true : void 0
	};
}

//#endregion
//#region ../api/dist/marketplace.gen.js
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
let TransactionOnRampProvider = /* @__PURE__ */ function(TransactionOnRampProvider$1) {
	TransactionOnRampProvider$1["unknown"] = "unknown";
	TransactionOnRampProvider$1["transak"] = "transak";
	TransactionOnRampProvider$1["sardine"] = "sardine";
	return TransactionOnRampProvider$1;
}({});
let ExecuteType = /* @__PURE__ */ function(ExecuteType$1) {
	ExecuteType$1["unknown"] = "unknown";
	ExecuteType$1["order"] = "order";
	ExecuteType$1["createListing"] = "createListing";
	ExecuteType$1["createItemOffer"] = "createItemOffer";
	ExecuteType$1["createTraitOffer"] = "createTraitOffer";
	return ExecuteType$1;
}({});
let MetadataStatus = /* @__PURE__ */ function(MetadataStatus$1) {
	MetadataStatus$1["NOT_AVAILABLE"] = "NOT_AVAILABLE";
	MetadataStatus$1["REFRESHING"] = "REFRESHING";
	MetadataStatus$1["AVAILABLE"] = "AVAILABLE";
	return MetadataStatus$1;
}({});
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
		return this.fetch(this.url("ListCurrencies"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCurrenciesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectionDetail = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionDetail"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionDetailResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectionActiveListingsCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionActiveListingsCurrencies"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionActiveListingsCurrenciesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectionActiveOffersCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionActiveOffersCurrencies"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionActiveOffersCurrenciesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getLowestPriceOfferForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetLowestPriceOfferForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetLowestPriceOfferForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getHighestPriceOfferForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetHighestPriceOfferForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetHighestPriceOfferForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getLowestPriceListingForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetLowestPriceListingForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetLowestPriceListingForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getHighestPriceListingForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetHighestPriceListingForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetHighestPriceListingForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listListingsForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("ListListingsForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListListingsForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listOffersForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("ListOffersForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListOffersForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listOrdersWithCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("ListOrdersWithCollectibles"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListOrdersWithCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfAllOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfAllOrders"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfAllOrdersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfFilteredOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfFilteredOrders"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfFilteredOrdersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listListings = (req, headers, signal) => {
		return this.fetch(this.url("ListListings"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListListingsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listOffers = (req, headers, signal) => {
		return this.fetch(this.url("ListOffers"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListOffersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfListingsForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfListingsForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfListingsForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfOffersForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfOffersForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfOffersForCollectibleResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectibleLowestOffer = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleLowestOffer"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleLowestOfferResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectibleHighestOffer = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleHighestOffer"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleHighestOfferResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectibleLowestListing = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleLowestListing"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleLowestListingResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCollectibleHighestListing = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleHighestListing"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleHighestListingResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectibleListings = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibleListings"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectibleListingsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectibleOffers = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibleOffers"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectibleOffersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateBuyTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateBuyTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateBuyTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateSellTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateSellTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateSellTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateListingTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateListingTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateListingTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateOfferTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateOfferTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateOfferTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	generateCancelTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateCancelTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GenerateCancelTransactionResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	execute = (req, headers, signal) => {
		return this.fetch(this.url("Execute"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ExecuteResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibles"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfAllCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfAllCollectibles"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfAllCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfFilteredCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfFilteredCollectibles"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfFilteredCollectiblesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getFloorOrder = (req, headers, signal) => {
		return this.fetch(this.url("GetFloorOrder"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetFloorOrderResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectiblesWithLowestListing = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectiblesWithLowestListing"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesWithLowestListingResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listCollectiblesWithHighestOffer = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectiblesWithHighestOffer"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesWithHighestOfferResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	syncOrder = (req, headers, signal) => {
		return this.fetch(this.url("SyncOrder"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "SyncOrderResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	syncOrders = (req, headers, signal) => {
		return this.fetch(this.url("SyncOrders"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "SyncOrdersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetOrders"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetOrdersResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	checkoutOptionsMarketplace = (req, headers, signal) => {
		return this.fetch(this.url("CheckoutOptionsMarketplace"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "CheckoutOptionsMarketplaceResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	checkoutOptionsSalesContract = (req, headers, signal) => {
		return this.fetch(this.url("CheckoutOptionsSalesContract"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "CheckoutOptionsSalesContractResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	supportedMarketplaces = (req, headers, signal) => {
		return this.fetch(this.url("SupportedMarketplaces"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "SupportedMarketplacesResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getPrimarySaleItem = (req, headers, signal) => {
		return this.fetch(this.url("GetPrimarySaleItem"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetPrimarySaleItemResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	listPrimarySaleItems = (req, headers, signal) => {
		return this.fetch(this.url("ListPrimarySaleItems"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "ListPrimarySaleItemsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
	getCountOfPrimarySaleItems = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfPrimarySaleItems"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfPrimarySaleItemsResponse");
			});
		}, (error) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error instanceof Error ? error.message : String(error)}` });
		});
	};
};
const createHttpRequest = (body = "{}", headers = {}, signal = null) => {
	return {
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json",
			[WebrpcHeader]: WebrpcHeaderValue
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
			throw WebrpcBadResponseError$1.new({
				status: res.status,
				cause: `JSON.parse(): ${error instanceof Error ? error.message : String(error)}: response text: ${text}`
			});
		}
		if (!res.ok) throw (webrpcErrorByCode[typeof data.code === "number" ? data.code : 0] || WebrpcError$1).new(data);
		return data;
	});
};
const BIG_INT_FIELDS = {
	Activity: [
		"tokenId",
		"quantity",
		"priceAmount"
	],
	AddCollectiblesRequest: ["tokenIds[]"],
	AdditionalFee: ["amount"],
	Asset: ["tokenId"],
	CheckoutOptionsItem: ["tokenId", "quantity"],
	CheckoutOptionsSalesContractRequest: [["items", "CheckoutOptionsItem[]"]],
	Collectible: ["tokenId"],
	CollectibleOrder: [
		["metadata", "TokenMetadata"],
		["order", "Order"],
		["listing", "Order"],
		["offer", "Order"]
	],
	CollectiblePrimarySaleItem: [["metadata", "TokenMetadata"], ["primarySaleItem", "PrimarySaleItem"]],
	CollectiblesFilter: [["prices", "PriceFilter[]"]],
	CreateReq: [
		"tokenId",
		"quantity",
		"pricePerToken"
	],
	GenerateBuySellTransactionResponse: [["steps", "Step[]"]],
	GenerateBuyTransactionRequest: [["ordersData", "OrderData[]"], ["additionalFees", "AdditionalFee[]"]],
	GenerateBuyTransactionResponse: [["resp", "GenerateBuySellTransactionResponse"], ["steps", "Step[]"]],
	GenerateCancelTransactionResponse: [["steps", "Step[]"]],
	GenerateListingTransactionRequest: [["listing", "CreateReq"], ["additionalFees", "AdditionalFee[]"]],
	GenerateListingTransactionResponse: [["steps", "Step[]"]],
	GenerateOfferTransactionRequest: [["offer", "CreateReq"], ["additionalFees", "AdditionalFee[]"]],
	GenerateOfferTransactionResponse: [["steps", "Step[]"]],
	GenerateSellTransactionRequest: [["ordersData", "OrderData[]"], ["additionalFees", "AdditionalFee[]"]],
	GenerateSellTransactionResponse: [["resp", "GenerateBuySellTransactionResponse"], ["steps", "Step[]"]],
	GetCollectibleHighestListingRequest: ["tokenId"],
	GetCollectibleHighestListingResponse: [["order", "Order"]],
	GetCollectibleHighestOfferRequest: ["tokenId"],
	GetCollectibleHighestOfferResponse: [["order", "Order"]],
	GetCollectibleLowestListingRequest: ["tokenId"],
	GetCollectibleLowestListingResponse: [["order", "Order"]],
	GetCollectibleLowestOfferRequest: ["tokenId"],
	GetCollectibleLowestOfferResponse: [["order", "Order"]],
	GetCollectibleRequest: ["tokenId"],
	GetCollectibleResponse: [["metadata", "TokenMetadata"]],
	GetCountOfFilteredCollectiblesRequest: [["filter", "CollectiblesFilter"]],
	GetCountOfFilteredOrdersRequest: [["filter", "OrdersFilter"]],
	GetCountOfListingsForCollectibleRequest: ["tokenId"],
	GetCountOfOffersForCollectibleRequest: ["tokenId"],
	GetFloorOrderRequest: [["filter", "CollectiblesFilter"]],
	GetFloorOrderResponse: [["collectible", "CollectibleOrder"]],
	GetHighestPriceListingForCollectibleRequest: ["tokenId"],
	GetHighestPriceListingForCollectibleResponse: [["order", "Order"]],
	GetHighestPriceOfferForCollectibleRequest: ["tokenId"],
	GetHighestPriceOfferForCollectibleResponse: [["order", "Order"]],
	GetLowestPriceListingForCollectibleRequest: ["tokenId"],
	GetLowestPriceListingForCollectibleResponse: [["order", "Order"]],
	GetLowestPriceOfferForCollectibleRequest: ["tokenId"],
	GetLowestPriceOfferForCollectibleResponse: [["order", "Order"]],
	GetOrdersResponse: [["orders", "Order[]"]],
	GetPrimarySaleItemRequest: ["tokenId"],
	GetPrimarySaleItemResponse: [["item", "CollectiblePrimarySaleItem"]],
	ListCollectibleActivitiesRequest: ["tokenId"],
	ListCollectibleActivitiesResponse: [["activities", "Activity[]"]],
	ListCollectibleListingsRequest: ["tokenId"],
	ListCollectibleListingsResponse: [["listings", "Order[]"]],
	ListCollectibleOffersRequest: ["tokenId"],
	ListCollectibleOffersResponse: [["offers", "Order[]"]],
	ListCollectiblesRequest: [["filter", "CollectiblesFilter"]],
	ListCollectiblesResponse: [["collectibles", "CollectibleOrder[]"]],
	ListCollectiblesWithHighestOfferRequest: [["filter", "CollectiblesFilter"]],
	ListCollectiblesWithHighestOfferResponse: [["collectibles", "CollectibleOrder[]"]],
	ListCollectiblesWithLowestListingRequest: [["filter", "CollectiblesFilter"]],
	ListCollectiblesWithLowestListingResponse: [["collectibles", "CollectibleOrder[]"]],
	ListCollectionActivitiesResponse: [["activities", "Activity[]"]],
	ListListingsForCollectibleRequest: ["tokenId"],
	ListListingsForCollectibleResponse: [["listings", "Order[]"]],
	ListListingsResponse: [["listings", "Order[]"]],
	ListOffersForCollectibleRequest: ["tokenId"],
	ListOffersForCollectibleResponse: [["offers", "Order[]"]],
	ListOffersResponse: [["offers", "Order[]"]],
	ListOrdersWithCollectiblesRequest: [["filter", "OrdersFilter"]],
	ListOrdersWithCollectiblesResponse: [["collectibles", "CollectibleOrder[]"]],
	ListPrimarySaleItemsResponse: [["primarySaleItems", "CollectiblePrimarySaleItem[]"]],
	Order: [
		"tokenId",
		"priceAmount",
		"priceAmountNet",
		"quantityInitial",
		"quantityRemaining",
		"quantityAvailable"
	],
	OrderData: ["quantity", "tokenId"],
	OrdersFilter: [["prices", "PriceFilter[]"]],
	PriceFilter: ["min", "max"],
	PrimarySaleItem: [
		"tokenId",
		"priceAmount",
		"supply",
		"supplyCap"
	],
	Step: ["value", "price"],
	SyncOrderRequest: [["order", "Order"]],
	SyncOrdersRequest: [["orders", "Order[]"]],
	TokenMetadata: ["tokenId", ["assets", "Asset[]"]]
};
function decodeType(typ, obj) {
	if (obj == null || typeof obj !== "object") return obj;
	const descs = BIG_INT_FIELDS[typ] || [];
	if (!descs.length) return obj;
	for (const d of descs) {
		if (Array.isArray(d)) {
			const [fieldName, nestedType] = d;
			if (fieldName.endsWith("[]")) {
				const arr = obj[fieldName.slice(0, -2)];
				if (Array.isArray(arr)) for (let i = 0; i < arr.length; i++) arr[i] = decodeType(nestedType, arr[i]);
			} else if (obj[fieldName]) if (nestedType.endsWith("[]")) {
				const baseType = nestedType.slice(0, -2);
				const arr = obj[fieldName];
				if (Array.isArray(arr)) for (let i = 0; i < arr.length; i++) arr[i] = decodeType(baseType, arr[i]);
			} else obj[fieldName] = decodeType(nestedType, obj[fieldName]);
			continue;
		}
		if (d.endsWith("[]")) {
			const base = d.slice(0, -2);
			const arr = obj[base];
			if (Array.isArray(arr)) for (let i = 0; i < arr.length; i++) {
				const v$1 = arr[i];
				if (typeof v$1 === "string") try {
					arr[i] = BigInt(v$1);
				} catch (e) {
					throw WebrpcBadResponseError$1.new({ cause: `Invalid bigint value for ${base}[${i}]: ${v$1}` });
				}
			}
			continue;
		}
		const v = obj[d];
		if (typeof v === "string") try {
			obj[d] = BigInt(v);
		} catch (e) {
			throw WebrpcBadResponseError$1.new({ cause: `Invalid bigint value for ${d}: ${v}` });
		}
	}
	return obj;
}
const JsonEncode = (obj) => {
	return JSON.stringify(obj, (_key, value) => typeof value === "bigint" ? value.toString() : value);
};
const JsonDecode = (data, typ = "") => {
	let parsed = data;
	if (typeof data === "string") try {
		parsed = JSON.parse(data);
	} catch (err) {
		throw WebrpcBadResponseError$1.new({ cause: `JsonDecode: JSON.parse failed: ${err.message}` });
	}
	return decodeType(typ, parsed);
};
var WebrpcError$1 = class WebrpcError$2 extends Error {
	code;
	status;
	constructor(error = {}) {
		super(error.message);
		this.name = error.name || "WebrpcEndpointError";
		this.code = typeof error.code === "number" ? error.code : 0;
		this.message = error.message || `endpoint error`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcError$2.prototype);
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
var WebrpcEndpointError$1 = class WebrpcEndpointError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcEndpoint";
		this.code = typeof error.code === "number" ? error.code : 0;
		this.message = error.message || `endpoint error`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcEndpointError$2.prototype);
	}
};
var WebrpcRequestFailedError$1 = class WebrpcRequestFailedError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcRequestFailed";
		this.code = typeof error.code === "number" ? error.code : -1;
		this.message = error.message || `request failed`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcRequestFailedError$2.prototype);
	}
};
var WebrpcBadRouteError$1 = class WebrpcBadRouteError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcBadRoute";
		this.code = typeof error.code === "number" ? error.code : -2;
		this.message = error.message || `bad route`;
		this.status = typeof error.status === "number" ? error.status : 404;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcBadRouteError$2.prototype);
	}
};
var WebrpcBadMethodError$1 = class WebrpcBadMethodError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcBadMethod";
		this.code = typeof error.code === "number" ? error.code : -3;
		this.message = error.message || `bad method`;
		this.status = typeof error.status === "number" ? error.status : 405;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcBadMethodError$2.prototype);
	}
};
var WebrpcBadRequestError$1 = class WebrpcBadRequestError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcBadRequest";
		this.code = typeof error.code === "number" ? error.code : -4;
		this.message = error.message || `bad request`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcBadRequestError$2.prototype);
	}
};
var WebrpcBadResponseError$1 = class WebrpcBadResponseError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcBadResponse";
		this.code = typeof error.code === "number" ? error.code : -5;
		this.message = error.message || `bad response`;
		this.status = typeof error.status === "number" ? error.status : 500;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcBadResponseError$2.prototype);
	}
};
var WebrpcServerPanicError$1 = class WebrpcServerPanicError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcServerPanic";
		this.code = typeof error.code === "number" ? error.code : -6;
		this.message = error.message || `server panic`;
		this.status = typeof error.status === "number" ? error.status : 500;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcServerPanicError$2.prototype);
	}
};
var WebrpcInternalErrorError$1 = class WebrpcInternalErrorError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcInternalError";
		this.code = typeof error.code === "number" ? error.code : -7;
		this.message = error.message || `internal error`;
		this.status = typeof error.status === "number" ? error.status : 500;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcInternalErrorError$2.prototype);
	}
};
var WebrpcClientAbortedError = class WebrpcClientAbortedError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcClientAborted";
		this.code = typeof error.code === "number" ? error.code : -8;
		this.message = error.message || `request aborted by client`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcClientAbortedError$1.prototype);
	}
};
var WebrpcStreamLostError$1 = class WebrpcStreamLostError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcStreamLost";
		this.code = typeof error.code === "number" ? error.code : -9;
		this.message = error.message || `stream lost`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcStreamLostError$2.prototype);
	}
};
var WebrpcStreamFinishedError$1 = class WebrpcStreamFinishedError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "WebrpcStreamFinished";
		this.code = typeof error.code === "number" ? error.code : -10;
		this.message = error.message || `stream finished`;
		this.status = typeof error.status === "number" ? error.status : 200;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, WebrpcStreamFinishedError$2.prototype);
	}
};
var UnauthorizedError = class UnauthorizedError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "Unauthorized";
		this.code = typeof error.code === "number" ? error.code : 1e3;
		this.message = error.message || `Unauthorized access`;
		this.status = typeof error.status === "number" ? error.status : 401;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, UnauthorizedError$2.prototype);
	}
};
var PermissionDeniedError = class PermissionDeniedError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "PermissionDenied";
		this.code = typeof error.code === "number" ? error.code : 1001;
		this.message = error.message || `Permission denied`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, PermissionDeniedError$2.prototype);
	}
};
var SessionExpiredError = class SessionExpiredError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "SessionExpired";
		this.code = typeof error.code === "number" ? error.code : 1002;
		this.message = error.message || `Session expired`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, SessionExpiredError$2.prototype);
	}
};
var MethodNotFoundError = class MethodNotFoundError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "MethodNotFound";
		this.code = typeof error.code === "number" ? error.code : 1003;
		this.message = error.message || `Method not found`;
		this.status = typeof error.status === "number" ? error.status : 404;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, MethodNotFoundError$2.prototype);
	}
};
var RequestConflictError = class RequestConflictError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "RequestConflict";
		this.code = typeof error.code === "number" ? error.code : 1004;
		this.message = error.message || `Conflict with target resource`;
		this.status = typeof error.status === "number" ? error.status : 409;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, RequestConflictError$2.prototype);
	}
};
var AbortedError = class AbortedError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "Aborted";
		this.code = typeof error.code === "number" ? error.code : 1005;
		this.message = error.message || `Request aborted`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, AbortedError$1.prototype);
	}
};
var GeoblockedError = class GeoblockedError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "Geoblocked";
		this.code = typeof error.code === "number" ? error.code : 1006;
		this.message = error.message || `Geoblocked region`;
		this.status = typeof error.status === "number" ? error.status : 451;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, GeoblockedError$1.prototype);
	}
};
var RateLimitedError = class RateLimitedError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "RateLimited";
		this.code = typeof error.code === "number" ? error.code : 1007;
		this.message = error.message || `Rate-limited. Please slow down.`;
		this.status = typeof error.status === "number" ? error.status : 429;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, RateLimitedError$1.prototype);
	}
};
var ProjectNotFoundError = class ProjectNotFoundError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "ProjectNotFound";
		this.code = typeof error.code === "number" ? error.code : 1008;
		this.message = error.message || `Project not found`;
		this.status = typeof error.status === "number" ? error.status : 401;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, ProjectNotFoundError$2.prototype);
	}
};
var SecretKeyCorsDisallowedError = class SecretKeyCorsDisallowedError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "SecretKeyCorsDisallowed";
		this.code = typeof error.code === "number" ? error.code : 1009;
		this.message = error.message || `CORS disallowed. Admin API Secret Key can't be used from a web app.`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, SecretKeyCorsDisallowedError$1.prototype);
	}
};
var AccessKeyNotFoundError = class AccessKeyNotFoundError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "AccessKeyNotFound";
		this.code = typeof error.code === "number" ? error.code : 1101;
		this.message = error.message || `Access key not found`;
		this.status = typeof error.status === "number" ? error.status : 401;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, AccessKeyNotFoundError$1.prototype);
	}
};
var AccessKeyMismatchError = class AccessKeyMismatchError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "AccessKeyMismatch";
		this.code = typeof error.code === "number" ? error.code : 1102;
		this.message = error.message || `Access key mismatch`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, AccessKeyMismatchError$1.prototype);
	}
};
var InvalidOriginError = class InvalidOriginError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "InvalidOrigin";
		this.code = typeof error.code === "number" ? error.code : 1103;
		this.message = error.message || `Invalid origin for Access Key`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, InvalidOriginError$1.prototype);
	}
};
var InvalidServiceError = class InvalidServiceError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "InvalidService";
		this.code = typeof error.code === "number" ? error.code : 1104;
		this.message = error.message || `Service not enabled for Access key`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, InvalidServiceError$1.prototype);
	}
};
var UnauthorizedUserError = class UnauthorizedUserError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "UnauthorizedUser";
		this.code = typeof error.code === "number" ? error.code : 1105;
		this.message = error.message || `Unauthorized user`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, UnauthorizedUserError$1.prototype);
	}
};
var InvalidChainError = class InvalidChainError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "InvalidChain";
		this.code = typeof error.code === "number" ? error.code : 1106;
		this.message = error.message || `Network not enabled for Access key`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, InvalidChainError$1.prototype);
	}
};
var QuotaExceededError = class QuotaExceededError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "QuotaExceeded";
		this.code = typeof error.code === "number" ? error.code : 1200;
		this.message = error.message || `Quota request exceeded`;
		this.status = typeof error.status === "number" ? error.status : 429;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, QuotaExceededError$1.prototype);
	}
};
var QuotaRateLimitError = class QuotaRateLimitError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "QuotaRateLimit";
		this.code = typeof error.code === "number" ? error.code : 1201;
		this.message = error.message || `Quota rate limit exceeded`;
		this.status = typeof error.status === "number" ? error.status : 429;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, QuotaRateLimitError$1.prototype);
	}
};
var NoDefaultKeyError = class NoDefaultKeyError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "NoDefaultKey";
		this.code = typeof error.code === "number" ? error.code : 1300;
		this.message = error.message || `No default access key found`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, NoDefaultKeyError$1.prototype);
	}
};
var MaxAccessKeysError = class MaxAccessKeysError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "MaxAccessKeys";
		this.code = typeof error.code === "number" ? error.code : 1301;
		this.message = error.message || `Access keys limit reached`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, MaxAccessKeysError$1.prototype);
	}
};
var AtLeastOneKeyError = class AtLeastOneKeyError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "AtLeastOneKey";
		this.code = typeof error.code === "number" ? error.code : 1302;
		this.message = error.message || `You need at least one Access Key`;
		this.status = typeof error.status === "number" ? error.status : 403;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, AtLeastOneKeyError$1.prototype);
	}
};
var TimeoutError = class TimeoutError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "Timeout";
		this.code = typeof error.code === "number" ? error.code : 1900;
		this.message = error.message || `Request timed out`;
		this.status = typeof error.status === "number" ? error.status : 408;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, TimeoutError$2.prototype);
	}
};
var NotFoundError = class NotFoundError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "NotFound";
		this.code = typeof error.code === "number" ? error.code : 2e3;
		this.message = error.message || `Resource not found`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, NotFoundError$2.prototype);
	}
};
var InvalidArgumentError = class InvalidArgumentError$2 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "InvalidArgument";
		this.code = typeof error.code === "number" ? error.code : 2001;
		this.message = error.message || `Invalid argument`;
		this.status = typeof error.status === "number" ? error.status : 400;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, InvalidArgumentError$2.prototype);
	}
};
var NotImplementedError = class NotImplementedError$1 extends WebrpcError$1 {
	constructor(error = {}) {
		super(error);
		this.name = error.name || "NotImplemented";
		this.code = typeof error.code === "number" ? error.code : 9999;
		this.message = error.message || `Not Implemented`;
		this.status = typeof error.status === "number" ? error.status : 500;
		if (error.cause !== void 0) this.cause = error.cause;
		Object.setPrototypeOf(this, NotImplementedError$1.prototype);
	}
};
const webrpcErrorByCode = {
	[0]: WebrpcEndpointError$1,
	[-1]: WebrpcRequestFailedError$1,
	[-2]: WebrpcBadRouteError$1,
	[-3]: WebrpcBadMethodError$1,
	[-4]: WebrpcBadRequestError$1,
	[-5]: WebrpcBadResponseError$1,
	[-6]: WebrpcServerPanicError$1,
	[-7]: WebrpcInternalErrorError$1,
	[-8]: WebrpcClientAbortedError,
	[-9]: WebrpcStreamLostError$1,
	[-10]: WebrpcStreamFinishedError$1,
	[1e3]: UnauthorizedError,
	[1001]: PermissionDeniedError,
	[1002]: SessionExpiredError,
	[1003]: MethodNotFoundError,
	[1004]: RequestConflictError,
	[1005]: AbortedError,
	[1006]: GeoblockedError,
	[1007]: RateLimitedError,
	[1008]: ProjectNotFoundError,
	[1009]: SecretKeyCorsDisallowedError,
	[1101]: AccessKeyNotFoundError,
	[1102]: AccessKeyMismatchError,
	[1103]: InvalidOriginError,
	[1104]: InvalidServiceError,
	[1105]: UnauthorizedUserError,
	[1106]: InvalidChainError,
	[1200]: QuotaExceededError,
	[1201]: QuotaRateLimitError,
	[1300]: NoDefaultKeyError,
	[1301]: MaxAccessKeysError,
	[1302]: AtLeastOneKeyError,
	[1900]: TimeoutError,
	[2e3]: NotFoundError,
	[2001]: InvalidArgumentError,
	[9999]: NotImplementedError
};
const WebrpcHeader = "Webrpc";
const WebrpcHeaderValue = "webrpc@v0.31.1;gen-typescript@v0.23.1;api-client@v0-25.11.10+051e186";

//#endregion
//#region ../api/dist/transforms2.js
function toBridgeInfo(raw) {
	return { tokenAddress: normalizeAddress(raw.tokenAddress) };
}
function toContractInfo$1(raw) {
	const extensions = {
		link: raw.extensions.link,
		description: raw.extensions.description,
		categories: raw.extensions.categories,
		ogImage: raw.extensions.ogImage,
		ogName: raw.extensions.ogName,
		blacklist: raw.extensions.blacklist,
		verified: raw.extensions.verified,
		verifiedBy: raw.extensions.verifiedBy,
		featured: raw.extensions.featured,
		featureIndex: raw.extensions.featureIndex
	};
	if (raw.extensions.originChainId !== void 0) extensions.originChainId = normalizeChainId(raw.extensions.originChainId);
	if (raw.extensions.originAddress !== void 0) extensions.originAddress = normalizeAddress(raw.extensions.originAddress);
	if (raw.extensions.bridgeInfo !== void 0) extensions.bridgeInfo = transformRecord(raw.extensions.bridgeInfo, toBridgeInfo);
	return spreadWith(raw, {
		address: normalizeAddress(raw.address),
		chainId: normalizeChainId(raw.chainId),
		type: raw.type,
		extensions
	});
}
function toAsset(raw) {
	return spreadWith(raw, { tokenId: transformOptional(raw.tokenId, normalizeTokenId) });
}
function toTokenMetadata$1(raw) {
	return spreadWith(raw, {
		chainId: transformOptional(raw.chainId, normalizeChainId),
		contractAddress: transformOptional(raw.contractAddress, normalizeAddress),
		tokenId: normalizeTokenId(raw.tokenId),
		assets: transformOptionalArray(raw.assets, toAsset)
	});
}
function toGetContractInfoReturn(raw) {
	return spreadWith(raw, { contractInfo: toContractInfo$1(raw.contractInfo) });
}
function toGetContractInfoBatchReturn(raw) {
	return spreadWith(raw, { contractInfoMap: transformRecord(raw.contractInfoMap, toContractInfo$1) });
}
function toGetTokenMetadataReturn(raw) {
	return spreadWith(raw, { tokenMetadata: transformArray(raw.tokenMetadata, toTokenMetadata$1) });
}
function toGetTokenMetadataBatchReturn(raw) {
	return spreadWith(raw, { contractTokenMetadata: transformRecord(raw.contractTokenMetadata, (metadata) => transformArray(metadata, toTokenMetadata$1)) });
}
function toSearchTokenMetadataReturn(raw) {
	return spreadWith(raw, { tokenMetadata: transformArray(raw.tokenMetadata, toTokenMetadata$1) });
}
function toGetContractInfoArgs(normalized) {
	const contractAddress = "collectionAddress" in normalized && normalized.collectionAddress ? normalized.collectionAddress : "contractAddress" in normalized && normalized.contractAddress ? normalized.contractAddress : "";
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress
	};
}
function toGetContractInfoBatchArgs(normalized) {
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddresses: normalized.contractAddresses
	};
}
function toGetTokenMetadataArgs(normalized) {
	const contractAddress = "collectionAddress" in normalized && normalized.collectionAddress ? normalized.collectionAddress : "contractAddress" in normalized && normalized.contractAddress ? normalized.contractAddress : "";
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
		tokenIDs: transformArray(normalized.tokenIds, toApiTokenId)
	};
}
function toGetTokenMetadataBatchArgs(normalized) {
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractTokenMap: transformRecord(normalized.contractTokenMap, (tokenIds) => transformArray(tokenIds, toApiTokenId))
	};
}
function toRefreshTokenMetadataArgs(normalized) {
	const contractAddress = "collectionAddress" in normalized && normalized.collectionAddress ? normalized.collectionAddress : "contractAddress" in normalized && normalized.contractAddress ? normalized.contractAddress : "";
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
		tokenIDs: transformOptionalArray(normalized.tokenIds, toApiTokenId)
	};
}
function toSearchTokenMetadataArgs(normalized) {
	const contractAddress = "collectionAddress" in normalized && normalized.collectionAddress ? normalized.collectionAddress : "contractAddress" in normalized && normalized.contractAddress ? normalized.contractAddress : "";
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
		filter: normalized.filter,
		page: normalized.page
	};
}
function toGetTokenMetadataPropertyFiltersArgs(normalized) {
	const contractAddress = "collectionAddress" in normalized && normalized.collectionAddress !== void 0 ? normalized.collectionAddress : normalized.contractAddress;
	return {
		chainID: toMetadataChainId(normalized.chainId),
		contractAddress,
		excludeProperties: normalized.excludeProperties,
		excludePropertyValues: normalized.excludePropertyValues
	};
}
function toGetTokenMetadataPropertyFiltersReturn(raw) {
	return raw;
}

//#endregion
//#region ../api/dist/index.js
function toLookupMarketplaceReturn(data) {
	const marketCollections = transformArray(data.marketCollections, toMarketCollection);
	const shopCollections = transformArray(data.shopCollections, toShopCollection);
	return {
		marketplace: {
			...data.marketplace,
			market: {
				...data.marketplace.market,
				collections: marketCollections
			},
			shop: {
				...data.marketplace.shop,
				collections: shopCollections
			}
		},
		marketCollections,
		shopCollections
	};
}
function toMarketCollection(data) {
	return {
		...data,
		marketplaceCollectionType: "market",
		chainId: normalizeChainId(data.chainId),
		itemsAddress: normalizeAddress(data.itemsAddress),
		contractType: data.contractType,
		destinationMarketplace: data.destinationMarketplace
	};
}
function toShopCollection(data) {
	return {
		...data,
		marketplaceCollectionType: "shop",
		chainId: normalizeChainId(data.chainId),
		itemsAddress: normalizeAddress(data.itemsAddress),
		saleAddress: normalizeAddress(data.saleAddress),
		tokenIds: transformArray(data.tokenIds, normalizeTokenId),
		customTokenIds: transformArray(data.customTokenIds, normalizeTokenId)
	};
}
function fromLookupMarketplaceReturn(data) {
	const marketCollections = transformArray(data.marketplace.market.collections, fromMarketCollection);
	const shopCollections = transformArray(data.marketplace.shop.collections, fromShopCollection);
	return {
		marketplace: {
			...data.marketplace,
			market: {
				enabled: data.marketplace.market.enabled,
				bannerUrl: data.marketplace.market.bannerUrl,
				ogImage: data.marketplace.market.ogImage,
				private: data.marketplace.market.private
			},
			shop: {
				enabled: data.marketplace.shop.enabled,
				bannerUrl: data.marketplace.shop.bannerUrl,
				ogImage: data.marketplace.shop.ogImage,
				private: data.marketplace.shop.private
			}
		},
		marketCollections,
		shopCollections
	};
}
function fromMarketCollection(data) {
	const { marketplaceCollectionType, ...rest } = data;
	return rest;
}
function fromShopCollection(data) {
	const { marketplaceCollectionType, ...rest } = data;
	return {
		...rest,
		tokenIds: transformArray(rest.tokenIds, toApiTokenId),
		customTokenIds: transformArray(rest.customTokenIds, toApiTokenId)
	};
}
var builder_exports = /* @__PURE__ */ __export({
	BuilderAPI: () => builder_gen_exports,
	FilterCondition: () => FilterCondition,
	MarketplaceWalletType: () => MarketplaceWalletType,
	WebrpcBadMethodError: () => WebrpcBadMethodError,
	WebrpcBadRequestError: () => WebrpcBadRequestError,
	WebrpcBadResponseError: () => WebrpcBadResponseError,
	WebrpcBadRouteError: () => WebrpcBadRouteError,
	WebrpcClientDisconnectedError: () => WebrpcClientDisconnectedError,
	WebrpcEndpointError: () => WebrpcEndpointError,
	WebrpcError: () => WebrpcError,
	WebrpcInternalErrorError: () => WebrpcInternalErrorError,
	WebrpcRequestFailedError: () => WebrpcRequestFailedError,
	WebrpcServerPanicError: () => WebrpcServerPanicError,
	WebrpcStreamFinishedError: () => WebrpcStreamFinishedError,
	WebrpcStreamLostError: () => WebrpcStreamLostError,
	fromLookupMarketplaceReturn: () => fromLookupMarketplaceReturn,
	fromMarketCollection: () => fromMarketCollection,
	fromShopCollection: () => fromShopCollection,
	toLookupMarketplaceReturn: () => toLookupMarketplaceReturn,
	toMarketCollection: () => toMarketCollection,
	toShopCollection: () => toShopCollection
});
/**
* Wrapped Indexer Client
*
* Wraps the raw SequenceIndexer with methods that return normalized types.
* Uses composition rather than inheritance to avoid type conflicts.
*/
var IndexerClient = class {
	client;
	constructor(hostname, projectAccessKey, jwtAuth) {
		this.client = new SequenceIndexer(hostname, projectAccessKey, jwtAuth);
	}
	/**
	* Get token balances for an account with normalized types (bigint)
	* Accepts tokenId as bigint, transforms to tokenID string for API
	*/
	async getTokenBalances(args) {
		const apiArgs = toGetTokenBalancesArgs(args);
		return toGetTokenBalancesResponse(await this.client.getTokenBalances(apiArgs));
	}
	/**
	* Get token supplies for a contract with normalized types (bigint)
	*/
	async getTokenSupplies(args) {
		const contractAddress = "collectionAddress" in args && args.collectionAddress ? args.collectionAddress : args.contractAddress;
		if (!contractAddress) throw new Error("getTokenSupplies requires either contractAddress or collectionAddress");
		const apiArgs = {
			...args,
			contractAddress
		};
		return toGetTokenSuppliesResponse(await this.client.getTokenSupplies(apiArgs), contractAddress);
	}
	/**
	* Get token ID ranges for a contract with normalized types (bigint)
	*/
	async getTokenIDRanges(args) {
		const contractAddress = "collectionAddress" in args && args.collectionAddress ? args.collectionAddress : args.contractAddress;
		if (!contractAddress) throw new Error("getTokenIDRanges requires either contractAddress or collectionAddress");
		const apiArgs = { contractAddress };
		return toGetTokenIDRangesResponse(await this.client.getTokenIDRanges(apiArgs), contractAddress);
	}
	/**
	* Get token balance details with normalized types (bigint)
	*/
	async getTokenBalancesDetails(args) {
		return toGetTokenBalancesDetailsResponse(await this.client.getTokenBalancesDetails(args));
	}
	/**
	* Get token balances by contract with normalized types (bigint)
	*/
	async getTokenBalancesByContract(args) {
		return toGetTokenBalancesByContractResponse(await this.client.getTokenBalancesByContract(args));
	}
	/**
	* Get token balances for a user in a specific collection
	* Convenience method with user-friendly parameter names
	*/
	async getUserCollectionBalances(args) {
		const apiArgs = toGetUserCollectionBalancesArgs(args);
		return (await this.client.getTokenBalancesByContract(apiArgs)).balances.map(toTokenBalance);
	}
	/**
	* Get native token balance with normalized types (bigint)
	*/
	async getNativeTokenBalance(args) {
		return toGetNativeTokenBalanceResponse(await this.client.getNativeTokenBalance(args));
	}
	/**
	* Fetch transaction receipt with normalized types (bigint)
	*/
	async fetchTransactionReceipt(args) {
		return { receipt: toTransactionReceipt((await this.client.fetchTransactionReceipt(args)).receipt) };
	}
	/**
	* Access the underlying raw client for any methods not wrapped
	*/
	get raw() {
		return this.client;
	}
};
function chainIdToString(chainId) {
	return chainId.toString();
}
function wrapChainId(clientMethod) {
	return async (req) => {
		return clientMethod({
			...req,
			chainId: chainIdToString(req.chainId)
		});
	};
}
function wrapCollectionAddress(clientMethod) {
	return async (req) => {
		const { collectionAddress, ...rest } = req;
		return clientMethod({
			...rest,
			chainId: chainIdToString(req.chainId),
			contractAddress: collectionAddress
		});
	};
}
function wrapWithTransform(clientMethod, transform) {
	return async (req) => {
		return clientMethod(transform(req));
	};
}
function wrapWithBothTransform(clientMethod, requestTransform, responseTransform) {
	return async (req) => {
		return responseTransform(await clientMethod(requestTransform(req)));
	};
}
function passthrough(clientMethod) {
	return clientMethod;
}
function toDomain(domain) {
	return {
		name: domain.name,
		version: domain.version,
		chainId: domain.chainId,
		verifyingContract: normalizeAddress(domain.verifyingContract)
	};
}
function toSignature(signature) {
	return {
		domain: toDomain(signature.domain),
		types: signature.types,
		primaryType: signature.primaryType,
		value: signature.value
	};
}
function toStep(raw) {
	switch (raw.id) {
		case StepType.tokenApproval:
		case StepType.buy:
		case StepType.sell:
		case StepType.cancel:
		case StepType.createOffer:
		case StepType.createListing:
			if (!raw.to) throw new Error(`Transaction step ${raw.id} missing required field: to`);
			if (!raw.data) throw new Error(`Transaction step ${raw.id} missing required field: data`);
			return {
				id: raw.id,
				to: normalizeAddress(raw.to),
				data: raw.data,
				value: raw.value,
				price: raw.price,
				...raw.signature && { signature: toSignature(raw.signature) },
				...raw.post && { post: raw.post },
				...raw.executeType && { executeType: raw.executeType }
			};
		case StepType.signEIP191:
			if (!raw.post) throw new Error(`Signature step ${raw.id} missing required field: post`);
			return {
				id: raw.id,
				post: raw.post
			};
		case StepType.signEIP712:
			if (!raw.post) throw new Error(`Signature step ${raw.id} missing required field: post`);
			if (!raw.signature) throw new Error(`Signature step ${raw.id} missing required field: signature`);
			return {
				id: raw.id,
				post: raw.post,
				signature: toSignature(raw.signature)
			};
		default: throw new Error(`Unknown step type: ${raw.id}`);
	}
}
function toSteps(raw) {
	return raw.map(toStep);
}
function toCurrency(raw) {
	return {
		...raw,
		contractAddress: normalizeAddress(raw.contractAddress)
	};
}
function toCurrencies(raw) {
	return raw.map(toCurrency);
}
function toOrder(raw) {
	return {
		...raw,
		priceCurrencyAddress: normalizeAddress(raw.priceCurrencyAddress)
	};
}
function toOrders(raw) {
	return raw.map(toOrder);
}
function toCollectibleOrder(raw) {
	return {
		...raw,
		metadata: {
			...raw.metadata,
			tokenId: typeof raw.metadata.tokenId === "string" ? BigInt(raw.metadata.tokenId) : raw.metadata.tokenId
		},
		order: raw.order ? toOrder(raw.order) : void 0,
		listing: raw.listing ? toOrder(raw.listing) : void 0,
		offer: raw.offer ? toOrder(raw.offer) : void 0
	};
}
function toCollectibleOrders(raw) {
	return raw.map(toCollectibleOrder);
}
function toPrimarySaleItem(raw) {
	return {
		...raw,
		currencyAddress: normalizeAddress(raw.currencyAddress),
		itemAddress: normalizeAddress(raw.itemAddress)
	};
}
function toCollectiblePrimarySaleItem(raw) {
	return {
		...raw,
		primarySaleItem: toPrimarySaleItem(raw.primarySaleItem)
	};
}
function toCollectiblePrimarySaleItems(raw) {
	return raw.map(toCollectiblePrimarySaleItem);
}
function transformCheckoutItem(item) {
	return {
		tokenId: item.tokenId,
		quantity: item.quantity
	};
}
function transformCreateReq(req) {
	return {
		...req,
		tokenId: req.tokenId,
		quantity: req.quantity
	};
}
function transformOrderData(data) {
	return {
		orderId: data.orderId,
		quantity: data.quantity,
		tokenId: data.tokenId
	};
}
/**
* Wrapped Marketplace Client
*
* Wraps the raw Marketplace client with methods that accept normalized types (number chainId).
* Uses proxy utilities to automatically convert chainId from number to string for API calls.
* Methods are created using wrapper functions to eliminate repetitive conversion code.
*/
var MarketplaceClient = class {
	client;
	queryKey;
	generateListingTransaction;
	generateOfferTransaction;
	generateSellTransaction;
	generateCancelTransaction;
	generateBuyTransaction;
	getCollectionDetail;
	listCurrencies;
	getCollectionActiveListingsCurrencies;
	getCollectionActiveOffersCurrencies;
	getCollectible;
	getLowestPriceListingForCollectible;
	getHighestPriceOfferForCollectible;
	listListingsForCollectible;
	listOffersForCollectible;
	listOrdersWithCollectibles;
	getFloorOrder;
	getOrders;
	listCollectibles;
	listPrimarySaleItems;
	getPrimarySaleItem;
	getCountOfPrimarySaleItems;
	getCountOfFilteredCollectibles;
	getCountOfAllCollectibles;
	getCountOfListingsForCollectible;
	getCountOfOffersForCollectible;
	getCountOfFilteredOrders;
	getCountOfAllOrders;
	checkoutOptionsMarketplace;
	checkoutOptionsSalesContract;
	execute;
	constructor(hostname, fetch) {
		this.client = new Marketplace(hostname, fetch);
		this.queryKey = this.client.queryKey;
		this.generateListingTransaction = wrapWithBothTransform((req) => this.client.generateListingTransaction(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractType: req.contractType,
			listing: transformCreateReq(req.listing)
		}), (res) => ({
			...res,
			steps: toSteps(res.steps)
		}));
		this.generateOfferTransaction = wrapWithBothTransform((req) => this.client.generateOfferTransaction(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractType: req.contractType,
			offer: transformCreateReq(req.offer)
		}), (res) => ({
			...res,
			steps: toSteps(res.steps)
		}));
		this.generateSellTransaction = wrapWithBothTransform((req) => this.client.generateSellTransaction(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			ordersData: req.ordersData.map(transformOrderData)
		}), (res) => ({
			...res,
			steps: toSteps(res.steps)
		}));
		this.generateCancelTransaction = wrapWithBothTransform((req) => this.client.generateCancelTransaction(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId)
		}), (res) => ({
			...res,
			steps: toSteps(res.steps)
		}));
		this.generateBuyTransaction = wrapWithBothTransform((req) => this.client.generateBuyTransaction(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			ordersData: req.ordersData.map(transformOrderData)
		}), (res) => ({
			...res,
			steps: toSteps(res.steps)
		}));
		this.getCollectionDetail = wrapCollectionAddress((req) => this.client.getCollectionDetail(req));
		this.listCurrencies = wrapWithBothTransform((req) => this.client.listCurrencies(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId)
		}), (res) => ({
			...res,
			currencies: toCurrencies(res.currencies)
		}));
		this.getCollectionActiveListingsCurrencies = wrapWithBothTransform((req) => this.client.getCollectionActiveListingsCurrencies(req), (req) => req, (res) => ({
			...res,
			currencies: toCurrencies(res.currencies)
		}));
		this.getCollectionActiveOffersCurrencies = wrapWithBothTransform((req) => this.client.getCollectionActiveOffersCurrencies(req), (req) => req, (res) => ({
			...res,
			currencies: toCurrencies(res.currencies)
		}));
		this.getCollectible = wrapCollectionAddress((req) => this.client.getCollectible(req));
		this.getLowestPriceListingForCollectible = wrapWithBothTransform((req) => this.client.getLowestPriceListingForCollectible(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractAddress: req.collectionAddress
		}), (res) => ({
			...res,
			order: res.order ? toOrder(res.order) : void 0
		}));
		this.getHighestPriceOfferForCollectible = wrapWithBothTransform((req) => this.client.getHighestPriceOfferForCollectible(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractAddress: req.collectionAddress
		}), (res) => ({
			...res,
			order: res.order ? toOrder(res.order) : void 0
		}));
		this.listListingsForCollectible = wrapWithBothTransform((req) => this.client.listListingsForCollectible(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractAddress: req.collectionAddress
		}), (res) => ({
			...res,
			listings: toOrders(res.listings)
		}));
		this.listOffersForCollectible = wrapWithBothTransform((req) => this.client.listOffersForCollectible(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractAddress: req.collectionAddress
		}), (res) => ({
			...res,
			offers: toOrders(res.offers)
		}));
		this.listOrdersWithCollectibles = wrapWithBothTransform((req) => this.client.listOrdersWithCollectibles(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractAddress: req.collectionAddress
		}), (res) => ({
			...res,
			collectibles: toCollectibleOrders(res.collectibles)
		}));
		this.getFloorOrder = wrapWithBothTransform((req) => this.client.getFloorOrder(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractAddress: req.collectionAddress
		}), (res) => ({
			...res,
			collectible: toCollectibleOrder(res.collectible)
		}));
		this.getOrders = wrapWithBothTransform((req) => this.client.getOrders(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId)
		}), (res) => ({
			...res,
			orders: toOrders(res.orders)
		}));
		this.listCollectibles = wrapWithBothTransform((req) => this.client.listCollectibles(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			contractAddress: req.collectionAddress
		}), (res) => ({
			...res,
			collectibles: toCollectibleOrders(res.collectibles)
		}));
		this.listPrimarySaleItems = wrapWithBothTransform((req) => this.client.listPrimarySaleItems(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId)
		}), (res) => ({
			...res,
			primarySaleItems: toCollectiblePrimarySaleItems(res.primarySaleItems)
		}));
		this.getPrimarySaleItem = wrapWithBothTransform((req) => this.client.getPrimarySaleItem(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId)
		}), (res) => ({
			...res,
			item: toCollectiblePrimarySaleItem(res.item)
		}));
		this.getCountOfPrimarySaleItems = wrapChainId((req) => this.client.getCountOfPrimarySaleItems(req));
		this.getCountOfFilteredCollectibles = wrapCollectionAddress((req) => this.client.getCountOfFilteredCollectibles(req));
		this.getCountOfAllCollectibles = wrapCollectionAddress((req) => this.client.getCountOfAllCollectibles(req));
		this.getCountOfListingsForCollectible = wrapCollectionAddress((req) => this.client.getCountOfListingsForCollectible(req));
		this.getCountOfOffersForCollectible = wrapCollectionAddress((req) => this.client.getCountOfOffersForCollectible(req));
		this.getCountOfFilteredOrders = wrapCollectionAddress((req) => this.client.getCountOfFilteredOrders(req));
		this.getCountOfAllOrders = wrapCollectionAddress((req) => this.client.getCountOfAllOrders(req));
		this.checkoutOptionsMarketplace = wrapWithTransform((req) => this.client.checkoutOptionsMarketplace(req), (req) => {
			const wallet = "walletAddress" in req && req.walletAddress ? req.walletAddress : "wallet" in req && req.wallet ? req.wallet : "";
			return {
				...req,
				chainId: chainIdToString(req.chainId),
				wallet
			};
		});
		this.checkoutOptionsSalesContract = wrapWithTransform((req) => this.client.checkoutOptionsSalesContract(req), (req) => ({
			...req,
			chainId: chainIdToString(req.chainId),
			items: req.items.map(transformCheckoutItem)
		}));
		this.execute = passthrough((req) => this.client.execute(req));
	}
	/**
	* Access the underlying raw client for any methods not wrapped
	*/
	get raw() {
		return this.client;
	}
};
function isSignatureStep(step) {
	return step.id === StepType.signEIP191 || step.id === StepType.signEIP712;
}
function isTransactionStep(step) {
	return [
		StepType.tokenApproval,
		StepType.buy,
		StepType.sell,
		StepType.cancel,
		StepType.createOffer,
		StepType.createListing
	].includes(step.id);
}
/**
* Wrapped Metadata Client
*
* Wraps the raw @0xsequence/metadata client to accept normalized types (number chainId, bigint tokenId)
* and automatically convert to/from the raw API types (string chainID, string tokenID).
*/
/**
* Wrapped Metadata Client
*
* This client accepts SDK-friendly types (number for chainId, bigint for tokenId)
* and handles conversion to/from the raw API types internally.
*/
var MetadataClient = class {
	client;
	constructor(hostname, projectAccessKey, jwtAuth) {
		this.client = new SequenceMetadata(hostname, projectAccessKey, jwtAuth);
	}
	/**
	* Get contract info
	* Accepts normalized types (chainId: number)
	*/
	async getContractInfo(args) {
		const apiArgs = toGetContractInfoArgs(args);
		return toGetContractInfoReturn(await this.client.getContractInfo(apiArgs));
	}
	/**
	* Get contract info batch
	* Accepts normalized types (chainId: number)
	*/
	async getContractInfoBatch(args) {
		const apiArgs = toGetContractInfoBatchArgs(args);
		return toGetContractInfoBatchReturn(await this.client.getContractInfoBatch(apiArgs));
	}
	/**
	* Get token metadata
	* Accepts normalized types (chainId: number, tokenIds: bigint[])
	*/
	async getTokenMetadata(args) {
		const apiArgs = toGetTokenMetadataArgs(args);
		return toGetTokenMetadataReturn(await this.client.getTokenMetadata(apiArgs));
	}
	/**
	* Get token metadata batch
	* Accepts normalized types (chainId: number, tokenIds: bigint[])
	*/
	async getTokenMetadataBatch(args) {
		const apiArgs = toGetTokenMetadataBatchArgs(args);
		return toGetTokenMetadataBatchReturn(await this.client.getTokenMetadataBatch(apiArgs));
	}
	/**
	* Refresh token metadata
	* Accepts normalized types (chainId: number, tokenIds: bigint[])
	*/
	async refreshTokenMetadata(args) {
		const apiArgs = toRefreshTokenMetadataArgs(args);
		return this.client.refreshTokenMetadata(apiArgs);
	}
	/**
	* Search token metadata
	* Accepts normalized types (chainId: number)
	*/
	async searchTokenMetadata(args) {
		const apiArgs = toSearchTokenMetadataArgs(args);
		return toSearchTokenMetadataReturn(await this.client.searchTokenMetadata(apiArgs));
	}
	/**
	* Get token metadata property filters
	* Accepts normalized types (chainId: number)
	*/
	async getTokenMetadataPropertyFilters(args) {
		const apiArgs = toGetTokenMetadataPropertyFiltersArgs(args);
		return toGetTokenMetadataPropertyFiltersReturn(await this.client.getTokenMetadataPropertyFilters(apiArgs));
	}
	/**
	* Access the underlying raw client if needed
	* (for advanced use cases or methods not yet wrapped)
	*/
	get raw() {
		return this.client;
	}
};

//#endregion
export { FilterCondition as C, WalletKind as S, MarketplaceWalletType as T, PropertyType as _, builder_exports as a, TransactionCrypto as b, CollectionStatus as c, MarketplaceKind as d, MetadataStatus as f, OrderbookKind as g, OrderStatus as h, MetadataClient as i, CurrencyStatus as l, OrderSide as m, IndexerClient as n, isSignatureStep as o, OfferType as p, MarketplaceClient as r, isTransactionStep as s, ContractType$2 as t, ExecuteType as u, SortOrder as v, MarketplaceService as w, TransactionOnRampProvider as x, StepType as y };
//# sourceMappingURL=dist.js.map