//#region src/react/_internal/api/builder.gen.ts
const WebrpcHeader = "Webrpc";
const WebrpcHeaderValue = "webrpc@v0.26.0;gen-typescript@v0.17.0;sequence-builder@v0.1.0";
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
var RequestConflictError = class RequestConflictError extends WebrpcError {
	constructor(name = "RequestConflict", code = 1004, message = `Conflict with target resource`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, RequestConflictError.prototype);
	}
};
var ServiceDisabledError = class ServiceDisabledError extends WebrpcError {
	constructor(name = "ServiceDisabled", code = 1005, message = `Service disabled`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, ServiceDisabledError.prototype);
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
var EmailTemplateExistsError = class EmailTemplateExistsError extends WebrpcError {
	constructor(name = "EmailTemplateExists", code = 3004, message = `Email Template exists`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, EmailTemplateExistsError.prototype);
	}
};
var SubscriptionLimitError = class SubscriptionLimitError extends WebrpcError {
	constructor(name = "SubscriptionLimit", code = 3005, message = `Subscription limit reached`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, SubscriptionLimitError.prototype);
	}
};
var FeatureNotIncludedError = class FeatureNotIncludedError extends WebrpcError {
	constructor(name = "FeatureNotIncluded", code = 3006, message = `Feature not included`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, FeatureNotIncludedError.prototype);
	}
};
var InvalidNetworkError = class InvalidNetworkError extends WebrpcError {
	constructor(name = "InvalidNetwork", code = 3007, message = `Invalid network`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, InvalidNetworkError.prototype);
	}
};
var InvitationExpiredError = class InvitationExpiredError extends WebrpcError {
	constructor(name = "InvitationExpired", code = 4e3, message = `Invitation code is expired`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, InvitationExpiredError.prototype);
	}
};
var AlreadyCollaboratorError = class AlreadyCollaboratorError extends WebrpcError {
	constructor(name = "AlreadyCollaborator", code = 4001, message = `Already a collaborator`, status = 0, cause) {
		super(name, code, message, status, cause);
		Object.setPrototypeOf(this, AlreadyCollaboratorError.prototype);
	}
};
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
	[1004]: RequestConflictError,
	[1005]: ServiceDisabledError,
	[2e3]: TimeoutError,
	[2001]: InvalidArgumentError,
	[3e3]: NotFoundError,
	[3001]: UserNotFoundError,
	[3002]: ProjectNotFoundError,
	[3003]: InvalidTierError,
	[3004]: EmailTemplateExistsError,
	[3005]: SubscriptionLimitError,
	[3006]: FeatureNotIncludedError,
	[3007]: InvalidNetworkError,
	[4e3]: InvitationExpiredError,
	[4001]: AlreadyCollaboratorError
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
			return buildResponse(res).then((_data) => {
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

//#endregion
export { MarketplaceService as n, MarketplaceWalletType as r, FilterCondition as t };
//# sourceMappingURL=builder.gen-D7rQ1F-y.js.map