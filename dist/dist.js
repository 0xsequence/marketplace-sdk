import { match } from "path-to-regexp";
import { zeroAddress } from "viem";
import { ContractType, ContractType as ContractType$2, OrderStatus, ResourceStatus, SequenceIndexer, TransactionStatus, TransactionType } from "@0xsequence/indexer";
import { Metadata, PropertyType, ResourceStatus as ResourceStatus$1 } from "@0xsequence/metadata";

//#region ../api/dist/chunk.js
var __defProp$4 = Object.defineProperty;
var __export = (all) => {
	let target = {};
	for (var name in all) __defProp$4(target, name, {
		get: all[name],
		enumerable: true
	});
	return target;
};

//#endregion
//#region ../api/dist/HttpResponse.js
var POSITIONALS_EXP = /(%?)(%([sdijo]))/g;
function serializePositional(positional, flag) {
	switch (flag) {
		case "s": return positional;
		case "d":
		case "i": return Number(positional);
		case "j": return JSON.stringify(positional);
		case "o": {
			if (typeof positional === "string") return positional;
			const json = JSON.stringify(positional);
			if (json === "{}" || json === "[]" || /^\[object .+?\]$/.test(json)) return positional;
			return json;
		}
	}
}
function format(message$3, ...positionals) {
	if (positionals.length === 0) return message$3;
	let positionalIndex = 0;
	let formattedMessage = message$3.replace(POSITIONALS_EXP, (match$1, isEscaped, _, flag) => {
		const positional = positionals[positionalIndex];
		const value = serializePositional(positional, flag);
		if (!isEscaped) {
			positionalIndex++;
			return value;
		}
		return match$1;
	});
	if (positionalIndex < positionals.length) formattedMessage += ` ${positionals.slice(positionalIndex).join(" ")}`;
	formattedMessage = formattedMessage.replace(/%{2,2}/g, "%");
	return formattedMessage;
}
var STACK_FRAMES_TO_IGNORE = 2;
function cleanErrorStack(error$1) {
	if (!error$1.stack) return;
	const nextStack = error$1.stack.split("\n");
	nextStack.splice(1, STACK_FRAMES_TO_IGNORE);
	error$1.stack = nextStack.join("\n");
}
var InvariantError = class extends Error {
	constructor(message$3, ...positionals) {
		super(message$3);
		this.message = message$3;
		this.name = "Invariant Violation";
		this.message = format(message$3, ...positionals);
		cleanErrorStack(this);
	}
};
var invariant = (predicate, message$3, ...positionals) => {
	if (!predicate) throw new InvariantError(message$3, ...positionals);
};
invariant.as = (ErrorConstructor, predicate, message$3, ...positionals) => {
	if (!predicate) {
		const formatMessage$1 = positionals.length === 0 ? message$3 : format(message$3, ...positionals);
		let error$1;
		try {
			error$1 = Reflect.construct(ErrorConstructor, [formatMessage$1]);
		} catch (err) {
			error$1 = ErrorConstructor(formatMessage$1);
		}
		throw error$1;
	}
};
const LIBRARY_PREFIX = "[MSW]";
function formatMessage(message$3, ...positionals) {
	return `${LIBRARY_PREFIX} ${format(message$3, ...positionals)}`;
}
function warn(message$3, ...positionals) {
	console.warn(formatMessage(message$3, ...positionals));
}
function error(message$3, ...positionals) {
	console.error(formatMessage(message$3, ...positionals));
}
const devUtils = {
	formatMessage,
	warn,
	error
};
var MemoryLeakError = class extends Error {
	constructor(emitter, type, count) {
		super(`Possible EventEmitter memory leak detected. ${count} ${type.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`);
		this.emitter = emitter;
		this.type = type;
		this.count = count;
		this.name = "MaxListenersExceededWarning";
	}
};
var _Emitter = class {
	static listenerCount(emitter, eventName) {
		return emitter.listenerCount(eventName);
	}
	constructor() {
		this.events = /* @__PURE__ */ new Map();
		this.maxListeners = _Emitter.defaultMaxListeners;
		this.hasWarnedAboutPotentialMemoryLeak = false;
	}
	_emitInternalEvent(internalEventName, eventName, listener) {
		this.emit(internalEventName, ...[eventName, listener]);
	}
	_getListeners(eventName) {
		return Array.prototype.concat.apply([], this.events.get(eventName)) || [];
	}
	_removeListener(listeners, listener) {
		const index = listeners.indexOf(listener);
		if (index > -1) listeners.splice(index, 1);
		return [];
	}
	_wrapOnceListener(eventName, listener) {
		const onceListener = (...data) => {
			this.removeListener(eventName, onceListener);
			return listener.apply(this, data);
		};
		Object.defineProperty(onceListener, "name", { value: listener.name });
		return onceListener;
	}
	setMaxListeners(maxListeners) {
		this.maxListeners = maxListeners;
		return this;
	}
	/**
	* Returns the current max listener value for the `Emitter` which is
	* either set by `emitter.setMaxListeners(n)` or defaults to
	* `Emitter.defaultMaxListeners`.
	*/
	getMaxListeners() {
		return this.maxListeners;
	}
	/**
	* Returns an array listing the events for which the emitter has registered listeners.
	* The values in the array will be strings or Symbols.
	*/
	eventNames() {
		return Array.from(this.events.keys());
	}
	/**
	* Synchronously calls each of the listeners registered for the event named `eventName`,
	* in the order they were registered, passing the supplied arguments to each.
	* Returns `true` if the event has listeners, `false` otherwise.
	*
	* @example
	* const emitter = new Emitter<{ hello: [string] }>()
	* emitter.emit('hello', 'John')
	*/
	emit(eventName, ...data) {
		const listeners = this._getListeners(eventName);
		listeners.forEach((listener) => {
			listener.apply(this, data);
		});
		return listeners.length > 0;
	}
	addListener(eventName, listener) {
		this._emitInternalEvent("newListener", eventName, listener);
		const nextListeners = this._getListeners(eventName).concat(listener);
		this.events.set(eventName, nextListeners);
		if (this.maxListeners > 0 && this.listenerCount(eventName) > this.maxListeners && !this.hasWarnedAboutPotentialMemoryLeak) {
			this.hasWarnedAboutPotentialMemoryLeak = true;
			const memoryLeakWarning = new MemoryLeakError(this, eventName, this.listenerCount(eventName));
			console.warn(memoryLeakWarning);
		}
		return this;
	}
	on(eventName, listener) {
		return this.addListener(eventName, listener);
	}
	once(eventName, listener) {
		return this.addListener(eventName, this._wrapOnceListener(eventName, listener));
	}
	prependListener(eventName, listener) {
		const listeners = this._getListeners(eventName);
		if (listeners.length > 0) {
			const nextListeners = [listener].concat(listeners);
			this.events.set(eventName, nextListeners);
		} else this.events.set(eventName, listeners.concat(listener));
		return this;
	}
	prependOnceListener(eventName, listener) {
		return this.prependListener(eventName, this._wrapOnceListener(eventName, listener));
	}
	removeListener(eventName, listener) {
		const listeners = this._getListeners(eventName);
		if (listeners.length > 0) {
			this._removeListener(listeners, listener);
			this.events.set(eventName, listeners);
			this._emitInternalEvent("removeListener", eventName, listener);
		}
		return this;
	}
	/**
	* Alias for `emitter.removeListener()`.
	*
	* @example
	* emitter.off('hello', listener)
	*/
	off(eventName, listener) {
		return this.removeListener(eventName, listener);
	}
	removeAllListeners(eventName) {
		if (eventName) this.events.delete(eventName);
		else this.events.clear();
		return this;
	}
	/**
	* Returns a copy of the array of listeners for the event named `eventName`.
	*/
	listeners(eventName) {
		return Array.from(this._getListeners(eventName));
	}
	/**
	* Returns the number of listeners listening to the event named `eventName`.
	*/
	listenerCount(eventName) {
		return this._getListeners(eventName).length;
	}
	rawListeners(eventName) {
		return this.listeners(eventName);
	}
};
var Emitter = _Emitter;
Emitter.defaultMaxListeners = 10;
const SOURCE_FRAME = /[/\\]msw[/\\]src[/\\](.+)/;
const BUILD_FRAME = /(node_modules)?[/\\]lib[/\\](core|browser|node|native|iife)[/\\]|^[^/\\]*$/;
function getCallFrame(error$1) {
	const stack = error$1.stack;
	if (!stack) return;
	const declarationFrame = stack.split("\n").slice(1).find((frame) => {
		return !(SOURCE_FRAME.test(frame) || BUILD_FRAME.test(frame));
	});
	if (!declarationFrame) return;
	return declarationFrame.replace(/\s*at [^()]*\(([^)]+)\)/, "$1").replace(/^@/, "");
}
function isIterable(fn) {
	if (!fn) return false;
	return Reflect.has(fn, Symbol.iterator) || Reflect.has(fn, Symbol.asyncIterator);
}
var RequestHandler = class RequestHandler$1 {
	static cache = /* @__PURE__ */ new WeakMap();
	__kind;
	info;
	/**
	* Indicates whether this request handler has been used
	* (its resolver has successfully executed).
	*/
	isUsed;
	resolver;
	resolverIterator;
	resolverIteratorResult;
	options;
	constructor(args) {
		this.resolver = args.resolver;
		this.options = args.options;
		const callFrame = getCallFrame(/* @__PURE__ */ new Error());
		this.info = {
			...args.info,
			callFrame
		};
		this.isUsed = false;
		this.__kind = "RequestHandler";
	}
	/**
	* Parse the intercepted request to extract additional information from it.
	* Parsed result is then exposed to other methods of this request handler.
	*/
	async parse(_args) {
		return {};
	}
	/**
	* Test if this handler matches the given request.
	*
	* This method is not used internally but is exposed
	* as a convenience method for consumers writing custom
	* handlers.
	*/
	async test(args) {
		const parsedResult = await this.parse({
			request: args.request,
			resolutionContext: args.resolutionContext
		});
		return this.predicate({
			request: args.request,
			parsedResult,
			resolutionContext: args.resolutionContext
		});
	}
	extendResolverArgs(_args) {
		return {};
	}
	cloneRequestOrGetFromCache(request) {
		const existingClone = RequestHandler$1.cache.get(request);
		if (typeof existingClone !== "undefined") return existingClone;
		const clonedRequest = request.clone();
		RequestHandler$1.cache.set(request, clonedRequest);
		return clonedRequest;
	}
	/**
	* Execute this request handler and produce a mocked response
	* using the given resolver function.
	*/
	async run(args) {
		if (this.isUsed && this.options?.once) return null;
		const requestClone = this.cloneRequestOrGetFromCache(args.request);
		const parsedResult = await this.parse({
			request: args.request,
			resolutionContext: args.resolutionContext
		});
		if (!await this.predicate({
			request: args.request,
			parsedResult,
			resolutionContext: args.resolutionContext
		})) return null;
		if (this.isUsed && this.options?.once) return null;
		this.isUsed = true;
		const mockedResponse = await this.wrapResolver(this.resolver)({
			...this.extendResolverArgs({
				request: args.request,
				parsedResult
			}),
			requestId: args.requestId,
			request: args.request
		}).catch((errorOrResponse) => {
			if (errorOrResponse instanceof Response) return errorOrResponse;
			throw errorOrResponse;
		});
		return this.createExecutionResult({
			request: requestClone,
			requestId: args.requestId,
			response: mockedResponse,
			parsedResult
		});
	}
	wrapResolver(resolver) {
		return async (info) => {
			if (!this.resolverIterator) {
				const result = await resolver(info);
				if (!isIterable(result)) return result;
				this.resolverIterator = Symbol.iterator in result ? result[Symbol.iterator]() : result[Symbol.asyncIterator]();
			}
			this.isUsed = false;
			const { done, value } = await this.resolverIterator.next();
			const nextResponse = await value;
			if (nextResponse) this.resolverIteratorResult = nextResponse.clone();
			if (done) {
				this.isUsed = true;
				return this.resolverIteratorResult?.clone();
			}
			return nextResponse;
		};
	}
	createExecutionResult(args) {
		return {
			handler: this,
			request: args.request,
			requestId: args.requestId,
			response: args.response,
			parsedResult: args.parsedResult
		};
	}
};
function isStringEqual(actual, expected) {
	return actual.toLowerCase() === expected.toLowerCase();
}
function getStatusCodeColor(status) {
	if (status < 300) return "#69AB32";
	if (status < 400) return "#F0BB4B";
	return "#E95F5D";
}
function getTimestamp(options) {
	const now = /* @__PURE__ */ new Date();
	const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
	if (options?.milliseconds) return `${timestamp}.${now.getMilliseconds().toString().padStart(3, "0")}`;
	return timestamp;
}
async function serializeRequest(request) {
	const requestText = await request.clone().text();
	return {
		url: new URL(request.url),
		method: request.method,
		headers: Object.fromEntries(request.headers.entries()),
		body: requestText
	};
}
var __create$2 = Object.create;
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$2 = Object.getOwnPropertyNames;
var __getProtoOf$2 = Object.getPrototypeOf;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __commonJS$2 = (cb, mod) => function __require() {
	return mod || (0, cb[__getOwnPropNames$2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$2 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$2(from)) if (!__hasOwnProp$2.call(to, key) && key !== except) __defProp$3(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$2(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$2 = (mod, isNodeMode, target) => (target = mod != null ? __create$2(__getProtoOf$2(mod)) : {}, __copyProps$2(isNodeMode || !mod || !mod.__esModule ? __defProp$3(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_codes = __commonJS$2({ "node_modules/.pnpm/statuses@2.0.2/node_modules/statuses/codes.json"(exports, module) {
	module.exports = {
		"100": "Continue",
		"101": "Switching Protocols",
		"102": "Processing",
		"103": "Early Hints",
		"200": "OK",
		"201": "Created",
		"202": "Accepted",
		"203": "Non-Authoritative Information",
		"204": "No Content",
		"205": "Reset Content",
		"206": "Partial Content",
		"207": "Multi-Status",
		"208": "Already Reported",
		"226": "IM Used",
		"300": "Multiple Choices",
		"301": "Moved Permanently",
		"302": "Found",
		"303": "See Other",
		"304": "Not Modified",
		"305": "Use Proxy",
		"307": "Temporary Redirect",
		"308": "Permanent Redirect",
		"400": "Bad Request",
		"401": "Unauthorized",
		"402": "Payment Required",
		"403": "Forbidden",
		"404": "Not Found",
		"405": "Method Not Allowed",
		"406": "Not Acceptable",
		"407": "Proxy Authentication Required",
		"408": "Request Timeout",
		"409": "Conflict",
		"410": "Gone",
		"411": "Length Required",
		"412": "Precondition Failed",
		"413": "Payload Too Large",
		"414": "URI Too Long",
		"415": "Unsupported Media Type",
		"416": "Range Not Satisfiable",
		"417": "Expectation Failed",
		"418": "I'm a Teapot",
		"421": "Misdirected Request",
		"422": "Unprocessable Entity",
		"423": "Locked",
		"424": "Failed Dependency",
		"425": "Too Early",
		"426": "Upgrade Required",
		"428": "Precondition Required",
		"429": "Too Many Requests",
		"431": "Request Header Fields Too Large",
		"451": "Unavailable For Legal Reasons",
		"500": "Internal Server Error",
		"501": "Not Implemented",
		"502": "Bad Gateway",
		"503": "Service Unavailable",
		"504": "Gateway Timeout",
		"505": "HTTP Version Not Supported",
		"506": "Variant Also Negotiates",
		"507": "Insufficient Storage",
		"508": "Loop Detected",
		"509": "Bandwidth Limit Exceeded",
		"510": "Not Extended",
		"511": "Network Authentication Required"
	};
} });
var allStatuses = __toESM$2(__commonJS$2({ "node_modules/.pnpm/statuses@2.0.2/node_modules/statuses/index.js"(exports, module) {
	var codes = require_codes();
	module.exports = status;
	status.message = codes;
	status.code = createMessageToStatusCodeMap(codes);
	status.codes = createStatusCodeList(codes);
	status.redirect = {
		300: true,
		301: true,
		302: true,
		303: true,
		305: true,
		307: true,
		308: true
	};
	status.empty = {
		204: true,
		205: true,
		304: true
	};
	status.retry = {
		502: true,
		503: true,
		504: true
	};
	function createMessageToStatusCodeMap(codes2) {
		var map = {};
		Object.keys(codes2).forEach(function forEachCode(code) {
			var message2 = codes2[code];
			var status2 = Number(code);
			map[message2.toLowerCase()] = status2;
		});
		return map;
	}
	function createStatusCodeList(codes2) {
		return Object.keys(codes2).map(function mapCode(code) {
			return Number(code);
		});
	}
	function getStatusCode(message2) {
		var msg = message2.toLowerCase();
		if (!Object.prototype.hasOwnProperty.call(status.code, msg)) throw new Error("invalid status message: \"" + message2 + "\"");
		return status.code[msg];
	}
	function getStatusMessage(code) {
		if (!Object.prototype.hasOwnProperty.call(status.message, code)) throw new Error("invalid status code: " + code);
		return status.message[code];
	}
	function status(code) {
		if (typeof code === "number") return getStatusMessage(code);
		if (typeof code !== "string") throw new TypeError("code must be a number or string");
		var n = parseInt(code, 10);
		if (!isNaN(n)) return getStatusMessage(n);
		return getStatusCode(code);
	}
} })(), 1);
var statuses = allStatuses.default || allStatuses;
statuses.message;
var statuses_default = statuses;
/*! Bundled license information:

statuses/index.js:
(*!
* statuses
* Copyright(c) 2014 Jonathan Ong
* Copyright(c) 2016 Douglas Christopher Wilson
* MIT Licensed
*)
*/
const { message: message$1 } = statuses_default;
async function serializeResponse(response) {
	const responseClone = response.clone();
	const responseText = await responseClone.text();
	const responseStatus = responseClone.status || 200;
	return {
		status: responseStatus,
		statusText: responseClone.statusText || message$1[responseStatus] || "OK",
		headers: Object.fromEntries(responseClone.headers.entries()),
		body: responseText
	};
}
var __accessCheck = (obj, member, msg) => {
	if (!member.has(obj)) throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
	__accessCheck(obj, member, "read from private field");
	return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
	if (member.has(obj)) throw TypeError("Cannot add the same private member more than once");
	member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
function isNodeProcess() {
	if (typeof navigator !== "undefined" && navigator.product === "ReactNative") return true;
	if (typeof process !== "undefined") {
		const type = process.type;
		if (type === "renderer" || type === "worker") return false;
		return !!(process.versions && process.versions.node);
	}
	return false;
}
var __defProp$2 = Object.defineProperty;
var __export$1 = (target, all) => {
	for (var name in all) __defProp$2(target, name, {
		get: all[name],
		enumerable: true
	});
};
__export$1({}, {
	blue: () => blue,
	gray: () => gray,
	green: () => green,
	red: () => red,
	yellow: () => yellow
});
function yellow(text) {
	return `\x1B[33m${text}\x1B[0m`;
}
function blue(text) {
	return `\x1B[34m${text}\x1B[0m`;
}
function gray(text) {
	return `\x1B[90m${text}\x1B[0m`;
}
function red(text) {
	return `\x1B[31m${text}\x1B[0m`;
}
function green(text) {
	return `\x1B[32m${text}\x1B[0m`;
}
isNodeProcess();
function createDeferredExecutor() {
	const executor = (resolve, reject) => {
		executor.state = "pending";
		executor.resolve = (data) => {
			if (executor.state !== "pending") return;
			executor.result = data;
			const onFulfilled = (value) => {
				executor.state = "fulfilled";
				return value;
			};
			return resolve(data instanceof Promise ? data : Promise.resolve(data).then(onFulfilled));
		};
		executor.reject = (reason) => {
			if (executor.state !== "pending") return;
			queueMicrotask(() => {
				executor.state = "rejected";
			});
			return reject(executor.rejectionReason = reason);
		};
	};
	return executor;
}
var DeferredPromise = class extends Promise {
	#executor;
	resolve;
	reject;
	constructor(executor = null) {
		const deferredExecutor = createDeferredExecutor();
		super((originalResolve, originalReject) => {
			deferredExecutor(originalResolve, originalReject);
			executor?.(deferredExecutor.resolve, deferredExecutor.reject);
		});
		this.#executor = deferredExecutor;
		this.resolve = this.#executor.resolve;
		this.reject = this.#executor.reject;
	}
	get state() {
		return this.#executor.state;
	}
	get rejectionReason() {
		return this.#executor.rejectionReason;
	}
	then(onFulfilled, onRejected) {
		return this.#decorate(super.then(onFulfilled, onRejected));
	}
	catch(onRejected) {
		return this.#decorate(super.catch(onRejected));
	}
	finally(onfinally) {
		return this.#decorate(super.finally(onfinally));
	}
	#decorate(promise) {
		return Object.defineProperties(promise, {
			resolve: {
				configurable: true,
				value: this.resolve
			},
			reject: {
				configurable: true,
				value: this.reject
			}
		});
	}
};
var InterceptorError = class extends Error {
	constructor(message$3) {
		super(message$3);
		this.name = "InterceptorError";
		Object.setPrototypeOf(this, InterceptorError.prototype);
	}
};
var _handled, handled_get;
var _RequestController = class {
	constructor(request, source) {
		this.request = request;
		this.source = source;
		__privateAdd(this, _handled);
		this.readyState = _RequestController.PENDING;
		this.handled = new DeferredPromise();
	}
	/**
	* Perform this request as-is.
	*/
	async passthrough() {
		invariant.as(InterceptorError, this.readyState === _RequestController.PENDING, "Failed to passthrough the \"%s %s\" request: the request has already been handled", this.request.method, this.request.url);
		this.readyState = _RequestController.PASSTHROUGH;
		await this.source.passthrough();
		__privateGet(this, _handled, handled_get).resolve();
	}
	/**
	* Respond to this request with the given `Response` instance.
	*
	* @example
	* controller.respondWith(new Response())
	* controller.respondWith(Response.json({ id }))
	* controller.respondWith(Response.error())
	*/
	respondWith(response) {
		invariant.as(InterceptorError, this.readyState === _RequestController.PENDING, "Failed to respond to the \"%s %s\" request with \"%d %s\": the request has already been handled (%d)", this.request.method, this.request.url, response.status, response.statusText || "OK", this.readyState);
		this.readyState = _RequestController.RESPONSE;
		__privateGet(this, _handled, handled_get).resolve();
		this.source.respondWith(response);
	}
	/**
	* Error this request with the given reason.
	*
	* @example
	* controller.errorWith()
	* controller.errorWith(new Error('Oops!'))
	* controller.errorWith({ message: 'Oops!'})
	*/
	errorWith(reason) {
		invariant.as(InterceptorError, this.readyState === _RequestController.PENDING, "Failed to error the \"%s %s\" request with \"%s\": the request has already been handled (%d)", this.request.method, this.request.url, reason == null ? void 0 : reason.toString(), this.readyState);
		this.readyState = _RequestController.ERROR;
		this.source.errorWith(reason);
		__privateGet(this, _handled, handled_get).resolve();
	}
};
var RequestController = _RequestController;
_handled = /* @__PURE__ */ new WeakSet();
handled_get = function() {
	return this.handled;
};
RequestController.PENDING = 0;
RequestController.PASSTHROUGH = 1;
RequestController.RESPONSE = 2;
RequestController.ERROR = 3;
function canParseUrl(url) {
	try {
		new URL(url);
		return true;
	} catch (_error) {
		return false;
	}
}
function getValueBySymbol(symbolName, source) {
	const symbol = Object.getOwnPropertySymbols(source).find((symbol2) => {
		return symbol2.description === symbolName;
	});
	if (symbol) return Reflect.get(source, symbol);
}
var _FetchResponse = class extends Response {
	static isConfigurableStatusCode(status) {
		return status >= 200 && status <= 599;
	}
	static isRedirectResponse(status) {
		return _FetchResponse.STATUS_CODES_WITH_REDIRECT.includes(status);
	}
	/**
	* Returns a boolean indicating whether the given response status
	* code represents a response that can have a body.
	*/
	static isResponseWithBody(status) {
		return !_FetchResponse.STATUS_CODES_WITHOUT_BODY.includes(status);
	}
	static setUrl(url, response) {
		if (!url || url === "about:" || !canParseUrl(url)) return;
		const state = getValueBySymbol("state", response);
		if (state) state.urlList.push(new URL(url));
		else Object.defineProperty(response, "url", {
			value: url,
			enumerable: true,
			configurable: true,
			writable: false
		});
	}
	/**
	* Parses the given raw HTTP headers into a Fetch API `Headers` instance.
	*/
	static parseRawHeaders(rawHeaders) {
		const headers = new Headers();
		for (let line = 0; line < rawHeaders.length; line += 2) headers.append(rawHeaders[line], rawHeaders[line + 1]);
		return headers;
	}
	constructor(body, init = {}) {
		var _a$1;
		const status = (_a$1 = init.status) != null ? _a$1 : 200;
		const safeStatus = _FetchResponse.isConfigurableStatusCode(status) ? status : 200;
		const finalBody = _FetchResponse.isResponseWithBody(status) ? body : null;
		super(finalBody, {
			status: safeStatus,
			statusText: init.statusText,
			headers: init.headers
		});
		if (status !== safeStatus) {
			const state = getValueBySymbol("state", this);
			if (state) state.status = status;
			else Object.defineProperty(this, "status", {
				value: status,
				enumerable: true,
				configurable: true,
				writable: false
			});
		}
		_FetchResponse.setUrl(init.url, this);
	}
};
var FetchResponse = _FetchResponse;
/**
* Response status codes for responses that cannot have body.
* @see https://fetch.spec.whatwg.org/#statuses
*/
FetchResponse.STATUS_CODES_WITHOUT_BODY = [
	101,
	103,
	204,
	205,
	304
];
FetchResponse.STATUS_CODES_WITH_REDIRECT = [
	301,
	302,
	303,
	307,
	308
];
new TextEncoder();
function getCleanUrl(url, isAbsolute = true) {
	return [isAbsolute && url.origin, url.pathname].filter(Boolean).join("");
}
const REDUNDANT_CHARACTERS_EXP = /[?|#].*$/g;
function cleanUrl(path) {
	if (path.endsWith("?")) return path;
	return path.replace(REDUNDANT_CHARACTERS_EXP, "");
}
function isAbsoluteUrl(url) {
	return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function getAbsoluteUrl(path, baseUrl) {
	if (isAbsoluteUrl(path)) return path;
	if (path.startsWith("*")) return path;
	const origin = baseUrl || typeof location !== "undefined" && location.href;
	return origin ? decodeURI(new URL(encodeURI(path), origin).href) : path;
}
function normalizePath(path, baseUrl) {
	if (path instanceof RegExp) return path;
	return cleanUrl(getAbsoluteUrl(path, baseUrl));
}
function coercePath(path) {
	return path.replace(/([:a-zA-Z_-]*)(\*{1,2})+/g, (_, parameterName, wildcard) => {
		const expression = "(.*)";
		if (!parameterName) return expression;
		return parameterName.startsWith(":") ? `${parameterName}${wildcard}` : `${parameterName}${expression}`;
	}).replace(/([^/])(:)(?=\d+)/, "$1\\$2").replace(/^([^/]+)(:)(?=\/\/)/, "$1\\$2");
}
function matchRequestUrl(url, path, baseUrl) {
	const normalizedPath = normalizePath(path, baseUrl);
	const cleanPath = typeof normalizedPath === "string" ? coercePath(normalizedPath) : normalizedPath;
	const cleanUrl$1 = getCleanUrl(url);
	const result = match(cleanPath, { decode: decodeURIComponent })(cleanUrl$1);
	const params = result && result.params || {};
	return {
		matches: result !== false,
		params
	};
}
function toPublicUrl(url) {
	if (typeof location === "undefined") return url.toString();
	const urlInstance = url instanceof URL ? url : new URL(url);
	return urlInstance.origin === location.origin ? urlInstance.pathname : urlInstance.origin + urlInstance.pathname;
}
var __create$1 = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __getProtoOf$1 = Object.getPrototypeOf;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __commonJS$1 = (cb, mod) => function __require() {
	return mod || (0, cb[__getOwnPropNames$1(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$1 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$1(from)) if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$1 = (mod, isNodeMode, target) => (target = mod != null ? __create$1(__getProtoOf$1(mod)) : {}, __copyProps$1(isNodeMode || !mod || !mod.__esModule ? __defProp$1(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var allCookie = __toESM$1(__commonJS$1({ "node_modules/.pnpm/cookie@1.0.2/node_modules/cookie/dist/index.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parse = parse2;
	exports.serialize = serialize2;
	var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
	var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
	var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
	var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
	var __toString = Object.prototype.toString;
	var NullObject = /* @__PURE__ */ (() => {
		const C = function() {};
		C.prototype = /* @__PURE__ */ Object.create(null);
		return C;
	})();
	function parse2(str, options) {
		const obj = new NullObject();
		const len = str.length;
		if (len < 2) return obj;
		const dec = options?.decode || decode;
		let index = 0;
		do {
			const eqIdx = str.indexOf("=", index);
			if (eqIdx === -1) break;
			const colonIdx = str.indexOf(";", index);
			const endIdx = colonIdx === -1 ? len : colonIdx;
			if (eqIdx > endIdx) {
				index = str.lastIndexOf(";", eqIdx - 1) + 1;
				continue;
			}
			const keyStartIdx = startIndex(str, index, eqIdx);
			const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
			const key = str.slice(keyStartIdx, keyEndIdx);
			if (obj[key] === void 0) {
				let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
				let valEndIdx = endIndex(str, endIdx, valStartIdx);
				obj[key] = dec(str.slice(valStartIdx, valEndIdx));
			}
			index = endIdx + 1;
		} while (index < len);
		return obj;
	}
	function startIndex(str, index, max) {
		do {
			const code = str.charCodeAt(index);
			if (code !== 32 && code !== 9) return index;
		} while (++index < max);
		return max;
	}
	function endIndex(str, index, min) {
		while (index > min) {
			const code = str.charCodeAt(--index);
			if (code !== 32 && code !== 9) return index + 1;
		}
		return min;
	}
	function serialize2(name, val, options) {
		const enc = options?.encode || encodeURIComponent;
		if (!cookieNameRegExp.test(name)) throw new TypeError(`argument name is invalid: ${name}`);
		const value = enc(val);
		if (!cookieValueRegExp.test(value)) throw new TypeError(`argument val is invalid: ${val}`);
		let str = name + "=" + value;
		if (!options) return str;
		if (options.maxAge !== void 0) {
			if (!Number.isInteger(options.maxAge)) throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
			str += "; Max-Age=" + options.maxAge;
		}
		if (options.domain) {
			if (!domainValueRegExp.test(options.domain)) throw new TypeError(`option domain is invalid: ${options.domain}`);
			str += "; Domain=" + options.domain;
		}
		if (options.path) {
			if (!pathValueRegExp.test(options.path)) throw new TypeError(`option path is invalid: ${options.path}`);
			str += "; Path=" + options.path;
		}
		if (options.expires) {
			if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) throw new TypeError(`option expires is invalid: ${options.expires}`);
			str += "; Expires=" + options.expires.toUTCString();
		}
		if (options.httpOnly) str += "; HttpOnly";
		if (options.secure) str += "; Secure";
		if (options.partitioned) str += "; Partitioned";
		if (options.priority) switch (typeof options.priority === "string" ? options.priority.toLowerCase() : void 0) {
			case "low":
				str += "; Priority=Low";
				break;
			case "medium":
				str += "; Priority=Medium";
				break;
			case "high":
				str += "; Priority=High";
				break;
			default: throw new TypeError(`option priority is invalid: ${options.priority}`);
		}
		if (options.sameSite) switch (typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite) {
			case true:
			case "strict":
				str += "; SameSite=Strict";
				break;
			case "lax":
				str += "; SameSite=Lax";
				break;
			case "none":
				str += "; SameSite=None";
				break;
			default: throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
		}
		return str;
	}
	function decode(str) {
		if (str.indexOf("%") === -1) return str;
		try {
			return decodeURIComponent(str);
		} catch (e) {
			return str;
		}
	}
	function isDate(val) {
		return __toString.call(val) === "[object Date]";
	}
} })(), 1);
var cookie = allCookie.default || allCookie;
var parse = cookie.parse;
var serialize = cookie.serialize;
/**
* Check if `vhost` is a valid suffix of `hostname` (top-domain)
*
* It means that `vhost` needs to be a suffix of `hostname` and we then need to
* make sure that: either they are equal, or the character preceding `vhost` in
* `hostname` is a '.' (it should not be a partial label).
*
* * hostname = 'not.evil.com' and vhost = 'vil.com'      => not ok
* * hostname = 'not.evil.com' and vhost = 'evil.com'     => ok
* * hostname = 'not.evil.com' and vhost = 'not.evil.com' => ok
*/
function shareSameDomainSuffix(hostname, vhost) {
	if (hostname.endsWith(vhost)) return hostname.length === vhost.length || hostname[hostname.length - vhost.length - 1] === ".";
	return false;
}
/**
* Given a hostname and its public suffix, extract the general domain.
*/
function extractDomainWithSuffix(hostname, publicSuffix) {
	const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
	const lastDotBeforeSuffixIndex = hostname.lastIndexOf(".", publicSuffixIndex);
	if (lastDotBeforeSuffixIndex === -1) return hostname;
	return hostname.slice(lastDotBeforeSuffixIndex + 1);
}
/**
* Detects the domain based on rules and upon and a host string
*/
function getDomain$1(suffix, hostname, options) {
	if (options.validHosts !== null) {
		const validHosts = options.validHosts;
		for (const vhost of validHosts) if (shareSameDomainSuffix(hostname, vhost)) return vhost;
	}
	let numberOfLeadingDots = 0;
	if (hostname.startsWith(".")) while (numberOfLeadingDots < hostname.length && hostname[numberOfLeadingDots] === ".") numberOfLeadingDots += 1;
	if (suffix.length === hostname.length - numberOfLeadingDots) return null;
	return extractDomainWithSuffix(hostname, suffix);
}
/**
* Return the part of domain without suffix.
*
* Example: for domain 'foo.com', the result would be 'foo'.
*/
function getDomainWithoutSuffix(domain, suffix) {
	return domain.slice(0, -suffix.length - 1);
}
/**
* @param url - URL we want to extract a hostname from.
* @param urlIsValidHostname - hint from caller; true if `url` is already a valid hostname.
*/
function extractHostname(url, urlIsValidHostname) {
	let start = 0;
	let end = url.length;
	let hasUpper = false;
	if (!urlIsValidHostname) {
		if (url.startsWith("data:")) return null;
		while (start < url.length && url.charCodeAt(start) <= 32) start += 1;
		while (end > start + 1 && url.charCodeAt(end - 1) <= 32) end -= 1;
		if (url.charCodeAt(start) === 47 && url.charCodeAt(start + 1) === 47) start += 2;
		else {
			const indexOfProtocol = url.indexOf(":/", start);
			if (indexOfProtocol !== -1) {
				const protocolSize = indexOfProtocol - start;
				const c0 = url.charCodeAt(start);
				const c1 = url.charCodeAt(start + 1);
				const c2 = url.charCodeAt(start + 2);
				const c3 = url.charCodeAt(start + 3);
				const c4 = url.charCodeAt(start + 4);
				if (protocolSize === 5 && c0 === 104 && c1 === 116 && c2 === 116 && c3 === 112 && c4 === 115) {} else if (protocolSize === 4 && c0 === 104 && c1 === 116 && c2 === 116 && c3 === 112) {} else if (protocolSize === 3 && c0 === 119 && c1 === 115 && c2 === 115) {} else if (protocolSize === 2 && c0 === 119 && c1 === 115) {} else for (let i = start; i < indexOfProtocol; i += 1) {
					const lowerCaseCode = url.charCodeAt(i) | 32;
					if (!(lowerCaseCode >= 97 && lowerCaseCode <= 122 || lowerCaseCode >= 48 && lowerCaseCode <= 57 || lowerCaseCode === 46 || lowerCaseCode === 45 || lowerCaseCode === 43)) return null;
				}
				start = indexOfProtocol + 2;
				while (url.charCodeAt(start) === 47) start += 1;
			}
		}
		let indexOfIdentifier = -1;
		let indexOfClosingBracket = -1;
		let indexOfPort = -1;
		for (let i = start; i < end; i += 1) {
			const code = url.charCodeAt(i);
			if (code === 35 || code === 47 || code === 63) {
				end = i;
				break;
			} else if (code === 64) indexOfIdentifier = i;
			else if (code === 93) indexOfClosingBracket = i;
			else if (code === 58) indexOfPort = i;
			else if (code >= 65 && code <= 90) hasUpper = true;
		}
		if (indexOfIdentifier !== -1 && indexOfIdentifier > start && indexOfIdentifier < end) start = indexOfIdentifier + 1;
		if (url.charCodeAt(start) === 91) {
			if (indexOfClosingBracket !== -1) return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
			return null;
		} else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end) end = indexOfPort;
	}
	while (end > start + 1 && url.charCodeAt(end - 1) === 46) end -= 1;
	const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
	if (hasUpper) return hostname.toLowerCase();
	return hostname;
}
/**
* Check if a hostname is an IP. You should be aware that this only works
* because `hostname` is already garanteed to be a valid hostname!
*/
function isProbablyIpv4(hostname) {
	if (hostname.length < 7) return false;
	if (hostname.length > 15) return false;
	let numberOfDots = 0;
	for (let i = 0; i < hostname.length; i += 1) {
		const code = hostname.charCodeAt(i);
		if (code === 46) numberOfDots += 1;
		else if (code < 48 || code > 57) return false;
	}
	return numberOfDots === 3 && hostname.charCodeAt(0) !== 46 && hostname.charCodeAt(hostname.length - 1) !== 46;
}
/**
* Similar to isProbablyIpv4.
*/
function isProbablyIpv6(hostname) {
	if (hostname.length < 3) return false;
	let start = hostname.startsWith("[") ? 1 : 0;
	let end = hostname.length;
	if (hostname[end - 1] === "]") end -= 1;
	if (end - start > 39) return false;
	let hasColon = false;
	for (; start < end; start += 1) {
		const code = hostname.charCodeAt(start);
		if (code === 58) hasColon = true;
		else if (!(code >= 48 && code <= 57 || code >= 97 && code <= 102 || code >= 65 && code <= 90)) return false;
	}
	return hasColon;
}
/**
* Check if `hostname` is *probably* a valid ip addr (either ipv6 or ipv4).
* This *will not* work on any string. We need `hostname` to be a valid
* hostname.
*/
function isIp(hostname) {
	return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
}
/**
* Implements fast shallow verification of hostnames. This does not perform a
* struct check on the content of labels (classes of Unicode characters, etc.)
* but instead check that the structure is valid (number of labels, length of
* labels, etc.).
*
* If you need stricter validation, consider using an external library.
*/
function isValidAscii(code) {
	return code >= 97 && code <= 122 || code >= 48 && code <= 57 || code > 127;
}
/**
* Check if a hostname string is valid. It's usually a preliminary check before
* trying to use getDomain or anything else.
*
* Beware: it does not check if the TLD exists.
*/
function is_valid_default(hostname) {
	if (hostname.length > 255) return false;
	if (hostname.length === 0) return false;
	if (!isValidAscii(hostname.charCodeAt(0)) && hostname.charCodeAt(0) !== 46 && hostname.charCodeAt(0) !== 95) return false;
	let lastDotIndex = -1;
	let lastCharCode = -1;
	const len = hostname.length;
	for (let i = 0; i < len; i += 1) {
		const code = hostname.charCodeAt(i);
		if (code === 46) {
			if (i - lastDotIndex > 64 || lastCharCode === 46 || lastCharCode === 45 || lastCharCode === 95) return false;
			lastDotIndex = i;
		} else if (!(isValidAscii(code) || code === 45 || code === 95)) return false;
		lastCharCode = code;
	}
	return len - lastDotIndex - 1 <= 63 && lastCharCode !== 45;
}
function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, extractHostname: extractHostname$1 = true, mixedInputs = true, validHosts = null, validateHostname = true }) {
	return {
		allowIcannDomains,
		allowPrivateDomains,
		detectIp,
		extractHostname: extractHostname$1,
		mixedInputs,
		validHosts,
		validateHostname
	};
}
const DEFAULT_OPTIONS = setDefaultsImpl({});
function setDefaults(options) {
	if (options === void 0) return DEFAULT_OPTIONS;
	return setDefaultsImpl(options);
}
/**
* Returns the subdomain of a hostname string
*/
function getSubdomain(hostname, domain) {
	if (domain.length === hostname.length) return "";
	return hostname.slice(0, -domain.length - 1);
}
/**
* Implement a factory allowing to plug different implementations of suffix
* lookup (e.g.: using a trie or the packed hashes datastructures). This is used
* and exposed in `tldts.ts` and `tldts-experimental.ts` bundle entrypoints.
*/
function getEmptyResult() {
	return {
		domain: null,
		domainWithoutSuffix: null,
		hostname: null,
		isIcann: null,
		isIp: null,
		isPrivate: null,
		publicSuffix: null,
		subdomain: null
	};
}
function resetResult(result) {
	result.domain = null;
	result.domainWithoutSuffix = null;
	result.hostname = null;
	result.isIcann = null;
	result.isIp = null;
	result.isPrivate = null;
	result.publicSuffix = null;
	result.subdomain = null;
}
let FLAG = /* @__PURE__ */ function(FLAG$1) {
	FLAG$1[FLAG$1["HOSTNAME"] = 0] = "HOSTNAME";
	FLAG$1[FLAG$1["IS_VALID"] = 1] = "IS_VALID";
	FLAG$1[FLAG$1["PUBLIC_SUFFIX"] = 2] = "PUBLIC_SUFFIX";
	FLAG$1[FLAG$1["DOMAIN"] = 3] = "DOMAIN";
	FLAG$1[FLAG$1["SUB_DOMAIN"] = 4] = "SUB_DOMAIN";
	FLAG$1[FLAG$1["ALL"] = 5] = "ALL";
	return FLAG$1;
}({});
function parseImpl(url, step, suffixLookup$1, partialOptions, result) {
	const options = setDefaults(partialOptions);
	if (typeof url !== "string") return result;
	if (!options.extractHostname) result.hostname = url;
	else if (options.mixedInputs) result.hostname = extractHostname(url, is_valid_default(url));
	else result.hostname = extractHostname(url, false);
	if (options.detectIp && result.hostname !== null) {
		result.isIp = isIp(result.hostname);
		if (result.isIp) return result;
	}
	if (options.validateHostname && options.extractHostname && result.hostname !== null && !is_valid_default(result.hostname)) {
		result.hostname = null;
		return result;
	}
	if (step === FLAG.HOSTNAME || result.hostname === null) return result;
	suffixLookup$1(result.hostname, options, result);
	if (step === FLAG.PUBLIC_SUFFIX || result.publicSuffix === null) return result;
	result.domain = getDomain$1(result.publicSuffix, result.hostname, options);
	if (step === FLAG.DOMAIN || result.domain === null) return result;
	result.subdomain = getSubdomain(result.hostname, result.domain);
	if (step === FLAG.SUB_DOMAIN) return result;
	result.domainWithoutSuffix = getDomainWithoutSuffix(result.domain, result.publicSuffix);
	return result;
}
function fast_path_default(hostname, options, out) {
	if (!options.allowPrivateDomains && hostname.length > 3) {
		const last = hostname.length - 1;
		const c3 = hostname.charCodeAt(last);
		const c2 = hostname.charCodeAt(last - 1);
		const c1 = hostname.charCodeAt(last - 2);
		const c0 = hostname.charCodeAt(last - 3);
		if (c3 === 109 && c2 === 111 && c1 === 99 && c0 === 46) {
			out.isIcann = true;
			out.isPrivate = false;
			out.publicSuffix = "com";
			return true;
		} else if (c3 === 103 && c2 === 114 && c1 === 111 && c0 === 46) {
			out.isIcann = true;
			out.isPrivate = false;
			out.publicSuffix = "org";
			return true;
		} else if (c3 === 117 && c2 === 100 && c1 === 101 && c0 === 46) {
			out.isIcann = true;
			out.isPrivate = false;
			out.publicSuffix = "edu";
			return true;
		} else if (c3 === 118 && c2 === 111 && c1 === 103 && c0 === 46) {
			out.isIcann = true;
			out.isPrivate = false;
			out.publicSuffix = "gov";
			return true;
		} else if (c3 === 116 && c2 === 101 && c1 === 110 && c0 === 46) {
			out.isIcann = true;
			out.isPrivate = false;
			out.publicSuffix = "net";
			return true;
		} else if (c3 === 101 && c2 === 100 && c1 === 46) {
			out.isIcann = true;
			out.isPrivate = false;
			out.publicSuffix = "de";
			return true;
		}
	}
	return false;
}
const exceptions = (function() {
	const _0 = [1, {}], _1 = [0, { "city": _0 }];
	return [0, {
		"ck": [0, { "www": _0 }],
		"jp": [0, {
			"kawasaki": _1,
			"kitakyushu": _1,
			"kobe": _1,
			"nagoya": _1,
			"sapporo": _1,
			"sendai": _1,
			"yokohama": _1
		}]
	}];
})();
const rules = (function() {
	const _2 = [1, {}], _3 = [2, {}], _4 = [1, {
		"com": _2,
		"edu": _2,
		"gov": _2,
		"net": _2,
		"org": _2
	}], _5 = [1, {
		"com": _2,
		"edu": _2,
		"gov": _2,
		"mil": _2,
		"net": _2,
		"org": _2
	}], _6 = [0, { "*": _3 }], _7 = [2, { "s": _6 }], _8 = [0, { "relay": _3 }], _9 = [2, { "id": _3 }], _10 = [1, { "gov": _2 }], _11 = [2, { "vps": _3 }], _12 = [0, {
		"airflow": _6,
		"transfer-webapp": _3
	}], _13 = [0, {
		"transfer-webapp": _3,
		"transfer-webapp-fips": _3
	}], _14 = [0, {
		"notebook": _3,
		"studio": _3
	}], _15 = [0, {
		"labeling": _3,
		"notebook": _3,
		"studio": _3
	}], _16 = [0, { "notebook": _3 }], _17 = [0, {
		"labeling": _3,
		"notebook": _3,
		"notebook-fips": _3,
		"studio": _3
	}], _18 = [0, {
		"notebook": _3,
		"notebook-fips": _3,
		"studio": _3,
		"studio-fips": _3
	}], _19 = [0, { "shop": _3 }], _20 = [0, { "*": _2 }], _21 = [1, { "co": _3 }], _22 = [0, { "objects": _3 }], _23 = [2, { "nodes": _3 }], _24 = [0, { "my": _3 }], _25 = [0, {
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-website": _3
	}], _26 = [0, {
		"s3": _3,
		"s3-accesspoint": _3
	}], _27 = [0, { "direct": _3 }], _28 = [0, { "webview-assets": _3 }], _29 = [0, {
		"vfs": _3,
		"webview-assets": _3
	}], _30 = [0, {
		"execute-api": _3,
		"emrappui-prod": _3,
		"emrnotebooks-prod": _3,
		"emrstudio-prod": _3,
		"dualstack": _25,
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-object-lambda": _3,
		"s3-website": _3,
		"aws-cloud9": _28,
		"cloud9": _29
	}], _31 = [0, {
		"execute-api": _3,
		"emrappui-prod": _3,
		"emrnotebooks-prod": _3,
		"emrstudio-prod": _3,
		"dualstack": _26,
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-object-lambda": _3,
		"s3-website": _3,
		"aws-cloud9": _28,
		"cloud9": _29
	}], _32 = [0, {
		"execute-api": _3,
		"emrappui-prod": _3,
		"emrnotebooks-prod": _3,
		"emrstudio-prod": _3,
		"dualstack": _25,
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-object-lambda": _3,
		"s3-website": _3,
		"analytics-gateway": _3,
		"aws-cloud9": _28,
		"cloud9": _29
	}], _33 = [0, {
		"execute-api": _3,
		"emrappui-prod": _3,
		"emrnotebooks-prod": _3,
		"emrstudio-prod": _3,
		"dualstack": _25,
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-object-lambda": _3,
		"s3-website": _3
	}], _34 = [0, {
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-accesspoint-fips": _3,
		"s3-fips": _3,
		"s3-website": _3
	}], _35 = [0, {
		"execute-api": _3,
		"emrappui-prod": _3,
		"emrnotebooks-prod": _3,
		"emrstudio-prod": _3,
		"dualstack": _34,
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-accesspoint-fips": _3,
		"s3-fips": _3,
		"s3-object-lambda": _3,
		"s3-website": _3,
		"aws-cloud9": _28,
		"cloud9": _29
	}], _36 = [0, {
		"execute-api": _3,
		"emrappui-prod": _3,
		"emrnotebooks-prod": _3,
		"emrstudio-prod": _3,
		"dualstack": _34,
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-accesspoint-fips": _3,
		"s3-deprecated": _3,
		"s3-fips": _3,
		"s3-object-lambda": _3,
		"s3-website": _3,
		"analytics-gateway": _3,
		"aws-cloud9": _28,
		"cloud9": _29
	}], _37 = [0, {
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-accesspoint-fips": _3,
		"s3-fips": _3
	}], _38 = [0, {
		"execute-api": _3,
		"emrappui-prod": _3,
		"emrnotebooks-prod": _3,
		"emrstudio-prod": _3,
		"dualstack": _37,
		"s3": _3,
		"s3-accesspoint": _3,
		"s3-accesspoint-fips": _3,
		"s3-fips": _3,
		"s3-object-lambda": _3,
		"s3-website": _3
	}], _39 = [0, { "auth": _3 }], _40 = [0, {
		"auth": _3,
		"auth-fips": _3
	}], _41 = [0, { "auth-fips": _3 }], _42 = [0, { "apps": _3 }], _43 = [0, { "paas": _3 }], _44 = [2, { "eu": _3 }], _45 = [0, { "app": _3 }], _46 = [0, { "site": _3 }], _47 = [1, {
		"com": _2,
		"edu": _2,
		"net": _2,
		"org": _2
	}], _48 = [0, { "j": _3 }], _49 = [0, { "dyn": _3 }], _50 = [2, { "web": _3 }], _51 = [1, {
		"co": _2,
		"com": _2,
		"edu": _2,
		"gov": _2,
		"net": _2,
		"org": _2
	}], _52 = [0, { "p": _3 }], _53 = [0, { "user": _3 }], _54 = [0, { "cdn": _3 }], _55 = [2, { "raw": _6 }], _56 = [0, {
		"cust": _3,
		"reservd": _3
	}], _57 = [0, { "cust": _3 }], _58 = [0, { "s3": _3 }], _59 = [1, {
		"biz": _2,
		"com": _2,
		"edu": _2,
		"gov": _2,
		"info": _2,
		"net": _2,
		"org": _2
	}], _60 = [0, { "ipfs": _3 }], _61 = [1, { "framer": _3 }], _62 = [0, { "forgot": _3 }], _63 = [1, { "gs": _2 }], _64 = [0, { "nes": _2 }], _65 = [1, {
		"k12": _2,
		"cc": _2,
		"lib": _2
	}], _66 = [1, { "cc": _2 }], _67 = [1, {
		"cc": _2,
		"lib": _2
	}];
	return [0, {
		"ac": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"drr": _3,
			"feedback": _3,
			"forms": _3
		}],
		"ad": _2,
		"ae": [1, {
			"ac": _2,
			"co": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"sch": _2
		}],
		"aero": [1, {
			"airline": _2,
			"airport": _2,
			"accident-investigation": _2,
			"accident-prevention": _2,
			"aerobatic": _2,
			"aeroclub": _2,
			"aerodrome": _2,
			"agents": _2,
			"air-surveillance": _2,
			"air-traffic-control": _2,
			"aircraft": _2,
			"airtraffic": _2,
			"ambulance": _2,
			"association": _2,
			"author": _2,
			"ballooning": _2,
			"broker": _2,
			"caa": _2,
			"cargo": _2,
			"catering": _2,
			"certification": _2,
			"championship": _2,
			"charter": _2,
			"civilaviation": _2,
			"club": _2,
			"conference": _2,
			"consultant": _2,
			"consulting": _2,
			"control": _2,
			"council": _2,
			"crew": _2,
			"design": _2,
			"dgca": _2,
			"educator": _2,
			"emergency": _2,
			"engine": _2,
			"engineer": _2,
			"entertainment": _2,
			"equipment": _2,
			"exchange": _2,
			"express": _2,
			"federation": _2,
			"flight": _2,
			"freight": _2,
			"fuel": _2,
			"gliding": _2,
			"government": _2,
			"groundhandling": _2,
			"group": _2,
			"hanggliding": _2,
			"homebuilt": _2,
			"insurance": _2,
			"journal": _2,
			"journalist": _2,
			"leasing": _2,
			"logistics": _2,
			"magazine": _2,
			"maintenance": _2,
			"marketplace": _2,
			"media": _2,
			"microlight": _2,
			"modelling": _2,
			"navigation": _2,
			"parachuting": _2,
			"paragliding": _2,
			"passenger-association": _2,
			"pilot": _2,
			"press": _2,
			"production": _2,
			"recreation": _2,
			"repbody": _2,
			"res": _2,
			"research": _2,
			"rotorcraft": _2,
			"safety": _2,
			"scientist": _2,
			"services": _2,
			"show": _2,
			"skydiving": _2,
			"software": _2,
			"student": _2,
			"taxi": _2,
			"trader": _2,
			"trading": _2,
			"trainer": _2,
			"union": _2,
			"workinggroup": _2,
			"works": _2
		}],
		"af": _4,
		"ag": [1, {
			"co": _2,
			"com": _2,
			"net": _2,
			"nom": _2,
			"org": _2,
			"obj": _3
		}],
		"ai": [1, {
			"com": _2,
			"net": _2,
			"off": _2,
			"org": _2,
			"uwu": _3,
			"framer": _3
		}],
		"al": _5,
		"am": [1, {
			"co": _2,
			"com": _2,
			"commune": _2,
			"net": _2,
			"org": _2,
			"radio": _3
		}],
		"ao": [1, {
			"co": _2,
			"ed": _2,
			"edu": _2,
			"gov": _2,
			"gv": _2,
			"it": _2,
			"og": _2,
			"org": _2,
			"pb": _2
		}],
		"aq": _2,
		"ar": [1, {
			"bet": _2,
			"com": _2,
			"coop": _2,
			"edu": _2,
			"gob": _2,
			"gov": _2,
			"int": _2,
			"mil": _2,
			"musica": _2,
			"mutual": _2,
			"net": _2,
			"org": _2,
			"seg": _2,
			"senasa": _2,
			"tur": _2
		}],
		"arpa": [1, {
			"e164": _2,
			"home": _2,
			"in-addr": _2,
			"ip6": _2,
			"iris": _2,
			"uri": _2,
			"urn": _2
		}],
		"as": _10,
		"asia": [1, {
			"cloudns": _3,
			"daemon": _3,
			"dix": _3
		}],
		"at": [1, {
			"4": _3,
			"ac": [1, { "sth": _2 }],
			"co": _2,
			"gv": _2,
			"or": _2,
			"funkfeuer": [0, { "wien": _3 }],
			"futurecms": [0, {
				"*": _3,
				"ex": _6,
				"in": _6
			}],
			"futurehosting": _3,
			"futuremailing": _3,
			"ortsinfo": [0, {
				"ex": _6,
				"kunden": _6
			}],
			"biz": _3,
			"info": _3,
			"123webseite": _3,
			"priv": _3,
			"my": _3,
			"myspreadshop": _3,
			"12hp": _3,
			"2ix": _3,
			"4lima": _3,
			"lima-city": _3
		}],
		"au": [1, {
			"asn": _2,
			"com": [1, {
				"cloudlets": [0, { "mel": _3 }],
				"myspreadshop": _3
			}],
			"edu": [1, {
				"act": _2,
				"catholic": _2,
				"nsw": _2,
				"nt": _2,
				"qld": _2,
				"sa": _2,
				"tas": _2,
				"vic": _2,
				"wa": _2
			}],
			"gov": [1, {
				"qld": _2,
				"sa": _2,
				"tas": _2,
				"vic": _2,
				"wa": _2
			}],
			"id": _2,
			"net": _2,
			"org": _2,
			"conf": _2,
			"oz": _2,
			"act": _2,
			"nsw": _2,
			"nt": _2,
			"qld": _2,
			"sa": _2,
			"tas": _2,
			"vic": _2,
			"wa": _2,
			"hrsn": _11
		}],
		"aw": [1, { "com": _2 }],
		"ax": _2,
		"az": [1, {
			"biz": _2,
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"int": _2,
			"mil": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"pp": _2,
			"pro": _2
		}],
		"ba": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"brendly": _19,
			"rs": _3
		}],
		"bb": [1, {
			"biz": _2,
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"net": _2,
			"org": _2,
			"store": _2,
			"tv": _2
		}],
		"bd": _20,
		"be": [1, {
			"ac": _2,
			"cloudns": _3,
			"webhosting": _3,
			"interhostsolutions": [0, { "cloud": _3 }],
			"kuleuven": [0, { "ezproxy": _3 }],
			"123website": _3,
			"myspreadshop": _3,
			"transurl": _6
		}],
		"bf": _10,
		"bg": [1, {
			"0": _2,
			"1": _2,
			"2": _2,
			"3": _2,
			"4": _2,
			"5": _2,
			"6": _2,
			"7": _2,
			"8": _2,
			"9": _2,
			"a": _2,
			"b": _2,
			"c": _2,
			"d": _2,
			"e": _2,
			"f": _2,
			"g": _2,
			"h": _2,
			"i": _2,
			"j": _2,
			"k": _2,
			"l": _2,
			"m": _2,
			"n": _2,
			"o": _2,
			"p": _2,
			"q": _2,
			"r": _2,
			"s": _2,
			"t": _2,
			"u": _2,
			"v": _2,
			"w": _2,
			"x": _2,
			"y": _2,
			"z": _2,
			"barsy": _3
		}],
		"bh": _4,
		"bi": [1, {
			"co": _2,
			"com": _2,
			"edu": _2,
			"or": _2,
			"org": _2
		}],
		"biz": [1, {
			"activetrail": _3,
			"cloud-ip": _3,
			"cloudns": _3,
			"jozi": _3,
			"dyndns": _3,
			"for-better": _3,
			"for-more": _3,
			"for-some": _3,
			"for-the": _3,
			"selfip": _3,
			"webhop": _3,
			"orx": _3,
			"mmafan": _3,
			"myftp": _3,
			"no-ip": _3,
			"dscloud": _3
		}],
		"bj": [1, {
			"africa": _2,
			"agro": _2,
			"architectes": _2,
			"assur": _2,
			"avocats": _2,
			"co": _2,
			"com": _2,
			"eco": _2,
			"econo": _2,
			"edu": _2,
			"info": _2,
			"loisirs": _2,
			"money": _2,
			"net": _2,
			"org": _2,
			"ote": _2,
			"restaurant": _2,
			"resto": _2,
			"tourism": _2,
			"univ": _2
		}],
		"bm": _4,
		"bn": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"co": _3
		}],
		"bo": [1, {
			"com": _2,
			"edu": _2,
			"gob": _2,
			"int": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"tv": _2,
			"web": _2,
			"academia": _2,
			"agro": _2,
			"arte": _2,
			"blog": _2,
			"bolivia": _2,
			"ciencia": _2,
			"cooperativa": _2,
			"democracia": _2,
			"deporte": _2,
			"ecologia": _2,
			"economia": _2,
			"empresa": _2,
			"indigena": _2,
			"industria": _2,
			"info": _2,
			"medicina": _2,
			"movimiento": _2,
			"musica": _2,
			"natural": _2,
			"nombre": _2,
			"noticias": _2,
			"patria": _2,
			"plurinacional": _2,
			"politica": _2,
			"profesional": _2,
			"pueblo": _2,
			"revista": _2,
			"salud": _2,
			"tecnologia": _2,
			"tksat": _2,
			"transporte": _2,
			"wiki": _2
		}],
		"br": [1, {
			"9guacu": _2,
			"abc": _2,
			"adm": _2,
			"adv": _2,
			"agr": _2,
			"aju": _2,
			"am": _2,
			"anani": _2,
			"aparecida": _2,
			"api": _2,
			"app": _2,
			"arq": _2,
			"art": _2,
			"ato": _2,
			"b": _2,
			"barueri": _2,
			"belem": _2,
			"bet": _2,
			"bhz": _2,
			"bib": _2,
			"bio": _2,
			"blog": _2,
			"bmd": _2,
			"boavista": _2,
			"bsb": _2,
			"campinagrande": _2,
			"campinas": _2,
			"caxias": _2,
			"cim": _2,
			"cng": _2,
			"cnt": _2,
			"com": [1, { "simplesite": _3 }],
			"contagem": _2,
			"coop": _2,
			"coz": _2,
			"cri": _2,
			"cuiaba": _2,
			"curitiba": _2,
			"def": _2,
			"des": _2,
			"det": _2,
			"dev": _2,
			"ecn": _2,
			"eco": _2,
			"edu": _2,
			"emp": _2,
			"enf": _2,
			"eng": _2,
			"esp": _2,
			"etc": _2,
			"eti": _2,
			"far": _2,
			"feira": _2,
			"flog": _2,
			"floripa": _2,
			"fm": _2,
			"fnd": _2,
			"fortal": _2,
			"fot": _2,
			"foz": _2,
			"fst": _2,
			"g12": _2,
			"geo": _2,
			"ggf": _2,
			"goiania": _2,
			"gov": [1, {
				"ac": _2,
				"al": _2,
				"am": _2,
				"ap": _2,
				"ba": _2,
				"ce": _2,
				"df": _2,
				"es": _2,
				"go": _2,
				"ma": _2,
				"mg": _2,
				"ms": _2,
				"mt": _2,
				"pa": _2,
				"pb": _2,
				"pe": _2,
				"pi": _2,
				"pr": _2,
				"rj": _2,
				"rn": _2,
				"ro": _2,
				"rr": _2,
				"rs": _2,
				"sc": _2,
				"se": _2,
				"sp": _2,
				"to": _2
			}],
			"gru": _2,
			"ia": _2,
			"imb": _2,
			"ind": _2,
			"inf": _2,
			"jab": _2,
			"jampa": _2,
			"jdf": _2,
			"joinville": _2,
			"jor": _2,
			"jus": _2,
			"leg": [1, {
				"ac": _3,
				"al": _3,
				"am": _3,
				"ap": _3,
				"ba": _3,
				"ce": _3,
				"df": _3,
				"es": _3,
				"go": _3,
				"ma": _3,
				"mg": _3,
				"ms": _3,
				"mt": _3,
				"pa": _3,
				"pb": _3,
				"pe": _3,
				"pi": _3,
				"pr": _3,
				"rj": _3,
				"rn": _3,
				"ro": _3,
				"rr": _3,
				"rs": _3,
				"sc": _3,
				"se": _3,
				"sp": _3,
				"to": _3
			}],
			"leilao": _2,
			"lel": _2,
			"log": _2,
			"londrina": _2,
			"macapa": _2,
			"maceio": _2,
			"manaus": _2,
			"maringa": _2,
			"mat": _2,
			"med": _2,
			"mil": _2,
			"morena": _2,
			"mp": _2,
			"mus": _2,
			"natal": _2,
			"net": _2,
			"niteroi": _2,
			"nom": _20,
			"not": _2,
			"ntr": _2,
			"odo": _2,
			"ong": _2,
			"org": _2,
			"osasco": _2,
			"palmas": _2,
			"poa": _2,
			"ppg": _2,
			"pro": _2,
			"psc": _2,
			"psi": _2,
			"pvh": _2,
			"qsl": _2,
			"radio": _2,
			"rec": _2,
			"recife": _2,
			"rep": _2,
			"ribeirao": _2,
			"rio": _2,
			"riobranco": _2,
			"riopreto": _2,
			"salvador": _2,
			"sampa": _2,
			"santamaria": _2,
			"santoandre": _2,
			"saobernardo": _2,
			"saogonca": _2,
			"seg": _2,
			"sjc": _2,
			"slg": _2,
			"slz": _2,
			"social": _2,
			"sorocaba": _2,
			"srv": _2,
			"taxi": _2,
			"tc": _2,
			"tec": _2,
			"teo": _2,
			"the": _2,
			"tmp": _2,
			"trd": _2,
			"tur": _2,
			"tv": _2,
			"udi": _2,
			"vet": _2,
			"vix": _2,
			"vlog": _2,
			"wiki": _2,
			"xyz": _2,
			"zlg": _2,
			"tche": _3
		}],
		"bs": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"we": _3
		}],
		"bt": _4,
		"bv": _2,
		"bw": [1, {
			"ac": _2,
			"co": _2,
			"gov": _2,
			"net": _2,
			"org": _2
		}],
		"by": [1, {
			"gov": _2,
			"mil": _2,
			"com": _2,
			"of": _2,
			"mediatech": _3
		}],
		"bz": [1, {
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"za": _3,
			"mydns": _3,
			"gsj": _3
		}],
		"ca": [1, {
			"ab": _2,
			"bc": _2,
			"mb": _2,
			"nb": _2,
			"nf": _2,
			"nl": _2,
			"ns": _2,
			"nt": _2,
			"nu": _2,
			"on": _2,
			"pe": _2,
			"qc": _2,
			"sk": _2,
			"yk": _2,
			"gc": _2,
			"barsy": _3,
			"awdev": _6,
			"co": _3,
			"no-ip": _3,
			"onid": _3,
			"myspreadshop": _3,
			"box": _3
		}],
		"cat": _2,
		"cc": [1, {
			"cleverapps": _3,
			"cloud-ip": _3,
			"cloudns": _3,
			"ftpaccess": _3,
			"game-server": _3,
			"myphotos": _3,
			"scrapping": _3,
			"twmail": _3,
			"csx": _3,
			"fantasyleague": _3,
			"spawn": [0, { "instances": _3 }]
		}],
		"cd": _10,
		"cf": _2,
		"cg": _2,
		"ch": [1, {
			"square7": _3,
			"cloudns": _3,
			"cloudscale": [0, {
				"cust": _3,
				"lpg": _22,
				"rma": _22
			}],
			"objectstorage": [0, {
				"lpg": _3,
				"rma": _3
			}],
			"flow": [0, {
				"ae": [0, { "alp1": _3 }],
				"appengine": _3
			}],
			"linkyard-cloud": _3,
			"gotdns": _3,
			"dnsking": _3,
			"123website": _3,
			"myspreadshop": _3,
			"firenet": [0, {
				"*": _3,
				"svc": _6
			}],
			"12hp": _3,
			"2ix": _3,
			"4lima": _3,
			"lima-city": _3
		}],
		"ci": [1, {
			"ac": _2,
			"xn--aroport-bya": _2,
			"aéroport": _2,
			"asso": _2,
			"co": _2,
			"com": _2,
			"ed": _2,
			"edu": _2,
			"go": _2,
			"gouv": _2,
			"int": _2,
			"net": _2,
			"or": _2,
			"org": _2
		}],
		"ck": _20,
		"cl": [1, {
			"co": _2,
			"gob": _2,
			"gov": _2,
			"mil": _2,
			"cloudns": _3
		}],
		"cm": [1, {
			"co": _2,
			"com": _2,
			"gov": _2,
			"net": _2
		}],
		"cn": [1, {
			"ac": _2,
			"com": [1, {
				"amazonaws": [0, {
					"cn-north-1": [0, {
						"execute-api": _3,
						"emrappui-prod": _3,
						"emrnotebooks-prod": _3,
						"emrstudio-prod": _3,
						"dualstack": _25,
						"s3": _3,
						"s3-accesspoint": _3,
						"s3-deprecated": _3,
						"s3-object-lambda": _3,
						"s3-website": _3
					}],
					"cn-northwest-1": [0, {
						"execute-api": _3,
						"emrappui-prod": _3,
						"emrnotebooks-prod": _3,
						"emrstudio-prod": _3,
						"dualstack": _26,
						"s3": _3,
						"s3-accesspoint": _3,
						"s3-object-lambda": _3,
						"s3-website": _3
					}],
					"compute": _6,
					"airflow": [0, {
						"cn-north-1": _6,
						"cn-northwest-1": _6
					}],
					"eb": [0, {
						"cn-north-1": _3,
						"cn-northwest-1": _3
					}],
					"elb": _6
				}],
				"amazonwebservices": [0, { "on": [0, {
					"cn-north-1": _12,
					"cn-northwest-1": _12
				}] }],
				"sagemaker": [0, {
					"cn-north-1": _14,
					"cn-northwest-1": _14
				}]
			}],
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"xn--55qx5d": _2,
			"公司": _2,
			"xn--od0alg": _2,
			"網絡": _2,
			"xn--io0a7i": _2,
			"网络": _2,
			"ah": _2,
			"bj": _2,
			"cq": _2,
			"fj": _2,
			"gd": _2,
			"gs": _2,
			"gx": _2,
			"gz": _2,
			"ha": _2,
			"hb": _2,
			"he": _2,
			"hi": _2,
			"hk": _2,
			"hl": _2,
			"hn": _2,
			"jl": _2,
			"js": _2,
			"jx": _2,
			"ln": _2,
			"mo": _2,
			"nm": _2,
			"nx": _2,
			"qh": _2,
			"sc": _2,
			"sd": _2,
			"sh": [1, { "as": _3 }],
			"sn": _2,
			"sx": _2,
			"tj": _2,
			"tw": _2,
			"xj": _2,
			"xz": _2,
			"yn": _2,
			"zj": _2,
			"canva-apps": _3,
			"canvasite": _24,
			"myqnapcloud": _3,
			"quickconnect": _27
		}],
		"co": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"nom": _2,
			"org": _2,
			"carrd": _3,
			"crd": _3,
			"otap": _6,
			"hidns": _3,
			"leadpages": _3,
			"lpages": _3,
			"mypi": _3,
			"xmit": _6,
			"firewalledreplit": _9,
			"repl": _9,
			"supabase": [2, {
				"realtime": _3,
				"storage": _3
			}]
		}],
		"com": [1, {
			"a2hosted": _3,
			"cpserver": _3,
			"adobeaemcloud": [2, { "dev": _6 }],
			"africa": _3,
			"aivencloud": _3,
			"alibabacloudcs": _3,
			"kasserver": _3,
			"amazonaws": [0, {
				"af-south-1": _30,
				"ap-east-1": _31,
				"ap-northeast-1": _32,
				"ap-northeast-2": _32,
				"ap-northeast-3": _30,
				"ap-south-1": _32,
				"ap-south-2": _33,
				"ap-southeast-1": _32,
				"ap-southeast-2": _32,
				"ap-southeast-3": _33,
				"ap-southeast-4": _33,
				"ap-southeast-5": [0, {
					"execute-api": _3,
					"dualstack": _25,
					"s3": _3,
					"s3-accesspoint": _3,
					"s3-deprecated": _3,
					"s3-object-lambda": _3,
					"s3-website": _3
				}],
				"ca-central-1": _35,
				"ca-west-1": [0, {
					"execute-api": _3,
					"emrappui-prod": _3,
					"emrnotebooks-prod": _3,
					"emrstudio-prod": _3,
					"dualstack": _34,
					"s3": _3,
					"s3-accesspoint": _3,
					"s3-accesspoint-fips": _3,
					"s3-fips": _3,
					"s3-object-lambda": _3,
					"s3-website": _3
				}],
				"eu-central-1": _32,
				"eu-central-2": _33,
				"eu-north-1": _31,
				"eu-south-1": _30,
				"eu-south-2": _33,
				"eu-west-1": [0, {
					"execute-api": _3,
					"emrappui-prod": _3,
					"emrnotebooks-prod": _3,
					"emrstudio-prod": _3,
					"dualstack": _25,
					"s3": _3,
					"s3-accesspoint": _3,
					"s3-deprecated": _3,
					"s3-object-lambda": _3,
					"s3-website": _3,
					"analytics-gateway": _3,
					"aws-cloud9": _28,
					"cloud9": _29
				}],
				"eu-west-2": _31,
				"eu-west-3": _30,
				"il-central-1": [0, {
					"execute-api": _3,
					"emrappui-prod": _3,
					"emrnotebooks-prod": _3,
					"emrstudio-prod": _3,
					"dualstack": _25,
					"s3": _3,
					"s3-accesspoint": _3,
					"s3-object-lambda": _3,
					"s3-website": _3,
					"aws-cloud9": _28,
					"cloud9": [0, { "vfs": _3 }]
				}],
				"me-central-1": _33,
				"me-south-1": _31,
				"sa-east-1": _30,
				"us-east-1": [2, {
					"execute-api": _3,
					"emrappui-prod": _3,
					"emrnotebooks-prod": _3,
					"emrstudio-prod": _3,
					"dualstack": _34,
					"s3": _3,
					"s3-accesspoint": _3,
					"s3-accesspoint-fips": _3,
					"s3-deprecated": _3,
					"s3-fips": _3,
					"s3-object-lambda": _3,
					"s3-website": _3,
					"analytics-gateway": _3,
					"aws-cloud9": _28,
					"cloud9": _29
				}],
				"us-east-2": _36,
				"us-gov-east-1": _38,
				"us-gov-west-1": _38,
				"us-west-1": _35,
				"us-west-2": _36,
				"compute": _6,
				"compute-1": _6,
				"airflow": [0, {
					"af-south-1": _6,
					"ap-east-1": _6,
					"ap-northeast-1": _6,
					"ap-northeast-2": _6,
					"ap-northeast-3": _6,
					"ap-south-1": _6,
					"ap-south-2": _6,
					"ap-southeast-1": _6,
					"ap-southeast-2": _6,
					"ap-southeast-3": _6,
					"ap-southeast-4": _6,
					"ap-southeast-5": _6,
					"ca-central-1": _6,
					"ca-west-1": _6,
					"eu-central-1": _6,
					"eu-central-2": _6,
					"eu-north-1": _6,
					"eu-south-1": _6,
					"eu-south-2": _6,
					"eu-west-1": _6,
					"eu-west-2": _6,
					"eu-west-3": _6,
					"il-central-1": _6,
					"me-central-1": _6,
					"me-south-1": _6,
					"sa-east-1": _6,
					"us-east-1": _6,
					"us-east-2": _6,
					"us-west-1": _6,
					"us-west-2": _6
				}],
				"s3": _3,
				"s3-1": _3,
				"s3-ap-east-1": _3,
				"s3-ap-northeast-1": _3,
				"s3-ap-northeast-2": _3,
				"s3-ap-northeast-3": _3,
				"s3-ap-south-1": _3,
				"s3-ap-southeast-1": _3,
				"s3-ap-southeast-2": _3,
				"s3-ca-central-1": _3,
				"s3-eu-central-1": _3,
				"s3-eu-north-1": _3,
				"s3-eu-west-1": _3,
				"s3-eu-west-2": _3,
				"s3-eu-west-3": _3,
				"s3-external-1": _3,
				"s3-fips-us-gov-east-1": _3,
				"s3-fips-us-gov-west-1": _3,
				"s3-global": [0, { "accesspoint": [0, { "mrap": _3 }] }],
				"s3-me-south-1": _3,
				"s3-sa-east-1": _3,
				"s3-us-east-2": _3,
				"s3-us-gov-east-1": _3,
				"s3-us-gov-west-1": _3,
				"s3-us-west-1": _3,
				"s3-us-west-2": _3,
				"s3-website-ap-northeast-1": _3,
				"s3-website-ap-southeast-1": _3,
				"s3-website-ap-southeast-2": _3,
				"s3-website-eu-west-1": _3,
				"s3-website-sa-east-1": _3,
				"s3-website-us-east-1": _3,
				"s3-website-us-gov-west-1": _3,
				"s3-website-us-west-1": _3,
				"s3-website-us-west-2": _3,
				"elb": _6
			}],
			"amazoncognito": [0, {
				"af-south-1": _39,
				"ap-east-1": _39,
				"ap-northeast-1": _39,
				"ap-northeast-2": _39,
				"ap-northeast-3": _39,
				"ap-south-1": _39,
				"ap-south-2": _39,
				"ap-southeast-1": _39,
				"ap-southeast-2": _39,
				"ap-southeast-3": _39,
				"ap-southeast-4": _39,
				"ap-southeast-5": _39,
				"ap-southeast-7": _39,
				"ca-central-1": _39,
				"ca-west-1": _39,
				"eu-central-1": _39,
				"eu-central-2": _39,
				"eu-north-1": _39,
				"eu-south-1": _39,
				"eu-south-2": _39,
				"eu-west-1": _39,
				"eu-west-2": _39,
				"eu-west-3": _39,
				"il-central-1": _39,
				"me-central-1": _39,
				"me-south-1": _39,
				"mx-central-1": _39,
				"sa-east-1": _39,
				"us-east-1": _40,
				"us-east-2": _40,
				"us-gov-east-1": _41,
				"us-gov-west-1": _41,
				"us-west-1": _40,
				"us-west-2": _40
			}],
			"amplifyapp": _3,
			"awsapprunner": _6,
			"awsapps": _3,
			"elasticbeanstalk": [2, {
				"af-south-1": _3,
				"ap-east-1": _3,
				"ap-northeast-1": _3,
				"ap-northeast-2": _3,
				"ap-northeast-3": _3,
				"ap-south-1": _3,
				"ap-southeast-1": _3,
				"ap-southeast-2": _3,
				"ap-southeast-3": _3,
				"ca-central-1": _3,
				"eu-central-1": _3,
				"eu-north-1": _3,
				"eu-south-1": _3,
				"eu-west-1": _3,
				"eu-west-2": _3,
				"eu-west-3": _3,
				"il-central-1": _3,
				"me-south-1": _3,
				"sa-east-1": _3,
				"us-east-1": _3,
				"us-east-2": _3,
				"us-gov-east-1": _3,
				"us-gov-west-1": _3,
				"us-west-1": _3,
				"us-west-2": _3
			}],
			"awsglobalaccelerator": _3,
			"siiites": _3,
			"appspacehosted": _3,
			"appspaceusercontent": _3,
			"on-aptible": _3,
			"myasustor": _3,
			"balena-devices": _3,
			"boutir": _3,
			"bplaced": _3,
			"cafjs": _3,
			"canva-apps": _3,
			"rice-labs": _3,
			"cdn77-storage": _3,
			"br": _3,
			"cn": _3,
			"de": _3,
			"eu": _3,
			"jpn": _3,
			"mex": _3,
			"ru": _3,
			"sa": _3,
			"uk": _3,
			"us": _3,
			"za": _3,
			"clever-cloud": [0, { "services": _6 }],
			"abrdns": _3,
			"dnsabr": _3,
			"ip-ddns": _3,
			"jdevcloud": _3,
			"wpdevcloud": _3,
			"cf-ipfs": _3,
			"cloudflare-ipfs": _3,
			"trycloudflare": _3,
			"co": _3,
			"devinapps": _6,
			"builtwithdark": _3,
			"datadetect": [0, {
				"demo": _3,
				"instance": _3
			}],
			"dattolocal": _3,
			"dattorelay": _3,
			"dattoweb": _3,
			"mydatto": _3,
			"digitaloceanspaces": _6,
			"discordsays": _3,
			"discordsez": _3,
			"drayddns": _3,
			"dreamhosters": _3,
			"durumis": _3,
			"blogdns": _3,
			"cechire": _3,
			"dnsalias": _3,
			"dnsdojo": _3,
			"doesntexist": _3,
			"dontexist": _3,
			"doomdns": _3,
			"dyn-o-saur": _3,
			"dynalias": _3,
			"dyndns-at-home": _3,
			"dyndns-at-work": _3,
			"dyndns-blog": _3,
			"dyndns-free": _3,
			"dyndns-home": _3,
			"dyndns-ip": _3,
			"dyndns-mail": _3,
			"dyndns-office": _3,
			"dyndns-pics": _3,
			"dyndns-remote": _3,
			"dyndns-server": _3,
			"dyndns-web": _3,
			"dyndns-wiki": _3,
			"dyndns-work": _3,
			"est-a-la-maison": _3,
			"est-a-la-masion": _3,
			"est-le-patron": _3,
			"est-mon-blogueur": _3,
			"from-ak": _3,
			"from-al": _3,
			"from-ar": _3,
			"from-ca": _3,
			"from-ct": _3,
			"from-dc": _3,
			"from-de": _3,
			"from-fl": _3,
			"from-ga": _3,
			"from-hi": _3,
			"from-ia": _3,
			"from-id": _3,
			"from-il": _3,
			"from-in": _3,
			"from-ks": _3,
			"from-ky": _3,
			"from-ma": _3,
			"from-md": _3,
			"from-mi": _3,
			"from-mn": _3,
			"from-mo": _3,
			"from-ms": _3,
			"from-mt": _3,
			"from-nc": _3,
			"from-nd": _3,
			"from-ne": _3,
			"from-nh": _3,
			"from-nj": _3,
			"from-nm": _3,
			"from-nv": _3,
			"from-oh": _3,
			"from-ok": _3,
			"from-or": _3,
			"from-pa": _3,
			"from-pr": _3,
			"from-ri": _3,
			"from-sc": _3,
			"from-sd": _3,
			"from-tn": _3,
			"from-tx": _3,
			"from-ut": _3,
			"from-va": _3,
			"from-vt": _3,
			"from-wa": _3,
			"from-wi": _3,
			"from-wv": _3,
			"from-wy": _3,
			"getmyip": _3,
			"gotdns": _3,
			"hobby-site": _3,
			"homelinux": _3,
			"homeunix": _3,
			"iamallama": _3,
			"is-a-anarchist": _3,
			"is-a-blogger": _3,
			"is-a-bookkeeper": _3,
			"is-a-bulls-fan": _3,
			"is-a-caterer": _3,
			"is-a-chef": _3,
			"is-a-conservative": _3,
			"is-a-cpa": _3,
			"is-a-cubicle-slave": _3,
			"is-a-democrat": _3,
			"is-a-designer": _3,
			"is-a-doctor": _3,
			"is-a-financialadvisor": _3,
			"is-a-geek": _3,
			"is-a-green": _3,
			"is-a-guru": _3,
			"is-a-hard-worker": _3,
			"is-a-hunter": _3,
			"is-a-landscaper": _3,
			"is-a-lawyer": _3,
			"is-a-liberal": _3,
			"is-a-libertarian": _3,
			"is-a-llama": _3,
			"is-a-musician": _3,
			"is-a-nascarfan": _3,
			"is-a-nurse": _3,
			"is-a-painter": _3,
			"is-a-personaltrainer": _3,
			"is-a-photographer": _3,
			"is-a-player": _3,
			"is-a-republican": _3,
			"is-a-rockstar": _3,
			"is-a-socialist": _3,
			"is-a-student": _3,
			"is-a-teacher": _3,
			"is-a-techie": _3,
			"is-a-therapist": _3,
			"is-an-accountant": _3,
			"is-an-actor": _3,
			"is-an-actress": _3,
			"is-an-anarchist": _3,
			"is-an-artist": _3,
			"is-an-engineer": _3,
			"is-an-entertainer": _3,
			"is-certified": _3,
			"is-gone": _3,
			"is-into-anime": _3,
			"is-into-cars": _3,
			"is-into-cartoons": _3,
			"is-into-games": _3,
			"is-leet": _3,
			"is-not-certified": _3,
			"is-slick": _3,
			"is-uberleet": _3,
			"is-with-theband": _3,
			"isa-geek": _3,
			"isa-hockeynut": _3,
			"issmarterthanyou": _3,
			"likes-pie": _3,
			"likescandy": _3,
			"neat-url": _3,
			"saves-the-whales": _3,
			"selfip": _3,
			"sells-for-less": _3,
			"sells-for-u": _3,
			"servebbs": _3,
			"simple-url": _3,
			"space-to-rent": _3,
			"teaches-yoga": _3,
			"writesthisblog": _3,
			"ddnsfree": _3,
			"ddnsgeek": _3,
			"giize": _3,
			"gleeze": _3,
			"kozow": _3,
			"loseyourip": _3,
			"ooguy": _3,
			"theworkpc": _3,
			"mytuleap": _3,
			"tuleap-partners": _3,
			"encoreapi": _3,
			"evennode": [0, {
				"eu-1": _3,
				"eu-2": _3,
				"eu-3": _3,
				"eu-4": _3,
				"us-1": _3,
				"us-2": _3,
				"us-3": _3,
				"us-4": _3
			}],
			"onfabrica": _3,
			"fastly-edge": _3,
			"fastly-terrarium": _3,
			"fastvps-server": _3,
			"mydobiss": _3,
			"firebaseapp": _3,
			"fldrv": _3,
			"forgeblocks": _3,
			"framercanvas": _3,
			"freebox-os": _3,
			"freeboxos": _3,
			"freemyip": _3,
			"aliases121": _3,
			"gentapps": _3,
			"gentlentapis": _3,
			"githubusercontent": _3,
			"0emm": _6,
			"appspot": [2, { "r": _6 }],
			"blogspot": _3,
			"codespot": _3,
			"googleapis": _3,
			"googlecode": _3,
			"pagespeedmobilizer": _3,
			"withgoogle": _3,
			"withyoutube": _3,
			"grayjayleagues": _3,
			"hatenablog": _3,
			"hatenadiary": _3,
			"herokuapp": _3,
			"gr": _3,
			"smushcdn": _3,
			"wphostedmail": _3,
			"wpmucdn": _3,
			"pixolino": _3,
			"apps-1and1": _3,
			"live-website": _3,
			"webspace-host": _3,
			"dopaas": _3,
			"hosted-by-previder": _43,
			"hosteur": [0, {
				"rag-cloud": _3,
				"rag-cloud-ch": _3
			}],
			"ik-server": [0, {
				"jcloud": _3,
				"jcloud-ver-jpc": _3
			}],
			"jelastic": [0, { "demo": _3 }],
			"massivegrid": _43,
			"wafaicloud": [0, {
				"jed": _3,
				"ryd": _3
			}],
			"jote-dr-lt1": _3,
			"jote-rd-lt1": _3,
			"webadorsite": _3,
			"joyent": [0, { "cns": _6 }],
			"on-forge": _3,
			"on-vapor": _3,
			"lpusercontent": _3,
			"linode": [0, {
				"members": _3,
				"nodebalancer": _6
			}],
			"linodeobjects": _6,
			"linodeusercontent": [0, { "ip": _3 }],
			"localtonet": _3,
			"lovableproject": _3,
			"barsycenter": _3,
			"barsyonline": _3,
			"lutrausercontent": _6,
			"modelscape": _3,
			"mwcloudnonprod": _3,
			"polyspace": _3,
			"mazeplay": _3,
			"miniserver": _3,
			"atmeta": _3,
			"fbsbx": _42,
			"meteorapp": _44,
			"routingthecloud": _3,
			"same-app": _3,
			"same-preview": _3,
			"mydbserver": _3,
			"hostedpi": _3,
			"mythic-beasts": [0, {
				"caracal": _3,
				"customer": _3,
				"fentiger": _3,
				"lynx": _3,
				"ocelot": _3,
				"oncilla": _3,
				"onza": _3,
				"sphinx": _3,
				"vs": _3,
				"x": _3,
				"yali": _3
			}],
			"nospamproxy": [0, { "cloud": [2, { "o365": _3 }] }],
			"4u": _3,
			"nfshost": _3,
			"3utilities": _3,
			"blogsyte": _3,
			"ciscofreak": _3,
			"damnserver": _3,
			"ddnsking": _3,
			"ditchyourip": _3,
			"dnsiskinky": _3,
			"dynns": _3,
			"geekgalaxy": _3,
			"health-carereform": _3,
			"homesecuritymac": _3,
			"homesecuritypc": _3,
			"myactivedirectory": _3,
			"mysecuritycamera": _3,
			"myvnc": _3,
			"net-freaks": _3,
			"onthewifi": _3,
			"point2this": _3,
			"quicksytes": _3,
			"securitytactics": _3,
			"servebeer": _3,
			"servecounterstrike": _3,
			"serveexchange": _3,
			"serveftp": _3,
			"servegame": _3,
			"servehalflife": _3,
			"servehttp": _3,
			"servehumour": _3,
			"serveirc": _3,
			"servemp3": _3,
			"servep2p": _3,
			"servepics": _3,
			"servequake": _3,
			"servesarcasm": _3,
			"stufftoread": _3,
			"unusualperson": _3,
			"workisboring": _3,
			"myiphost": _3,
			"observableusercontent": [0, { "static": _3 }],
			"simplesite": _3,
			"oaiusercontent": _6,
			"orsites": _3,
			"operaunite": _3,
			"customer-oci": [0, {
				"*": _3,
				"oci": _6,
				"ocp": _6,
				"ocs": _6
			}],
			"oraclecloudapps": _6,
			"oraclegovcloudapps": _6,
			"authgear-staging": _3,
			"authgearapps": _3,
			"skygearapp": _3,
			"outsystemscloud": _3,
			"ownprovider": _3,
			"pgfog": _3,
			"pagexl": _3,
			"gotpantheon": _3,
			"paywhirl": _6,
			"upsunapp": _3,
			"postman-echo": _3,
			"prgmr": [0, { "xen": _3 }],
			"project-study": [0, { "dev": _3 }],
			"pythonanywhere": _44,
			"qa2": _3,
			"alpha-myqnapcloud": _3,
			"dev-myqnapcloud": _3,
			"mycloudnas": _3,
			"mynascloud": _3,
			"myqnapcloud": _3,
			"qualifioapp": _3,
			"ladesk": _3,
			"qualyhqpartner": _6,
			"qualyhqportal": _6,
			"qbuser": _3,
			"quipelements": _6,
			"rackmaze": _3,
			"readthedocs-hosted": _3,
			"rhcloud": _3,
			"onrender": _3,
			"render": _45,
			"subsc-pay": _3,
			"180r": _3,
			"dojin": _3,
			"sakuratan": _3,
			"sakuraweb": _3,
			"x0": _3,
			"code": [0, {
				"builder": _6,
				"dev-builder": _6,
				"stg-builder": _6
			}],
			"salesforce": [0, { "platform": [0, { "code-builder-stg": [0, { "test": [0, { "001": _6 }] }] }] }],
			"logoip": _3,
			"scrysec": _3,
			"firewall-gateway": _3,
			"myshopblocks": _3,
			"myshopify": _3,
			"shopitsite": _3,
			"1kapp": _3,
			"appchizi": _3,
			"applinzi": _3,
			"sinaapp": _3,
			"vipsinaapp": _3,
			"streamlitapp": _3,
			"try-snowplow": _3,
			"playstation-cloud": _3,
			"myspreadshop": _3,
			"w-corp-staticblitz": _3,
			"w-credentialless-staticblitz": _3,
			"w-staticblitz": _3,
			"stackhero-network": _3,
			"stdlib": [0, { "api": _3 }],
			"strapiapp": [2, { "media": _3 }],
			"streak-link": _3,
			"streaklinks": _3,
			"streakusercontent": _3,
			"temp-dns": _3,
			"dsmynas": _3,
			"familyds": _3,
			"mytabit": _3,
			"taveusercontent": _3,
			"tb-hosting": _46,
			"reservd": _3,
			"thingdustdata": _3,
			"townnews-staging": _3,
			"typeform": [0, { "pro": _3 }],
			"hk": _3,
			"it": _3,
			"deus-canvas": _3,
			"vultrobjects": _6,
			"wafflecell": _3,
			"hotelwithflight": _3,
			"reserve-online": _3,
			"cprapid": _3,
			"pleskns": _3,
			"remotewd": _3,
			"wiardweb": [0, { "pages": _3 }],
			"wixsite": _3,
			"wixstudio": _3,
			"messwithdns": _3,
			"woltlab-demo": _3,
			"wpenginepowered": [2, { "js": _3 }],
			"xnbay": [2, {
				"u2": _3,
				"u2-local": _3
			}],
			"yolasite": _3
		}],
		"coop": _2,
		"cr": [1, {
			"ac": _2,
			"co": _2,
			"ed": _2,
			"fi": _2,
			"go": _2,
			"or": _2,
			"sa": _2
		}],
		"cu": [1, {
			"com": _2,
			"edu": _2,
			"gob": _2,
			"inf": _2,
			"nat": _2,
			"net": _2,
			"org": _2
		}],
		"cv": [1, {
			"com": _2,
			"edu": _2,
			"id": _2,
			"int": _2,
			"net": _2,
			"nome": _2,
			"org": _2,
			"publ": _2
		}],
		"cw": _47,
		"cx": [1, {
			"gov": _2,
			"cloudns": _3,
			"ath": _3,
			"info": _3,
			"assessments": _3,
			"calculators": _3,
			"funnels": _3,
			"paynow": _3,
			"quizzes": _3,
			"researched": _3,
			"tests": _3
		}],
		"cy": [1, {
			"ac": _2,
			"biz": _2,
			"com": [1, { "scaleforce": _48 }],
			"ekloges": _2,
			"gov": _2,
			"ltd": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"press": _2,
			"pro": _2,
			"tm": _2
		}],
		"cz": [1, {
			"gov": _2,
			"contentproxy9": [0, { "rsc": _3 }],
			"realm": _3,
			"e4": _3,
			"co": _3,
			"metacentrum": [0, {
				"cloud": _6,
				"custom": _3
			}],
			"muni": [0, { "cloud": [0, {
				"flt": _3,
				"usr": _3
			}] }]
		}],
		"de": [1, {
			"bplaced": _3,
			"square7": _3,
			"com": _3,
			"cosidns": _49,
			"dnsupdater": _3,
			"dynamisches-dns": _3,
			"internet-dns": _3,
			"l-o-g-i-n": _3,
			"ddnss": [2, {
				"dyn": _3,
				"dyndns": _3
			}],
			"dyn-ip24": _3,
			"dyndns1": _3,
			"home-webserver": [2, { "dyn": _3 }],
			"myhome-server": _3,
			"dnshome": _3,
			"fuettertdasnetz": _3,
			"isteingeek": _3,
			"istmein": _3,
			"lebtimnetz": _3,
			"leitungsen": _3,
			"traeumtgerade": _3,
			"frusky": _6,
			"goip": _3,
			"xn--gnstigbestellen-zvb": _3,
			"günstigbestellen": _3,
			"xn--gnstigliefern-wob": _3,
			"günstigliefern": _3,
			"hs-heilbronn": [0, { "it": [0, {
				"pages": _3,
				"pages-research": _3
			}] }],
			"dyn-berlin": _3,
			"in-berlin": _3,
			"in-brb": _3,
			"in-butter": _3,
			"in-dsl": _3,
			"in-vpn": _3,
			"iservschule": _3,
			"mein-iserv": _3,
			"schuldock": _3,
			"schulplattform": _3,
			"schulserver": _3,
			"test-iserv": _3,
			"keymachine": _3,
			"co": _3,
			"git-repos": _3,
			"lcube-server": _3,
			"svn-repos": _3,
			"barsy": _3,
			"webspaceconfig": _3,
			"123webseite": _3,
			"rub": _3,
			"ruhr-uni-bochum": [2, { "noc": [0, { "io": _3 }] }],
			"logoip": _3,
			"firewall-gateway": _3,
			"my-gateway": _3,
			"my-router": _3,
			"spdns": _3,
			"my": _3,
			"speedpartner": [0, { "customer": _3 }],
			"myspreadshop": _3,
			"taifun-dns": _3,
			"12hp": _3,
			"2ix": _3,
			"4lima": _3,
			"lima-city": _3,
			"dd-dns": _3,
			"dray-dns": _3,
			"draydns": _3,
			"dyn-vpn": _3,
			"dynvpn": _3,
			"mein-vigor": _3,
			"my-vigor": _3,
			"my-wan": _3,
			"syno-ds": _3,
			"synology-diskstation": _3,
			"synology-ds": _3,
			"virtual-user": _3,
			"virtualuser": _3,
			"community-pro": _3,
			"diskussionsbereich": _3,
			"xenonconnect": _6
		}],
		"dj": _2,
		"dk": [1, {
			"biz": _3,
			"co": _3,
			"firm": _3,
			"reg": _3,
			"store": _3,
			"123hjemmeside": _3,
			"myspreadshop": _3
		}],
		"dm": _51,
		"do": [1, {
			"art": _2,
			"com": _2,
			"edu": _2,
			"gob": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"sld": _2,
			"web": _2
		}],
		"dz": [1, {
			"art": _2,
			"asso": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"pol": _2,
			"soc": _2,
			"tm": _2
		}],
		"ec": [1, {
			"abg": _2,
			"adm": _2,
			"agron": _2,
			"arqt": _2,
			"art": _2,
			"bar": _2,
			"chef": _2,
			"com": _2,
			"cont": _2,
			"cpa": _2,
			"cue": _2,
			"dent": _2,
			"dgn": _2,
			"disco": _2,
			"doc": _2,
			"edu": _2,
			"eng": _2,
			"esm": _2,
			"fin": _2,
			"fot": _2,
			"gal": _2,
			"gob": _2,
			"gov": _2,
			"gye": _2,
			"ibr": _2,
			"info": _2,
			"k12": _2,
			"lat": _2,
			"loj": _2,
			"med": _2,
			"mil": _2,
			"mktg": _2,
			"mon": _2,
			"net": _2,
			"ntr": _2,
			"odont": _2,
			"org": _2,
			"pro": _2,
			"prof": _2,
			"psic": _2,
			"psiq": _2,
			"pub": _2,
			"rio": _2,
			"rrpp": _2,
			"sal": _2,
			"tech": _2,
			"tul": _2,
			"tur": _2,
			"uio": _2,
			"vet": _2,
			"xxx": _2,
			"base": _3,
			"official": _3
		}],
		"edu": [1, { "rit": [0, { "git-pages": _3 }] }],
		"ee": [1, {
			"aip": _2,
			"com": _2,
			"edu": _2,
			"fie": _2,
			"gov": _2,
			"lib": _2,
			"med": _2,
			"org": _2,
			"pri": _2,
			"riik": _2
		}],
		"eg": [1, {
			"ac": _2,
			"com": _2,
			"edu": _2,
			"eun": _2,
			"gov": _2,
			"info": _2,
			"me": _2,
			"mil": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"sci": _2,
			"sport": _2,
			"tv": _2
		}],
		"er": _20,
		"es": [1, {
			"com": _2,
			"edu": _2,
			"gob": _2,
			"nom": _2,
			"org": _2,
			"123miweb": _3,
			"myspreadshop": _3
		}],
		"et": [1, {
			"biz": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"name": _2,
			"net": _2,
			"org": _2
		}],
		"eu": [1, {
			"cloudns": _3,
			"dogado": [0, { "jelastic": _3 }],
			"barsy": _3,
			"spdns": _3,
			"nxa": _6,
			"transurl": _6,
			"diskstation": _3
		}],
		"fi": [1, {
			"aland": _2,
			"dy": _3,
			"xn--hkkinen-5wa": _3,
			"häkkinen": _3,
			"iki": _3,
			"cloudplatform": [0, { "fi": _3 }],
			"datacenter": [0, {
				"demo": _3,
				"paas": _3
			}],
			"kapsi": _3,
			"123kotisivu": _3,
			"myspreadshop": _3
		}],
		"fj": [1, {
			"ac": _2,
			"biz": _2,
			"com": _2,
			"gov": _2,
			"info": _2,
			"mil": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"pro": _2
		}],
		"fk": _20,
		"fm": [1, {
			"com": _2,
			"edu": _2,
			"net": _2,
			"org": _2,
			"radio": _3,
			"user": _6
		}],
		"fo": _2,
		"fr": [1, {
			"asso": _2,
			"com": _2,
			"gouv": _2,
			"nom": _2,
			"prd": _2,
			"tm": _2,
			"avoues": _2,
			"cci": _2,
			"greta": _2,
			"huissier-justice": _2,
			"en-root": _3,
			"fbx-os": _3,
			"fbxos": _3,
			"freebox-os": _3,
			"freeboxos": _3,
			"goupile": _3,
			"123siteweb": _3,
			"on-web": _3,
			"chirurgiens-dentistes-en-france": _3,
			"dedibox": _3,
			"aeroport": _3,
			"avocat": _3,
			"chambagri": _3,
			"chirurgiens-dentistes": _3,
			"experts-comptables": _3,
			"medecin": _3,
			"notaires": _3,
			"pharmacien": _3,
			"port": _3,
			"veterinaire": _3,
			"myspreadshop": _3,
			"ynh": _3
		}],
		"ga": _2,
		"gb": _2,
		"gd": [1, {
			"edu": _2,
			"gov": _2
		}],
		"ge": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"pvt": _2,
			"school": _2
		}],
		"gf": _2,
		"gg": [1, {
			"co": _2,
			"net": _2,
			"org": _2,
			"botdash": _3,
			"kaas": _3,
			"stackit": _3,
			"panel": [2, { "daemon": _3 }]
		}],
		"gh": [1, {
			"biz": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2
		}],
		"gi": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"ltd": _2,
			"mod": _2,
			"org": _2
		}],
		"gl": [1, {
			"co": _2,
			"com": _2,
			"edu": _2,
			"net": _2,
			"org": _2
		}],
		"gm": _2,
		"gn": [1, {
			"ac": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2
		}],
		"gov": _2,
		"gp": [1, {
			"asso": _2,
			"com": _2,
			"edu": _2,
			"mobi": _2,
			"net": _2,
			"org": _2
		}],
		"gq": _2,
		"gr": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"barsy": _3,
			"simplesite": _3
		}],
		"gs": _2,
		"gt": [1, {
			"com": _2,
			"edu": _2,
			"gob": _2,
			"ind": _2,
			"mil": _2,
			"net": _2,
			"org": _2
		}],
		"gu": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"guam": _2,
			"info": _2,
			"net": _2,
			"org": _2,
			"web": _2
		}],
		"gw": [1, { "nx": _3 }],
		"gy": _51,
		"hk": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"idv": _2,
			"net": _2,
			"org": _2,
			"xn--ciqpn": _2,
			"个人": _2,
			"xn--gmqw5a": _2,
			"個人": _2,
			"xn--55qx5d": _2,
			"公司": _2,
			"xn--mxtq1m": _2,
			"政府": _2,
			"xn--lcvr32d": _2,
			"敎育": _2,
			"xn--wcvs22d": _2,
			"教育": _2,
			"xn--gmq050i": _2,
			"箇人": _2,
			"xn--uc0atv": _2,
			"組織": _2,
			"xn--uc0ay4a": _2,
			"組织": _2,
			"xn--od0alg": _2,
			"網絡": _2,
			"xn--zf0avx": _2,
			"網络": _2,
			"xn--mk0axi": _2,
			"组織": _2,
			"xn--tn0ag": _2,
			"组织": _2,
			"xn--od0aq3b": _2,
			"网絡": _2,
			"xn--io0a7i": _2,
			"网络": _2,
			"inc": _3,
			"ltd": _3
		}],
		"hm": _2,
		"hn": [1, {
			"com": _2,
			"edu": _2,
			"gob": _2,
			"mil": _2,
			"net": _2,
			"org": _2
		}],
		"hr": [1, {
			"com": _2,
			"from": _2,
			"iz": _2,
			"name": _2,
			"brendly": _19
		}],
		"ht": [1, {
			"adult": _2,
			"art": _2,
			"asso": _2,
			"com": _2,
			"coop": _2,
			"edu": _2,
			"firm": _2,
			"gouv": _2,
			"info": _2,
			"med": _2,
			"net": _2,
			"org": _2,
			"perso": _2,
			"pol": _2,
			"pro": _2,
			"rel": _2,
			"shop": _2,
			"rt": _3
		}],
		"hu": [1, {
			"2000": _2,
			"agrar": _2,
			"bolt": _2,
			"casino": _2,
			"city": _2,
			"co": _2,
			"erotica": _2,
			"erotika": _2,
			"film": _2,
			"forum": _2,
			"games": _2,
			"hotel": _2,
			"info": _2,
			"ingatlan": _2,
			"jogasz": _2,
			"konyvelo": _2,
			"lakas": _2,
			"media": _2,
			"news": _2,
			"org": _2,
			"priv": _2,
			"reklam": _2,
			"sex": _2,
			"shop": _2,
			"sport": _2,
			"suli": _2,
			"szex": _2,
			"tm": _2,
			"tozsde": _2,
			"utazas": _2,
			"video": _2
		}],
		"id": [1, {
			"ac": _2,
			"biz": _2,
			"co": _2,
			"desa": _2,
			"go": _2,
			"kop": _2,
			"mil": _2,
			"my": _2,
			"net": _2,
			"or": _2,
			"ponpes": _2,
			"sch": _2,
			"web": _2,
			"e": _3,
			"zone": _3
		}],
		"ie": [1, {
			"gov": _2,
			"myspreadshop": _3
		}],
		"il": [1, {
			"ac": _2,
			"co": [1, {
				"ravpage": _3,
				"mytabit": _3,
				"tabitorder": _3
			}],
			"gov": _2,
			"idf": _2,
			"k12": _2,
			"muni": _2,
			"net": _2,
			"org": _2
		}],
		"xn--4dbrk0ce": [1, {
			"xn--4dbgdty6c": _2,
			"xn--5dbhl8d": _2,
			"xn--8dbq2a": _2,
			"xn--hebda8b": _2
		}],
		"ישראל": [1, {
			"אקדמיה": _2,
			"ישוב": _2,
			"צהל": _2,
			"ממשל": _2
		}],
		"im": [1, {
			"ac": _2,
			"co": [1, {
				"ltd": _2,
				"plc": _2
			}],
			"com": _2,
			"net": _2,
			"org": _2,
			"tt": _2,
			"tv": _2
		}],
		"in": [1, {
			"5g": _2,
			"6g": _2,
			"ac": _2,
			"ai": _2,
			"am": _2,
			"bihar": _2,
			"biz": _2,
			"business": _2,
			"ca": _2,
			"cn": _2,
			"co": _2,
			"com": _2,
			"coop": _2,
			"cs": _2,
			"delhi": _2,
			"dr": _2,
			"edu": _2,
			"er": _2,
			"firm": _2,
			"gen": _2,
			"gov": _2,
			"gujarat": _2,
			"ind": _2,
			"info": _2,
			"int": _2,
			"internet": _2,
			"io": _2,
			"me": _2,
			"mil": _2,
			"net": _2,
			"nic": _2,
			"org": _2,
			"pg": _2,
			"post": _2,
			"pro": _2,
			"res": _2,
			"travel": _2,
			"tv": _2,
			"uk": _2,
			"up": _2,
			"us": _2,
			"cloudns": _3,
			"barsy": _3,
			"web": _3,
			"supabase": _3
		}],
		"info": [1, {
			"cloudns": _3,
			"dynamic-dns": _3,
			"barrel-of-knowledge": _3,
			"barrell-of-knowledge": _3,
			"dyndns": _3,
			"for-our": _3,
			"groks-the": _3,
			"groks-this": _3,
			"here-for-more": _3,
			"knowsitall": _3,
			"selfip": _3,
			"webhop": _3,
			"barsy": _3,
			"mayfirst": _3,
			"mittwald": _3,
			"mittwaldserver": _3,
			"typo3server": _3,
			"dvrcam": _3,
			"ilovecollege": _3,
			"no-ip": _3,
			"forumz": _3,
			"nsupdate": _3,
			"dnsupdate": _3,
			"v-info": _3
		}],
		"int": [1, { "eu": _2 }],
		"io": [1, {
			"2038": _3,
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"nom": _2,
			"org": _2,
			"on-acorn": _6,
			"myaddr": _3,
			"apigee": _3,
			"b-data": _3,
			"beagleboard": _3,
			"bitbucket": _3,
			"bluebite": _3,
			"boxfuse": _3,
			"brave": _7,
			"browsersafetymark": _3,
			"bubble": _54,
			"bubbleapps": _3,
			"bigv": [0, { "uk0": _3 }],
			"cleverapps": _3,
			"cloudbeesusercontent": _3,
			"dappnode": [0, { "dyndns": _3 }],
			"darklang": _3,
			"definima": _3,
			"dedyn": _3,
			"icp0": _55,
			"icp1": _55,
			"qzz": _3,
			"fh-muenster": _3,
			"shw": _3,
			"forgerock": [0, { "id": _3 }],
			"github": _3,
			"gitlab": _3,
			"lolipop": _3,
			"hasura-app": _3,
			"hostyhosting": _3,
			"hypernode": _3,
			"moonscale": _6,
			"beebyte": _43,
			"beebyteapp": [0, { "sekd1": _3 }],
			"jele": _3,
			"webthings": _3,
			"loginline": _3,
			"barsy": _3,
			"azurecontainer": _6,
			"ngrok": [2, {
				"ap": _3,
				"au": _3,
				"eu": _3,
				"in": _3,
				"jp": _3,
				"sa": _3,
				"us": _3
			}],
			"nodeart": [0, { "stage": _3 }],
			"pantheonsite": _3,
			"pstmn": [2, { "mock": _3 }],
			"protonet": _3,
			"qcx": [2, { "sys": _6 }],
			"qoto": _3,
			"vaporcloud": _3,
			"myrdbx": _3,
			"rb-hosting": _46,
			"on-k3s": _6,
			"on-rio": _6,
			"readthedocs": _3,
			"resindevice": _3,
			"resinstaging": [0, { "devices": _3 }],
			"hzc": _3,
			"sandcats": _3,
			"scrypted": [0, { "client": _3 }],
			"mo-siemens": _3,
			"lair": _42,
			"stolos": _6,
			"musician": _3,
			"utwente": _3,
			"edugit": _3,
			"telebit": _3,
			"thingdust": [0, {
				"dev": _56,
				"disrec": _56,
				"prod": _57,
				"testing": _56
			}],
			"tickets": _3,
			"webflow": _3,
			"webflowtest": _3,
			"editorx": _3,
			"wixstudio": _3,
			"basicserver": _3,
			"virtualserver": _3
		}],
		"iq": _5,
		"ir": [1, {
			"ac": _2,
			"co": _2,
			"gov": _2,
			"id": _2,
			"net": _2,
			"org": _2,
			"sch": _2,
			"xn--mgba3a4f16a": _2,
			"ایران": _2,
			"xn--mgba3a4fra": _2,
			"ايران": _2,
			"arvanedge": _3,
			"vistablog": _3
		}],
		"is": _2,
		"it": [1, {
			"edu": _2,
			"gov": _2,
			"abr": _2,
			"abruzzo": _2,
			"aosta-valley": _2,
			"aostavalley": _2,
			"bas": _2,
			"basilicata": _2,
			"cal": _2,
			"calabria": _2,
			"cam": _2,
			"campania": _2,
			"emilia-romagna": _2,
			"emiliaromagna": _2,
			"emr": _2,
			"friuli-v-giulia": _2,
			"friuli-ve-giulia": _2,
			"friuli-vegiulia": _2,
			"friuli-venezia-giulia": _2,
			"friuli-veneziagiulia": _2,
			"friuli-vgiulia": _2,
			"friuliv-giulia": _2,
			"friulive-giulia": _2,
			"friulivegiulia": _2,
			"friulivenezia-giulia": _2,
			"friuliveneziagiulia": _2,
			"friulivgiulia": _2,
			"fvg": _2,
			"laz": _2,
			"lazio": _2,
			"lig": _2,
			"liguria": _2,
			"lom": _2,
			"lombardia": _2,
			"lombardy": _2,
			"lucania": _2,
			"mar": _2,
			"marche": _2,
			"mol": _2,
			"molise": _2,
			"piedmont": _2,
			"piemonte": _2,
			"pmn": _2,
			"pug": _2,
			"puglia": _2,
			"sar": _2,
			"sardegna": _2,
			"sardinia": _2,
			"sic": _2,
			"sicilia": _2,
			"sicily": _2,
			"taa": _2,
			"tos": _2,
			"toscana": _2,
			"trentin-sud-tirol": _2,
			"xn--trentin-sd-tirol-rzb": _2,
			"trentin-süd-tirol": _2,
			"trentin-sudtirol": _2,
			"xn--trentin-sdtirol-7vb": _2,
			"trentin-südtirol": _2,
			"trentin-sued-tirol": _2,
			"trentin-suedtirol": _2,
			"trentino": _2,
			"trentino-a-adige": _2,
			"trentino-aadige": _2,
			"trentino-alto-adige": _2,
			"trentino-altoadige": _2,
			"trentino-s-tirol": _2,
			"trentino-stirol": _2,
			"trentino-sud-tirol": _2,
			"xn--trentino-sd-tirol-c3b": _2,
			"trentino-süd-tirol": _2,
			"trentino-sudtirol": _2,
			"xn--trentino-sdtirol-szb": _2,
			"trentino-südtirol": _2,
			"trentino-sued-tirol": _2,
			"trentino-suedtirol": _2,
			"trentinoa-adige": _2,
			"trentinoaadige": _2,
			"trentinoalto-adige": _2,
			"trentinoaltoadige": _2,
			"trentinos-tirol": _2,
			"trentinostirol": _2,
			"trentinosud-tirol": _2,
			"xn--trentinosd-tirol-rzb": _2,
			"trentinosüd-tirol": _2,
			"trentinosudtirol": _2,
			"xn--trentinosdtirol-7vb": _2,
			"trentinosüdtirol": _2,
			"trentinosued-tirol": _2,
			"trentinosuedtirol": _2,
			"trentinsud-tirol": _2,
			"xn--trentinsd-tirol-6vb": _2,
			"trentinsüd-tirol": _2,
			"trentinsudtirol": _2,
			"xn--trentinsdtirol-nsb": _2,
			"trentinsüdtirol": _2,
			"trentinsued-tirol": _2,
			"trentinsuedtirol": _2,
			"tuscany": _2,
			"umb": _2,
			"umbria": _2,
			"val-d-aosta": _2,
			"val-daosta": _2,
			"vald-aosta": _2,
			"valdaosta": _2,
			"valle-aosta": _2,
			"valle-d-aosta": _2,
			"valle-daosta": _2,
			"valleaosta": _2,
			"valled-aosta": _2,
			"valledaosta": _2,
			"vallee-aoste": _2,
			"xn--valle-aoste-ebb": _2,
			"vallée-aoste": _2,
			"vallee-d-aoste": _2,
			"xn--valle-d-aoste-ehb": _2,
			"vallée-d-aoste": _2,
			"valleeaoste": _2,
			"xn--valleaoste-e7a": _2,
			"valléeaoste": _2,
			"valleedaoste": _2,
			"xn--valledaoste-ebb": _2,
			"valléedaoste": _2,
			"vao": _2,
			"vda": _2,
			"ven": _2,
			"veneto": _2,
			"ag": _2,
			"agrigento": _2,
			"al": _2,
			"alessandria": _2,
			"alto-adige": _2,
			"altoadige": _2,
			"an": _2,
			"ancona": _2,
			"andria-barletta-trani": _2,
			"andria-trani-barletta": _2,
			"andriabarlettatrani": _2,
			"andriatranibarletta": _2,
			"ao": _2,
			"aosta": _2,
			"aoste": _2,
			"ap": _2,
			"aq": _2,
			"aquila": _2,
			"ar": _2,
			"arezzo": _2,
			"ascoli-piceno": _2,
			"ascolipiceno": _2,
			"asti": _2,
			"at": _2,
			"av": _2,
			"avellino": _2,
			"ba": _2,
			"balsan": _2,
			"balsan-sudtirol": _2,
			"xn--balsan-sdtirol-nsb": _2,
			"balsan-südtirol": _2,
			"balsan-suedtirol": _2,
			"bari": _2,
			"barletta-trani-andria": _2,
			"barlettatraniandria": _2,
			"belluno": _2,
			"benevento": _2,
			"bergamo": _2,
			"bg": _2,
			"bi": _2,
			"biella": _2,
			"bl": _2,
			"bn": _2,
			"bo": _2,
			"bologna": _2,
			"bolzano": _2,
			"bolzano-altoadige": _2,
			"bozen": _2,
			"bozen-sudtirol": _2,
			"xn--bozen-sdtirol-2ob": _2,
			"bozen-südtirol": _2,
			"bozen-suedtirol": _2,
			"br": _2,
			"brescia": _2,
			"brindisi": _2,
			"bs": _2,
			"bt": _2,
			"bulsan": _2,
			"bulsan-sudtirol": _2,
			"xn--bulsan-sdtirol-nsb": _2,
			"bulsan-südtirol": _2,
			"bulsan-suedtirol": _2,
			"bz": _2,
			"ca": _2,
			"cagliari": _2,
			"caltanissetta": _2,
			"campidano-medio": _2,
			"campidanomedio": _2,
			"campobasso": _2,
			"carbonia-iglesias": _2,
			"carboniaiglesias": _2,
			"carrara-massa": _2,
			"carraramassa": _2,
			"caserta": _2,
			"catania": _2,
			"catanzaro": _2,
			"cb": _2,
			"ce": _2,
			"cesena-forli": _2,
			"xn--cesena-forl-mcb": _2,
			"cesena-forlì": _2,
			"cesenaforli": _2,
			"xn--cesenaforl-i8a": _2,
			"cesenaforlì": _2,
			"ch": _2,
			"chieti": _2,
			"ci": _2,
			"cl": _2,
			"cn": _2,
			"co": _2,
			"como": _2,
			"cosenza": _2,
			"cr": _2,
			"cremona": _2,
			"crotone": _2,
			"cs": _2,
			"ct": _2,
			"cuneo": _2,
			"cz": _2,
			"dell-ogliastra": _2,
			"dellogliastra": _2,
			"en": _2,
			"enna": _2,
			"fc": _2,
			"fe": _2,
			"fermo": _2,
			"ferrara": _2,
			"fg": _2,
			"fi": _2,
			"firenze": _2,
			"florence": _2,
			"fm": _2,
			"foggia": _2,
			"forli-cesena": _2,
			"xn--forl-cesena-fcb": _2,
			"forlì-cesena": _2,
			"forlicesena": _2,
			"xn--forlcesena-c8a": _2,
			"forlìcesena": _2,
			"fr": _2,
			"frosinone": _2,
			"ge": _2,
			"genoa": _2,
			"genova": _2,
			"go": _2,
			"gorizia": _2,
			"gr": _2,
			"grosseto": _2,
			"iglesias-carbonia": _2,
			"iglesiascarbonia": _2,
			"im": _2,
			"imperia": _2,
			"is": _2,
			"isernia": _2,
			"kr": _2,
			"la-spezia": _2,
			"laquila": _2,
			"laspezia": _2,
			"latina": _2,
			"lc": _2,
			"le": _2,
			"lecce": _2,
			"lecco": _2,
			"li": _2,
			"livorno": _2,
			"lo": _2,
			"lodi": _2,
			"lt": _2,
			"lu": _2,
			"lucca": _2,
			"macerata": _2,
			"mantova": _2,
			"massa-carrara": _2,
			"massacarrara": _2,
			"matera": _2,
			"mb": _2,
			"mc": _2,
			"me": _2,
			"medio-campidano": _2,
			"mediocampidano": _2,
			"messina": _2,
			"mi": _2,
			"milan": _2,
			"milano": _2,
			"mn": _2,
			"mo": _2,
			"modena": _2,
			"monza": _2,
			"monza-brianza": _2,
			"monza-e-della-brianza": _2,
			"monzabrianza": _2,
			"monzaebrianza": _2,
			"monzaedellabrianza": _2,
			"ms": _2,
			"mt": _2,
			"na": _2,
			"naples": _2,
			"napoli": _2,
			"no": _2,
			"novara": _2,
			"nu": _2,
			"nuoro": _2,
			"og": _2,
			"ogliastra": _2,
			"olbia-tempio": _2,
			"olbiatempio": _2,
			"or": _2,
			"oristano": _2,
			"ot": _2,
			"pa": _2,
			"padova": _2,
			"padua": _2,
			"palermo": _2,
			"parma": _2,
			"pavia": _2,
			"pc": _2,
			"pd": _2,
			"pe": _2,
			"perugia": _2,
			"pesaro-urbino": _2,
			"pesarourbino": _2,
			"pescara": _2,
			"pg": _2,
			"pi": _2,
			"piacenza": _2,
			"pisa": _2,
			"pistoia": _2,
			"pn": _2,
			"po": _2,
			"pordenone": _2,
			"potenza": _2,
			"pr": _2,
			"prato": _2,
			"pt": _2,
			"pu": _2,
			"pv": _2,
			"pz": _2,
			"ra": _2,
			"ragusa": _2,
			"ravenna": _2,
			"rc": _2,
			"re": _2,
			"reggio-calabria": _2,
			"reggio-emilia": _2,
			"reggiocalabria": _2,
			"reggioemilia": _2,
			"rg": _2,
			"ri": _2,
			"rieti": _2,
			"rimini": _2,
			"rm": _2,
			"rn": _2,
			"ro": _2,
			"roma": _2,
			"rome": _2,
			"rovigo": _2,
			"sa": _2,
			"salerno": _2,
			"sassari": _2,
			"savona": _2,
			"si": _2,
			"siena": _2,
			"siracusa": _2,
			"so": _2,
			"sondrio": _2,
			"sp": _2,
			"sr": _2,
			"ss": _2,
			"xn--sdtirol-n2a": _2,
			"südtirol": _2,
			"suedtirol": _2,
			"sv": _2,
			"ta": _2,
			"taranto": _2,
			"te": _2,
			"tempio-olbia": _2,
			"tempioolbia": _2,
			"teramo": _2,
			"terni": _2,
			"tn": _2,
			"to": _2,
			"torino": _2,
			"tp": _2,
			"tr": _2,
			"trani-andria-barletta": _2,
			"trani-barletta-andria": _2,
			"traniandriabarletta": _2,
			"tranibarlettaandria": _2,
			"trapani": _2,
			"trento": _2,
			"treviso": _2,
			"trieste": _2,
			"ts": _2,
			"turin": _2,
			"tv": _2,
			"ud": _2,
			"udine": _2,
			"urbino-pesaro": _2,
			"urbinopesaro": _2,
			"va": _2,
			"varese": _2,
			"vb": _2,
			"vc": _2,
			"ve": _2,
			"venezia": _2,
			"venice": _2,
			"verbania": _2,
			"vercelli": _2,
			"verona": _2,
			"vi": _2,
			"vibo-valentia": _2,
			"vibovalentia": _2,
			"vicenza": _2,
			"viterbo": _2,
			"vr": _2,
			"vs": _2,
			"vt": _2,
			"vv": _2,
			"12chars": _3,
			"ibxos": _3,
			"iliadboxos": _3,
			"neen": [0, { "jc": _3 }],
			"123homepage": _3,
			"16-b": _3,
			"32-b": _3,
			"64-b": _3,
			"myspreadshop": _3,
			"syncloud": _3
		}],
		"je": [1, {
			"co": _2,
			"net": _2,
			"org": _2,
			"of": _3
		}],
		"jm": _20,
		"jo": [1, {
			"agri": _2,
			"ai": _2,
			"com": _2,
			"edu": _2,
			"eng": _2,
			"fm": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"per": _2,
			"phd": _2,
			"sch": _2,
			"tv": _2
		}],
		"jobs": _2,
		"jp": [1, {
			"ac": _2,
			"ad": _2,
			"co": _2,
			"ed": _2,
			"go": _2,
			"gr": _2,
			"lg": _2,
			"ne": [1, {
				"aseinet": _53,
				"gehirn": _3,
				"ivory": _3,
				"mail-box": _3,
				"mints": _3,
				"mokuren": _3,
				"opal": _3,
				"sakura": _3,
				"sumomo": _3,
				"topaz": _3
			}],
			"or": _2,
			"aichi": [1, {
				"aisai": _2,
				"ama": _2,
				"anjo": _2,
				"asuke": _2,
				"chiryu": _2,
				"chita": _2,
				"fuso": _2,
				"gamagori": _2,
				"handa": _2,
				"hazu": _2,
				"hekinan": _2,
				"higashiura": _2,
				"ichinomiya": _2,
				"inazawa": _2,
				"inuyama": _2,
				"isshiki": _2,
				"iwakura": _2,
				"kanie": _2,
				"kariya": _2,
				"kasugai": _2,
				"kira": _2,
				"kiyosu": _2,
				"komaki": _2,
				"konan": _2,
				"kota": _2,
				"mihama": _2,
				"miyoshi": _2,
				"nishio": _2,
				"nisshin": _2,
				"obu": _2,
				"oguchi": _2,
				"oharu": _2,
				"okazaki": _2,
				"owariasahi": _2,
				"seto": _2,
				"shikatsu": _2,
				"shinshiro": _2,
				"shitara": _2,
				"tahara": _2,
				"takahama": _2,
				"tobishima": _2,
				"toei": _2,
				"togo": _2,
				"tokai": _2,
				"tokoname": _2,
				"toyoake": _2,
				"toyohashi": _2,
				"toyokawa": _2,
				"toyone": _2,
				"toyota": _2,
				"tsushima": _2,
				"yatomi": _2
			}],
			"akita": [1, {
				"akita": _2,
				"daisen": _2,
				"fujisato": _2,
				"gojome": _2,
				"hachirogata": _2,
				"happou": _2,
				"higashinaruse": _2,
				"honjo": _2,
				"honjyo": _2,
				"ikawa": _2,
				"kamikoani": _2,
				"kamioka": _2,
				"katagami": _2,
				"kazuno": _2,
				"kitaakita": _2,
				"kosaka": _2,
				"kyowa": _2,
				"misato": _2,
				"mitane": _2,
				"moriyoshi": _2,
				"nikaho": _2,
				"noshiro": _2,
				"odate": _2,
				"oga": _2,
				"ogata": _2,
				"semboku": _2,
				"yokote": _2,
				"yurihonjo": _2
			}],
			"aomori": [1, {
				"aomori": _2,
				"gonohe": _2,
				"hachinohe": _2,
				"hashikami": _2,
				"hiranai": _2,
				"hirosaki": _2,
				"itayanagi": _2,
				"kuroishi": _2,
				"misawa": _2,
				"mutsu": _2,
				"nakadomari": _2,
				"noheji": _2,
				"oirase": _2,
				"owani": _2,
				"rokunohe": _2,
				"sannohe": _2,
				"shichinohe": _2,
				"shingo": _2,
				"takko": _2,
				"towada": _2,
				"tsugaru": _2,
				"tsuruta": _2
			}],
			"chiba": [1, {
				"abiko": _2,
				"asahi": _2,
				"chonan": _2,
				"chosei": _2,
				"choshi": _2,
				"chuo": _2,
				"funabashi": _2,
				"futtsu": _2,
				"hanamigawa": _2,
				"ichihara": _2,
				"ichikawa": _2,
				"ichinomiya": _2,
				"inzai": _2,
				"isumi": _2,
				"kamagaya": _2,
				"kamogawa": _2,
				"kashiwa": _2,
				"katori": _2,
				"katsuura": _2,
				"kimitsu": _2,
				"kisarazu": _2,
				"kozaki": _2,
				"kujukuri": _2,
				"kyonan": _2,
				"matsudo": _2,
				"midori": _2,
				"mihama": _2,
				"minamiboso": _2,
				"mobara": _2,
				"mutsuzawa": _2,
				"nagara": _2,
				"nagareyama": _2,
				"narashino": _2,
				"narita": _2,
				"noda": _2,
				"oamishirasato": _2,
				"omigawa": _2,
				"onjuku": _2,
				"otaki": _2,
				"sakae": _2,
				"sakura": _2,
				"shimofusa": _2,
				"shirako": _2,
				"shiroi": _2,
				"shisui": _2,
				"sodegaura": _2,
				"sosa": _2,
				"tako": _2,
				"tateyama": _2,
				"togane": _2,
				"tohnosho": _2,
				"tomisato": _2,
				"urayasu": _2,
				"yachimata": _2,
				"yachiyo": _2,
				"yokaichiba": _2,
				"yokoshibahikari": _2,
				"yotsukaido": _2
			}],
			"ehime": [1, {
				"ainan": _2,
				"honai": _2,
				"ikata": _2,
				"imabari": _2,
				"iyo": _2,
				"kamijima": _2,
				"kihoku": _2,
				"kumakogen": _2,
				"masaki": _2,
				"matsuno": _2,
				"matsuyama": _2,
				"namikata": _2,
				"niihama": _2,
				"ozu": _2,
				"saijo": _2,
				"seiyo": _2,
				"shikokuchuo": _2,
				"tobe": _2,
				"toon": _2,
				"uchiko": _2,
				"uwajima": _2,
				"yawatahama": _2
			}],
			"fukui": [1, {
				"echizen": _2,
				"eiheiji": _2,
				"fukui": _2,
				"ikeda": _2,
				"katsuyama": _2,
				"mihama": _2,
				"minamiechizen": _2,
				"obama": _2,
				"ohi": _2,
				"ono": _2,
				"sabae": _2,
				"sakai": _2,
				"takahama": _2,
				"tsuruga": _2,
				"wakasa": _2
			}],
			"fukuoka": [1, {
				"ashiya": _2,
				"buzen": _2,
				"chikugo": _2,
				"chikuho": _2,
				"chikujo": _2,
				"chikushino": _2,
				"chikuzen": _2,
				"chuo": _2,
				"dazaifu": _2,
				"fukuchi": _2,
				"hakata": _2,
				"higashi": _2,
				"hirokawa": _2,
				"hisayama": _2,
				"iizuka": _2,
				"inatsuki": _2,
				"kaho": _2,
				"kasuga": _2,
				"kasuya": _2,
				"kawara": _2,
				"keisen": _2,
				"koga": _2,
				"kurate": _2,
				"kurogi": _2,
				"kurume": _2,
				"minami": _2,
				"miyako": _2,
				"miyama": _2,
				"miyawaka": _2,
				"mizumaki": _2,
				"munakata": _2,
				"nakagawa": _2,
				"nakama": _2,
				"nishi": _2,
				"nogata": _2,
				"ogori": _2,
				"okagaki": _2,
				"okawa": _2,
				"oki": _2,
				"omuta": _2,
				"onga": _2,
				"onojo": _2,
				"oto": _2,
				"saigawa": _2,
				"sasaguri": _2,
				"shingu": _2,
				"shinyoshitomi": _2,
				"shonai": _2,
				"soeda": _2,
				"sue": _2,
				"tachiarai": _2,
				"tagawa": _2,
				"takata": _2,
				"toho": _2,
				"toyotsu": _2,
				"tsuiki": _2,
				"ukiha": _2,
				"umi": _2,
				"usui": _2,
				"yamada": _2,
				"yame": _2,
				"yanagawa": _2,
				"yukuhashi": _2
			}],
			"fukushima": [1, {
				"aizubange": _2,
				"aizumisato": _2,
				"aizuwakamatsu": _2,
				"asakawa": _2,
				"bandai": _2,
				"date": _2,
				"fukushima": _2,
				"furudono": _2,
				"futaba": _2,
				"hanawa": _2,
				"higashi": _2,
				"hirata": _2,
				"hirono": _2,
				"iitate": _2,
				"inawashiro": _2,
				"ishikawa": _2,
				"iwaki": _2,
				"izumizaki": _2,
				"kagamiishi": _2,
				"kaneyama": _2,
				"kawamata": _2,
				"kitakata": _2,
				"kitashiobara": _2,
				"koori": _2,
				"koriyama": _2,
				"kunimi": _2,
				"miharu": _2,
				"mishima": _2,
				"namie": _2,
				"nango": _2,
				"nishiaizu": _2,
				"nishigo": _2,
				"okuma": _2,
				"omotego": _2,
				"ono": _2,
				"otama": _2,
				"samegawa": _2,
				"shimogo": _2,
				"shirakawa": _2,
				"showa": _2,
				"soma": _2,
				"sukagawa": _2,
				"taishin": _2,
				"tamakawa": _2,
				"tanagura": _2,
				"tenei": _2,
				"yabuki": _2,
				"yamato": _2,
				"yamatsuri": _2,
				"yanaizu": _2,
				"yugawa": _2
			}],
			"gifu": [1, {
				"anpachi": _2,
				"ena": _2,
				"gifu": _2,
				"ginan": _2,
				"godo": _2,
				"gujo": _2,
				"hashima": _2,
				"hichiso": _2,
				"hida": _2,
				"higashishirakawa": _2,
				"ibigawa": _2,
				"ikeda": _2,
				"kakamigahara": _2,
				"kani": _2,
				"kasahara": _2,
				"kasamatsu": _2,
				"kawaue": _2,
				"kitagata": _2,
				"mino": _2,
				"minokamo": _2,
				"mitake": _2,
				"mizunami": _2,
				"motosu": _2,
				"nakatsugawa": _2,
				"ogaki": _2,
				"sakahogi": _2,
				"seki": _2,
				"sekigahara": _2,
				"shirakawa": _2,
				"tajimi": _2,
				"takayama": _2,
				"tarui": _2,
				"toki": _2,
				"tomika": _2,
				"wanouchi": _2,
				"yamagata": _2,
				"yaotsu": _2,
				"yoro": _2
			}],
			"gunma": [1, {
				"annaka": _2,
				"chiyoda": _2,
				"fujioka": _2,
				"higashiagatsuma": _2,
				"isesaki": _2,
				"itakura": _2,
				"kanna": _2,
				"kanra": _2,
				"katashina": _2,
				"kawaba": _2,
				"kiryu": _2,
				"kusatsu": _2,
				"maebashi": _2,
				"meiwa": _2,
				"midori": _2,
				"minakami": _2,
				"naganohara": _2,
				"nakanojo": _2,
				"nanmoku": _2,
				"numata": _2,
				"oizumi": _2,
				"ora": _2,
				"ota": _2,
				"shibukawa": _2,
				"shimonita": _2,
				"shinto": _2,
				"showa": _2,
				"takasaki": _2,
				"takayama": _2,
				"tamamura": _2,
				"tatebayashi": _2,
				"tomioka": _2,
				"tsukiyono": _2,
				"tsumagoi": _2,
				"ueno": _2,
				"yoshioka": _2
			}],
			"hiroshima": [1, {
				"asaminami": _2,
				"daiwa": _2,
				"etajima": _2,
				"fuchu": _2,
				"fukuyama": _2,
				"hatsukaichi": _2,
				"higashihiroshima": _2,
				"hongo": _2,
				"jinsekikogen": _2,
				"kaita": _2,
				"kui": _2,
				"kumano": _2,
				"kure": _2,
				"mihara": _2,
				"miyoshi": _2,
				"naka": _2,
				"onomichi": _2,
				"osakikamijima": _2,
				"otake": _2,
				"saka": _2,
				"sera": _2,
				"seranishi": _2,
				"shinichi": _2,
				"shobara": _2,
				"takehara": _2
			}],
			"hokkaido": [1, {
				"abashiri": _2,
				"abira": _2,
				"aibetsu": _2,
				"akabira": _2,
				"akkeshi": _2,
				"asahikawa": _2,
				"ashibetsu": _2,
				"ashoro": _2,
				"assabu": _2,
				"atsuma": _2,
				"bibai": _2,
				"biei": _2,
				"bifuka": _2,
				"bihoro": _2,
				"biratori": _2,
				"chippubetsu": _2,
				"chitose": _2,
				"date": _2,
				"ebetsu": _2,
				"embetsu": _2,
				"eniwa": _2,
				"erimo": _2,
				"esan": _2,
				"esashi": _2,
				"fukagawa": _2,
				"fukushima": _2,
				"furano": _2,
				"furubira": _2,
				"haboro": _2,
				"hakodate": _2,
				"hamatonbetsu": _2,
				"hidaka": _2,
				"higashikagura": _2,
				"higashikawa": _2,
				"hiroo": _2,
				"hokuryu": _2,
				"hokuto": _2,
				"honbetsu": _2,
				"horokanai": _2,
				"horonobe": _2,
				"ikeda": _2,
				"imakane": _2,
				"ishikari": _2,
				"iwamizawa": _2,
				"iwanai": _2,
				"kamifurano": _2,
				"kamikawa": _2,
				"kamishihoro": _2,
				"kamisunagawa": _2,
				"kamoenai": _2,
				"kayabe": _2,
				"kembuchi": _2,
				"kikonai": _2,
				"kimobetsu": _2,
				"kitahiroshima": _2,
				"kitami": _2,
				"kiyosato": _2,
				"koshimizu": _2,
				"kunneppu": _2,
				"kuriyama": _2,
				"kuromatsunai": _2,
				"kushiro": _2,
				"kutchan": _2,
				"kyowa": _2,
				"mashike": _2,
				"matsumae": _2,
				"mikasa": _2,
				"minamifurano": _2,
				"mombetsu": _2,
				"moseushi": _2,
				"mukawa": _2,
				"muroran": _2,
				"naie": _2,
				"nakagawa": _2,
				"nakasatsunai": _2,
				"nakatombetsu": _2,
				"nanae": _2,
				"nanporo": _2,
				"nayoro": _2,
				"nemuro": _2,
				"niikappu": _2,
				"niki": _2,
				"nishiokoppe": _2,
				"noboribetsu": _2,
				"numata": _2,
				"obihiro": _2,
				"obira": _2,
				"oketo": _2,
				"okoppe": _2,
				"otaru": _2,
				"otobe": _2,
				"otofuke": _2,
				"otoineppu": _2,
				"oumu": _2,
				"ozora": _2,
				"pippu": _2,
				"rankoshi": _2,
				"rebun": _2,
				"rikubetsu": _2,
				"rishiri": _2,
				"rishirifuji": _2,
				"saroma": _2,
				"sarufutsu": _2,
				"shakotan": _2,
				"shari": _2,
				"shibecha": _2,
				"shibetsu": _2,
				"shikabe": _2,
				"shikaoi": _2,
				"shimamaki": _2,
				"shimizu": _2,
				"shimokawa": _2,
				"shinshinotsu": _2,
				"shintoku": _2,
				"shiranuka": _2,
				"shiraoi": _2,
				"shiriuchi": _2,
				"sobetsu": _2,
				"sunagawa": _2,
				"taiki": _2,
				"takasu": _2,
				"takikawa": _2,
				"takinoue": _2,
				"teshikaga": _2,
				"tobetsu": _2,
				"tohma": _2,
				"tomakomai": _2,
				"tomari": _2,
				"toya": _2,
				"toyako": _2,
				"toyotomi": _2,
				"toyoura": _2,
				"tsubetsu": _2,
				"tsukigata": _2,
				"urakawa": _2,
				"urausu": _2,
				"uryu": _2,
				"utashinai": _2,
				"wakkanai": _2,
				"wassamu": _2,
				"yakumo": _2,
				"yoichi": _2
			}],
			"hyogo": [1, {
				"aioi": _2,
				"akashi": _2,
				"ako": _2,
				"amagasaki": _2,
				"aogaki": _2,
				"asago": _2,
				"ashiya": _2,
				"awaji": _2,
				"fukusaki": _2,
				"goshiki": _2,
				"harima": _2,
				"himeji": _2,
				"ichikawa": _2,
				"inagawa": _2,
				"itami": _2,
				"kakogawa": _2,
				"kamigori": _2,
				"kamikawa": _2,
				"kasai": _2,
				"kasuga": _2,
				"kawanishi": _2,
				"miki": _2,
				"minamiawaji": _2,
				"nishinomiya": _2,
				"nishiwaki": _2,
				"ono": _2,
				"sanda": _2,
				"sannan": _2,
				"sasayama": _2,
				"sayo": _2,
				"shingu": _2,
				"shinonsen": _2,
				"shiso": _2,
				"sumoto": _2,
				"taishi": _2,
				"taka": _2,
				"takarazuka": _2,
				"takasago": _2,
				"takino": _2,
				"tamba": _2,
				"tatsuno": _2,
				"toyooka": _2,
				"yabu": _2,
				"yashiro": _2,
				"yoka": _2,
				"yokawa": _2
			}],
			"ibaraki": [1, {
				"ami": _2,
				"asahi": _2,
				"bando": _2,
				"chikusei": _2,
				"daigo": _2,
				"fujishiro": _2,
				"hitachi": _2,
				"hitachinaka": _2,
				"hitachiomiya": _2,
				"hitachiota": _2,
				"ibaraki": _2,
				"ina": _2,
				"inashiki": _2,
				"itako": _2,
				"iwama": _2,
				"joso": _2,
				"kamisu": _2,
				"kasama": _2,
				"kashima": _2,
				"kasumigaura": _2,
				"koga": _2,
				"miho": _2,
				"mito": _2,
				"moriya": _2,
				"naka": _2,
				"namegata": _2,
				"oarai": _2,
				"ogawa": _2,
				"omitama": _2,
				"ryugasaki": _2,
				"sakai": _2,
				"sakuragawa": _2,
				"shimodate": _2,
				"shimotsuma": _2,
				"shirosato": _2,
				"sowa": _2,
				"suifu": _2,
				"takahagi": _2,
				"tamatsukuri": _2,
				"tokai": _2,
				"tomobe": _2,
				"tone": _2,
				"toride": _2,
				"tsuchiura": _2,
				"tsukuba": _2,
				"uchihara": _2,
				"ushiku": _2,
				"yachiyo": _2,
				"yamagata": _2,
				"yawara": _2,
				"yuki": _2
			}],
			"ishikawa": [1, {
				"anamizu": _2,
				"hakui": _2,
				"hakusan": _2,
				"kaga": _2,
				"kahoku": _2,
				"kanazawa": _2,
				"kawakita": _2,
				"komatsu": _2,
				"nakanoto": _2,
				"nanao": _2,
				"nomi": _2,
				"nonoichi": _2,
				"noto": _2,
				"shika": _2,
				"suzu": _2,
				"tsubata": _2,
				"tsurugi": _2,
				"uchinada": _2,
				"wajima": _2
			}],
			"iwate": [1, {
				"fudai": _2,
				"fujisawa": _2,
				"hanamaki": _2,
				"hiraizumi": _2,
				"hirono": _2,
				"ichinohe": _2,
				"ichinoseki": _2,
				"iwaizumi": _2,
				"iwate": _2,
				"joboji": _2,
				"kamaishi": _2,
				"kanegasaki": _2,
				"karumai": _2,
				"kawai": _2,
				"kitakami": _2,
				"kuji": _2,
				"kunohe": _2,
				"kuzumaki": _2,
				"miyako": _2,
				"mizusawa": _2,
				"morioka": _2,
				"ninohe": _2,
				"noda": _2,
				"ofunato": _2,
				"oshu": _2,
				"otsuchi": _2,
				"rikuzentakata": _2,
				"shiwa": _2,
				"shizukuishi": _2,
				"sumita": _2,
				"tanohata": _2,
				"tono": _2,
				"yahaba": _2,
				"yamada": _2
			}],
			"kagawa": [1, {
				"ayagawa": _2,
				"higashikagawa": _2,
				"kanonji": _2,
				"kotohira": _2,
				"manno": _2,
				"marugame": _2,
				"mitoyo": _2,
				"naoshima": _2,
				"sanuki": _2,
				"tadotsu": _2,
				"takamatsu": _2,
				"tonosho": _2,
				"uchinomi": _2,
				"utazu": _2,
				"zentsuji": _2
			}],
			"kagoshima": [1, {
				"akune": _2,
				"amami": _2,
				"hioki": _2,
				"isa": _2,
				"isen": _2,
				"izumi": _2,
				"kagoshima": _2,
				"kanoya": _2,
				"kawanabe": _2,
				"kinko": _2,
				"kouyama": _2,
				"makurazaki": _2,
				"matsumoto": _2,
				"minamitane": _2,
				"nakatane": _2,
				"nishinoomote": _2,
				"satsumasendai": _2,
				"soo": _2,
				"tarumizu": _2,
				"yusui": _2
			}],
			"kanagawa": [1, {
				"aikawa": _2,
				"atsugi": _2,
				"ayase": _2,
				"chigasaki": _2,
				"ebina": _2,
				"fujisawa": _2,
				"hadano": _2,
				"hakone": _2,
				"hiratsuka": _2,
				"isehara": _2,
				"kaisei": _2,
				"kamakura": _2,
				"kiyokawa": _2,
				"matsuda": _2,
				"minamiashigara": _2,
				"miura": _2,
				"nakai": _2,
				"ninomiya": _2,
				"odawara": _2,
				"oi": _2,
				"oiso": _2,
				"sagamihara": _2,
				"samukawa": _2,
				"tsukui": _2,
				"yamakita": _2,
				"yamato": _2,
				"yokosuka": _2,
				"yugawara": _2,
				"zama": _2,
				"zushi": _2
			}],
			"kochi": [1, {
				"aki": _2,
				"geisei": _2,
				"hidaka": _2,
				"higashitsuno": _2,
				"ino": _2,
				"kagami": _2,
				"kami": _2,
				"kitagawa": _2,
				"kochi": _2,
				"mihara": _2,
				"motoyama": _2,
				"muroto": _2,
				"nahari": _2,
				"nakamura": _2,
				"nankoku": _2,
				"nishitosa": _2,
				"niyodogawa": _2,
				"ochi": _2,
				"okawa": _2,
				"otoyo": _2,
				"otsuki": _2,
				"sakawa": _2,
				"sukumo": _2,
				"susaki": _2,
				"tosa": _2,
				"tosashimizu": _2,
				"toyo": _2,
				"tsuno": _2,
				"umaji": _2,
				"yasuda": _2,
				"yusuhara": _2
			}],
			"kumamoto": [1, {
				"amakusa": _2,
				"arao": _2,
				"aso": _2,
				"choyo": _2,
				"gyokuto": _2,
				"kamiamakusa": _2,
				"kikuchi": _2,
				"kumamoto": _2,
				"mashiki": _2,
				"mifune": _2,
				"minamata": _2,
				"minamioguni": _2,
				"nagasu": _2,
				"nishihara": _2,
				"oguni": _2,
				"ozu": _2,
				"sumoto": _2,
				"takamori": _2,
				"uki": _2,
				"uto": _2,
				"yamaga": _2,
				"yamato": _2,
				"yatsushiro": _2
			}],
			"kyoto": [1, {
				"ayabe": _2,
				"fukuchiyama": _2,
				"higashiyama": _2,
				"ide": _2,
				"ine": _2,
				"joyo": _2,
				"kameoka": _2,
				"kamo": _2,
				"kita": _2,
				"kizu": _2,
				"kumiyama": _2,
				"kyotamba": _2,
				"kyotanabe": _2,
				"kyotango": _2,
				"maizuru": _2,
				"minami": _2,
				"minamiyamashiro": _2,
				"miyazu": _2,
				"muko": _2,
				"nagaokakyo": _2,
				"nakagyo": _2,
				"nantan": _2,
				"oyamazaki": _2,
				"sakyo": _2,
				"seika": _2,
				"tanabe": _2,
				"uji": _2,
				"ujitawara": _2,
				"wazuka": _2,
				"yamashina": _2,
				"yawata": _2
			}],
			"mie": [1, {
				"asahi": _2,
				"inabe": _2,
				"ise": _2,
				"kameyama": _2,
				"kawagoe": _2,
				"kiho": _2,
				"kisosaki": _2,
				"kiwa": _2,
				"komono": _2,
				"kumano": _2,
				"kuwana": _2,
				"matsusaka": _2,
				"meiwa": _2,
				"mihama": _2,
				"minamiise": _2,
				"misugi": _2,
				"miyama": _2,
				"nabari": _2,
				"shima": _2,
				"suzuka": _2,
				"tado": _2,
				"taiki": _2,
				"taki": _2,
				"tamaki": _2,
				"toba": _2,
				"tsu": _2,
				"udono": _2,
				"ureshino": _2,
				"watarai": _2,
				"yokkaichi": _2
			}],
			"miyagi": [1, {
				"furukawa": _2,
				"higashimatsushima": _2,
				"ishinomaki": _2,
				"iwanuma": _2,
				"kakuda": _2,
				"kami": _2,
				"kawasaki": _2,
				"marumori": _2,
				"matsushima": _2,
				"minamisanriku": _2,
				"misato": _2,
				"murata": _2,
				"natori": _2,
				"ogawara": _2,
				"ohira": _2,
				"onagawa": _2,
				"osaki": _2,
				"rifu": _2,
				"semine": _2,
				"shibata": _2,
				"shichikashuku": _2,
				"shikama": _2,
				"shiogama": _2,
				"shiroishi": _2,
				"tagajo": _2,
				"taiwa": _2,
				"tome": _2,
				"tomiya": _2,
				"wakuya": _2,
				"watari": _2,
				"yamamoto": _2,
				"zao": _2
			}],
			"miyazaki": [1, {
				"aya": _2,
				"ebino": _2,
				"gokase": _2,
				"hyuga": _2,
				"kadogawa": _2,
				"kawaminami": _2,
				"kijo": _2,
				"kitagawa": _2,
				"kitakata": _2,
				"kitaura": _2,
				"kobayashi": _2,
				"kunitomi": _2,
				"kushima": _2,
				"mimata": _2,
				"miyakonojo": _2,
				"miyazaki": _2,
				"morotsuka": _2,
				"nichinan": _2,
				"nishimera": _2,
				"nobeoka": _2,
				"saito": _2,
				"shiiba": _2,
				"shintomi": _2,
				"takaharu": _2,
				"takanabe": _2,
				"takazaki": _2,
				"tsuno": _2
			}],
			"nagano": [1, {
				"achi": _2,
				"agematsu": _2,
				"anan": _2,
				"aoki": _2,
				"asahi": _2,
				"azumino": _2,
				"chikuhoku": _2,
				"chikuma": _2,
				"chino": _2,
				"fujimi": _2,
				"hakuba": _2,
				"hara": _2,
				"hiraya": _2,
				"iida": _2,
				"iijima": _2,
				"iiyama": _2,
				"iizuna": _2,
				"ikeda": _2,
				"ikusaka": _2,
				"ina": _2,
				"karuizawa": _2,
				"kawakami": _2,
				"kiso": _2,
				"kisofukushima": _2,
				"kitaaiki": _2,
				"komagane": _2,
				"komoro": _2,
				"matsukawa": _2,
				"matsumoto": _2,
				"miasa": _2,
				"minamiaiki": _2,
				"minamimaki": _2,
				"minamiminowa": _2,
				"minowa": _2,
				"miyada": _2,
				"miyota": _2,
				"mochizuki": _2,
				"nagano": _2,
				"nagawa": _2,
				"nagiso": _2,
				"nakagawa": _2,
				"nakano": _2,
				"nozawaonsen": _2,
				"obuse": _2,
				"ogawa": _2,
				"okaya": _2,
				"omachi": _2,
				"omi": _2,
				"ookuwa": _2,
				"ooshika": _2,
				"otaki": _2,
				"otari": _2,
				"sakae": _2,
				"sakaki": _2,
				"saku": _2,
				"sakuho": _2,
				"shimosuwa": _2,
				"shinanomachi": _2,
				"shiojiri": _2,
				"suwa": _2,
				"suzaka": _2,
				"takagi": _2,
				"takamori": _2,
				"takayama": _2,
				"tateshina": _2,
				"tatsuno": _2,
				"togakushi": _2,
				"togura": _2,
				"tomi": _2,
				"ueda": _2,
				"wada": _2,
				"yamagata": _2,
				"yamanouchi": _2,
				"yasaka": _2,
				"yasuoka": _2
			}],
			"nagasaki": [1, {
				"chijiwa": _2,
				"futsu": _2,
				"goto": _2,
				"hasami": _2,
				"hirado": _2,
				"iki": _2,
				"isahaya": _2,
				"kawatana": _2,
				"kuchinotsu": _2,
				"matsuura": _2,
				"nagasaki": _2,
				"obama": _2,
				"omura": _2,
				"oseto": _2,
				"saikai": _2,
				"sasebo": _2,
				"seihi": _2,
				"shimabara": _2,
				"shinkamigoto": _2,
				"togitsu": _2,
				"tsushima": _2,
				"unzen": _2
			}],
			"nara": [1, {
				"ando": _2,
				"gose": _2,
				"heguri": _2,
				"higashiyoshino": _2,
				"ikaruga": _2,
				"ikoma": _2,
				"kamikitayama": _2,
				"kanmaki": _2,
				"kashiba": _2,
				"kashihara": _2,
				"katsuragi": _2,
				"kawai": _2,
				"kawakami": _2,
				"kawanishi": _2,
				"koryo": _2,
				"kurotaki": _2,
				"mitsue": _2,
				"miyake": _2,
				"nara": _2,
				"nosegawa": _2,
				"oji": _2,
				"ouda": _2,
				"oyodo": _2,
				"sakurai": _2,
				"sango": _2,
				"shimoichi": _2,
				"shimokitayama": _2,
				"shinjo": _2,
				"soni": _2,
				"takatori": _2,
				"tawaramoto": _2,
				"tenkawa": _2,
				"tenri": _2,
				"uda": _2,
				"yamatokoriyama": _2,
				"yamatotakada": _2,
				"yamazoe": _2,
				"yoshino": _2
			}],
			"niigata": [1, {
				"aga": _2,
				"agano": _2,
				"gosen": _2,
				"itoigawa": _2,
				"izumozaki": _2,
				"joetsu": _2,
				"kamo": _2,
				"kariwa": _2,
				"kashiwazaki": _2,
				"minamiuonuma": _2,
				"mitsuke": _2,
				"muika": _2,
				"murakami": _2,
				"myoko": _2,
				"nagaoka": _2,
				"niigata": _2,
				"ojiya": _2,
				"omi": _2,
				"sado": _2,
				"sanjo": _2,
				"seiro": _2,
				"seirou": _2,
				"sekikawa": _2,
				"shibata": _2,
				"tagami": _2,
				"tainai": _2,
				"tochio": _2,
				"tokamachi": _2,
				"tsubame": _2,
				"tsunan": _2,
				"uonuma": _2,
				"yahiko": _2,
				"yoita": _2,
				"yuzawa": _2
			}],
			"oita": [1, {
				"beppu": _2,
				"bungoono": _2,
				"bungotakada": _2,
				"hasama": _2,
				"hiji": _2,
				"himeshima": _2,
				"hita": _2,
				"kamitsue": _2,
				"kokonoe": _2,
				"kuju": _2,
				"kunisaki": _2,
				"kusu": _2,
				"oita": _2,
				"saiki": _2,
				"taketa": _2,
				"tsukumi": _2,
				"usa": _2,
				"usuki": _2,
				"yufu": _2
			}],
			"okayama": [1, {
				"akaiwa": _2,
				"asakuchi": _2,
				"bizen": _2,
				"hayashima": _2,
				"ibara": _2,
				"kagamino": _2,
				"kasaoka": _2,
				"kibichuo": _2,
				"kumenan": _2,
				"kurashiki": _2,
				"maniwa": _2,
				"misaki": _2,
				"nagi": _2,
				"niimi": _2,
				"nishiawakura": _2,
				"okayama": _2,
				"satosho": _2,
				"setouchi": _2,
				"shinjo": _2,
				"shoo": _2,
				"soja": _2,
				"takahashi": _2,
				"tamano": _2,
				"tsuyama": _2,
				"wake": _2,
				"yakage": _2
			}],
			"okinawa": [1, {
				"aguni": _2,
				"ginowan": _2,
				"ginoza": _2,
				"gushikami": _2,
				"haebaru": _2,
				"higashi": _2,
				"hirara": _2,
				"iheya": _2,
				"ishigaki": _2,
				"ishikawa": _2,
				"itoman": _2,
				"izena": _2,
				"kadena": _2,
				"kin": _2,
				"kitadaito": _2,
				"kitanakagusuku": _2,
				"kumejima": _2,
				"kunigami": _2,
				"minamidaito": _2,
				"motobu": _2,
				"nago": _2,
				"naha": _2,
				"nakagusuku": _2,
				"nakijin": _2,
				"nanjo": _2,
				"nishihara": _2,
				"ogimi": _2,
				"okinawa": _2,
				"onna": _2,
				"shimoji": _2,
				"taketomi": _2,
				"tarama": _2,
				"tokashiki": _2,
				"tomigusuku": _2,
				"tonaki": _2,
				"urasoe": _2,
				"uruma": _2,
				"yaese": _2,
				"yomitan": _2,
				"yonabaru": _2,
				"yonaguni": _2,
				"zamami": _2
			}],
			"osaka": [1, {
				"abeno": _2,
				"chihayaakasaka": _2,
				"chuo": _2,
				"daito": _2,
				"fujiidera": _2,
				"habikino": _2,
				"hannan": _2,
				"higashiosaka": _2,
				"higashisumiyoshi": _2,
				"higashiyodogawa": _2,
				"hirakata": _2,
				"ibaraki": _2,
				"ikeda": _2,
				"izumi": _2,
				"izumiotsu": _2,
				"izumisano": _2,
				"kadoma": _2,
				"kaizuka": _2,
				"kanan": _2,
				"kashiwara": _2,
				"katano": _2,
				"kawachinagano": _2,
				"kishiwada": _2,
				"kita": _2,
				"kumatori": _2,
				"matsubara": _2,
				"minato": _2,
				"minoh": _2,
				"misaki": _2,
				"moriguchi": _2,
				"neyagawa": _2,
				"nishi": _2,
				"nose": _2,
				"osakasayama": _2,
				"sakai": _2,
				"sayama": _2,
				"sennan": _2,
				"settsu": _2,
				"shijonawate": _2,
				"shimamoto": _2,
				"suita": _2,
				"tadaoka": _2,
				"taishi": _2,
				"tajiri": _2,
				"takaishi": _2,
				"takatsuki": _2,
				"tondabayashi": _2,
				"toyonaka": _2,
				"toyono": _2,
				"yao": _2
			}],
			"saga": [1, {
				"ariake": _2,
				"arita": _2,
				"fukudomi": _2,
				"genkai": _2,
				"hamatama": _2,
				"hizen": _2,
				"imari": _2,
				"kamimine": _2,
				"kanzaki": _2,
				"karatsu": _2,
				"kashima": _2,
				"kitagata": _2,
				"kitahata": _2,
				"kiyama": _2,
				"kouhoku": _2,
				"kyuragi": _2,
				"nishiarita": _2,
				"ogi": _2,
				"omachi": _2,
				"ouchi": _2,
				"saga": _2,
				"shiroishi": _2,
				"taku": _2,
				"tara": _2,
				"tosu": _2,
				"yoshinogari": _2
			}],
			"saitama": [1, {
				"arakawa": _2,
				"asaka": _2,
				"chichibu": _2,
				"fujimi": _2,
				"fujimino": _2,
				"fukaya": _2,
				"hanno": _2,
				"hanyu": _2,
				"hasuda": _2,
				"hatogaya": _2,
				"hatoyama": _2,
				"hidaka": _2,
				"higashichichibu": _2,
				"higashimatsuyama": _2,
				"honjo": _2,
				"ina": _2,
				"iruma": _2,
				"iwatsuki": _2,
				"kamiizumi": _2,
				"kamikawa": _2,
				"kamisato": _2,
				"kasukabe": _2,
				"kawagoe": _2,
				"kawaguchi": _2,
				"kawajima": _2,
				"kazo": _2,
				"kitamoto": _2,
				"koshigaya": _2,
				"kounosu": _2,
				"kuki": _2,
				"kumagaya": _2,
				"matsubushi": _2,
				"minano": _2,
				"misato": _2,
				"miyashiro": _2,
				"miyoshi": _2,
				"moroyama": _2,
				"nagatoro": _2,
				"namegawa": _2,
				"niiza": _2,
				"ogano": _2,
				"ogawa": _2,
				"ogose": _2,
				"okegawa": _2,
				"omiya": _2,
				"otaki": _2,
				"ranzan": _2,
				"ryokami": _2,
				"saitama": _2,
				"sakado": _2,
				"satte": _2,
				"sayama": _2,
				"shiki": _2,
				"shiraoka": _2,
				"soka": _2,
				"sugito": _2,
				"toda": _2,
				"tokigawa": _2,
				"tokorozawa": _2,
				"tsurugashima": _2,
				"urawa": _2,
				"warabi": _2,
				"yashio": _2,
				"yokoze": _2,
				"yono": _2,
				"yorii": _2,
				"yoshida": _2,
				"yoshikawa": _2,
				"yoshimi": _2
			}],
			"shiga": [1, {
				"aisho": _2,
				"gamo": _2,
				"higashiomi": _2,
				"hikone": _2,
				"koka": _2,
				"konan": _2,
				"kosei": _2,
				"koto": _2,
				"kusatsu": _2,
				"maibara": _2,
				"moriyama": _2,
				"nagahama": _2,
				"nishiazai": _2,
				"notogawa": _2,
				"omihachiman": _2,
				"otsu": _2,
				"ritto": _2,
				"ryuoh": _2,
				"takashima": _2,
				"takatsuki": _2,
				"torahime": _2,
				"toyosato": _2,
				"yasu": _2
			}],
			"shimane": [1, {
				"akagi": _2,
				"ama": _2,
				"gotsu": _2,
				"hamada": _2,
				"higashiizumo": _2,
				"hikawa": _2,
				"hikimi": _2,
				"izumo": _2,
				"kakinoki": _2,
				"masuda": _2,
				"matsue": _2,
				"misato": _2,
				"nishinoshima": _2,
				"ohda": _2,
				"okinoshima": _2,
				"okuizumo": _2,
				"shimane": _2,
				"tamayu": _2,
				"tsuwano": _2,
				"unnan": _2,
				"yakumo": _2,
				"yasugi": _2,
				"yatsuka": _2
			}],
			"shizuoka": [1, {
				"arai": _2,
				"atami": _2,
				"fuji": _2,
				"fujieda": _2,
				"fujikawa": _2,
				"fujinomiya": _2,
				"fukuroi": _2,
				"gotemba": _2,
				"haibara": _2,
				"hamamatsu": _2,
				"higashiizu": _2,
				"ito": _2,
				"iwata": _2,
				"izu": _2,
				"izunokuni": _2,
				"kakegawa": _2,
				"kannami": _2,
				"kawanehon": _2,
				"kawazu": _2,
				"kikugawa": _2,
				"kosai": _2,
				"makinohara": _2,
				"matsuzaki": _2,
				"minamiizu": _2,
				"mishima": _2,
				"morimachi": _2,
				"nishiizu": _2,
				"numazu": _2,
				"omaezaki": _2,
				"shimada": _2,
				"shimizu": _2,
				"shimoda": _2,
				"shizuoka": _2,
				"susono": _2,
				"yaizu": _2,
				"yoshida": _2
			}],
			"tochigi": [1, {
				"ashikaga": _2,
				"bato": _2,
				"haga": _2,
				"ichikai": _2,
				"iwafune": _2,
				"kaminokawa": _2,
				"kanuma": _2,
				"karasuyama": _2,
				"kuroiso": _2,
				"mashiko": _2,
				"mibu": _2,
				"moka": _2,
				"motegi": _2,
				"nasu": _2,
				"nasushiobara": _2,
				"nikko": _2,
				"nishikata": _2,
				"nogi": _2,
				"ohira": _2,
				"ohtawara": _2,
				"oyama": _2,
				"sakura": _2,
				"sano": _2,
				"shimotsuke": _2,
				"shioya": _2,
				"takanezawa": _2,
				"tochigi": _2,
				"tsuga": _2,
				"ujiie": _2,
				"utsunomiya": _2,
				"yaita": _2
			}],
			"tokushima": [1, {
				"aizumi": _2,
				"anan": _2,
				"ichiba": _2,
				"itano": _2,
				"kainan": _2,
				"komatsushima": _2,
				"matsushige": _2,
				"mima": _2,
				"minami": _2,
				"miyoshi": _2,
				"mugi": _2,
				"nakagawa": _2,
				"naruto": _2,
				"sanagochi": _2,
				"shishikui": _2,
				"tokushima": _2,
				"wajiki": _2
			}],
			"tokyo": [1, {
				"adachi": _2,
				"akiruno": _2,
				"akishima": _2,
				"aogashima": _2,
				"arakawa": _2,
				"bunkyo": _2,
				"chiyoda": _2,
				"chofu": _2,
				"chuo": _2,
				"edogawa": _2,
				"fuchu": _2,
				"fussa": _2,
				"hachijo": _2,
				"hachioji": _2,
				"hamura": _2,
				"higashikurume": _2,
				"higashimurayama": _2,
				"higashiyamato": _2,
				"hino": _2,
				"hinode": _2,
				"hinohara": _2,
				"inagi": _2,
				"itabashi": _2,
				"katsushika": _2,
				"kita": _2,
				"kiyose": _2,
				"kodaira": _2,
				"koganei": _2,
				"kokubunji": _2,
				"komae": _2,
				"koto": _2,
				"kouzushima": _2,
				"kunitachi": _2,
				"machida": _2,
				"meguro": _2,
				"minato": _2,
				"mitaka": _2,
				"mizuho": _2,
				"musashimurayama": _2,
				"musashino": _2,
				"nakano": _2,
				"nerima": _2,
				"ogasawara": _2,
				"okutama": _2,
				"ome": _2,
				"oshima": _2,
				"ota": _2,
				"setagaya": _2,
				"shibuya": _2,
				"shinagawa": _2,
				"shinjuku": _2,
				"suginami": _2,
				"sumida": _2,
				"tachikawa": _2,
				"taito": _2,
				"tama": _2,
				"toshima": _2
			}],
			"tottori": [1, {
				"chizu": _2,
				"hino": _2,
				"kawahara": _2,
				"koge": _2,
				"kotoura": _2,
				"misasa": _2,
				"nanbu": _2,
				"nichinan": _2,
				"sakaiminato": _2,
				"tottori": _2,
				"wakasa": _2,
				"yazu": _2,
				"yonago": _2
			}],
			"toyama": [1, {
				"asahi": _2,
				"fuchu": _2,
				"fukumitsu": _2,
				"funahashi": _2,
				"himi": _2,
				"imizu": _2,
				"inami": _2,
				"johana": _2,
				"kamiichi": _2,
				"kurobe": _2,
				"nakaniikawa": _2,
				"namerikawa": _2,
				"nanto": _2,
				"nyuzen": _2,
				"oyabe": _2,
				"taira": _2,
				"takaoka": _2,
				"tateyama": _2,
				"toga": _2,
				"tonami": _2,
				"toyama": _2,
				"unazuki": _2,
				"uozu": _2,
				"yamada": _2
			}],
			"wakayama": [1, {
				"arida": _2,
				"aridagawa": _2,
				"gobo": _2,
				"hashimoto": _2,
				"hidaka": _2,
				"hirogawa": _2,
				"inami": _2,
				"iwade": _2,
				"kainan": _2,
				"kamitonda": _2,
				"katsuragi": _2,
				"kimino": _2,
				"kinokawa": _2,
				"kitayama": _2,
				"koya": _2,
				"koza": _2,
				"kozagawa": _2,
				"kudoyama": _2,
				"kushimoto": _2,
				"mihama": _2,
				"misato": _2,
				"nachikatsuura": _2,
				"shingu": _2,
				"shirahama": _2,
				"taiji": _2,
				"tanabe": _2,
				"wakayama": _2,
				"yuasa": _2,
				"yura": _2
			}],
			"yamagata": [1, {
				"asahi": _2,
				"funagata": _2,
				"higashine": _2,
				"iide": _2,
				"kahoku": _2,
				"kaminoyama": _2,
				"kaneyama": _2,
				"kawanishi": _2,
				"mamurogawa": _2,
				"mikawa": _2,
				"murayama": _2,
				"nagai": _2,
				"nakayama": _2,
				"nanyo": _2,
				"nishikawa": _2,
				"obanazawa": _2,
				"oe": _2,
				"oguni": _2,
				"ohkura": _2,
				"oishida": _2,
				"sagae": _2,
				"sakata": _2,
				"sakegawa": _2,
				"shinjo": _2,
				"shirataka": _2,
				"shonai": _2,
				"takahata": _2,
				"tendo": _2,
				"tozawa": _2,
				"tsuruoka": _2,
				"yamagata": _2,
				"yamanobe": _2,
				"yonezawa": _2,
				"yuza": _2
			}],
			"yamaguchi": [1, {
				"abu": _2,
				"hagi": _2,
				"hikari": _2,
				"hofu": _2,
				"iwakuni": _2,
				"kudamatsu": _2,
				"mitou": _2,
				"nagato": _2,
				"oshima": _2,
				"shimonoseki": _2,
				"shunan": _2,
				"tabuse": _2,
				"tokuyama": _2,
				"toyota": _2,
				"ube": _2,
				"yuu": _2
			}],
			"yamanashi": [1, {
				"chuo": _2,
				"doshi": _2,
				"fuefuki": _2,
				"fujikawa": _2,
				"fujikawaguchiko": _2,
				"fujiyoshida": _2,
				"hayakawa": _2,
				"hokuto": _2,
				"ichikawamisato": _2,
				"kai": _2,
				"kofu": _2,
				"koshu": _2,
				"kosuge": _2,
				"minami-alps": _2,
				"minobu": _2,
				"nakamichi": _2,
				"nanbu": _2,
				"narusawa": _2,
				"nirasaki": _2,
				"nishikatsura": _2,
				"oshino": _2,
				"otsuki": _2,
				"showa": _2,
				"tabayama": _2,
				"tsuru": _2,
				"uenohara": _2,
				"yamanakako": _2,
				"yamanashi": _2
			}],
			"xn--ehqz56n": _2,
			"三重": _2,
			"xn--1lqs03n": _2,
			"京都": _2,
			"xn--qqqt11m": _2,
			"佐賀": _2,
			"xn--f6qx53a": _2,
			"兵庫": _2,
			"xn--djrs72d6uy": _2,
			"北海道": _2,
			"xn--mkru45i": _2,
			"千葉": _2,
			"xn--0trq7p7nn": _2,
			"和歌山": _2,
			"xn--5js045d": _2,
			"埼玉": _2,
			"xn--kbrq7o": _2,
			"大分": _2,
			"xn--pssu33l": _2,
			"大阪": _2,
			"xn--ntsq17g": _2,
			"奈良": _2,
			"xn--uisz3g": _2,
			"宮城": _2,
			"xn--6btw5a": _2,
			"宮崎": _2,
			"xn--1ctwo": _2,
			"富山": _2,
			"xn--6orx2r": _2,
			"山口": _2,
			"xn--rht61e": _2,
			"山形": _2,
			"xn--rht27z": _2,
			"山梨": _2,
			"xn--nit225k": _2,
			"岐阜": _2,
			"xn--rht3d": _2,
			"岡山": _2,
			"xn--djty4k": _2,
			"岩手": _2,
			"xn--klty5x": _2,
			"島根": _2,
			"xn--kltx9a": _2,
			"広島": _2,
			"xn--kltp7d": _2,
			"徳島": _2,
			"xn--c3s14m": _2,
			"愛媛": _2,
			"xn--vgu402c": _2,
			"愛知": _2,
			"xn--efvn9s": _2,
			"新潟": _2,
			"xn--1lqs71d": _2,
			"東京": _2,
			"xn--4pvxs": _2,
			"栃木": _2,
			"xn--uuwu58a": _2,
			"沖縄": _2,
			"xn--zbx025d": _2,
			"滋賀": _2,
			"xn--8pvr4u": _2,
			"熊本": _2,
			"xn--5rtp49c": _2,
			"石川": _2,
			"xn--ntso0iqx3a": _2,
			"神奈川": _2,
			"xn--elqq16h": _2,
			"福井": _2,
			"xn--4it168d": _2,
			"福岡": _2,
			"xn--klt787d": _2,
			"福島": _2,
			"xn--rny31h": _2,
			"秋田": _2,
			"xn--7t0a264c": _2,
			"群馬": _2,
			"xn--uist22h": _2,
			"茨城": _2,
			"xn--8ltr62k": _2,
			"長崎": _2,
			"xn--2m4a15e": _2,
			"長野": _2,
			"xn--32vp30h": _2,
			"青森": _2,
			"xn--4it797k": _2,
			"静岡": _2,
			"xn--5rtq34k": _2,
			"香川": _2,
			"xn--k7yn95e": _2,
			"高知": _2,
			"xn--tor131o": _2,
			"鳥取": _2,
			"xn--d5qv7z876c": _2,
			"鹿児島": _2,
			"kawasaki": _20,
			"kitakyushu": _20,
			"kobe": _20,
			"nagoya": _20,
			"sapporo": _20,
			"sendai": _20,
			"yokohama": _20,
			"buyshop": _3,
			"fashionstore": _3,
			"handcrafted": _3,
			"kawaiishop": _3,
			"supersale": _3,
			"theshop": _3,
			"0am": _3,
			"0g0": _3,
			"0j0": _3,
			"0t0": _3,
			"mydns": _3,
			"pgw": _3,
			"wjg": _3,
			"usercontent": _3,
			"angry": _3,
			"babyblue": _3,
			"babymilk": _3,
			"backdrop": _3,
			"bambina": _3,
			"bitter": _3,
			"blush": _3,
			"boo": _3,
			"boy": _3,
			"boyfriend": _3,
			"but": _3,
			"candypop": _3,
			"capoo": _3,
			"catfood": _3,
			"cheap": _3,
			"chicappa": _3,
			"chillout": _3,
			"chips": _3,
			"chowder": _3,
			"chu": _3,
			"ciao": _3,
			"cocotte": _3,
			"coolblog": _3,
			"cranky": _3,
			"cutegirl": _3,
			"daa": _3,
			"deca": _3,
			"deci": _3,
			"digick": _3,
			"egoism": _3,
			"fakefur": _3,
			"fem": _3,
			"flier": _3,
			"floppy": _3,
			"fool": _3,
			"frenchkiss": _3,
			"girlfriend": _3,
			"girly": _3,
			"gloomy": _3,
			"gonna": _3,
			"greater": _3,
			"hacca": _3,
			"heavy": _3,
			"her": _3,
			"hiho": _3,
			"hippy": _3,
			"holy": _3,
			"hungry": _3,
			"icurus": _3,
			"itigo": _3,
			"jellybean": _3,
			"kikirara": _3,
			"kill": _3,
			"kilo": _3,
			"kuron": _3,
			"littlestar": _3,
			"lolipopmc": _3,
			"lolitapunk": _3,
			"lomo": _3,
			"lovepop": _3,
			"lovesick": _3,
			"main": _3,
			"mods": _3,
			"mond": _3,
			"mongolian": _3,
			"moo": _3,
			"namaste": _3,
			"nikita": _3,
			"nobushi": _3,
			"noor": _3,
			"oops": _3,
			"parallel": _3,
			"parasite": _3,
			"pecori": _3,
			"peewee": _3,
			"penne": _3,
			"pepper": _3,
			"perma": _3,
			"pigboat": _3,
			"pinoko": _3,
			"punyu": _3,
			"pupu": _3,
			"pussycat": _3,
			"pya": _3,
			"raindrop": _3,
			"readymade": _3,
			"sadist": _3,
			"schoolbus": _3,
			"secret": _3,
			"staba": _3,
			"stripper": _3,
			"sub": _3,
			"sunnyday": _3,
			"thick": _3,
			"tonkotsu": _3,
			"under": _3,
			"upper": _3,
			"velvet": _3,
			"verse": _3,
			"versus": _3,
			"vivian": _3,
			"watson": _3,
			"weblike": _3,
			"whitesnow": _3,
			"zombie": _3,
			"hateblo": _3,
			"hatenablog": _3,
			"hatenadiary": _3,
			"2-d": _3,
			"bona": _3,
			"crap": _3,
			"daynight": _3,
			"eek": _3,
			"flop": _3,
			"halfmoon": _3,
			"jeez": _3,
			"matrix": _3,
			"mimoza": _3,
			"netgamers": _3,
			"nyanta": _3,
			"o0o0": _3,
			"rdy": _3,
			"rgr": _3,
			"rulez": _3,
			"sakurastorage": [0, {
				"isk01": _58,
				"isk02": _58
			}],
			"saloon": _3,
			"sblo": _3,
			"skr": _3,
			"tank": _3,
			"uh-oh": _3,
			"undo": _3,
			"webaccel": [0, {
				"rs": _3,
				"user": _3
			}],
			"websozai": _3,
			"xii": _3
		}],
		"ke": [1, {
			"ac": _2,
			"co": _2,
			"go": _2,
			"info": _2,
			"me": _2,
			"mobi": _2,
			"ne": _2,
			"or": _2,
			"sc": _2
		}],
		"kg": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"us": _3,
			"xx": _3
		}],
		"kh": _20,
		"ki": _59,
		"km": [1, {
			"ass": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"nom": _2,
			"org": _2,
			"prd": _2,
			"tm": _2,
			"asso": _2,
			"coop": _2,
			"gouv": _2,
			"medecin": _2,
			"notaires": _2,
			"pharmaciens": _2,
			"presse": _2,
			"veterinaire": _2
		}],
		"kn": [1, {
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2
		}],
		"kp": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"org": _2,
			"rep": _2,
			"tra": _2
		}],
		"kr": [1, {
			"ac": _2,
			"ai": _2,
			"co": _2,
			"es": _2,
			"go": _2,
			"hs": _2,
			"io": _2,
			"it": _2,
			"kg": _2,
			"me": _2,
			"mil": _2,
			"ms": _2,
			"ne": _2,
			"or": _2,
			"pe": _2,
			"re": _2,
			"sc": _2,
			"busan": _2,
			"chungbuk": _2,
			"chungnam": _2,
			"daegu": _2,
			"daejeon": _2,
			"gangwon": _2,
			"gwangju": _2,
			"gyeongbuk": _2,
			"gyeonggi": _2,
			"gyeongnam": _2,
			"incheon": _2,
			"jeju": _2,
			"jeonbuk": _2,
			"jeonnam": _2,
			"seoul": _2,
			"ulsan": _2,
			"c01": _3,
			"eliv-cdn": _3,
			"eliv-dns": _3,
			"mmv": _3,
			"vki": _3
		}],
		"kw": [1, {
			"com": _2,
			"edu": _2,
			"emb": _2,
			"gov": _2,
			"ind": _2,
			"net": _2,
			"org": _2
		}],
		"ky": _47,
		"kz": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"jcloud": _3
		}],
		"la": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"int": _2,
			"net": _2,
			"org": _2,
			"per": _2,
			"bnr": _3
		}],
		"lb": _4,
		"lc": [1, {
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"oy": _3
		}],
		"li": _2,
		"lk": [1, {
			"ac": _2,
			"assn": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"grp": _2,
			"hotel": _2,
			"int": _2,
			"ltd": _2,
			"net": _2,
			"ngo": _2,
			"org": _2,
			"sch": _2,
			"soc": _2,
			"web": _2
		}],
		"lr": _4,
		"ls": [1, {
			"ac": _2,
			"biz": _2,
			"co": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"net": _2,
			"org": _2,
			"sc": _2
		}],
		"lt": _10,
		"lu": [1, { "123website": _3 }],
		"lv": [1, {
			"asn": _2,
			"com": _2,
			"conf": _2,
			"edu": _2,
			"gov": _2,
			"id": _2,
			"mil": _2,
			"net": _2,
			"org": _2
		}],
		"ly": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"id": _2,
			"med": _2,
			"net": _2,
			"org": _2,
			"plc": _2,
			"sch": _2
		}],
		"ma": [1, {
			"ac": _2,
			"co": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"press": _2
		}],
		"mc": [1, {
			"asso": _2,
			"tm": _2
		}],
		"md": [1, { "ir": _3 }],
		"me": [1, {
			"ac": _2,
			"co": _2,
			"edu": _2,
			"gov": _2,
			"its": _2,
			"net": _2,
			"org": _2,
			"priv": _2,
			"c66": _3,
			"craft": _3,
			"edgestack": _3,
			"filegear": _3,
			"filegear-sg": _3,
			"lohmus": _3,
			"barsy": _3,
			"mcdir": _3,
			"brasilia": _3,
			"ddns": _3,
			"dnsfor": _3,
			"hopto": _3,
			"loginto": _3,
			"noip": _3,
			"webhop": _3,
			"soundcast": _3,
			"tcp4": _3,
			"vp4": _3,
			"diskstation": _3,
			"dscloud": _3,
			"i234": _3,
			"myds": _3,
			"synology": _3,
			"transip": _46,
			"nohost": _3
		}],
		"mg": [1, {
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"nom": _2,
			"org": _2,
			"prd": _2
		}],
		"mh": _2,
		"mil": _2,
		"mk": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"inf": _2,
			"name": _2,
			"net": _2,
			"org": _2
		}],
		"ml": [1, {
			"ac": _2,
			"art": _2,
			"asso": _2,
			"com": _2,
			"edu": _2,
			"gouv": _2,
			"gov": _2,
			"info": _2,
			"inst": _2,
			"net": _2,
			"org": _2,
			"pr": _2,
			"presse": _2
		}],
		"mm": _20,
		"mn": [1, {
			"edu": _2,
			"gov": _2,
			"org": _2,
			"nyc": _3
		}],
		"mo": _4,
		"mobi": [1, {
			"barsy": _3,
			"dscloud": _3
		}],
		"mp": [1, { "ju": _3 }],
		"mq": _2,
		"mr": _10,
		"ms": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"minisite": _3
		}],
		"mt": _47,
		"mu": [1, {
			"ac": _2,
			"co": _2,
			"com": _2,
			"gov": _2,
			"net": _2,
			"or": _2,
			"org": _2
		}],
		"museum": _2,
		"mv": [1, {
			"aero": _2,
			"biz": _2,
			"com": _2,
			"coop": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"int": _2,
			"mil": _2,
			"museum": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"pro": _2
		}],
		"mw": [1, {
			"ac": _2,
			"biz": _2,
			"co": _2,
			"com": _2,
			"coop": _2,
			"edu": _2,
			"gov": _2,
			"int": _2,
			"net": _2,
			"org": _2
		}],
		"mx": [1, {
			"com": _2,
			"edu": _2,
			"gob": _2,
			"net": _2,
			"org": _2
		}],
		"my": [1, {
			"biz": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"name": _2,
			"net": _2,
			"org": _2
		}],
		"mz": [1, {
			"ac": _2,
			"adv": _2,
			"co": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2
		}],
		"na": [1, {
			"alt": _2,
			"co": _2,
			"com": _2,
			"gov": _2,
			"net": _2,
			"org": _2
		}],
		"name": [1, {
			"her": _62,
			"his": _62
		}],
		"nc": [1, {
			"asso": _2,
			"nom": _2
		}],
		"ne": _2,
		"net": [1, {
			"adobeaemcloud": _3,
			"adobeio-static": _3,
			"adobeioruntime": _3,
			"akadns": _3,
			"akamai": _3,
			"akamai-staging": _3,
			"akamaiedge": _3,
			"akamaiedge-staging": _3,
			"akamaihd": _3,
			"akamaihd-staging": _3,
			"akamaiorigin": _3,
			"akamaiorigin-staging": _3,
			"akamaized": _3,
			"akamaized-staging": _3,
			"edgekey": _3,
			"edgekey-staging": _3,
			"edgesuite": _3,
			"edgesuite-staging": _3,
			"alwaysdata": _3,
			"myamaze": _3,
			"cloudfront": _3,
			"appudo": _3,
			"atlassian-dev": [0, { "prod": _54 }],
			"myfritz": _3,
			"onavstack": _3,
			"shopselect": _3,
			"blackbaudcdn": _3,
			"boomla": _3,
			"bplaced": _3,
			"square7": _3,
			"cdn77": [0, { "r": _3 }],
			"cdn77-ssl": _3,
			"gb": _3,
			"hu": _3,
			"jp": _3,
			"se": _3,
			"uk": _3,
			"clickrising": _3,
			"ddns-ip": _3,
			"dns-cloud": _3,
			"dns-dynamic": _3,
			"cloudaccess": _3,
			"cloudflare": [2, { "cdn": _3 }],
			"cloudflareanycast": _54,
			"cloudflarecn": _54,
			"cloudflareglobal": _54,
			"ctfcloud": _3,
			"feste-ip": _3,
			"knx-server": _3,
			"static-access": _3,
			"cryptonomic": _6,
			"dattolocal": _3,
			"mydatto": _3,
			"debian": _3,
			"definima": _3,
			"deno": _3,
			"icp": _6,
			"at-band-camp": _3,
			"blogdns": _3,
			"broke-it": _3,
			"buyshouses": _3,
			"dnsalias": _3,
			"dnsdojo": _3,
			"does-it": _3,
			"dontexist": _3,
			"dynalias": _3,
			"dynathome": _3,
			"endofinternet": _3,
			"from-az": _3,
			"from-co": _3,
			"from-la": _3,
			"from-ny": _3,
			"gets-it": _3,
			"ham-radio-op": _3,
			"homeftp": _3,
			"homeip": _3,
			"homelinux": _3,
			"homeunix": _3,
			"in-the-band": _3,
			"is-a-chef": _3,
			"is-a-geek": _3,
			"isa-geek": _3,
			"kicks-ass": _3,
			"office-on-the": _3,
			"podzone": _3,
			"scrapper-site": _3,
			"selfip": _3,
			"sells-it": _3,
			"servebbs": _3,
			"serveftp": _3,
			"thruhere": _3,
			"webhop": _3,
			"casacam": _3,
			"dynu": _3,
			"dynv6": _3,
			"twmail": _3,
			"ru": _3,
			"channelsdvr": [2, { "u": _3 }],
			"fastly": [0, {
				"freetls": _3,
				"map": _3,
				"prod": [0, {
					"a": _3,
					"global": _3
				}],
				"ssl": [0, {
					"a": _3,
					"b": _3,
					"global": _3
				}]
			}],
			"fastlylb": [2, { "map": _3 }],
			"edgeapp": _3,
			"keyword-on": _3,
			"live-on": _3,
			"server-on": _3,
			"cdn-edges": _3,
			"heteml": _3,
			"cloudfunctions": _3,
			"grafana-dev": _3,
			"iobb": _3,
			"moonscale": _3,
			"in-dsl": _3,
			"in-vpn": _3,
			"oninferno": _3,
			"botdash": _3,
			"apps-1and1": _3,
			"ipifony": _3,
			"cloudjiffy": [2, {
				"fra1-de": _3,
				"west1-us": _3
			}],
			"elastx": [0, {
				"jls-sto1": _3,
				"jls-sto2": _3,
				"jls-sto3": _3
			}],
			"massivegrid": [0, { "paas": [0, {
				"fr-1": _3,
				"lon-1": _3,
				"lon-2": _3,
				"ny-1": _3,
				"ny-2": _3,
				"sg-1": _3
			}] }],
			"saveincloud": [0, {
				"jelastic": _3,
				"nordeste-idc": _3
			}],
			"scaleforce": _48,
			"kinghost": _3,
			"uni5": _3,
			"krellian": _3,
			"ggff": _3,
			"localto": _6,
			"barsy": _3,
			"luyani": _3,
			"memset": _3,
			"azure-api": _3,
			"azure-mobile": _3,
			"azureedge": _3,
			"azurefd": _3,
			"azurestaticapps": [2, {
				"1": _3,
				"2": _3,
				"3": _3,
				"4": _3,
				"5": _3,
				"6": _3,
				"7": _3,
				"centralus": _3,
				"eastasia": _3,
				"eastus2": _3,
				"westeurope": _3,
				"westus2": _3
			}],
			"azurewebsites": _3,
			"cloudapp": _3,
			"trafficmanager": _3,
			"windows": [0, {
				"core": [0, { "blob": _3 }],
				"servicebus": _3
			}],
			"mynetname": [0, { "sn": _3 }],
			"routingthecloud": _3,
			"bounceme": _3,
			"ddns": _3,
			"eating-organic": _3,
			"mydissent": _3,
			"myeffect": _3,
			"mymediapc": _3,
			"mypsx": _3,
			"mysecuritycamera": _3,
			"nhlfan": _3,
			"no-ip": _3,
			"pgafan": _3,
			"privatizehealthinsurance": _3,
			"redirectme": _3,
			"serveblog": _3,
			"serveminecraft": _3,
			"sytes": _3,
			"dnsup": _3,
			"hicam": _3,
			"now-dns": _3,
			"ownip": _3,
			"vpndns": _3,
			"cloudycluster": _3,
			"ovh": [0, {
				"hosting": _6,
				"webpaas": _6
			}],
			"rackmaze": _3,
			"myradweb": _3,
			"in": _3,
			"subsc-pay": _3,
			"squares": _3,
			"schokokeks": _3,
			"firewall-gateway": _3,
			"seidat": _3,
			"senseering": _3,
			"siteleaf": _3,
			"mafelo": _3,
			"myspreadshop": _3,
			"vps-host": [2, { "jelastic": [0, {
				"atl": _3,
				"njs": _3,
				"ric": _3
			}] }],
			"srcf": [0, {
				"soc": _3,
				"user": _3
			}],
			"supabase": _3,
			"dsmynas": _3,
			"familyds": _3,
			"ts": [2, { "c": _6 }],
			"torproject": [2, { "pages": _3 }],
			"vusercontent": _3,
			"reserve-online": _3,
			"localcert": _3,
			"community-pro": _3,
			"meinforum": _3,
			"yandexcloud": [2, {
				"storage": _3,
				"website": _3
			}],
			"za": _3,
			"zabc": _3
		}],
		"nf": [1, {
			"arts": _2,
			"com": _2,
			"firm": _2,
			"info": _2,
			"net": _2,
			"other": _2,
			"per": _2,
			"rec": _2,
			"store": _2,
			"web": _2
		}],
		"ng": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"i": _2,
			"mil": _2,
			"mobi": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"sch": _2,
			"biz": [2, {
				"co": _3,
				"dl": _3,
				"go": _3,
				"lg": _3,
				"on": _3
			}],
			"col": _3,
			"firm": _3,
			"gen": _3,
			"ltd": _3,
			"ngo": _3,
			"plc": _3
		}],
		"ni": [1, {
			"ac": _2,
			"biz": _2,
			"co": _2,
			"com": _2,
			"edu": _2,
			"gob": _2,
			"in": _2,
			"info": _2,
			"int": _2,
			"mil": _2,
			"net": _2,
			"nom": _2,
			"org": _2,
			"web": _2
		}],
		"nl": [1, {
			"co": _3,
			"hosting-cluster": _3,
			"gov": _3,
			"khplay": _3,
			"123website": _3,
			"myspreadshop": _3,
			"transurl": _6,
			"cistron": _3,
			"demon": _3
		}],
		"no": [1, {
			"fhs": _2,
			"folkebibl": _2,
			"fylkesbibl": _2,
			"idrett": _2,
			"museum": _2,
			"priv": _2,
			"vgs": _2,
			"dep": _2,
			"herad": _2,
			"kommune": _2,
			"mil": _2,
			"stat": _2,
			"aa": _63,
			"ah": _63,
			"bu": _63,
			"fm": _63,
			"hl": _63,
			"hm": _63,
			"jan-mayen": _63,
			"mr": _63,
			"nl": _63,
			"nt": _63,
			"of": _63,
			"ol": _63,
			"oslo": _63,
			"rl": _63,
			"sf": _63,
			"st": _63,
			"svalbard": _63,
			"tm": _63,
			"tr": _63,
			"va": _63,
			"vf": _63,
			"akrehamn": _2,
			"xn--krehamn-dxa": _2,
			"åkrehamn": _2,
			"algard": _2,
			"xn--lgrd-poac": _2,
			"ålgård": _2,
			"arna": _2,
			"bronnoysund": _2,
			"xn--brnnysund-m8ac": _2,
			"brønnøysund": _2,
			"brumunddal": _2,
			"bryne": _2,
			"drobak": _2,
			"xn--drbak-wua": _2,
			"drøbak": _2,
			"egersund": _2,
			"fetsund": _2,
			"floro": _2,
			"xn--flor-jra": _2,
			"florø": _2,
			"fredrikstad": _2,
			"hokksund": _2,
			"honefoss": _2,
			"xn--hnefoss-q1a": _2,
			"hønefoss": _2,
			"jessheim": _2,
			"jorpeland": _2,
			"xn--jrpeland-54a": _2,
			"jørpeland": _2,
			"kirkenes": _2,
			"kopervik": _2,
			"krokstadelva": _2,
			"langevag": _2,
			"xn--langevg-jxa": _2,
			"langevåg": _2,
			"leirvik": _2,
			"mjondalen": _2,
			"xn--mjndalen-64a": _2,
			"mjøndalen": _2,
			"mo-i-rana": _2,
			"mosjoen": _2,
			"xn--mosjen-eya": _2,
			"mosjøen": _2,
			"nesoddtangen": _2,
			"orkanger": _2,
			"osoyro": _2,
			"xn--osyro-wua": _2,
			"osøyro": _2,
			"raholt": _2,
			"xn--rholt-mra": _2,
			"råholt": _2,
			"sandnessjoen": _2,
			"xn--sandnessjen-ogb": _2,
			"sandnessjøen": _2,
			"skedsmokorset": _2,
			"slattum": _2,
			"spjelkavik": _2,
			"stathelle": _2,
			"stavern": _2,
			"stjordalshalsen": _2,
			"xn--stjrdalshalsen-sqb": _2,
			"stjørdalshalsen": _2,
			"tananger": _2,
			"tranby": _2,
			"vossevangen": _2,
			"aarborte": _2,
			"aejrie": _2,
			"afjord": _2,
			"xn--fjord-lra": _2,
			"åfjord": _2,
			"agdenes": _2,
			"akershus": _64,
			"aknoluokta": _2,
			"xn--koluokta-7ya57h": _2,
			"ákŋoluokta": _2,
			"al": _2,
			"xn--l-1fa": _2,
			"ål": _2,
			"alaheadju": _2,
			"xn--laheadju-7ya": _2,
			"álaheadju": _2,
			"alesund": _2,
			"xn--lesund-hua": _2,
			"ålesund": _2,
			"alstahaug": _2,
			"alta": _2,
			"xn--lt-liac": _2,
			"áltá": _2,
			"alvdal": _2,
			"amli": _2,
			"xn--mli-tla": _2,
			"åmli": _2,
			"amot": _2,
			"xn--mot-tla": _2,
			"åmot": _2,
			"andasuolo": _2,
			"andebu": _2,
			"andoy": _2,
			"xn--andy-ira": _2,
			"andøy": _2,
			"ardal": _2,
			"xn--rdal-poa": _2,
			"årdal": _2,
			"aremark": _2,
			"arendal": _2,
			"xn--s-1fa": _2,
			"ås": _2,
			"aseral": _2,
			"xn--seral-lra": _2,
			"åseral": _2,
			"asker": _2,
			"askim": _2,
			"askoy": _2,
			"xn--asky-ira": _2,
			"askøy": _2,
			"askvoll": _2,
			"asnes": _2,
			"xn--snes-poa": _2,
			"åsnes": _2,
			"audnedaln": _2,
			"aukra": _2,
			"aure": _2,
			"aurland": _2,
			"aurskog-holand": _2,
			"xn--aurskog-hland-jnb": _2,
			"aurskog-høland": _2,
			"austevoll": _2,
			"austrheim": _2,
			"averoy": _2,
			"xn--avery-yua": _2,
			"averøy": _2,
			"badaddja": _2,
			"xn--bdddj-mrabd": _2,
			"bådåddjå": _2,
			"xn--brum-voa": _2,
			"bærum": _2,
			"bahcavuotna": _2,
			"xn--bhcavuotna-s4a": _2,
			"báhcavuotna": _2,
			"bahccavuotna": _2,
			"xn--bhccavuotna-k7a": _2,
			"báhccavuotna": _2,
			"baidar": _2,
			"xn--bidr-5nac": _2,
			"báidár": _2,
			"bajddar": _2,
			"xn--bjddar-pta": _2,
			"bájddar": _2,
			"balat": _2,
			"xn--blt-elab": _2,
			"bálát": _2,
			"balestrand": _2,
			"ballangen": _2,
			"balsfjord": _2,
			"bamble": _2,
			"bardu": _2,
			"barum": _2,
			"batsfjord": _2,
			"xn--btsfjord-9za": _2,
			"båtsfjord": _2,
			"bearalvahki": _2,
			"xn--bearalvhki-y4a": _2,
			"bearalváhki": _2,
			"beardu": _2,
			"beiarn": _2,
			"berg": _2,
			"bergen": _2,
			"berlevag": _2,
			"xn--berlevg-jxa": _2,
			"berlevåg": _2,
			"bievat": _2,
			"xn--bievt-0qa": _2,
			"bievát": _2,
			"bindal": _2,
			"birkenes": _2,
			"bjarkoy": _2,
			"xn--bjarky-fya": _2,
			"bjarkøy": _2,
			"bjerkreim": _2,
			"bjugn": _2,
			"bodo": _2,
			"xn--bod-2na": _2,
			"bodø": _2,
			"bokn": _2,
			"bomlo": _2,
			"xn--bmlo-gra": _2,
			"bømlo": _2,
			"bremanger": _2,
			"bronnoy": _2,
			"xn--brnny-wuac": _2,
			"brønnøy": _2,
			"budejju": _2,
			"buskerud": _64,
			"bygland": _2,
			"bykle": _2,
			"cahcesuolo": _2,
			"xn--hcesuolo-7ya35b": _2,
			"čáhcesuolo": _2,
			"davvenjarga": _2,
			"xn--davvenjrga-y4a": _2,
			"davvenjárga": _2,
			"davvesiida": _2,
			"deatnu": _2,
			"dielddanuorri": _2,
			"divtasvuodna": _2,
			"divttasvuotna": _2,
			"donna": _2,
			"xn--dnna-gra": _2,
			"dønna": _2,
			"dovre": _2,
			"drammen": _2,
			"drangedal": _2,
			"dyroy": _2,
			"xn--dyry-ira": _2,
			"dyrøy": _2,
			"eid": _2,
			"eidfjord": _2,
			"eidsberg": _2,
			"eidskog": _2,
			"eidsvoll": _2,
			"eigersund": _2,
			"elverum": _2,
			"enebakk": _2,
			"engerdal": _2,
			"etne": _2,
			"etnedal": _2,
			"evenassi": _2,
			"xn--eveni-0qa01ga": _2,
			"evenášši": _2,
			"evenes": _2,
			"evje-og-hornnes": _2,
			"farsund": _2,
			"fauske": _2,
			"fedje": _2,
			"fet": _2,
			"finnoy": _2,
			"xn--finny-yua": _2,
			"finnøy": _2,
			"fitjar": _2,
			"fjaler": _2,
			"fjell": _2,
			"fla": _2,
			"xn--fl-zia": _2,
			"flå": _2,
			"flakstad": _2,
			"flatanger": _2,
			"flekkefjord": _2,
			"flesberg": _2,
			"flora": _2,
			"folldal": _2,
			"forde": _2,
			"xn--frde-gra": _2,
			"førde": _2,
			"forsand": _2,
			"fosnes": _2,
			"xn--frna-woa": _2,
			"fræna": _2,
			"frana": _2,
			"frei": _2,
			"frogn": _2,
			"froland": _2,
			"frosta": _2,
			"froya": _2,
			"xn--frya-hra": _2,
			"frøya": _2,
			"fuoisku": _2,
			"fuossko": _2,
			"fusa": _2,
			"fyresdal": _2,
			"gaivuotna": _2,
			"xn--givuotna-8ya": _2,
			"gáivuotna": _2,
			"galsa": _2,
			"xn--gls-elac": _2,
			"gálsá": _2,
			"gamvik": _2,
			"gangaviika": _2,
			"xn--ggaviika-8ya47h": _2,
			"gáŋgaviika": _2,
			"gaular": _2,
			"gausdal": _2,
			"giehtavuoatna": _2,
			"gildeskal": _2,
			"xn--gildeskl-g0a": _2,
			"gildeskål": _2,
			"giske": _2,
			"gjemnes": _2,
			"gjerdrum": _2,
			"gjerstad": _2,
			"gjesdal": _2,
			"gjovik": _2,
			"xn--gjvik-wua": _2,
			"gjøvik": _2,
			"gloppen": _2,
			"gol": _2,
			"gran": _2,
			"grane": _2,
			"granvin": _2,
			"gratangen": _2,
			"grimstad": _2,
			"grong": _2,
			"grue": _2,
			"gulen": _2,
			"guovdageaidnu": _2,
			"ha": _2,
			"xn--h-2fa": _2,
			"hå": _2,
			"habmer": _2,
			"xn--hbmer-xqa": _2,
			"hábmer": _2,
			"hadsel": _2,
			"xn--hgebostad-g3a": _2,
			"hægebostad": _2,
			"hagebostad": _2,
			"halden": _2,
			"halsa": _2,
			"hamar": _2,
			"hamaroy": _2,
			"hammarfeasta": _2,
			"xn--hmmrfeasta-s4ac": _2,
			"hámmárfeasta": _2,
			"hammerfest": _2,
			"hapmir": _2,
			"xn--hpmir-xqa": _2,
			"hápmir": _2,
			"haram": _2,
			"hareid": _2,
			"harstad": _2,
			"hasvik": _2,
			"hattfjelldal": _2,
			"haugesund": _2,
			"hedmark": [0, {
				"os": _2,
				"valer": _2,
				"xn--vler-qoa": _2,
				"våler": _2
			}],
			"hemne": _2,
			"hemnes": _2,
			"hemsedal": _2,
			"hitra": _2,
			"hjartdal": _2,
			"hjelmeland": _2,
			"hobol": _2,
			"xn--hobl-ira": _2,
			"hobøl": _2,
			"hof": _2,
			"hol": _2,
			"hole": _2,
			"holmestrand": _2,
			"holtalen": _2,
			"xn--holtlen-hxa": _2,
			"holtålen": _2,
			"hordaland": [0, { "os": _2 }],
			"hornindal": _2,
			"horten": _2,
			"hoyanger": _2,
			"xn--hyanger-q1a": _2,
			"høyanger": _2,
			"hoylandet": _2,
			"xn--hylandet-54a": _2,
			"høylandet": _2,
			"hurdal": _2,
			"hurum": _2,
			"hvaler": _2,
			"hyllestad": _2,
			"ibestad": _2,
			"inderoy": _2,
			"xn--indery-fya": _2,
			"inderøy": _2,
			"iveland": _2,
			"ivgu": _2,
			"jevnaker": _2,
			"jolster": _2,
			"xn--jlster-bya": _2,
			"jølster": _2,
			"jondal": _2,
			"kafjord": _2,
			"xn--kfjord-iua": _2,
			"kåfjord": _2,
			"karasjohka": _2,
			"xn--krjohka-hwab49j": _2,
			"kárášjohka": _2,
			"karasjok": _2,
			"karlsoy": _2,
			"karmoy": _2,
			"xn--karmy-yua": _2,
			"karmøy": _2,
			"kautokeino": _2,
			"klabu": _2,
			"xn--klbu-woa": _2,
			"klæbu": _2,
			"klepp": _2,
			"kongsberg": _2,
			"kongsvinger": _2,
			"kraanghke": _2,
			"xn--kranghke-b0a": _2,
			"kråanghke": _2,
			"kragero": _2,
			"xn--krager-gya": _2,
			"kragerø": _2,
			"kristiansand": _2,
			"kristiansund": _2,
			"krodsherad": _2,
			"xn--krdsherad-m8a": _2,
			"krødsherad": _2,
			"xn--kvfjord-nxa": _2,
			"kvæfjord": _2,
			"xn--kvnangen-k0a": _2,
			"kvænangen": _2,
			"kvafjord": _2,
			"kvalsund": _2,
			"kvam": _2,
			"kvanangen": _2,
			"kvinesdal": _2,
			"kvinnherad": _2,
			"kviteseid": _2,
			"kvitsoy": _2,
			"xn--kvitsy-fya": _2,
			"kvitsøy": _2,
			"laakesvuemie": _2,
			"xn--lrdal-sra": _2,
			"lærdal": _2,
			"lahppi": _2,
			"xn--lhppi-xqa": _2,
			"láhppi": _2,
			"lardal": _2,
			"larvik": _2,
			"lavagis": _2,
			"lavangen": _2,
			"leangaviika": _2,
			"xn--leagaviika-52b": _2,
			"leaŋgaviika": _2,
			"lebesby": _2,
			"leikanger": _2,
			"leirfjord": _2,
			"leka": _2,
			"leksvik": _2,
			"lenvik": _2,
			"lerdal": _2,
			"lesja": _2,
			"levanger": _2,
			"lier": _2,
			"lierne": _2,
			"lillehammer": _2,
			"lillesand": _2,
			"lindas": _2,
			"xn--linds-pra": _2,
			"lindås": _2,
			"lindesnes": _2,
			"loabat": _2,
			"xn--loabt-0qa": _2,
			"loabát": _2,
			"lodingen": _2,
			"xn--ldingen-q1a": _2,
			"lødingen": _2,
			"lom": _2,
			"loppa": _2,
			"lorenskog": _2,
			"xn--lrenskog-54a": _2,
			"lørenskog": _2,
			"loten": _2,
			"xn--lten-gra": _2,
			"løten": _2,
			"lund": _2,
			"lunner": _2,
			"luroy": _2,
			"xn--lury-ira": _2,
			"lurøy": _2,
			"luster": _2,
			"lyngdal": _2,
			"lyngen": _2,
			"malatvuopmi": _2,
			"xn--mlatvuopmi-s4a": _2,
			"málatvuopmi": _2,
			"malselv": _2,
			"xn--mlselv-iua": _2,
			"målselv": _2,
			"malvik": _2,
			"mandal": _2,
			"marker": _2,
			"marnardal": _2,
			"masfjorden": _2,
			"masoy": _2,
			"xn--msy-ula0h": _2,
			"måsøy": _2,
			"matta-varjjat": _2,
			"xn--mtta-vrjjat-k7af": _2,
			"mátta-várjjat": _2,
			"meland": _2,
			"meldal": _2,
			"melhus": _2,
			"meloy": _2,
			"xn--mely-ira": _2,
			"meløy": _2,
			"meraker": _2,
			"xn--merker-kua": _2,
			"meråker": _2,
			"midsund": _2,
			"midtre-gauldal": _2,
			"moareke": _2,
			"xn--moreke-jua": _2,
			"moåreke": _2,
			"modalen": _2,
			"modum": _2,
			"molde": _2,
			"more-og-romsdal": [0, {
				"heroy": _2,
				"sande": _2
			}],
			"xn--mre-og-romsdal-qqb": [0, {
				"xn--hery-ira": _2,
				"sande": _2
			}],
			"møre-og-romsdal": [0, {
				"herøy": _2,
				"sande": _2
			}],
			"moskenes": _2,
			"moss": _2,
			"mosvik": _2,
			"muosat": _2,
			"xn--muost-0qa": _2,
			"muosát": _2,
			"naamesjevuemie": _2,
			"xn--nmesjevuemie-tcba": _2,
			"nååmesjevuemie": _2,
			"xn--nry-yla5g": _2,
			"nærøy": _2,
			"namdalseid": _2,
			"namsos": _2,
			"namsskogan": _2,
			"nannestad": _2,
			"naroy": _2,
			"narviika": _2,
			"narvik": _2,
			"naustdal": _2,
			"navuotna": _2,
			"xn--nvuotna-hwa": _2,
			"návuotna": _2,
			"nedre-eiker": _2,
			"nesna": _2,
			"nesodden": _2,
			"nesseby": _2,
			"nesset": _2,
			"nissedal": _2,
			"nittedal": _2,
			"nord-aurdal": _2,
			"nord-fron": _2,
			"nord-odal": _2,
			"norddal": _2,
			"nordkapp": _2,
			"nordland": [0, {
				"bo": _2,
				"xn--b-5ga": _2,
				"bø": _2,
				"heroy": _2,
				"xn--hery-ira": _2,
				"herøy": _2
			}],
			"nordre-land": _2,
			"nordreisa": _2,
			"nore-og-uvdal": _2,
			"notodden": _2,
			"notteroy": _2,
			"xn--nttery-byae": _2,
			"nøtterøy": _2,
			"odda": _2,
			"oksnes": _2,
			"xn--ksnes-uua": _2,
			"øksnes": _2,
			"omasvuotna": _2,
			"oppdal": _2,
			"oppegard": _2,
			"xn--oppegrd-ixa": _2,
			"oppegård": _2,
			"orkdal": _2,
			"orland": _2,
			"xn--rland-uua": _2,
			"ørland": _2,
			"orskog": _2,
			"xn--rskog-uua": _2,
			"ørskog": _2,
			"orsta": _2,
			"xn--rsta-fra": _2,
			"ørsta": _2,
			"osen": _2,
			"osteroy": _2,
			"xn--ostery-fya": _2,
			"osterøy": _2,
			"ostfold": [0, { "valer": _2 }],
			"xn--stfold-9xa": [0, { "xn--vler-qoa": _2 }],
			"østfold": [0, { "våler": _2 }],
			"ostre-toten": _2,
			"xn--stre-toten-zcb": _2,
			"østre-toten": _2,
			"overhalla": _2,
			"ovre-eiker": _2,
			"xn--vre-eiker-k8a": _2,
			"øvre-eiker": _2,
			"oyer": _2,
			"xn--yer-zna": _2,
			"øyer": _2,
			"oygarden": _2,
			"xn--ygarden-p1a": _2,
			"øygarden": _2,
			"oystre-slidre": _2,
			"xn--ystre-slidre-ujb": _2,
			"øystre-slidre": _2,
			"porsanger": _2,
			"porsangu": _2,
			"xn--porsgu-sta26f": _2,
			"porsáŋgu": _2,
			"porsgrunn": _2,
			"rade": _2,
			"xn--rde-ula": _2,
			"råde": _2,
			"radoy": _2,
			"xn--rady-ira": _2,
			"radøy": _2,
			"xn--rlingen-mxa": _2,
			"rælingen": _2,
			"rahkkeravju": _2,
			"xn--rhkkervju-01af": _2,
			"ráhkkerávju": _2,
			"raisa": _2,
			"xn--risa-5na": _2,
			"ráisa": _2,
			"rakkestad": _2,
			"ralingen": _2,
			"rana": _2,
			"randaberg": _2,
			"rauma": _2,
			"rendalen": _2,
			"rennebu": _2,
			"rennesoy": _2,
			"xn--rennesy-v1a": _2,
			"rennesøy": _2,
			"rindal": _2,
			"ringebu": _2,
			"ringerike": _2,
			"ringsaker": _2,
			"risor": _2,
			"xn--risr-ira": _2,
			"risør": _2,
			"rissa": _2,
			"roan": _2,
			"rodoy": _2,
			"xn--rdy-0nab": _2,
			"rødøy": _2,
			"rollag": _2,
			"romsa": _2,
			"romskog": _2,
			"xn--rmskog-bya": _2,
			"rømskog": _2,
			"roros": _2,
			"xn--rros-gra": _2,
			"røros": _2,
			"rost": _2,
			"xn--rst-0na": _2,
			"røst": _2,
			"royken": _2,
			"xn--ryken-vua": _2,
			"røyken": _2,
			"royrvik": _2,
			"xn--ryrvik-bya": _2,
			"røyrvik": _2,
			"ruovat": _2,
			"rygge": _2,
			"salangen": _2,
			"salat": _2,
			"xn--slat-5na": _2,
			"sálat": _2,
			"xn--slt-elab": _2,
			"sálát": _2,
			"saltdal": _2,
			"samnanger": _2,
			"sandefjord": _2,
			"sandnes": _2,
			"sandoy": _2,
			"xn--sandy-yua": _2,
			"sandøy": _2,
			"sarpsborg": _2,
			"sauda": _2,
			"sauherad": _2,
			"sel": _2,
			"selbu": _2,
			"selje": _2,
			"seljord": _2,
			"siellak": _2,
			"sigdal": _2,
			"siljan": _2,
			"sirdal": _2,
			"skanit": _2,
			"xn--sknit-yqa": _2,
			"skánit": _2,
			"skanland": _2,
			"xn--sknland-fxa": _2,
			"skånland": _2,
			"skaun": _2,
			"skedsmo": _2,
			"ski": _2,
			"skien": _2,
			"skierva": _2,
			"xn--skierv-uta": _2,
			"skiervá": _2,
			"skiptvet": _2,
			"skjak": _2,
			"xn--skjk-soa": _2,
			"skjåk": _2,
			"skjervoy": _2,
			"xn--skjervy-v1a": _2,
			"skjervøy": _2,
			"skodje": _2,
			"smola": _2,
			"xn--smla-hra": _2,
			"smøla": _2,
			"snaase": _2,
			"xn--snase-nra": _2,
			"snåase": _2,
			"snasa": _2,
			"xn--snsa-roa": _2,
			"snåsa": _2,
			"snillfjord": _2,
			"snoasa": _2,
			"sogndal": _2,
			"sogne": _2,
			"xn--sgne-gra": _2,
			"søgne": _2,
			"sokndal": _2,
			"sola": _2,
			"solund": _2,
			"somna": _2,
			"xn--smna-gra": _2,
			"sømna": _2,
			"sondre-land": _2,
			"xn--sndre-land-0cb": _2,
			"søndre-land": _2,
			"songdalen": _2,
			"sor-aurdal": _2,
			"xn--sr-aurdal-l8a": _2,
			"sør-aurdal": _2,
			"sor-fron": _2,
			"xn--sr-fron-q1a": _2,
			"sør-fron": _2,
			"sor-odal": _2,
			"xn--sr-odal-q1a": _2,
			"sør-odal": _2,
			"sor-varanger": _2,
			"xn--sr-varanger-ggb": _2,
			"sør-varanger": _2,
			"sorfold": _2,
			"xn--srfold-bya": _2,
			"sørfold": _2,
			"sorreisa": _2,
			"xn--srreisa-q1a": _2,
			"sørreisa": _2,
			"sortland": _2,
			"sorum": _2,
			"xn--srum-gra": _2,
			"sørum": _2,
			"spydeberg": _2,
			"stange": _2,
			"stavanger": _2,
			"steigen": _2,
			"steinkjer": _2,
			"stjordal": _2,
			"xn--stjrdal-s1a": _2,
			"stjørdal": _2,
			"stokke": _2,
			"stor-elvdal": _2,
			"stord": _2,
			"stordal": _2,
			"storfjord": _2,
			"strand": _2,
			"stranda": _2,
			"stryn": _2,
			"sula": _2,
			"suldal": _2,
			"sund": _2,
			"sunndal": _2,
			"surnadal": _2,
			"sveio": _2,
			"svelvik": _2,
			"sykkylven": _2,
			"tana": _2,
			"telemark": [0, {
				"bo": _2,
				"xn--b-5ga": _2,
				"bø": _2
			}],
			"time": _2,
			"tingvoll": _2,
			"tinn": _2,
			"tjeldsund": _2,
			"tjome": _2,
			"xn--tjme-hra": _2,
			"tjøme": _2,
			"tokke": _2,
			"tolga": _2,
			"tonsberg": _2,
			"xn--tnsberg-q1a": _2,
			"tønsberg": _2,
			"torsken": _2,
			"xn--trna-woa": _2,
			"træna": _2,
			"trana": _2,
			"tranoy": _2,
			"xn--trany-yua": _2,
			"tranøy": _2,
			"troandin": _2,
			"trogstad": _2,
			"xn--trgstad-r1a": _2,
			"trøgstad": _2,
			"tromsa": _2,
			"tromso": _2,
			"xn--troms-zua": _2,
			"tromsø": _2,
			"trondheim": _2,
			"trysil": _2,
			"tvedestrand": _2,
			"tydal": _2,
			"tynset": _2,
			"tysfjord": _2,
			"tysnes": _2,
			"xn--tysvr-vra": _2,
			"tysvær": _2,
			"tysvar": _2,
			"ullensaker": _2,
			"ullensvang": _2,
			"ulvik": _2,
			"unjarga": _2,
			"xn--unjrga-rta": _2,
			"unjárga": _2,
			"utsira": _2,
			"vaapste": _2,
			"vadso": _2,
			"xn--vads-jra": _2,
			"vadsø": _2,
			"xn--vry-yla5g": _2,
			"værøy": _2,
			"vaga": _2,
			"xn--vg-yiab": _2,
			"vågå": _2,
			"vagan": _2,
			"xn--vgan-qoa": _2,
			"vågan": _2,
			"vagsoy": _2,
			"xn--vgsy-qoa0j": _2,
			"vågsøy": _2,
			"vaksdal": _2,
			"valle": _2,
			"vang": _2,
			"vanylven": _2,
			"vardo": _2,
			"xn--vard-jra": _2,
			"vardø": _2,
			"varggat": _2,
			"xn--vrggt-xqad": _2,
			"várggát": _2,
			"varoy": _2,
			"vefsn": _2,
			"vega": _2,
			"vegarshei": _2,
			"xn--vegrshei-c0a": _2,
			"vegårshei": _2,
			"vennesla": _2,
			"verdal": _2,
			"verran": _2,
			"vestby": _2,
			"vestfold": [0, { "sande": _2 }],
			"vestnes": _2,
			"vestre-slidre": _2,
			"vestre-toten": _2,
			"vestvagoy": _2,
			"xn--vestvgy-ixa6o": _2,
			"vestvågøy": _2,
			"vevelstad": _2,
			"vik": _2,
			"vikna": _2,
			"vindafjord": _2,
			"voagat": _2,
			"volda": _2,
			"voss": _2,
			"co": _3,
			"123hjemmeside": _3,
			"myspreadshop": _3
		}],
		"np": _20,
		"nr": _59,
		"nu": [1, {
			"merseine": _3,
			"mine": _3,
			"shacknet": _3,
			"enterprisecloud": _3
		}],
		"nz": [1, {
			"ac": _2,
			"co": _2,
			"cri": _2,
			"geek": _2,
			"gen": _2,
			"govt": _2,
			"health": _2,
			"iwi": _2,
			"kiwi": _2,
			"maori": _2,
			"xn--mori-qsa": _2,
			"māori": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"parliament": _2,
			"school": _2,
			"cloudns": _3
		}],
		"om": [1, {
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"med": _2,
			"museum": _2,
			"net": _2,
			"org": _2,
			"pro": _2
		}],
		"onion": _2,
		"org": [1, {
			"altervista": _3,
			"pimienta": _3,
			"poivron": _3,
			"potager": _3,
			"sweetpepper": _3,
			"cdn77": [0, {
				"c": _3,
				"rsc": _3
			}],
			"cdn77-secure": [0, { "origin": [0, { "ssl": _3 }] }],
			"ae": _3,
			"cloudns": _3,
			"ip-dynamic": _3,
			"ddnss": _3,
			"dpdns": _3,
			"duckdns": _3,
			"tunk": _3,
			"blogdns": _3,
			"blogsite": _3,
			"boldlygoingnowhere": _3,
			"dnsalias": _3,
			"dnsdojo": _3,
			"doesntexist": _3,
			"dontexist": _3,
			"doomdns": _3,
			"dvrdns": _3,
			"dynalias": _3,
			"dyndns": [2, {
				"go": _3,
				"home": _3
			}],
			"endofinternet": _3,
			"endoftheinternet": _3,
			"from-me": _3,
			"game-host": _3,
			"gotdns": _3,
			"hobby-site": _3,
			"homedns": _3,
			"homeftp": _3,
			"homelinux": _3,
			"homeunix": _3,
			"is-a-bruinsfan": _3,
			"is-a-candidate": _3,
			"is-a-celticsfan": _3,
			"is-a-chef": _3,
			"is-a-geek": _3,
			"is-a-knight": _3,
			"is-a-linux-user": _3,
			"is-a-patsfan": _3,
			"is-a-soxfan": _3,
			"is-found": _3,
			"is-lost": _3,
			"is-saved": _3,
			"is-very-bad": _3,
			"is-very-evil": _3,
			"is-very-good": _3,
			"is-very-nice": _3,
			"is-very-sweet": _3,
			"isa-geek": _3,
			"kicks-ass": _3,
			"misconfused": _3,
			"podzone": _3,
			"readmyblog": _3,
			"selfip": _3,
			"sellsyourhome": _3,
			"servebbs": _3,
			"serveftp": _3,
			"servegame": _3,
			"stuff-4-sale": _3,
			"webhop": _3,
			"accesscam": _3,
			"camdvr": _3,
			"freeddns": _3,
			"mywire": _3,
			"webredirect": _3,
			"twmail": _3,
			"eu": [2, {
				"al": _3,
				"asso": _3,
				"at": _3,
				"au": _3,
				"be": _3,
				"bg": _3,
				"ca": _3,
				"cd": _3,
				"ch": _3,
				"cn": _3,
				"cy": _3,
				"cz": _3,
				"de": _3,
				"dk": _3,
				"edu": _3,
				"ee": _3,
				"es": _3,
				"fi": _3,
				"fr": _3,
				"gr": _3,
				"hr": _3,
				"hu": _3,
				"ie": _3,
				"il": _3,
				"in": _3,
				"int": _3,
				"is": _3,
				"it": _3,
				"jp": _3,
				"kr": _3,
				"lt": _3,
				"lu": _3,
				"lv": _3,
				"me": _3,
				"mk": _3,
				"mt": _3,
				"my": _3,
				"net": _3,
				"ng": _3,
				"nl": _3,
				"no": _3,
				"nz": _3,
				"pl": _3,
				"pt": _3,
				"ro": _3,
				"ru": _3,
				"se": _3,
				"si": _3,
				"sk": _3,
				"tr": _3,
				"uk": _3,
				"us": _3
			}],
			"fedorainfracloud": _3,
			"fedorapeople": _3,
			"fedoraproject": [0, {
				"cloud": _3,
				"os": _45,
				"stg": [0, { "os": _45 }]
			}],
			"freedesktop": _3,
			"hatenadiary": _3,
			"hepforge": _3,
			"in-dsl": _3,
			"in-vpn": _3,
			"js": _3,
			"barsy": _3,
			"mayfirst": _3,
			"routingthecloud": _3,
			"bmoattachments": _3,
			"cable-modem": _3,
			"collegefan": _3,
			"couchpotatofries": _3,
			"hopto": _3,
			"mlbfan": _3,
			"myftp": _3,
			"mysecuritycamera": _3,
			"nflfan": _3,
			"no-ip": _3,
			"read-books": _3,
			"ufcfan": _3,
			"zapto": _3,
			"dynserv": _3,
			"now-dns": _3,
			"is-local": _3,
			"httpbin": _3,
			"pubtls": _3,
			"jpn": _3,
			"my-firewall": _3,
			"myfirewall": _3,
			"spdns": _3,
			"small-web": _3,
			"dsmynas": _3,
			"familyds": _3,
			"teckids": _58,
			"tuxfamily": _3,
			"diskstation": _3,
			"hk": _3,
			"us": _3,
			"toolforge": _3,
			"wmcloud": [2, { "beta": _3 }],
			"wmflabs": _3,
			"za": _3
		}],
		"pa": [1, {
			"abo": _2,
			"ac": _2,
			"com": _2,
			"edu": _2,
			"gob": _2,
			"ing": _2,
			"med": _2,
			"net": _2,
			"nom": _2,
			"org": _2,
			"sld": _2
		}],
		"pe": [1, {
			"com": _2,
			"edu": _2,
			"gob": _2,
			"mil": _2,
			"net": _2,
			"nom": _2,
			"org": _2
		}],
		"pf": [1, {
			"com": _2,
			"edu": _2,
			"org": _2
		}],
		"pg": _20,
		"ph": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"i": _2,
			"mil": _2,
			"net": _2,
			"ngo": _2,
			"org": _2,
			"cloudns": _3
		}],
		"pk": [1, {
			"ac": _2,
			"biz": _2,
			"com": _2,
			"edu": _2,
			"fam": _2,
			"gkp": _2,
			"gob": _2,
			"gog": _2,
			"gok": _2,
			"gop": _2,
			"gos": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"web": _2
		}],
		"pl": [1, {
			"com": _2,
			"net": _2,
			"org": _2,
			"agro": _2,
			"aid": _2,
			"atm": _2,
			"auto": _2,
			"biz": _2,
			"edu": _2,
			"gmina": _2,
			"gsm": _2,
			"info": _2,
			"mail": _2,
			"media": _2,
			"miasta": _2,
			"mil": _2,
			"nieruchomosci": _2,
			"nom": _2,
			"pc": _2,
			"powiat": _2,
			"priv": _2,
			"realestate": _2,
			"rel": _2,
			"sex": _2,
			"shop": _2,
			"sklep": _2,
			"sos": _2,
			"szkola": _2,
			"targi": _2,
			"tm": _2,
			"tourism": _2,
			"travel": _2,
			"turystyka": _2,
			"gov": [1, {
				"ap": _2,
				"griw": _2,
				"ic": _2,
				"is": _2,
				"kmpsp": _2,
				"konsulat": _2,
				"kppsp": _2,
				"kwp": _2,
				"kwpsp": _2,
				"mup": _2,
				"mw": _2,
				"oia": _2,
				"oirm": _2,
				"oke": _2,
				"oow": _2,
				"oschr": _2,
				"oum": _2,
				"pa": _2,
				"pinb": _2,
				"piw": _2,
				"po": _2,
				"pr": _2,
				"psp": _2,
				"psse": _2,
				"pup": _2,
				"rzgw": _2,
				"sa": _2,
				"sdn": _2,
				"sko": _2,
				"so": _2,
				"sr": _2,
				"starostwo": _2,
				"ug": _2,
				"ugim": _2,
				"um": _2,
				"umig": _2,
				"upow": _2,
				"uppo": _2,
				"us": _2,
				"uw": _2,
				"uzs": _2,
				"wif": _2,
				"wiih": _2,
				"winb": _2,
				"wios": _2,
				"witd": _2,
				"wiw": _2,
				"wkz": _2,
				"wsa": _2,
				"wskr": _2,
				"wsse": _2,
				"wuoz": _2,
				"wzmiuw": _2,
				"zp": _2,
				"zpisdn": _2
			}],
			"augustow": _2,
			"babia-gora": _2,
			"bedzin": _2,
			"beskidy": _2,
			"bialowieza": _2,
			"bialystok": _2,
			"bielawa": _2,
			"bieszczady": _2,
			"boleslawiec": _2,
			"bydgoszcz": _2,
			"bytom": _2,
			"cieszyn": _2,
			"czeladz": _2,
			"czest": _2,
			"dlugoleka": _2,
			"elblag": _2,
			"elk": _2,
			"glogow": _2,
			"gniezno": _2,
			"gorlice": _2,
			"grajewo": _2,
			"ilawa": _2,
			"jaworzno": _2,
			"jelenia-gora": _2,
			"jgora": _2,
			"kalisz": _2,
			"karpacz": _2,
			"kartuzy": _2,
			"kaszuby": _2,
			"katowice": _2,
			"kazimierz-dolny": _2,
			"kepno": _2,
			"ketrzyn": _2,
			"klodzko": _2,
			"kobierzyce": _2,
			"kolobrzeg": _2,
			"konin": _2,
			"konskowola": _2,
			"kutno": _2,
			"lapy": _2,
			"lebork": _2,
			"legnica": _2,
			"lezajsk": _2,
			"limanowa": _2,
			"lomza": _2,
			"lowicz": _2,
			"lubin": _2,
			"lukow": _2,
			"malbork": _2,
			"malopolska": _2,
			"mazowsze": _2,
			"mazury": _2,
			"mielec": _2,
			"mielno": _2,
			"mragowo": _2,
			"naklo": _2,
			"nowaruda": _2,
			"nysa": _2,
			"olawa": _2,
			"olecko": _2,
			"olkusz": _2,
			"olsztyn": _2,
			"opoczno": _2,
			"opole": _2,
			"ostroda": _2,
			"ostroleka": _2,
			"ostrowiec": _2,
			"ostrowwlkp": _2,
			"pila": _2,
			"pisz": _2,
			"podhale": _2,
			"podlasie": _2,
			"polkowice": _2,
			"pomorskie": _2,
			"pomorze": _2,
			"prochowice": _2,
			"pruszkow": _2,
			"przeworsk": _2,
			"pulawy": _2,
			"radom": _2,
			"rawa-maz": _2,
			"rybnik": _2,
			"rzeszow": _2,
			"sanok": _2,
			"sejny": _2,
			"skoczow": _2,
			"slask": _2,
			"slupsk": _2,
			"sosnowiec": _2,
			"stalowa-wola": _2,
			"starachowice": _2,
			"stargard": _2,
			"suwalki": _2,
			"swidnica": _2,
			"swiebodzin": _2,
			"swinoujscie": _2,
			"szczecin": _2,
			"szczytno": _2,
			"tarnobrzeg": _2,
			"tgory": _2,
			"turek": _2,
			"tychy": _2,
			"ustka": _2,
			"walbrzych": _2,
			"warmia": _2,
			"warszawa": _2,
			"waw": _2,
			"wegrow": _2,
			"wielun": _2,
			"wlocl": _2,
			"wloclawek": _2,
			"wodzislaw": _2,
			"wolomin": _2,
			"wroclaw": _2,
			"zachpomor": _2,
			"zagan": _2,
			"zarow": _2,
			"zgora": _2,
			"zgorzelec": _2,
			"art": _3,
			"gliwice": _3,
			"krakow": _3,
			"poznan": _3,
			"wroc": _3,
			"zakopane": _3,
			"beep": _3,
			"ecommerce-shop": _3,
			"cfolks": _3,
			"dfirma": _3,
			"dkonto": _3,
			"you2": _3,
			"shoparena": _3,
			"homesklep": _3,
			"sdscloud": _3,
			"unicloud": _3,
			"lodz": _3,
			"pabianice": _3,
			"plock": _3,
			"sieradz": _3,
			"skierniewice": _3,
			"zgierz": _3,
			"krasnik": _3,
			"leczna": _3,
			"lubartow": _3,
			"lublin": _3,
			"poniatowa": _3,
			"swidnik": _3,
			"co": _3,
			"torun": _3,
			"simplesite": _3,
			"myspreadshop": _3,
			"gda": _3,
			"gdansk": _3,
			"gdynia": _3,
			"med": _3,
			"sopot": _3,
			"bielsko": _3
		}],
		"pm": [1, {
			"own": _3,
			"name": _3
		}],
		"pn": [1, {
			"co": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2
		}],
		"post": _2,
		"pr": [1, {
			"biz": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"isla": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"pro": _2,
			"ac": _2,
			"est": _2,
			"prof": _2
		}],
		"pro": [1, {
			"aaa": _2,
			"aca": _2,
			"acct": _2,
			"avocat": _2,
			"bar": _2,
			"cpa": _2,
			"eng": _2,
			"jur": _2,
			"law": _2,
			"med": _2,
			"recht": _2,
			"12chars": _3,
			"cloudns": _3,
			"barsy": _3,
			"ngrok": _3
		}],
		"ps": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"plo": _2,
			"sec": _2
		}],
		"pt": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"int": _2,
			"net": _2,
			"nome": _2,
			"org": _2,
			"publ": _2,
			"123paginaweb": _3
		}],
		"pw": [1, {
			"gov": _2,
			"cloudns": _3,
			"x443": _3
		}],
		"py": [1, {
			"com": _2,
			"coop": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2
		}],
		"qa": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"sch": _2
		}],
		"re": [1, {
			"asso": _2,
			"com": _2,
			"netlib": _3,
			"can": _3
		}],
		"ro": [1, {
			"arts": _2,
			"com": _2,
			"firm": _2,
			"info": _2,
			"nom": _2,
			"nt": _2,
			"org": _2,
			"rec": _2,
			"store": _2,
			"tm": _2,
			"www": _2,
			"co": _3,
			"shop": _3,
			"barsy": _3
		}],
		"rs": [1, {
			"ac": _2,
			"co": _2,
			"edu": _2,
			"gov": _2,
			"in": _2,
			"org": _2,
			"brendly": _19,
			"barsy": _3,
			"ox": _3
		}],
		"ru": [1, {
			"ac": _3,
			"edu": _3,
			"gov": _3,
			"int": _3,
			"mil": _3,
			"eurodir": _3,
			"adygeya": _3,
			"bashkiria": _3,
			"bir": _3,
			"cbg": _3,
			"com": _3,
			"dagestan": _3,
			"grozny": _3,
			"kalmykia": _3,
			"kustanai": _3,
			"marine": _3,
			"mordovia": _3,
			"msk": _3,
			"mytis": _3,
			"nalchik": _3,
			"nov": _3,
			"pyatigorsk": _3,
			"spb": _3,
			"vladikavkaz": _3,
			"vladimir": _3,
			"na4u": _3,
			"mircloud": _3,
			"myjino": [2, {
				"hosting": _6,
				"landing": _6,
				"spectrum": _6,
				"vps": _6
			}],
			"cldmail": [0, { "hb": _3 }],
			"mcdir": _11,
			"mcpre": _3,
			"net": _3,
			"org": _3,
			"pp": _3,
			"lk3": _3,
			"ras": _3
		}],
		"rw": [1, {
			"ac": _2,
			"co": _2,
			"coop": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2
		}],
		"sa": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"med": _2,
			"net": _2,
			"org": _2,
			"pub": _2,
			"sch": _2
		}],
		"sb": _4,
		"sc": _4,
		"sd": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"med": _2,
			"net": _2,
			"org": _2,
			"tv": _2
		}],
		"se": [1, {
			"a": _2,
			"ac": _2,
			"b": _2,
			"bd": _2,
			"brand": _2,
			"c": _2,
			"d": _2,
			"e": _2,
			"f": _2,
			"fh": _2,
			"fhsk": _2,
			"fhv": _2,
			"g": _2,
			"h": _2,
			"i": _2,
			"k": _2,
			"komforb": _2,
			"kommunalforbund": _2,
			"komvux": _2,
			"l": _2,
			"lanbib": _2,
			"m": _2,
			"n": _2,
			"naturbruksgymn": _2,
			"o": _2,
			"org": _2,
			"p": _2,
			"parti": _2,
			"pp": _2,
			"press": _2,
			"r": _2,
			"s": _2,
			"t": _2,
			"tm": _2,
			"u": _2,
			"w": _2,
			"x": _2,
			"y": _2,
			"z": _2,
			"com": _3,
			"iopsys": _3,
			"123minsida": _3,
			"itcouldbewor": _3,
			"myspreadshop": _3
		}],
		"sg": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"enscaled": _3
		}],
		"sh": [1, {
			"com": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"hashbang": _3,
			"botda": _3,
			"lovable": _3,
			"platform": [0, {
				"ent": _3,
				"eu": _3,
				"us": _3
			}],
			"teleport": _3,
			"now": _3
		}],
		"si": [1, {
			"f5": _3,
			"gitapp": _3,
			"gitpage": _3
		}],
		"sj": _2,
		"sk": _2,
		"sl": _4,
		"sm": _2,
		"sn": [1, {
			"art": _2,
			"com": _2,
			"edu": _2,
			"gouv": _2,
			"org": _2,
			"perso": _2,
			"univ": _2
		}],
		"so": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"me": _2,
			"net": _2,
			"org": _2,
			"surveys": _3
		}],
		"sr": _2,
		"ss": [1, {
			"biz": _2,
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"me": _2,
			"net": _2,
			"org": _2,
			"sch": _2
		}],
		"st": [1, {
			"co": _2,
			"com": _2,
			"consulado": _2,
			"edu": _2,
			"embaixada": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"principe": _2,
			"saotome": _2,
			"store": _2,
			"helioho": _3,
			"kirara": _3,
			"noho": _3
		}],
		"su": [1, {
			"abkhazia": _3,
			"adygeya": _3,
			"aktyubinsk": _3,
			"arkhangelsk": _3,
			"armenia": _3,
			"ashgabad": _3,
			"azerbaijan": _3,
			"balashov": _3,
			"bashkiria": _3,
			"bryansk": _3,
			"bukhara": _3,
			"chimkent": _3,
			"dagestan": _3,
			"east-kazakhstan": _3,
			"exnet": _3,
			"georgia": _3,
			"grozny": _3,
			"ivanovo": _3,
			"jambyl": _3,
			"kalmykia": _3,
			"kaluga": _3,
			"karacol": _3,
			"karaganda": _3,
			"karelia": _3,
			"khakassia": _3,
			"krasnodar": _3,
			"kurgan": _3,
			"kustanai": _3,
			"lenug": _3,
			"mangyshlak": _3,
			"mordovia": _3,
			"msk": _3,
			"murmansk": _3,
			"nalchik": _3,
			"navoi": _3,
			"north-kazakhstan": _3,
			"nov": _3,
			"obninsk": _3,
			"penza": _3,
			"pokrovsk": _3,
			"sochi": _3,
			"spb": _3,
			"tashkent": _3,
			"termez": _3,
			"togliatti": _3,
			"troitsk": _3,
			"tselinograd": _3,
			"tula": _3,
			"tuva": _3,
			"vladikavkaz": _3,
			"vladimir": _3,
			"vologda": _3
		}],
		"sv": [1, {
			"com": _2,
			"edu": _2,
			"gob": _2,
			"org": _2,
			"red": _2
		}],
		"sx": _10,
		"sy": _5,
		"sz": [1, {
			"ac": _2,
			"co": _2,
			"org": _2
		}],
		"tc": _2,
		"td": _2,
		"tel": _2,
		"tf": [1, { "sch": _3 }],
		"tg": _2,
		"th": [1, {
			"ac": _2,
			"co": _2,
			"go": _2,
			"in": _2,
			"mi": _2,
			"net": _2,
			"or": _2,
			"online": _3,
			"shop": _3
		}],
		"tj": [1, {
			"ac": _2,
			"biz": _2,
			"co": _2,
			"com": _2,
			"edu": _2,
			"go": _2,
			"gov": _2,
			"int": _2,
			"mil": _2,
			"name": _2,
			"net": _2,
			"nic": _2,
			"org": _2,
			"test": _2,
			"web": _2
		}],
		"tk": _2,
		"tl": _10,
		"tm": [1, {
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"nom": _2,
			"org": _2
		}],
		"tn": [1, {
			"com": _2,
			"ens": _2,
			"fin": _2,
			"gov": _2,
			"ind": _2,
			"info": _2,
			"intl": _2,
			"mincom": _2,
			"nat": _2,
			"net": _2,
			"org": _2,
			"perso": _2,
			"tourism": _2,
			"orangecloud": _3
		}],
		"to": [1, {
			"611": _3,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"oya": _3,
			"x0": _3,
			"quickconnect": _27,
			"vpnplus": _3
		}],
		"tr": [1, {
			"av": _2,
			"bbs": _2,
			"bel": _2,
			"biz": _2,
			"com": _2,
			"dr": _2,
			"edu": _2,
			"gen": _2,
			"gov": _2,
			"info": _2,
			"k12": _2,
			"kep": _2,
			"mil": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"pol": _2,
			"tel": _2,
			"tsk": _2,
			"tv": _2,
			"web": _2,
			"nc": _10
		}],
		"tt": [1, {
			"biz": _2,
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"mil": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"pro": _2
		}],
		"tv": [1, {
			"better-than": _3,
			"dyndns": _3,
			"on-the-web": _3,
			"worse-than": _3,
			"from": _3,
			"sakura": _3
		}],
		"tw": [1, {
			"club": _2,
			"com": [1, { "mymailer": _3 }],
			"ebiz": _2,
			"edu": _2,
			"game": _2,
			"gov": _2,
			"idv": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"url": _3,
			"mydns": _3
		}],
		"tz": [1, {
			"ac": _2,
			"co": _2,
			"go": _2,
			"hotel": _2,
			"info": _2,
			"me": _2,
			"mil": _2,
			"mobi": _2,
			"ne": _2,
			"or": _2,
			"sc": _2,
			"tv": _2
		}],
		"ua": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"in": _2,
			"net": _2,
			"org": _2,
			"cherkassy": _2,
			"cherkasy": _2,
			"chernigov": _2,
			"chernihiv": _2,
			"chernivtsi": _2,
			"chernovtsy": _2,
			"ck": _2,
			"cn": _2,
			"cr": _2,
			"crimea": _2,
			"cv": _2,
			"dn": _2,
			"dnepropetrovsk": _2,
			"dnipropetrovsk": _2,
			"donetsk": _2,
			"dp": _2,
			"if": _2,
			"ivano-frankivsk": _2,
			"kh": _2,
			"kharkiv": _2,
			"kharkov": _2,
			"kherson": _2,
			"khmelnitskiy": _2,
			"khmelnytskyi": _2,
			"kiev": _2,
			"kirovograd": _2,
			"km": _2,
			"kr": _2,
			"kropyvnytskyi": _2,
			"krym": _2,
			"ks": _2,
			"kv": _2,
			"kyiv": _2,
			"lg": _2,
			"lt": _2,
			"lugansk": _2,
			"luhansk": _2,
			"lutsk": _2,
			"lv": _2,
			"lviv": _2,
			"mk": _2,
			"mykolaiv": _2,
			"nikolaev": _2,
			"od": _2,
			"odesa": _2,
			"odessa": _2,
			"pl": _2,
			"poltava": _2,
			"rivne": _2,
			"rovno": _2,
			"rv": _2,
			"sb": _2,
			"sebastopol": _2,
			"sevastopol": _2,
			"sm": _2,
			"sumy": _2,
			"te": _2,
			"ternopil": _2,
			"uz": _2,
			"uzhgorod": _2,
			"uzhhorod": _2,
			"vinnica": _2,
			"vinnytsia": _2,
			"vn": _2,
			"volyn": _2,
			"yalta": _2,
			"zakarpattia": _2,
			"zaporizhzhe": _2,
			"zaporizhzhia": _2,
			"zhitomir": _2,
			"zhytomyr": _2,
			"zp": _2,
			"zt": _2,
			"cc": _3,
			"inf": _3,
			"ltd": _3,
			"cx": _3,
			"biz": _3,
			"co": _3,
			"pp": _3,
			"v": _3
		}],
		"ug": [1, {
			"ac": _2,
			"co": _2,
			"com": _2,
			"edu": _2,
			"go": _2,
			"gov": _2,
			"mil": _2,
			"ne": _2,
			"or": _2,
			"org": _2,
			"sc": _2,
			"us": _2
		}],
		"uk": [1, {
			"ac": _2,
			"co": [1, {
				"bytemark": [0, {
					"dh": _3,
					"vm": _3
				}],
				"layershift": _48,
				"barsy": _3,
				"barsyonline": _3,
				"retrosnub": _57,
				"nh-serv": _3,
				"no-ip": _3,
				"adimo": _3,
				"myspreadshop": _3
			}],
			"gov": [1, {
				"api": _3,
				"campaign": _3,
				"service": _3
			}],
			"ltd": _2,
			"me": _2,
			"net": _2,
			"nhs": _2,
			"org": [1, {
				"glug": _3,
				"lug": _3,
				"lugs": _3,
				"affinitylottery": _3,
				"raffleentry": _3,
				"weeklylottery": _3
			}],
			"plc": _2,
			"police": _2,
			"sch": _20,
			"conn": _3,
			"copro": _3,
			"hosp": _3,
			"independent-commission": _3,
			"independent-inquest": _3,
			"independent-inquiry": _3,
			"independent-panel": _3,
			"independent-review": _3,
			"public-inquiry": _3,
			"royal-commission": _3,
			"pymnt": _3,
			"barsy": _3,
			"nimsite": _3,
			"oraclegovcloudapps": _6
		}],
		"us": [1, {
			"dni": _2,
			"isa": _2,
			"nsn": _2,
			"ak": _65,
			"al": _65,
			"ar": _65,
			"as": _65,
			"az": _65,
			"ca": _65,
			"co": _65,
			"ct": _65,
			"dc": _65,
			"de": _66,
			"fl": _65,
			"ga": _65,
			"gu": _65,
			"hi": _67,
			"ia": _65,
			"id": _65,
			"il": _65,
			"in": _65,
			"ks": _65,
			"ky": _65,
			"la": _65,
			"ma": [1, {
				"k12": [1, {
					"chtr": _2,
					"paroch": _2,
					"pvt": _2
				}],
				"cc": _2,
				"lib": _2
			}],
			"md": _65,
			"me": _65,
			"mi": [1, {
				"k12": _2,
				"cc": _2,
				"lib": _2,
				"ann-arbor": _2,
				"cog": _2,
				"dst": _2,
				"eaton": _2,
				"gen": _2,
				"mus": _2,
				"tec": _2,
				"washtenaw": _2
			}],
			"mn": _65,
			"mo": _65,
			"ms": [1, {
				"k12": _2,
				"cc": _2
			}],
			"mt": _65,
			"nc": _65,
			"nd": _67,
			"ne": _65,
			"nh": _65,
			"nj": _65,
			"nm": _65,
			"nv": _65,
			"ny": _65,
			"oh": _65,
			"ok": _65,
			"or": _65,
			"pa": _65,
			"pr": _65,
			"ri": _67,
			"sc": _65,
			"sd": _67,
			"tn": _65,
			"tx": _65,
			"ut": _65,
			"va": _65,
			"vi": _65,
			"vt": _65,
			"wa": _65,
			"wi": _65,
			"wv": _66,
			"wy": _65,
			"cloudns": _3,
			"is-by": _3,
			"land-4-sale": _3,
			"stuff-4-sale": _3,
			"heliohost": _3,
			"enscaled": [0, { "phx": _3 }],
			"mircloud": _3,
			"ngo": _3,
			"golffan": _3,
			"noip": _3,
			"pointto": _3,
			"freeddns": _3,
			"srv": [2, {
				"gh": _3,
				"gl": _3
			}],
			"platterp": _3,
			"servername": _3
		}],
		"uy": [1, {
			"com": _2,
			"edu": _2,
			"gub": _2,
			"mil": _2,
			"net": _2,
			"org": _2
		}],
		"uz": [1, {
			"co": _2,
			"com": _2,
			"net": _2,
			"org": _2
		}],
		"va": _2,
		"vc": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"gv": [2, { "d": _3 }],
			"0e": _6,
			"mydns": _3
		}],
		"ve": [1, {
			"arts": _2,
			"bib": _2,
			"co": _2,
			"com": _2,
			"e12": _2,
			"edu": _2,
			"emprende": _2,
			"firm": _2,
			"gob": _2,
			"gov": _2,
			"info": _2,
			"int": _2,
			"mil": _2,
			"net": _2,
			"nom": _2,
			"org": _2,
			"rar": _2,
			"rec": _2,
			"store": _2,
			"tec": _2,
			"web": _2
		}],
		"vg": [1, { "edu": _2 }],
		"vi": [1, {
			"co": _2,
			"com": _2,
			"k12": _2,
			"net": _2,
			"org": _2
		}],
		"vn": [1, {
			"ac": _2,
			"ai": _2,
			"biz": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"health": _2,
			"id": _2,
			"info": _2,
			"int": _2,
			"io": _2,
			"name": _2,
			"net": _2,
			"org": _2,
			"pro": _2,
			"angiang": _2,
			"bacgiang": _2,
			"backan": _2,
			"baclieu": _2,
			"bacninh": _2,
			"baria-vungtau": _2,
			"bentre": _2,
			"binhdinh": _2,
			"binhduong": _2,
			"binhphuoc": _2,
			"binhthuan": _2,
			"camau": _2,
			"cantho": _2,
			"caobang": _2,
			"daklak": _2,
			"daknong": _2,
			"danang": _2,
			"dienbien": _2,
			"dongnai": _2,
			"dongthap": _2,
			"gialai": _2,
			"hagiang": _2,
			"haiduong": _2,
			"haiphong": _2,
			"hanam": _2,
			"hanoi": _2,
			"hatinh": _2,
			"haugiang": _2,
			"hoabinh": _2,
			"hungyen": _2,
			"khanhhoa": _2,
			"kiengiang": _2,
			"kontum": _2,
			"laichau": _2,
			"lamdong": _2,
			"langson": _2,
			"laocai": _2,
			"longan": _2,
			"namdinh": _2,
			"nghean": _2,
			"ninhbinh": _2,
			"ninhthuan": _2,
			"phutho": _2,
			"phuyen": _2,
			"quangbinh": _2,
			"quangnam": _2,
			"quangngai": _2,
			"quangninh": _2,
			"quangtri": _2,
			"soctrang": _2,
			"sonla": _2,
			"tayninh": _2,
			"thaibinh": _2,
			"thainguyen": _2,
			"thanhhoa": _2,
			"thanhphohochiminh": _2,
			"thuathienhue": _2,
			"tiengiang": _2,
			"travinh": _2,
			"tuyenquang": _2,
			"vinhlong": _2,
			"vinhphuc": _2,
			"yenbai": _2
		}],
		"vu": _47,
		"wf": [1, {
			"biz": _3,
			"sch": _3
		}],
		"ws": [1, {
			"com": _2,
			"edu": _2,
			"gov": _2,
			"net": _2,
			"org": _2,
			"advisor": _6,
			"cloud66": _3,
			"dyndns": _3,
			"mypets": _3
		}],
		"yt": [1, { "org": _3 }],
		"xn--mgbaam7a8h": _2,
		"امارات": _2,
		"xn--y9a3aq": _2,
		"հայ": _2,
		"xn--54b7fta0cc": _2,
		"বাংলা": _2,
		"xn--90ae": _2,
		"бг": _2,
		"xn--mgbcpq6gpa1a": _2,
		"البحرين": _2,
		"xn--90ais": _2,
		"бел": _2,
		"xn--fiqs8s": _2,
		"中国": _2,
		"xn--fiqz9s": _2,
		"中國": _2,
		"xn--lgbbat1ad8j": _2,
		"الجزائر": _2,
		"xn--wgbh1c": _2,
		"مصر": _2,
		"xn--e1a4c": _2,
		"ею": _2,
		"xn--qxa6a": _2,
		"ευ": _2,
		"xn--mgbah1a3hjkrd": _2,
		"موريتانيا": _2,
		"xn--node": _2,
		"გე": _2,
		"xn--qxam": _2,
		"ελ": _2,
		"xn--j6w193g": [1, {
			"xn--gmqw5a": _2,
			"xn--55qx5d": _2,
			"xn--mxtq1m": _2,
			"xn--wcvs22d": _2,
			"xn--uc0atv": _2,
			"xn--od0alg": _2
		}],
		"香港": [1, {
			"個人": _2,
			"公司": _2,
			"政府": _2,
			"教育": _2,
			"組織": _2,
			"網絡": _2
		}],
		"xn--2scrj9c": _2,
		"ಭಾರತ": _2,
		"xn--3hcrj9c": _2,
		"ଭାରତ": _2,
		"xn--45br5cyl": _2,
		"ভাৰত": _2,
		"xn--h2breg3eve": _2,
		"भारतम्": _2,
		"xn--h2brj9c8c": _2,
		"भारोत": _2,
		"xn--mgbgu82a": _2,
		"ڀارت": _2,
		"xn--rvc1e0am3e": _2,
		"ഭാരതം": _2,
		"xn--h2brj9c": _2,
		"भारत": _2,
		"xn--mgbbh1a": _2,
		"بارت": _2,
		"xn--mgbbh1a71e": _2,
		"بھارت": _2,
		"xn--fpcrj9c3d": _2,
		"భారత్": _2,
		"xn--gecrj9c": _2,
		"ભારત": _2,
		"xn--s9brj9c": _2,
		"ਭਾਰਤ": _2,
		"xn--45brj9c": _2,
		"ভারত": _2,
		"xn--xkc2dl3a5ee0h": _2,
		"இந்தியா": _2,
		"xn--mgba3a4f16a": _2,
		"ایران": _2,
		"xn--mgba3a4fra": _2,
		"ايران": _2,
		"xn--mgbtx2b": _2,
		"عراق": _2,
		"xn--mgbayh7gpa": _2,
		"الاردن": _2,
		"xn--3e0b707e": _2,
		"한국": _2,
		"xn--80ao21a": _2,
		"қаз": _2,
		"xn--q7ce6a": _2,
		"ລາວ": _2,
		"xn--fzc2c9e2c": _2,
		"ලංකා": _2,
		"xn--xkc2al3hye2a": _2,
		"இலங்கை": _2,
		"xn--mgbc0a9azcg": _2,
		"المغرب": _2,
		"xn--d1alf": _2,
		"мкд": _2,
		"xn--l1acc": _2,
		"мон": _2,
		"xn--mix891f": _2,
		"澳門": _2,
		"xn--mix082f": _2,
		"澳门": _2,
		"xn--mgbx4cd0ab": _2,
		"مليسيا": _2,
		"xn--mgb9awbf": _2,
		"عمان": _2,
		"xn--mgbai9azgqp6j": _2,
		"پاکستان": _2,
		"xn--mgbai9a5eva00b": _2,
		"پاكستان": _2,
		"xn--ygbi2ammx": _2,
		"فلسطين": _2,
		"xn--90a3ac": [1, {
			"xn--80au": _2,
			"xn--90azh": _2,
			"xn--d1at": _2,
			"xn--c1avg": _2,
			"xn--o1ac": _2,
			"xn--o1ach": _2
		}],
		"срб": [1, {
			"ак": _2,
			"обр": _2,
			"од": _2,
			"орг": _2,
			"пр": _2,
			"упр": _2
		}],
		"xn--p1ai": _2,
		"рф": _2,
		"xn--wgbl6a": _2,
		"قطر": _2,
		"xn--mgberp4a5d4ar": _2,
		"السعودية": _2,
		"xn--mgberp4a5d4a87g": _2,
		"السعودیة": _2,
		"xn--mgbqly7c0a67fbc": _2,
		"السعودیۃ": _2,
		"xn--mgbqly7cvafr": _2,
		"السعوديه": _2,
		"xn--mgbpl2fh": _2,
		"سودان": _2,
		"xn--yfro4i67o": _2,
		"新加坡": _2,
		"xn--clchc0ea0b2g2a9gcd": _2,
		"சிங்கப்பூர்": _2,
		"xn--ogbpf8fl": _2,
		"سورية": _2,
		"xn--mgbtf8fl": _2,
		"سوريا": _2,
		"xn--o3cw4h": [1, {
			"xn--o3cyx2a": _2,
			"xn--12co0c3b4eva": _2,
			"xn--m3ch0j3a": _2,
			"xn--h3cuzk1di": _2,
			"xn--12c1fe0br": _2,
			"xn--12cfi8ixb8l": _2
		}],
		"ไทย": [1, {
			"ทหาร": _2,
			"ธุรกิจ": _2,
			"เน็ต": _2,
			"รัฐบาล": _2,
			"ศึกษา": _2,
			"องค์กร": _2
		}],
		"xn--pgbs0dh": _2,
		"تونس": _2,
		"xn--kpry57d": _2,
		"台灣": _2,
		"xn--kprw13d": _2,
		"台湾": _2,
		"xn--nnx388a": _2,
		"臺灣": _2,
		"xn--j1amh": _2,
		"укр": _2,
		"xn--mgb2ddes": _2,
		"اليمن": _2,
		"xxx": _2,
		"ye": _5,
		"za": [0, {
			"ac": _2,
			"agric": _2,
			"alt": _2,
			"co": _2,
			"edu": _2,
			"gov": _2,
			"grondar": _2,
			"law": _2,
			"mil": _2,
			"net": _2,
			"ngo": _2,
			"nic": _2,
			"nis": _2,
			"nom": _2,
			"org": _2,
			"school": _2,
			"tm": _2,
			"web": _2
		}],
		"zm": [1, {
			"ac": _2,
			"biz": _2,
			"co": _2,
			"com": _2,
			"edu": _2,
			"gov": _2,
			"info": _2,
			"mil": _2,
			"net": _2,
			"org": _2,
			"sch": _2
		}],
		"zw": [1, {
			"ac": _2,
			"co": _2,
			"gov": _2,
			"mil": _2,
			"org": _2
		}],
		"aaa": _2,
		"aarp": _2,
		"abb": _2,
		"abbott": _2,
		"abbvie": _2,
		"abc": _2,
		"able": _2,
		"abogado": _2,
		"abudhabi": _2,
		"academy": [1, { "official": _3 }],
		"accenture": _2,
		"accountant": _2,
		"accountants": _2,
		"aco": _2,
		"actor": _2,
		"ads": _2,
		"adult": _2,
		"aeg": _2,
		"aetna": _2,
		"afl": _2,
		"africa": _2,
		"agakhan": _2,
		"agency": _2,
		"aig": _2,
		"airbus": _2,
		"airforce": _2,
		"airtel": _2,
		"akdn": _2,
		"alibaba": _2,
		"alipay": _2,
		"allfinanz": _2,
		"allstate": _2,
		"ally": _2,
		"alsace": _2,
		"alstom": _2,
		"amazon": _2,
		"americanexpress": _2,
		"americanfamily": _2,
		"amex": _2,
		"amfam": _2,
		"amica": _2,
		"amsterdam": _2,
		"analytics": _2,
		"android": _2,
		"anquan": _2,
		"anz": _2,
		"aol": _2,
		"apartments": _2,
		"app": [1, {
			"adaptable": _3,
			"aiven": _3,
			"beget": _6,
			"brave": _7,
			"clerk": _3,
			"clerkstage": _3,
			"wnext": _3,
			"csb": [2, { "preview": _3 }],
			"convex": _3,
			"deta": _3,
			"ondigitalocean": _3,
			"easypanel": _3,
			"encr": [2, { "frontend": _3 }],
			"evervault": _8,
			"expo": [2, { "staging": _3 }],
			"edgecompute": _3,
			"on-fleek": _3,
			"flutterflow": _3,
			"e2b": _3,
			"framer": _3,
			"github": _3,
			"hosted": _6,
			"run": [0, {
				"*": _3,
				"mtls": _6
			}],
			"web": _3,
			"hackclub": _3,
			"hasura": _3,
			"botdash": _3,
			"leapcell": _3,
			"loginline": _3,
			"lovable": _3,
			"luyani": _3,
			"medusajs": _3,
			"messerli": _3,
			"netfy": _3,
			"netlify": _3,
			"ngrok": _3,
			"ngrok-free": _3,
			"developer": _6,
			"noop": _3,
			"northflank": _6,
			"upsun": _6,
			"railway": [0, { "up": _3 }],
			"replit": _9,
			"nyat": _3,
			"snowflake": [0, {
				"*": _3,
				"privatelink": _6
			}],
			"streamlit": _3,
			"storipress": _3,
			"telebit": _3,
			"typedream": _3,
			"vercel": _3,
			"wal": _3,
			"bookonline": _3,
			"wdh": _3,
			"windsurf": _3,
			"zeabur": _3,
			"zerops": _6
		}],
		"apple": _2,
		"aquarelle": _2,
		"arab": _2,
		"aramco": _2,
		"archi": _2,
		"army": _2,
		"art": _2,
		"arte": _2,
		"asda": _2,
		"associates": _2,
		"athleta": _2,
		"attorney": _2,
		"auction": _2,
		"audi": _2,
		"audible": _2,
		"audio": _2,
		"auspost": _2,
		"author": _2,
		"auto": _2,
		"autos": _2,
		"aws": [1, {
			"on": [0, {
				"af-south-1": _12,
				"ap-east-1": _12,
				"ap-northeast-1": _12,
				"ap-northeast-2": _12,
				"ap-northeast-3": _12,
				"ap-south-1": _12,
				"ap-south-2": _12,
				"ap-southeast-1": _12,
				"ap-southeast-2": _12,
				"ap-southeast-3": _12,
				"ap-southeast-4": _12,
				"ap-southeast-5": _12,
				"ca-central-1": _12,
				"ca-west-1": _12,
				"eu-central-1": _12,
				"eu-central-2": _12,
				"eu-north-1": _12,
				"eu-south-1": _12,
				"eu-south-2": _12,
				"eu-west-1": _12,
				"eu-west-2": _12,
				"eu-west-3": _12,
				"il-central-1": _12,
				"me-central-1": _12,
				"me-south-1": _12,
				"sa-east-1": _12,
				"us-east-1": _12,
				"us-east-2": _12,
				"us-west-1": _12,
				"us-west-2": _12,
				"us-gov-east-1": _13,
				"us-gov-west-1": _13
			}],
			"sagemaker": [0, {
				"ap-northeast-1": _15,
				"ap-northeast-2": _15,
				"ap-south-1": _15,
				"ap-southeast-1": _15,
				"ap-southeast-2": _15,
				"ca-central-1": _17,
				"eu-central-1": _15,
				"eu-west-1": _15,
				"eu-west-2": _15,
				"us-east-1": _17,
				"us-east-2": _17,
				"us-west-2": _17,
				"af-south-1": _14,
				"ap-east-1": _14,
				"ap-northeast-3": _14,
				"ap-south-2": _16,
				"ap-southeast-3": _14,
				"ap-southeast-4": _16,
				"ca-west-1": [0, {
					"notebook": _3,
					"notebook-fips": _3
				}],
				"eu-central-2": _14,
				"eu-north-1": _14,
				"eu-south-1": _14,
				"eu-south-2": _14,
				"eu-west-3": _14,
				"il-central-1": _14,
				"me-central-1": _14,
				"me-south-1": _14,
				"sa-east-1": _14,
				"us-gov-east-1": _18,
				"us-gov-west-1": _18,
				"us-west-1": [0, {
					"notebook": _3,
					"notebook-fips": _3,
					"studio": _3
				}],
				"experiments": _6
			}],
			"repost": [0, { "private": _6 }]
		}],
		"axa": _2,
		"azure": _2,
		"baby": _2,
		"baidu": _2,
		"banamex": _2,
		"band": _2,
		"bank": _2,
		"bar": _2,
		"barcelona": _2,
		"barclaycard": _2,
		"barclays": _2,
		"barefoot": _2,
		"bargains": _2,
		"baseball": _2,
		"basketball": [1, {
			"aus": _3,
			"nz": _3
		}],
		"bauhaus": _2,
		"bayern": _2,
		"bbc": _2,
		"bbt": _2,
		"bbva": _2,
		"bcg": _2,
		"bcn": _2,
		"beats": _2,
		"beauty": _2,
		"beer": _2,
		"berlin": _2,
		"best": _2,
		"bestbuy": _2,
		"bet": _2,
		"bharti": _2,
		"bible": _2,
		"bid": _2,
		"bike": _2,
		"bing": _2,
		"bingo": _2,
		"bio": _2,
		"black": _2,
		"blackfriday": _2,
		"blockbuster": _2,
		"blog": _2,
		"bloomberg": _2,
		"blue": _2,
		"bms": _2,
		"bmw": _2,
		"bnpparibas": _2,
		"boats": _2,
		"boehringer": _2,
		"bofa": _2,
		"bom": _2,
		"bond": _2,
		"boo": _2,
		"book": _2,
		"booking": _2,
		"bosch": _2,
		"bostik": _2,
		"boston": _2,
		"bot": _2,
		"boutique": _2,
		"box": _2,
		"bradesco": _2,
		"bridgestone": _2,
		"broadway": _2,
		"broker": _2,
		"brother": _2,
		"brussels": _2,
		"build": [1, {
			"v0": _3,
			"windsurf": _3
		}],
		"builders": [1, { "cloudsite": _3 }],
		"business": _21,
		"buy": _2,
		"buzz": _2,
		"bzh": _2,
		"cab": _2,
		"cafe": _2,
		"cal": _2,
		"call": _2,
		"calvinklein": _2,
		"cam": _2,
		"camera": _2,
		"camp": [1, { "emf": [0, { "at": _3 }] }],
		"canon": _2,
		"capetown": _2,
		"capital": _2,
		"capitalone": _2,
		"car": _2,
		"caravan": _2,
		"cards": _2,
		"care": _2,
		"career": _2,
		"careers": _2,
		"cars": _2,
		"casa": [1, { "nabu": [0, { "ui": _3 }] }],
		"case": _2,
		"cash": _2,
		"casino": _2,
		"catering": _2,
		"catholic": _2,
		"cba": _2,
		"cbn": _2,
		"cbre": _2,
		"center": _2,
		"ceo": _2,
		"cern": _2,
		"cfa": _2,
		"cfd": _2,
		"chanel": _2,
		"channel": _2,
		"charity": _2,
		"chase": _2,
		"chat": _2,
		"cheap": _2,
		"chintai": _2,
		"christmas": _2,
		"chrome": _2,
		"church": _2,
		"cipriani": _2,
		"circle": _2,
		"cisco": _2,
		"citadel": _2,
		"citi": _2,
		"citic": _2,
		"city": _2,
		"claims": _2,
		"cleaning": _2,
		"click": _2,
		"clinic": _2,
		"clinique": _2,
		"clothing": _2,
		"cloud": [1, {
			"convex": _3,
			"elementor": _3,
			"encoway": [0, { "eu": _3 }],
			"statics": _6,
			"ravendb": _3,
			"axarnet": [0, { "es-1": _3 }],
			"diadem": _3,
			"jelastic": [0, { "vip": _3 }],
			"jele": _3,
			"jenv-aruba": [0, {
				"aruba": [0, { "eur": [0, { "it1": _3 }] }],
				"it1": _3
			}],
			"keliweb": [2, { "cs": _3 }],
			"oxa": [2, {
				"tn": _3,
				"uk": _3
			}],
			"primetel": [2, { "uk": _3 }],
			"reclaim": [0, {
				"ca": _3,
				"uk": _3,
				"us": _3
			}],
			"trendhosting": [0, {
				"ch": _3,
				"de": _3
			}],
			"jote": _3,
			"jotelulu": _3,
			"kuleuven": _3,
			"laravel": _3,
			"linkyard": _3,
			"magentosite": _6,
			"matlab": _3,
			"observablehq": _3,
			"perspecta": _3,
			"vapor": _3,
			"on-rancher": _6,
			"scw": [0, {
				"baremetal": [0, {
					"fr-par-1": _3,
					"fr-par-2": _3,
					"nl-ams-1": _3
				}],
				"fr-par": [0, {
					"cockpit": _3,
					"ddl": _3,
					"dtwh": _3,
					"fnc": [2, { "functions": _3 }],
					"ifr": _3,
					"k8s": _23,
					"kafk": _3,
					"mgdb": _3,
					"rdb": _3,
					"s3": _3,
					"s3-website": _3,
					"scbl": _3,
					"whm": _3
				}],
				"instances": [0, {
					"priv": _3,
					"pub": _3
				}],
				"k8s": _3,
				"nl-ams": [0, {
					"cockpit": _3,
					"ddl": _3,
					"dtwh": _3,
					"ifr": _3,
					"k8s": _23,
					"kafk": _3,
					"mgdb": _3,
					"rdb": _3,
					"s3": _3,
					"s3-website": _3,
					"scbl": _3,
					"whm": _3
				}],
				"pl-waw": [0, {
					"cockpit": _3,
					"ddl": _3,
					"dtwh": _3,
					"ifr": _3,
					"k8s": _23,
					"kafk": _3,
					"mgdb": _3,
					"rdb": _3,
					"s3": _3,
					"s3-website": _3,
					"scbl": _3
				}],
				"scalebook": _3,
				"smartlabeling": _3
			}],
			"servebolt": _3,
			"onstackit": [0, { "runs": _3 }],
			"trafficplex": _3,
			"unison-services": _3,
			"urown": _3,
			"voorloper": _3,
			"zap": _3
		}],
		"club": [1, {
			"cloudns": _3,
			"jele": _3,
			"barsy": _3
		}],
		"clubmed": _2,
		"coach": _2,
		"codes": [1, { "owo": _6 }],
		"coffee": _2,
		"college": _2,
		"cologne": _2,
		"commbank": _2,
		"community": [1, {
			"nog": _3,
			"ravendb": _3,
			"myforum": _3
		}],
		"company": _2,
		"compare": _2,
		"computer": _2,
		"comsec": _2,
		"condos": _2,
		"construction": _2,
		"consulting": _2,
		"contact": _2,
		"contractors": _2,
		"cooking": _2,
		"cool": [1, {
			"elementor": _3,
			"de": _3
		}],
		"corsica": _2,
		"country": _2,
		"coupon": _2,
		"coupons": _2,
		"courses": _2,
		"cpa": _2,
		"credit": _2,
		"creditcard": _2,
		"creditunion": _2,
		"cricket": _2,
		"crown": _2,
		"crs": _2,
		"cruise": _2,
		"cruises": _2,
		"cuisinella": _2,
		"cymru": _2,
		"cyou": _2,
		"dad": _2,
		"dance": _2,
		"data": _2,
		"date": _2,
		"dating": _2,
		"datsun": _2,
		"day": _2,
		"dclk": _2,
		"dds": _2,
		"deal": _2,
		"dealer": _2,
		"deals": _2,
		"degree": _2,
		"delivery": _2,
		"dell": _2,
		"deloitte": _2,
		"delta": _2,
		"democrat": _2,
		"dental": _2,
		"dentist": _2,
		"desi": _2,
		"design": [1, {
			"graphic": _3,
			"bss": _3
		}],
		"dev": [1, {
			"12chars": _3,
			"myaddr": _3,
			"panel": _3,
			"lcl": _6,
			"lclstage": _6,
			"stg": _6,
			"stgstage": _6,
			"pages": _3,
			"r2": _3,
			"workers": _3,
			"deno": _3,
			"deno-staging": _3,
			"deta": _3,
			"lp": [2, {
				"api": _3,
				"objects": _3
			}],
			"evervault": _8,
			"fly": _3,
			"githubpreview": _3,
			"gateway": _6,
			"botdash": _3,
			"inbrowser": _6,
			"is-a-good": _3,
			"iserv": _3,
			"leapcell": _3,
			"runcontainers": _3,
			"localcert": [0, { "user": _6 }],
			"loginline": _3,
			"barsy": _3,
			"mediatech": _3,
			"modx": _3,
			"ngrok": _3,
			"ngrok-free": _3,
			"is-a-fullstack": _3,
			"is-cool": _3,
			"is-not-a": _3,
			"localplayer": _3,
			"xmit": _3,
			"platter-app": _3,
			"replit": [2, {
				"archer": _3,
				"bones": _3,
				"canary": _3,
				"global": _3,
				"hacker": _3,
				"id": _3,
				"janeway": _3,
				"kim": _3,
				"kira": _3,
				"kirk": _3,
				"odo": _3,
				"paris": _3,
				"picard": _3,
				"pike": _3,
				"prerelease": _3,
				"reed": _3,
				"riker": _3,
				"sisko": _3,
				"spock": _3,
				"staging": _3,
				"sulu": _3,
				"tarpit": _3,
				"teams": _3,
				"tucker": _3,
				"wesley": _3,
				"worf": _3
			}],
			"crm": [0, {
				"d": _6,
				"w": _6,
				"wa": _6,
				"wb": _6,
				"wc": _6,
				"wd": _6,
				"we": _6,
				"wf": _6
			}],
			"erp": _50,
			"vercel": _3,
			"webhare": _6,
			"hrsn": _3,
			"is-a": _3
		}],
		"dhl": _2,
		"diamonds": _2,
		"diet": _2,
		"digital": [1, { "cloudapps": [2, { "london": _3 }] }],
		"direct": [1, { "libp2p": _3 }],
		"directory": _2,
		"discount": _2,
		"discover": _2,
		"dish": _2,
		"diy": _2,
		"dnp": _2,
		"docs": _2,
		"doctor": _2,
		"dog": _2,
		"domains": _2,
		"dot": _2,
		"download": _2,
		"drive": _2,
		"dtv": _2,
		"dubai": _2,
		"dunlop": _2,
		"dupont": _2,
		"durban": _2,
		"dvag": _2,
		"dvr": _2,
		"earth": _2,
		"eat": _2,
		"eco": _2,
		"edeka": _2,
		"education": _21,
		"email": [1, {
			"crisp": [0, { "on": _3 }],
			"tawk": _52,
			"tawkto": _52
		}],
		"emerck": _2,
		"energy": _2,
		"engineer": _2,
		"engineering": _2,
		"enterprises": _2,
		"epson": _2,
		"equipment": _2,
		"ericsson": _2,
		"erni": _2,
		"esq": _2,
		"estate": [1, { "compute": _6 }],
		"eurovision": _2,
		"eus": [1, { "party": _53 }],
		"events": [1, {
			"koobin": _3,
			"co": _3
		}],
		"exchange": _2,
		"expert": _2,
		"exposed": _2,
		"express": _2,
		"extraspace": _2,
		"fage": _2,
		"fail": _2,
		"fairwinds": _2,
		"faith": _2,
		"family": _2,
		"fan": _2,
		"fans": _2,
		"farm": [1, { "storj": _3 }],
		"farmers": _2,
		"fashion": _2,
		"fast": _2,
		"fedex": _2,
		"feedback": _2,
		"ferrari": _2,
		"ferrero": _2,
		"fidelity": _2,
		"fido": _2,
		"film": _2,
		"final": _2,
		"finance": _2,
		"financial": _21,
		"fire": _2,
		"firestone": _2,
		"firmdale": _2,
		"fish": _2,
		"fishing": _2,
		"fit": _2,
		"fitness": _2,
		"flickr": _2,
		"flights": _2,
		"flir": _2,
		"florist": _2,
		"flowers": _2,
		"fly": _2,
		"foo": _2,
		"food": _2,
		"football": _2,
		"ford": _2,
		"forex": _2,
		"forsale": _2,
		"forum": _2,
		"foundation": _2,
		"fox": _2,
		"free": _2,
		"fresenius": _2,
		"frl": _2,
		"frogans": _2,
		"frontier": _2,
		"ftr": _2,
		"fujitsu": _2,
		"fun": _2,
		"fund": _2,
		"furniture": _2,
		"futbol": _2,
		"fyi": _2,
		"gal": _2,
		"gallery": _2,
		"gallo": _2,
		"gallup": _2,
		"game": _2,
		"games": [1, {
			"pley": _3,
			"sheezy": _3
		}],
		"gap": _2,
		"garden": _2,
		"gay": [1, { "pages": _3 }],
		"gbiz": _2,
		"gdn": [1, { "cnpy": _3 }],
		"gea": _2,
		"gent": _2,
		"genting": _2,
		"george": _2,
		"ggee": _2,
		"gift": _2,
		"gifts": _2,
		"gives": _2,
		"giving": _2,
		"glass": _2,
		"gle": _2,
		"global": [1, { "appwrite": _3 }],
		"globo": _2,
		"gmail": _2,
		"gmbh": _2,
		"gmo": _2,
		"gmx": _2,
		"godaddy": _2,
		"gold": _2,
		"goldpoint": _2,
		"golf": _2,
		"goo": _2,
		"goodyear": _2,
		"goog": [1, {
			"cloud": _3,
			"translate": _3,
			"usercontent": _6
		}],
		"google": _2,
		"gop": _2,
		"got": _2,
		"grainger": _2,
		"graphics": _2,
		"gratis": _2,
		"green": _2,
		"gripe": _2,
		"grocery": _2,
		"group": [1, { "discourse": _3 }],
		"gucci": _2,
		"guge": _2,
		"guide": _2,
		"guitars": _2,
		"guru": _2,
		"hair": _2,
		"hamburg": _2,
		"hangout": _2,
		"haus": _2,
		"hbo": _2,
		"hdfc": _2,
		"hdfcbank": _2,
		"health": [1, { "hra": _3 }],
		"healthcare": _2,
		"help": _2,
		"helsinki": _2,
		"here": _2,
		"hermes": _2,
		"hiphop": _2,
		"hisamitsu": _2,
		"hitachi": _2,
		"hiv": _2,
		"hkt": _2,
		"hockey": _2,
		"holdings": _2,
		"holiday": _2,
		"homedepot": _2,
		"homegoods": _2,
		"homes": _2,
		"homesense": _2,
		"honda": _2,
		"horse": _2,
		"hospital": _2,
		"host": [1, {
			"cloudaccess": _3,
			"freesite": _3,
			"easypanel": _3,
			"fastvps": _3,
			"myfast": _3,
			"tempurl": _3,
			"wpmudev": _3,
			"iserv": _3,
			"jele": _3,
			"mircloud": _3,
			"bolt": _3,
			"wp2": _3,
			"half": _3
		}],
		"hosting": [1, { "opencraft": _3 }],
		"hot": _2,
		"hotel": _2,
		"hotels": _2,
		"hotmail": _2,
		"house": _2,
		"how": _2,
		"hsbc": _2,
		"hughes": _2,
		"hyatt": _2,
		"hyundai": _2,
		"ibm": _2,
		"icbc": _2,
		"ice": _2,
		"icu": _2,
		"ieee": _2,
		"ifm": _2,
		"ikano": _2,
		"imamat": _2,
		"imdb": _2,
		"immo": _2,
		"immobilien": _2,
		"inc": _2,
		"industries": _2,
		"infiniti": _2,
		"ing": _2,
		"ink": _2,
		"institute": _2,
		"insurance": _2,
		"insure": _2,
		"international": _2,
		"intuit": _2,
		"investments": _2,
		"ipiranga": _2,
		"irish": _2,
		"ismaili": _2,
		"ist": _2,
		"istanbul": _2,
		"itau": _2,
		"itv": _2,
		"jaguar": _2,
		"java": _2,
		"jcb": _2,
		"jeep": _2,
		"jetzt": _2,
		"jewelry": _2,
		"jio": _2,
		"jll": _2,
		"jmp": _2,
		"jnj": _2,
		"joburg": _2,
		"jot": _2,
		"joy": _2,
		"jpmorgan": _2,
		"jprs": _2,
		"juegos": _2,
		"juniper": _2,
		"kaufen": _2,
		"kddi": _2,
		"kerryhotels": _2,
		"kerryproperties": _2,
		"kfh": _2,
		"kia": _2,
		"kids": _2,
		"kim": _2,
		"kindle": _2,
		"kitchen": _2,
		"kiwi": _2,
		"koeln": _2,
		"komatsu": _2,
		"kosher": _2,
		"kpmg": _2,
		"kpn": _2,
		"krd": [1, {
			"co": _3,
			"edu": _3
		}],
		"kred": _2,
		"kuokgroup": _2,
		"kyoto": _2,
		"lacaixa": _2,
		"lamborghini": _2,
		"lamer": _2,
		"land": _2,
		"landrover": _2,
		"lanxess": _2,
		"lasalle": _2,
		"lat": _2,
		"latino": _2,
		"latrobe": _2,
		"law": _2,
		"lawyer": _2,
		"lds": _2,
		"lease": _2,
		"leclerc": _2,
		"lefrak": _2,
		"legal": _2,
		"lego": _2,
		"lexus": _2,
		"lgbt": _2,
		"lidl": _2,
		"life": _2,
		"lifeinsurance": _2,
		"lifestyle": _2,
		"lighting": _2,
		"like": _2,
		"lilly": _2,
		"limited": _2,
		"limo": _2,
		"lincoln": _2,
		"link": [1, {
			"myfritz": _3,
			"cyon": _3,
			"dweb": _6,
			"inbrowser": _6,
			"nftstorage": _60,
			"mypep": _3,
			"storacha": _60,
			"w3s": _60
		}],
		"live": [1, {
			"aem": _3,
			"hlx": _3,
			"ewp": _6
		}],
		"living": _2,
		"llc": _2,
		"llp": _2,
		"loan": _2,
		"loans": _2,
		"locker": _2,
		"locus": _2,
		"lol": [1, { "omg": _3 }],
		"london": _2,
		"lotte": _2,
		"lotto": _2,
		"love": _2,
		"lpl": _2,
		"lplfinancial": _2,
		"ltd": _2,
		"ltda": _2,
		"lundbeck": _2,
		"luxe": _2,
		"luxury": _2,
		"madrid": _2,
		"maif": _2,
		"maison": _2,
		"makeup": _2,
		"man": _2,
		"management": _2,
		"mango": _2,
		"map": _2,
		"market": _2,
		"marketing": _2,
		"markets": _2,
		"marriott": _2,
		"marshalls": _2,
		"mattel": _2,
		"mba": _2,
		"mckinsey": _2,
		"med": _2,
		"media": _61,
		"meet": _2,
		"melbourne": _2,
		"meme": _2,
		"memorial": _2,
		"men": _2,
		"menu": [1, {
			"barsy": _3,
			"barsyonline": _3
		}],
		"merck": _2,
		"merckmsd": _2,
		"miami": _2,
		"microsoft": _2,
		"mini": _2,
		"mint": _2,
		"mit": _2,
		"mitsubishi": _2,
		"mlb": _2,
		"mls": _2,
		"mma": _2,
		"mobile": _2,
		"moda": _2,
		"moe": _2,
		"moi": _2,
		"mom": _2,
		"monash": _2,
		"money": _2,
		"monster": _2,
		"mormon": _2,
		"mortgage": _2,
		"moscow": _2,
		"moto": _2,
		"motorcycles": _2,
		"mov": _2,
		"movie": _2,
		"msd": _2,
		"mtn": _2,
		"mtr": _2,
		"music": _2,
		"nab": _2,
		"nagoya": _2,
		"navy": _2,
		"nba": _2,
		"nec": _2,
		"netbank": _2,
		"netflix": _2,
		"network": [1, {
			"aem": _3,
			"alces": _6,
			"co": _3,
			"arvo": _3,
			"azimuth": _3,
			"tlon": _3
		}],
		"neustar": _2,
		"new": _2,
		"news": [1, { "noticeable": _3 }],
		"next": _2,
		"nextdirect": _2,
		"nexus": _2,
		"nfl": _2,
		"ngo": _2,
		"nhk": _2,
		"nico": _2,
		"nike": _2,
		"nikon": _2,
		"ninja": _2,
		"nissan": _2,
		"nissay": _2,
		"nokia": _2,
		"norton": _2,
		"now": _2,
		"nowruz": _2,
		"nowtv": _2,
		"nra": _2,
		"nrw": _2,
		"ntt": _2,
		"nyc": _2,
		"obi": _2,
		"observer": _2,
		"office": _2,
		"okinawa": _2,
		"olayan": _2,
		"olayangroup": _2,
		"ollo": _2,
		"omega": _2,
		"one": [1, {
			"kin": _6,
			"service": _3
		}],
		"ong": [1, { "obl": _3 }],
		"onl": _2,
		"online": [1, {
			"eero": _3,
			"eero-stage": _3,
			"websitebuilder": _3,
			"leapcell": _3,
			"barsy": _3
		}],
		"ooo": _2,
		"open": _2,
		"oracle": _2,
		"orange": [1, { "tech": _3 }],
		"organic": _2,
		"origins": _2,
		"osaka": _2,
		"otsuka": _2,
		"ott": _2,
		"ovh": [1, { "nerdpol": _3 }],
		"page": [1, {
			"aem": _3,
			"hlx": _3,
			"translated": _3,
			"codeberg": _3,
			"heyflow": _3,
			"prvcy": _3,
			"rocky": _3,
			"pdns": _3,
			"plesk": _3
		}],
		"panasonic": _2,
		"paris": _2,
		"pars": _2,
		"partners": _2,
		"parts": _2,
		"party": _2,
		"pay": _2,
		"pccw": _2,
		"pet": _2,
		"pfizer": _2,
		"pharmacy": _2,
		"phd": _2,
		"philips": _2,
		"phone": _2,
		"photo": _2,
		"photography": _2,
		"photos": _61,
		"physio": _2,
		"pics": _2,
		"pictet": _2,
		"pictures": [1, { "1337": _3 }],
		"pid": _2,
		"pin": _2,
		"ping": _2,
		"pink": _2,
		"pioneer": _2,
		"pizza": [1, { "ngrok": _3 }],
		"place": _21,
		"play": _2,
		"playstation": _2,
		"plumbing": _2,
		"plus": _2,
		"pnc": _2,
		"pohl": _2,
		"poker": _2,
		"politie": _2,
		"porn": _2,
		"praxi": _2,
		"press": _2,
		"prime": _2,
		"prod": _2,
		"productions": _2,
		"prof": _2,
		"progressive": _2,
		"promo": _2,
		"properties": _2,
		"property": _2,
		"protection": _2,
		"pru": _2,
		"prudential": _2,
		"pub": [1, {
			"id": _6,
			"kin": _6,
			"barsy": _3
		}],
		"pwc": _2,
		"qpon": _2,
		"quebec": _2,
		"quest": _2,
		"racing": _2,
		"radio": _2,
		"read": _2,
		"realestate": _2,
		"realtor": _2,
		"realty": _2,
		"recipes": _2,
		"red": _2,
		"redumbrella": _2,
		"rehab": _2,
		"reise": _2,
		"reisen": _2,
		"reit": _2,
		"reliance": _2,
		"ren": _2,
		"rent": _2,
		"rentals": _2,
		"repair": _2,
		"report": _2,
		"republican": _2,
		"rest": _2,
		"restaurant": _2,
		"review": _2,
		"reviews": [1, { "aem": _3 }],
		"rexroth": _2,
		"rich": _2,
		"richardli": _2,
		"ricoh": _2,
		"ril": _2,
		"rio": _2,
		"rip": [1, { "clan": _3 }],
		"rocks": [1, {
			"myddns": _3,
			"stackit": _3,
			"lima-city": _3,
			"webspace": _3
		}],
		"rodeo": _2,
		"rogers": _2,
		"room": _2,
		"rsvp": _2,
		"rugby": _2,
		"ruhr": _2,
		"run": [1, {
			"appwrite": _6,
			"canva": _3,
			"development": _3,
			"ravendb": _3,
			"liara": [2, { "iran": _3 }],
			"lovable": _3,
			"build": _6,
			"code": _6,
			"database": _6,
			"migration": _6,
			"onporter": _3,
			"repl": _3,
			"stackit": _3,
			"val": _50,
			"vercel": _3,
			"wix": _3
		}],
		"rwe": _2,
		"ryukyu": _2,
		"saarland": _2,
		"safe": _2,
		"safety": _2,
		"sakura": _2,
		"sale": _2,
		"salon": _2,
		"samsclub": _2,
		"samsung": _2,
		"sandvik": _2,
		"sandvikcoromant": _2,
		"sanofi": _2,
		"sap": _2,
		"sarl": _2,
		"sas": _2,
		"save": _2,
		"saxo": _2,
		"sbi": _2,
		"sbs": _2,
		"scb": _2,
		"schaeffler": _2,
		"schmidt": _2,
		"scholarships": _2,
		"school": _2,
		"schule": _2,
		"schwarz": _2,
		"science": _2,
		"scot": [1, { "gov": [2, { "service": _3 }] }],
		"search": _2,
		"seat": _2,
		"secure": _2,
		"security": _2,
		"seek": _2,
		"select": _2,
		"sener": _2,
		"services": [1, { "loginline": _3 }],
		"seven": _2,
		"sew": _2,
		"sex": _2,
		"sexy": _2,
		"sfr": _2,
		"shangrila": _2,
		"sharp": _2,
		"shell": _2,
		"shia": _2,
		"shiksha": _2,
		"shoes": _2,
		"shop": [1, {
			"base": _3,
			"hoplix": _3,
			"barsy": _3,
			"barsyonline": _3,
			"shopware": _3
		}],
		"shopping": _2,
		"shouji": _2,
		"show": _2,
		"silk": _2,
		"sina": _2,
		"singles": _2,
		"site": [1, {
			"square": _3,
			"canva": _24,
			"cloudera": _6,
			"convex": _3,
			"cyon": _3,
			"caffeine": _3,
			"fastvps": _3,
			"figma": _3,
			"preview": _3,
			"heyflow": _3,
			"jele": _3,
			"jouwweb": _3,
			"loginline": _3,
			"barsy": _3,
			"notion": _3,
			"omniwe": _3,
			"opensocial": _3,
			"madethis": _3,
			"support": _3,
			"platformsh": _6,
			"tst": _6,
			"byen": _3,
			"srht": _3,
			"novecore": _3,
			"cpanel": _3,
			"wpsquared": _3,
			"sourcecraft": _3
		}],
		"ski": _2,
		"skin": _2,
		"sky": _2,
		"skype": _2,
		"sling": _2,
		"smart": _2,
		"smile": _2,
		"sncf": _2,
		"soccer": _2,
		"social": _2,
		"softbank": _2,
		"software": _2,
		"sohu": _2,
		"solar": _2,
		"solutions": _2,
		"song": _2,
		"sony": _2,
		"soy": _2,
		"spa": _2,
		"space": [1, {
			"myfast": _3,
			"heiyu": _3,
			"hf": [2, { "static": _3 }],
			"app-ionos": _3,
			"project": _3,
			"uber": _3,
			"xs4all": _3
		}],
		"sport": _2,
		"spot": _2,
		"srl": _2,
		"stada": _2,
		"staples": _2,
		"star": _2,
		"statebank": _2,
		"statefarm": _2,
		"stc": _2,
		"stcgroup": _2,
		"stockholm": _2,
		"storage": _2,
		"store": [1, {
			"barsy": _3,
			"sellfy": _3,
			"shopware": _3,
			"storebase": _3
		}],
		"stream": _2,
		"studio": _2,
		"study": _2,
		"style": _2,
		"sucks": _2,
		"supplies": _2,
		"supply": _2,
		"support": [1, { "barsy": _3 }],
		"surf": _2,
		"surgery": _2,
		"suzuki": _2,
		"swatch": _2,
		"swiss": _2,
		"sydney": _2,
		"systems": [1, { "knightpoint": _3 }],
		"tab": _2,
		"taipei": _2,
		"talk": _2,
		"taobao": _2,
		"target": _2,
		"tatamotors": _2,
		"tatar": _2,
		"tattoo": _2,
		"tax": _2,
		"taxi": _2,
		"tci": _2,
		"tdk": _2,
		"team": [1, {
			"discourse": _3,
			"jelastic": _3
		}],
		"tech": [1, { "cleverapps": _3 }],
		"technology": _21,
		"temasek": _2,
		"tennis": _2,
		"teva": _2,
		"thd": _2,
		"theater": _2,
		"theatre": _2,
		"tiaa": _2,
		"tickets": _2,
		"tienda": _2,
		"tips": _2,
		"tires": _2,
		"tirol": _2,
		"tjmaxx": _2,
		"tjx": _2,
		"tkmaxx": _2,
		"tmall": _2,
		"today": [1, { "prequalifyme": _3 }],
		"tokyo": _2,
		"tools": [1, {
			"addr": _49,
			"myaddr": _3
		}],
		"top": [1, {
			"ntdll": _3,
			"wadl": _6
		}],
		"toray": _2,
		"toshiba": _2,
		"total": _2,
		"tours": _2,
		"town": _2,
		"toyota": _2,
		"toys": _2,
		"trade": _2,
		"trading": _2,
		"training": _2,
		"travel": _2,
		"travelers": _2,
		"travelersinsurance": _2,
		"trust": _2,
		"trv": _2,
		"tube": _2,
		"tui": _2,
		"tunes": _2,
		"tushu": _2,
		"tvs": _2,
		"ubank": _2,
		"ubs": _2,
		"unicom": _2,
		"university": _2,
		"uno": _2,
		"uol": _2,
		"ups": _2,
		"vacations": _2,
		"vana": _2,
		"vanguard": _2,
		"vegas": _2,
		"ventures": _2,
		"verisign": _2,
		"versicherung": _2,
		"vet": _2,
		"viajes": _2,
		"video": _2,
		"vig": _2,
		"viking": _2,
		"villas": _2,
		"vin": _2,
		"vip": [1, { "hidns": _3 }],
		"virgin": _2,
		"visa": _2,
		"vision": _2,
		"viva": _2,
		"vivo": _2,
		"vlaanderen": _2,
		"vodka": _2,
		"volvo": _2,
		"vote": _2,
		"voting": _2,
		"voto": _2,
		"voyage": _2,
		"wales": _2,
		"walmart": _2,
		"walter": _2,
		"wang": _2,
		"wanggou": _2,
		"watch": _2,
		"watches": _2,
		"weather": _2,
		"weatherchannel": _2,
		"webcam": _2,
		"weber": _2,
		"website": _61,
		"wed": _2,
		"wedding": _2,
		"weibo": _2,
		"weir": _2,
		"whoswho": _2,
		"wien": _2,
		"wiki": _61,
		"williamhill": _2,
		"win": _2,
		"windows": _2,
		"wine": _2,
		"winners": _2,
		"wme": _2,
		"wolterskluwer": _2,
		"woodside": _2,
		"work": _2,
		"works": _2,
		"world": _2,
		"wow": _2,
		"wtc": _2,
		"wtf": _2,
		"xbox": _2,
		"xerox": _2,
		"xihuan": _2,
		"xin": _2,
		"xn--11b4c3d": _2,
		"कॉम": _2,
		"xn--1ck2e1b": _2,
		"セール": _2,
		"xn--1qqw23a": _2,
		"佛山": _2,
		"xn--30rr7y": _2,
		"慈善": _2,
		"xn--3bst00m": _2,
		"集团": _2,
		"xn--3ds443g": _2,
		"在线": _2,
		"xn--3pxu8k": _2,
		"点看": _2,
		"xn--42c2d9a": _2,
		"คอม": _2,
		"xn--45q11c": _2,
		"八卦": _2,
		"xn--4gbrim": _2,
		"موقع": _2,
		"xn--55qw42g": _2,
		"公益": _2,
		"xn--55qx5d": _2,
		"公司": _2,
		"xn--5su34j936bgsg": _2,
		"香格里拉": _2,
		"xn--5tzm5g": _2,
		"网站": _2,
		"xn--6frz82g": _2,
		"移动": _2,
		"xn--6qq986b3xl": _2,
		"我爱你": _2,
		"xn--80adxhks": _2,
		"москва": _2,
		"xn--80aqecdr1a": _2,
		"католик": _2,
		"xn--80asehdb": _2,
		"онлайн": _2,
		"xn--80aswg": _2,
		"сайт": _2,
		"xn--8y0a063a": _2,
		"联通": _2,
		"xn--9dbq2a": _2,
		"קום": _2,
		"xn--9et52u": _2,
		"时尚": _2,
		"xn--9krt00a": _2,
		"微博": _2,
		"xn--b4w605ferd": _2,
		"淡马锡": _2,
		"xn--bck1b9a5dre4c": _2,
		"ファッション": _2,
		"xn--c1avg": _2,
		"орг": _2,
		"xn--c2br7g": _2,
		"नेट": _2,
		"xn--cck2b3b": _2,
		"ストア": _2,
		"xn--cckwcxetd": _2,
		"アマゾン": _2,
		"xn--cg4bki": _2,
		"삼성": _2,
		"xn--czr694b": _2,
		"商标": _2,
		"xn--czrs0t": _2,
		"商店": _2,
		"xn--czru2d": _2,
		"商城": _2,
		"xn--d1acj3b": _2,
		"дети": _2,
		"xn--eckvdtc9d": _2,
		"ポイント": _2,
		"xn--efvy88h": _2,
		"新闻": _2,
		"xn--fct429k": _2,
		"家電": _2,
		"xn--fhbei": _2,
		"كوم": _2,
		"xn--fiq228c5hs": _2,
		"中文网": _2,
		"xn--fiq64b": _2,
		"中信": _2,
		"xn--fjq720a": _2,
		"娱乐": _2,
		"xn--flw351e": _2,
		"谷歌": _2,
		"xn--fzys8d69uvgm": _2,
		"電訊盈科": _2,
		"xn--g2xx48c": _2,
		"购物": _2,
		"xn--gckr3f0f": _2,
		"クラウド": _2,
		"xn--gk3at1e": _2,
		"通販": _2,
		"xn--hxt814e": _2,
		"网店": _2,
		"xn--i1b6b1a6a2e": _2,
		"संगठन": _2,
		"xn--imr513n": _2,
		"餐厅": _2,
		"xn--io0a7i": _2,
		"网络": _2,
		"xn--j1aef": _2,
		"ком": _2,
		"xn--jlq480n2rg": _2,
		"亚马逊": _2,
		"xn--jvr189m": _2,
		"食品": _2,
		"xn--kcrx77d1x4a": _2,
		"飞利浦": _2,
		"xn--kput3i": _2,
		"手机": _2,
		"xn--mgba3a3ejt": _2,
		"ارامكو": _2,
		"xn--mgba7c0bbn0a": _2,
		"العليان": _2,
		"xn--mgbab2bd": _2,
		"بازار": _2,
		"xn--mgbca7dzdo": _2,
		"ابوظبي": _2,
		"xn--mgbi4ecexp": _2,
		"كاثوليك": _2,
		"xn--mgbt3dhd": _2,
		"همراه": _2,
		"xn--mk1bu44c": _2,
		"닷컴": _2,
		"xn--mxtq1m": _2,
		"政府": _2,
		"xn--ngbc5azd": _2,
		"شبكة": _2,
		"xn--ngbe9e0a": _2,
		"بيتك": _2,
		"xn--ngbrx": _2,
		"عرب": _2,
		"xn--nqv7f": _2,
		"机构": _2,
		"xn--nqv7fs00ema": _2,
		"组织机构": _2,
		"xn--nyqy26a": _2,
		"健康": _2,
		"xn--otu796d": _2,
		"招聘": _2,
		"xn--p1acf": [1, {
			"xn--90amc": _3,
			"xn--j1aef": _3,
			"xn--j1ael8b": _3,
			"xn--h1ahn": _3,
			"xn--j1adp": _3,
			"xn--c1avg": _3,
			"xn--80aaa0cvac": _3,
			"xn--h1aliz": _3,
			"xn--90a1af": _3,
			"xn--41a": _3
		}],
		"рус": [1, {
			"биз": _3,
			"ком": _3,
			"крым": _3,
			"мир": _3,
			"мск": _3,
			"орг": _3,
			"самара": _3,
			"сочи": _3,
			"спб": _3,
			"я": _3
		}],
		"xn--pssy2u": _2,
		"大拿": _2,
		"xn--q9jyb4c": _2,
		"みんな": _2,
		"xn--qcka1pmc": _2,
		"グーグル": _2,
		"xn--rhqv96g": _2,
		"世界": _2,
		"xn--rovu88b": _2,
		"書籍": _2,
		"xn--ses554g": _2,
		"网址": _2,
		"xn--t60b56a": _2,
		"닷넷": _2,
		"xn--tckwe": _2,
		"コム": _2,
		"xn--tiq49xqyj": _2,
		"天主教": _2,
		"xn--unup4y": _2,
		"游戏": _2,
		"xn--vermgensberater-ctb": _2,
		"vermögensberater": _2,
		"xn--vermgensberatung-pwb": _2,
		"vermögensberatung": _2,
		"xn--vhquv": _2,
		"企业": _2,
		"xn--vuq861b": _2,
		"信息": _2,
		"xn--w4r85el8fhu5dnra": _2,
		"嘉里大酒店": _2,
		"xn--w4rs40l": _2,
		"嘉里": _2,
		"xn--xhq521b": _2,
		"广东": _2,
		"xn--zfr164b": _2,
		"政务": _2,
		"xyz": [1, {
			"botdash": _3,
			"telebit": _6
		}],
		"yachts": _2,
		"yahoo": _2,
		"yamaxun": _2,
		"yandex": _2,
		"yodobashi": _2,
		"yoga": _2,
		"yokohama": _2,
		"you": _2,
		"youtube": _2,
		"yun": _2,
		"zappos": _2,
		"zara": _2,
		"zero": _2,
		"zip": _2,
		"zone": [1, {
			"triton": _6,
			"stackit": _3,
			"lima": _3
		}],
		"zuerich": _2
	}];
})();
var RULE_TYPE = /* @__PURE__ */ function(RULE_TYPE$1) {
	RULE_TYPE$1[RULE_TYPE$1["ICANN"] = 1] = "ICANN";
	RULE_TYPE$1[RULE_TYPE$1["PRIVATE"] = 2] = "PRIVATE";
	return RULE_TYPE$1;
}(RULE_TYPE || {});
/**
* Lookup parts of domain in Trie
*/
function lookupInTrie(parts, trie, index, allowedMask) {
	let result = null;
	let node = trie;
	while (node !== void 0) {
		if ((node[0] & allowedMask) !== 0) result = {
			index: index + 1,
			isIcann: node[0] === RULE_TYPE.ICANN,
			isPrivate: node[0] === RULE_TYPE.PRIVATE
		};
		if (index === -1) break;
		const succ = node[1];
		node = Object.prototype.hasOwnProperty.call(succ, parts[index]) ? succ[parts[index]] : succ["*"];
		index -= 1;
	}
	return result;
}
/**
* Check if `hostname` has a valid public suffix in `trie`.
*/
function suffixLookup(hostname, options, out) {
	if (fast_path_default(hostname, options, out)) return;
	const hostnameParts = hostname.split(".");
	const allowedMask = (options.allowPrivateDomains ? RULE_TYPE.PRIVATE : 0) | (options.allowIcannDomains ? RULE_TYPE.ICANN : 0);
	const exceptionMatch = lookupInTrie(hostnameParts, exceptions, hostnameParts.length - 1, allowedMask);
	if (exceptionMatch !== null) {
		out.isIcann = exceptionMatch.isIcann;
		out.isPrivate = exceptionMatch.isPrivate;
		out.publicSuffix = hostnameParts.slice(exceptionMatch.index + 1).join(".");
		return;
	}
	const rulesMatch = lookupInTrie(hostnameParts, rules, hostnameParts.length - 1, allowedMask);
	if (rulesMatch !== null) {
		out.isIcann = rulesMatch.isIcann;
		out.isPrivate = rulesMatch.isPrivate;
		out.publicSuffix = hostnameParts.slice(rulesMatch.index).join(".");
		return;
	}
	out.isIcann = false;
	out.isPrivate = false;
	out.publicSuffix = hostnameParts[hostnameParts.length - 1] ?? null;
}
const RESULT = getEmptyResult();
function getDomain(url, options = {}) {
	resetResult(RESULT);
	return parseImpl(url, FLAG.DOMAIN, suffixLookup, options, RESULT).domain;
}
function pathMatch(reqPath, cookiePath) {
	if (cookiePath === reqPath) return true;
	if (reqPath.indexOf(cookiePath) === 0) {
		if (cookiePath[cookiePath.length - 1] === "/") return true;
		if (reqPath.startsWith(cookiePath) && reqPath[cookiePath.length] === "/") return true;
	}
	return false;
}
var SPECIAL_USE_DOMAINS = [
	"local",
	"example",
	"invalid",
	"localhost",
	"test"
];
var SPECIAL_TREATMENT_DOMAINS = ["localhost", "invalid"];
var defaultGetPublicSuffixOptions = {
	allowSpecialUseDomain: false,
	ignoreError: false
};
function getPublicSuffix(domain, options = {}) {
	options = {
		...defaultGetPublicSuffixOptions,
		...options
	};
	const domainParts = domain.split(".");
	const topLevelDomain = domainParts[domainParts.length - 1];
	const allowSpecialUseDomain = !!options.allowSpecialUseDomain;
	const ignoreError = !!options.ignoreError;
	if (allowSpecialUseDomain && topLevelDomain !== void 0 && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
		if (domainParts.length > 1) return `${domainParts[domainParts.length - 2]}.${topLevelDomain}`;
		else if (SPECIAL_TREATMENT_DOMAINS.includes(topLevelDomain)) return topLevelDomain;
	}
	if (!ignoreError && topLevelDomain !== void 0 && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) throw new Error(`Cookie has domain set to the public suffix "${topLevelDomain}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain: true, rejectPublicSuffixes: false}.`);
	const publicSuffix = getDomain(domain, {
		allowIcannDomains: true,
		allowPrivateDomains: true
	});
	if (publicSuffix) return publicSuffix;
}
function permuteDomain(domain, allowSpecialUseDomain) {
	const pubSuf = getPublicSuffix(domain, { allowSpecialUseDomain });
	if (!pubSuf) return;
	if (pubSuf == domain) return [domain];
	if (domain.slice(-1) == ".") domain = domain.slice(0, -1);
	const parts = domain.slice(0, -(pubSuf.length + 1)).split(".").reverse();
	let cur = pubSuf;
	const permutations = [cur];
	while (parts.length) {
		cur = `${parts.shift()}.${cur}`;
		permutations.push(cur);
	}
	return permutations;
}
var Store = class {
	constructor() {
		this.synchronous = false;
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	findCookie(_domain, _path, _key, _callback) {
		throw new Error("findCookie is not implemented");
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	findCookies(_domain, _path, _allowSpecialUseDomain = false, _callback) {
		throw new Error("findCookies is not implemented");
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	putCookie(_cookie, _callback) {
		throw new Error("putCookie is not implemented");
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	updateCookie(_oldCookie, _newCookie, _callback) {
		throw new Error("updateCookie is not implemented");
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	removeCookie(_domain, _path, _key, _callback) {
		throw new Error("removeCookie is not implemented");
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	removeCookies(_domain, _path, _callback) {
		throw new Error("removeCookies is not implemented");
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	removeAllCookies(_callback) {
		throw new Error("removeAllCookies is not implemented");
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	getAllCookies(_callback) {
		throw new Error("getAllCookies is not implemented (therefore jar cannot be serialized)");
	}
};
var objectToString = (obj) => Object.prototype.toString.call(obj);
var safeArrayToString = (arr, seenArrays) => {
	if (typeof arr.join !== "function") return objectToString(arr);
	seenArrays.add(arr);
	return arr.map((val) => val === null || val === void 0 || seenArrays.has(val) ? "" : safeToStringImpl(val, seenArrays)).join();
};
var safeToStringImpl = (val, seenArrays = /* @__PURE__ */ new WeakSet()) => {
	if (typeof val !== "object" || val === null) return String(val);
	else if (typeof val.toString === "function") return Array.isArray(val) ? safeArrayToString(val, seenArrays) : String(val);
	else return objectToString(val);
};
var safeToString = (val) => safeToStringImpl(val);
function createPromiseCallback(cb) {
	let callback;
	let resolve;
	let reject;
	const promise = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	if (typeof cb === "function") callback = (err, result) => {
		try {
			if (err) cb(err);
			else cb(null, result);
		} catch (e) {
			reject(e instanceof Error ? e : /* @__PURE__ */ new Error());
		}
	};
	else callback = (err, result) => {
		try {
			if (err) reject(err);
			else resolve(result);
		} catch (e) {
			reject(e instanceof Error ? e : /* @__PURE__ */ new Error());
		}
	};
	return {
		promise,
		callback,
		resolve: (value) => {
			callback(null, value);
			return promise;
		},
		reject: (error$1) => {
			callback(error$1);
			return promise;
		}
	};
}
function inOperator(k, o) {
	return k in o;
}
var MemoryCookieStore = class extends Store {
	/**
	* Create a new {@link MemoryCookieStore}.
	*/
	constructor() {
		super();
		this.synchronous = true;
		this.idx = /* @__PURE__ */ Object.create(null);
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	findCookie(domain, path, key, callback) {
		const promiseCallback = createPromiseCallback(callback);
		if (domain == null || path == null || key == null) return promiseCallback.resolve(void 0);
		const result = this.idx[domain]?.[path]?.[key];
		return promiseCallback.resolve(result);
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	findCookies(domain, path, allowSpecialUseDomain = false, callback) {
		if (typeof allowSpecialUseDomain === "function") {
			callback = allowSpecialUseDomain;
			allowSpecialUseDomain = true;
		}
		const results = [];
		const promiseCallback = createPromiseCallback(callback);
		if (!domain) return promiseCallback.resolve([]);
		let pathMatcher;
		if (!path) pathMatcher = function matchAll(domainIndex) {
			for (const curPath in domainIndex) {
				const pathIndex = domainIndex[curPath];
				for (const key in pathIndex) {
					const value = pathIndex[key];
					if (value) results.push(value);
				}
			}
		};
		else pathMatcher = function matchRFC(domainIndex) {
			for (const cookiePath in domainIndex) if (pathMatch(path, cookiePath)) {
				const pathIndex = domainIndex[cookiePath];
				for (const key in pathIndex) {
					const value = pathIndex[key];
					if (value) results.push(value);
				}
			}
		};
		const domains = permuteDomain(domain, allowSpecialUseDomain) || [domain];
		const idx = this.idx;
		domains.forEach((curDomain) => {
			const domainIndex = idx[curDomain];
			if (!domainIndex) return;
			pathMatcher(domainIndex);
		});
		return promiseCallback.resolve(results);
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	putCookie(cookie$1, callback) {
		const promiseCallback = createPromiseCallback(callback);
		const { domain, path, key } = cookie$1;
		if (domain == null || path == null || key == null) return promiseCallback.resolve(void 0);
		const domainEntry = this.idx[domain] ?? /* @__PURE__ */ Object.create(null);
		this.idx[domain] = domainEntry;
		const pathEntry = domainEntry[path] ?? /* @__PURE__ */ Object.create(null);
		domainEntry[path] = pathEntry;
		pathEntry[key] = cookie$1;
		return promiseCallback.resolve(void 0);
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	updateCookie(_oldCookie, newCookie, callback) {
		if (callback) this.putCookie(newCookie, callback);
		else return this.putCookie(newCookie);
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	removeCookie(domain, path, key, callback) {
		const promiseCallback = createPromiseCallback(callback);
		delete this.idx[domain]?.[path]?.[key];
		return promiseCallback.resolve(void 0);
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	removeCookies(domain, path, callback) {
		const promiseCallback = createPromiseCallback(callback);
		const domainEntry = this.idx[domain];
		if (domainEntry) if (path) delete domainEntry[path];
		else delete this.idx[domain];
		return promiseCallback.resolve(void 0);
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	removeAllCookies(callback) {
		const promiseCallback = createPromiseCallback(callback);
		this.idx = /* @__PURE__ */ Object.create(null);
		return promiseCallback.resolve(void 0);
	}
	/**
	* @internal No doc because this is an overload that supports the implementation
	*/
	getAllCookies(callback) {
		const promiseCallback = createPromiseCallback(callback);
		const cookies = [];
		const idx = this.idx;
		Object.keys(idx).forEach((domain) => {
			const domainEntry = idx[domain] ?? {};
			Object.keys(domainEntry).forEach((path) => {
				const pathEntry = domainEntry[path] ?? {};
				Object.keys(pathEntry).forEach((key) => {
					const keyEntry = pathEntry[key];
					if (keyEntry != null) cookies.push(keyEntry);
				});
			});
		});
		cookies.sort((a, b) => {
			return (a.creationIndex || 0) - (b.creationIndex || 0);
		});
		return promiseCallback.resolve(cookies);
	}
};
function isNonEmptyString(data) {
	return isString(data) && data !== "";
}
function isEmptyString(data) {
	return data === "" || data instanceof String && data.toString() === "";
}
function isString(data) {
	return typeof data === "string" || data instanceof String;
}
function isObject(data) {
	return objectToString(data) === "[object Object]";
}
function validate(bool, cbOrMessage, message$3) {
	if (bool) return;
	const cb = typeof cbOrMessage === "function" ? cbOrMessage : void 0;
	let options = typeof cbOrMessage === "function" ? message$3 : cbOrMessage;
	if (!isObject(options)) options = "[object Object]";
	const err = new ParameterError(safeToString(options));
	if (cb) cb(err);
	else throw err;
}
var ParameterError = class extends Error {};
var version = "6.0.0";
var PrefixSecurityEnum = {
	SILENT: "silent",
	STRICT: "strict",
	DISABLED: "unsafe-disabled"
};
Object.freeze(PrefixSecurityEnum);
var IP_V6_REGEX = `
\\[?(?:
(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|
(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|
(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|
(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|
(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?\\]?
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
var IP_V6_REGEX_OBJECT = /* @__PURE__ */ new RegExp(`^${IP_V6_REGEX}$`);
var IP_V4_REGEX_OBJECT = /* @__PURE__ */ new RegExp(`^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$`);
function domainToASCII(domain) {
	return new URL(`http://${domain}`).hostname;
}
function canonicalDomain(domainName) {
	if (domainName == null) return;
	let str = domainName.trim().replace(/^\./, "");
	if (IP_V6_REGEX_OBJECT.test(str)) {
		if (!str.startsWith("[")) str = "[" + str;
		if (!str.endsWith("]")) str = str + "]";
		return domainToASCII(str).slice(1, -1);
	}
	if (/[^\u0001-\u007f]/.test(str)) return domainToASCII(str);
	return str.toLowerCase();
}
function formatDate(date) {
	return date.toUTCString();
}
var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;
var MONTH_TO_NUM = {
	jan: 0,
	feb: 1,
	mar: 2,
	apr: 3,
	may: 4,
	jun: 5,
	jul: 6,
	aug: 7,
	sep: 8,
	oct: 9,
	nov: 10,
	dec: 11
};
function parseDigits(token, minDigits, maxDigits, trailingOK) {
	let count = 0;
	while (count < token.length) {
		const c = token.charCodeAt(count);
		if (c <= 47 || c >= 58) break;
		count++;
	}
	if (count < minDigits || count > maxDigits) return;
	if (!trailingOK && count != token.length) return;
	return parseInt(token.slice(0, count), 10);
}
function parseTime(token) {
	const parts = token.split(":");
	const result = [
		0,
		0,
		0
	];
	if (parts.length !== 3) return;
	for (let i = 0; i < 3; i++) {
		const trailingOK = i == 2;
		const numPart = parts[i];
		if (numPart === void 0) return;
		const num = parseDigits(numPart, 1, 2, trailingOK);
		if (num === void 0) return;
		result[i] = num;
	}
	return result;
}
function parseMonth(token) {
	token = String(token).slice(0, 3).toLowerCase();
	switch (token) {
		case "jan": return MONTH_TO_NUM.jan;
		case "feb": return MONTH_TO_NUM.feb;
		case "mar": return MONTH_TO_NUM.mar;
		case "apr": return MONTH_TO_NUM.apr;
		case "may": return MONTH_TO_NUM.may;
		case "jun": return MONTH_TO_NUM.jun;
		case "jul": return MONTH_TO_NUM.jul;
		case "aug": return MONTH_TO_NUM.aug;
		case "sep": return MONTH_TO_NUM.sep;
		case "oct": return MONTH_TO_NUM.oct;
		case "nov": return MONTH_TO_NUM.nov;
		case "dec": return MONTH_TO_NUM.dec;
		default: return;
	}
}
function parseDate(cookieDate) {
	if (!cookieDate) return;
	const tokens = cookieDate.split(DATE_DELIM);
	let hour;
	let minute;
	let second;
	let dayOfMonth;
	let month;
	let year;
	for (let i = 0; i < tokens.length; i++) {
		const token = (tokens[i] ?? "").trim();
		if (!token.length) continue;
		if (second === void 0) {
			const result = parseTime(token);
			if (result) {
				hour = result[0];
				minute = result[1];
				second = result[2];
				continue;
			}
		}
		if (dayOfMonth === void 0) {
			const result = parseDigits(token, 1, 2, true);
			if (result !== void 0) {
				dayOfMonth = result;
				continue;
			}
		}
		if (month === void 0) {
			const result = parseMonth(token);
			if (result !== void 0) {
				month = result;
				continue;
			}
		}
		if (year === void 0) {
			const result = parseDigits(token, 2, 4, true);
			if (result !== void 0) {
				year = result;
				if (year >= 70 && year <= 99) year += 1900;
				else if (year >= 0 && year <= 69) year += 2e3;
			}
		}
	}
	if (dayOfMonth === void 0 || month === void 0 || year === void 0 || hour === void 0 || minute === void 0 || second === void 0 || dayOfMonth < 1 || dayOfMonth > 31 || year < 1601 || hour > 23 || minute > 59 || second > 59) return;
	return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
}
var COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;
var PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;
var CONTROL_CHARS = /[\x00-\x1F]/;
var TERMINATORS = [
	"\n",
	"\r",
	"\0"
];
function trimTerminator(str) {
	if (isEmptyString(str)) return str;
	for (let t = 0; t < TERMINATORS.length; t++) {
		const terminator = TERMINATORS[t];
		const terminatorIdx = terminator ? str.indexOf(terminator) : -1;
		if (terminatorIdx !== -1) str = str.slice(0, terminatorIdx);
	}
	return str;
}
function parseCookiePair(cookiePair, looseMode) {
	cookiePair = trimTerminator(cookiePair);
	let firstEq = cookiePair.indexOf("=");
	if (looseMode) {
		if (firstEq === 0) {
			cookiePair = cookiePair.substring(1);
			firstEq = cookiePair.indexOf("=");
		}
	} else if (firstEq <= 0) return;
	let cookieName, cookieValue;
	if (firstEq <= 0) {
		cookieName = "";
		cookieValue = cookiePair.trim();
	} else {
		cookieName = cookiePair.slice(0, firstEq).trim();
		cookieValue = cookiePair.slice(firstEq + 1).trim();
	}
	if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) return;
	const c = new Cookie();
	c.key = cookieName;
	c.value = cookieValue;
	return c;
}
function parse$1(str, options) {
	if (isEmptyString(str) || !isString(str)) return;
	str = str.trim();
	const firstSemi = str.indexOf(";");
	const c = parseCookiePair(firstSemi === -1 ? str : str.slice(0, firstSemi), options?.loose ?? false);
	if (!c) return;
	if (firstSemi === -1) return c;
	const unparsed = str.slice(firstSemi + 1).trim();
	if (unparsed.length === 0) return c;
	const cookie_avs = unparsed.split(";");
	while (cookie_avs.length) {
		const av = (cookie_avs.shift() ?? "").trim();
		if (av.length === 0) continue;
		const av_sep = av.indexOf("=");
		let av_key, av_value;
		if (av_sep === -1) {
			av_key = av;
			av_value = null;
		} else {
			av_key = av.slice(0, av_sep);
			av_value = av.slice(av_sep + 1);
		}
		av_key = av_key.trim().toLowerCase();
		if (av_value) av_value = av_value.trim();
		switch (av_key) {
			case "expires":
				if (av_value) {
					const exp = parseDate(av_value);
					if (exp) c.expires = exp;
				}
				break;
			case "max-age":
				if (av_value) {
					if (/^-?[0-9]+$/.test(av_value)) {
						const delta = parseInt(av_value, 10);
						c.setMaxAge(delta);
					}
				}
				break;
			case "domain":
				if (av_value) {
					const domain = av_value.trim().replace(/^\./, "");
					if (domain) c.domain = domain.toLowerCase();
				}
				break;
			case "path":
				c.path = av_value && av_value[0] === "/" ? av_value : null;
				break;
			case "secure":
				c.secure = true;
				break;
			case "httponly":
				c.httpOnly = true;
				break;
			case "samesite":
				switch (av_value ? av_value.toLowerCase() : "") {
					case "strict":
						c.sameSite = "strict";
						break;
					case "lax":
						c.sameSite = "lax";
						break;
					case "none":
						c.sameSite = "none";
						break;
					default:
						c.sameSite = void 0;
						break;
				}
				break;
			default:
				c.extensions = c.extensions || [];
				c.extensions.push(av);
				break;
		}
	}
	return c;
}
function fromJSON(str) {
	if (!str || isEmptyString(str)) return;
	let obj;
	if (typeof str === "string") try {
		obj = JSON.parse(str);
	} catch {
		return;
	}
	else obj = str;
	const c = new Cookie();
	Cookie.serializableProperties.forEach((prop) => {
		if (obj && typeof obj === "object" && inOperator(prop, obj)) {
			const val = obj[prop];
			if (val === void 0) return;
			if (inOperator(prop, cookieDefaults) && val === cookieDefaults[prop]) return;
			switch (prop) {
				case "key":
				case "value":
				case "sameSite":
					if (typeof val === "string") c[prop] = val;
					break;
				case "expires":
				case "creation":
				case "lastAccessed":
					if (typeof val === "number" || typeof val === "string" || val instanceof Date) c[prop] = obj[prop] == "Infinity" ? "Infinity" : new Date(val);
					else if (val === null) c[prop] = null;
					break;
				case "maxAge":
					if (typeof val === "number" || val === "Infinity" || val === "-Infinity") c[prop] = val;
					break;
				case "domain":
				case "path":
					if (typeof val === "string" || val === null) c[prop] = val;
					break;
				case "secure":
				case "httpOnly":
					if (typeof val === "boolean") c[prop] = val;
					break;
				case "extensions":
					if (Array.isArray(val) && val.every((item) => typeof item === "string")) c[prop] = val;
					break;
				case "hostOnly":
				case "pathIsDefault":
					if (typeof val === "boolean" || val === null) c[prop] = val;
					break;
			}
		}
	});
	return c;
}
var cookieDefaults = {
	key: "",
	value: "",
	expires: "Infinity",
	maxAge: null,
	domain: null,
	path: null,
	secure: false,
	httpOnly: false,
	extensions: null,
	hostOnly: null,
	pathIsDefault: null,
	creation: null,
	lastAccessed: null,
	sameSite: void 0
};
var _Cookie = class _Cookie$1 {
	/**
	* Create a new Cookie instance.
	* @public
	* @param options - The attributes to set on the cookie
	*/
	constructor(options = {}) {
		this.key = options.key ?? cookieDefaults.key;
		this.value = options.value ?? cookieDefaults.value;
		this.expires = options.expires ?? cookieDefaults.expires;
		this.maxAge = options.maxAge ?? cookieDefaults.maxAge;
		this.domain = options.domain ?? cookieDefaults.domain;
		this.path = options.path ?? cookieDefaults.path;
		this.secure = options.secure ?? cookieDefaults.secure;
		this.httpOnly = options.httpOnly ?? cookieDefaults.httpOnly;
		this.extensions = options.extensions ?? cookieDefaults.extensions;
		this.creation = options.creation ?? cookieDefaults.creation;
		this.hostOnly = options.hostOnly ?? cookieDefaults.hostOnly;
		this.pathIsDefault = options.pathIsDefault ?? cookieDefaults.pathIsDefault;
		this.lastAccessed = options.lastAccessed ?? cookieDefaults.lastAccessed;
		this.sameSite = options.sameSite ?? cookieDefaults.sameSite;
		this.creation = options.creation ?? /* @__PURE__ */ new Date();
		Object.defineProperty(this, "creationIndex", {
			configurable: false,
			enumerable: false,
			writable: true,
			value: ++_Cookie$1.cookiesCreated
		});
		this.creationIndex = _Cookie$1.cookiesCreated;
	}
	[Symbol.for("nodejs.util.inspect.custom")]() {
		const now = Date.now();
		const hostOnly = this.hostOnly != null ? this.hostOnly.toString() : "?";
		const createAge = this.creation && this.creation !== "Infinity" ? `${String(now - this.creation.getTime())}ms` : "?";
		const accessAge = this.lastAccessed && this.lastAccessed !== "Infinity" ? `${String(now - this.lastAccessed.getTime())}ms` : "?";
		return `Cookie="${this.toString()}; hostOnly=${hostOnly}; aAge=${accessAge}; cAge=${createAge}"`;
	}
	/**
	* For convenience in using `JSON.stringify(cookie)`. Returns a plain-old Object that can be JSON-serialized.
	*
	* @remarks
	* - Any `Date` properties (such as {@link Cookie.expires}, {@link Cookie.creation}, and {@link Cookie.lastAccessed}) are exported in ISO format (`Date.toISOString()`).
	*
	*  - Custom Cookie properties are discarded. In tough-cookie 1.x, since there was no {@link Cookie.toJSON} method explicitly defined, all enumerable properties were captured.
	*      If you want a property to be serialized, add the property name to {@link Cookie.serializableProperties}.
	*/
	toJSON() {
		const obj = {};
		for (const prop of _Cookie$1.serializableProperties) {
			const val = this[prop];
			if (val === cookieDefaults[prop]) continue;
			switch (prop) {
				case "key":
				case "value":
				case "sameSite":
					if (typeof val === "string") obj[prop] = val;
					break;
				case "expires":
				case "creation":
				case "lastAccessed":
					if (typeof val === "number" || typeof val === "string" || val instanceof Date) obj[prop] = val == "Infinity" ? "Infinity" : new Date(val).toISOString();
					else if (val === null) obj[prop] = null;
					break;
				case "maxAge":
					if (typeof val === "number" || val === "Infinity" || val === "-Infinity") obj[prop] = val;
					break;
				case "domain":
				case "path":
					if (typeof val === "string" || val === null) obj[prop] = val;
					break;
				case "secure":
				case "httpOnly":
					if (typeof val === "boolean") obj[prop] = val;
					break;
				case "extensions":
					if (Array.isArray(val)) obj[prop] = val;
					break;
				case "hostOnly":
				case "pathIsDefault":
					if (typeof val === "boolean" || val === null) obj[prop] = val;
					break;
			}
		}
		return obj;
	}
	/**
	* Does a deep clone of this cookie, implemented exactly as `Cookie.fromJSON(cookie.toJSON())`.
	* @public
	*/
	clone() {
		return fromJSON(this.toJSON());
	}
	/**
	* Validates cookie attributes for semantic correctness. Useful for "lint" checking any `Set-Cookie` headers you generate.
	* For now, it returns a boolean, but eventually could return a reason string.
	*
	* @remarks
	* Works for a few things, but is by no means comprehensive.
	*
	* @beta
	*/
	validate() {
		if (!this.value || !COOKIE_OCTETS.test(this.value)) return false;
		if (this.expires != "Infinity" && !(this.expires instanceof Date) && !parseDate(this.expires)) return false;
		if (this.maxAge != null && this.maxAge !== "Infinity" && (this.maxAge === "-Infinity" || this.maxAge <= 0)) return false;
		if (this.path != null && !PATH_VALUE.test(this.path)) return false;
		const cdomain = this.cdomain();
		if (cdomain) {
			if (cdomain.match(/\.$/)) return false;
			if (getPublicSuffix(cdomain) == null) return false;
		}
		return true;
	}
	/**
	* Sets the 'Expires' attribute on a cookie.
	*
	* @remarks
	* When given a `string` value it will be parsed with {@link parseDate}. If the value can't be parsed as a cookie date
	* then the 'Expires' attribute will be set to `"Infinity"`.
	*
	* @param exp - the new value for the 'Expires' attribute of the cookie.
	*/
	setExpires(exp) {
		if (exp instanceof Date) this.expires = exp;
		else this.expires = parseDate(exp) || "Infinity";
	}
	/**
	* Sets the 'Max-Age' attribute (in seconds) on a cookie.
	*
	* @remarks
	* Coerces `-Infinity` to `"-Infinity"` and `Infinity` to `"Infinity"` so it can be serialized to JSON.
	*
	* @param age - the new value for the 'Max-Age' attribute (in seconds).
	*/
	setMaxAge(age) {
		if (age === Infinity) this.maxAge = "Infinity";
		else if (age === -Infinity) this.maxAge = "-Infinity";
		else this.maxAge = age;
	}
	/**
	* Encodes to a `Cookie` header value (specifically, the {@link Cookie.key} and {@link Cookie.value} properties joined with "=").
	* @public
	*/
	cookieString() {
		const val = this.value || "";
		if (this.key) return `${this.key}=${val}`;
		return val;
	}
	/**
	* Encodes to a `Set-Cookie header` value.
	* @public
	*/
	toString() {
		let str = this.cookieString();
		if (this.expires != "Infinity") {
			if (this.expires instanceof Date) str += `; Expires=${formatDate(this.expires)}`;
		}
		if (this.maxAge != null && this.maxAge != Infinity) str += `; Max-Age=${String(this.maxAge)}`;
		if (this.domain && !this.hostOnly) str += `; Domain=${this.domain}`;
		if (this.path) str += `; Path=${this.path}`;
		if (this.secure) str += "; Secure";
		if (this.httpOnly) str += "; HttpOnly";
		if (this.sameSite && this.sameSite !== "none") if (this.sameSite.toLowerCase() === _Cookie$1.sameSiteCanonical.lax.toLowerCase()) str += `; SameSite=${_Cookie$1.sameSiteCanonical.lax}`;
		else if (this.sameSite.toLowerCase() === _Cookie$1.sameSiteCanonical.strict.toLowerCase()) str += `; SameSite=${_Cookie$1.sameSiteCanonical.strict}`;
		else str += `; SameSite=${this.sameSite}`;
		if (this.extensions) this.extensions.forEach((ext) => {
			str += `; ${ext}`;
		});
		return str;
	}
	/**
	* Computes the TTL relative to now (milliseconds).
	*
	* @remarks
	* - `Infinity` is returned for cookies without an explicit expiry
	*
	* - `0` is returned if the cookie is expired.
	*
	* - Otherwise a time-to-live in milliseconds is returned.
	*
	* @param now - passing an explicit value is mostly used for testing purposes since this defaults to the `Date.now()`
	* @public
	*/
	TTL(now = Date.now()) {
		if (this.maxAge != null && typeof this.maxAge === "number") return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
		const expires = this.expires;
		if (expires === "Infinity") return Infinity;
		return (expires?.getTime() ?? now) - (now || Date.now());
	}
	/**
	* Computes the absolute unix-epoch milliseconds that this cookie expires.
	*
	* The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
	* (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
	*
	* If Expires ({@link Cookie.expires}) is set, that's returned.
	*
	* @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
	*/
	expiryTime(now) {
		if (this.maxAge != null) {
			const relativeTo = now || this.lastAccessed || /* @__PURE__ */ new Date();
			const maxAge = typeof this.maxAge === "number" ? this.maxAge : -Infinity;
			const age = maxAge <= 0 ? -Infinity : maxAge * 1e3;
			if (relativeTo === "Infinity") return Infinity;
			return relativeTo.getTime() + age;
		}
		if (this.expires == "Infinity") return Infinity;
		return this.expires ? this.expires.getTime() : void 0;
	}
	/**
	* Similar to {@link Cookie.expiryTime}, computes the absolute unix-epoch milliseconds that this cookie expires and returns it as a Date.
	*
	* The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
	* (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
	*
	* If Expires ({@link Cookie.expires}) is set, that's returned.
	*
	* @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
	*/
	expiryDate(now) {
		const millisec = this.expiryTime(now);
		if (millisec == Infinity) return /* @__PURE__ */ new Date(2147483647e3);
		else if (millisec == -Infinity) return /* @__PURE__ */ new Date(0);
		else return millisec == void 0 ? void 0 : new Date(millisec);
	}
	/**
	* Indicates if the cookie has been persisted to a store or not.
	* @public
	*/
	isPersistent() {
		return this.maxAge != null || this.expires != "Infinity";
	}
	/**
	* Calls {@link canonicalDomain} with the {@link Cookie.domain} property.
	* @public
	*/
	canonicalizedDomain() {
		return canonicalDomain(this.domain);
	}
	/**
	* Alias for {@link Cookie.canonicalizedDomain}
	* @public
	*/
	cdomain() {
		return canonicalDomain(this.domain);
	}
	/**
	* Parses a string into a Cookie object.
	*
	* @remarks
	* Note: when parsing a `Cookie` header it must be split by ';' before each Cookie string can be parsed.
	*
	* @example
	* ```
	* // parse a `Set-Cookie` header
	* const setCookieHeader = 'a=bcd; Expires=Tue, 18 Oct 2011 07:05:03 GMT'
	* const cookie = Cookie.parse(setCookieHeader)
	* cookie.key === 'a'
	* cookie.value === 'bcd'
	* cookie.expires === new Date(Date.parse('Tue, 18 Oct 2011 07:05:03 GMT'))
	* ```
	*
	* @example
	* ```
	* // parse a `Cookie` header
	* const cookieHeader = 'name=value; name2=value2; name3=value3'
	* const cookies = cookieHeader.split(';').map(Cookie.parse)
	* cookies[0].name === 'name'
	* cookies[0].value === 'value'
	* cookies[1].name === 'name2'
	* cookies[1].value === 'value2'
	* cookies[2].name === 'name3'
	* cookies[2].value === 'value3'
	* ```
	*
	* @param str - The `Set-Cookie` header or a Cookie string to parse.
	* @param options - Configures `strict` or `loose` mode for cookie parsing
	*/
	static parse(str, options) {
		return parse$1(str, options);
	}
	/**
	* Does the reverse of {@link Cookie.toJSON}.
	*
	* @remarks
	* Any Date properties (such as .expires, .creation, and .lastAccessed) are parsed via Date.parse, not tough-cookie's parseDate, since ISO timestamps are being handled at this layer.
	*
	* @example
	* ```
	* const json = JSON.stringify({
	*   key: 'alpha',
	*   value: 'beta',
	*   domain: 'example.com',
	*   path: '/foo',
	*   expires: '2038-01-19T03:14:07.000Z',
	* })
	* const cookie = Cookie.fromJSON(json)
	* cookie.key === 'alpha'
	* cookie.value === 'beta'
	* cookie.domain === 'example.com'
	* cookie.path === '/foo'
	* cookie.expires === new Date(Date.parse('2038-01-19T03:14:07.000Z'))
	* ```
	*
	* @param str - An unparsed JSON string or a value that has already been parsed as JSON
	*/
	static fromJSON(str) {
		return fromJSON(str);
	}
};
_Cookie.cookiesCreated = 0;
/**
* @internal
*/
_Cookie.sameSiteLevel = {
	strict: 3,
	lax: 2,
	none: 1
};
/**
* @internal
*/
_Cookie.sameSiteCanonical = {
	strict: "Strict",
	lax: "Lax"
};
/**
* Cookie properties that will be serialized when using {@link Cookie.fromJSON} and {@link Cookie.toJSON}.
* @public
*/
_Cookie.serializableProperties = [
	"key",
	"value",
	"expires",
	"maxAge",
	"domain",
	"path",
	"secure",
	"httpOnly",
	"extensions",
	"hostOnly",
	"pathIsDefault",
	"creation",
	"lastAccessed",
	"sameSite"
];
var Cookie = _Cookie;
var MAX_TIME = 2147483647e3;
function cookieCompare(a, b) {
	let cmp;
	const aPathLen = a.path ? a.path.length : 0;
	cmp = (b.path ? b.path.length : 0) - aPathLen;
	if (cmp !== 0) return cmp;
	cmp = (a.creation && a.creation instanceof Date ? a.creation.getTime() : MAX_TIME) - (b.creation && b.creation instanceof Date ? b.creation.getTime() : MAX_TIME);
	if (cmp !== 0) return cmp;
	cmp = (a.creationIndex || 0) - (b.creationIndex || 0);
	return cmp;
}
function defaultPath(path) {
	if (!path || path.slice(0, 1) !== "/") return "/";
	if (path === "/") return path;
	const rightSlash = path.lastIndexOf("/");
	if (rightSlash === 0) return "/";
	return path.slice(0, rightSlash);
}
var IP_REGEX_LOWERCASE = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
function domainMatch(domain, cookieDomain, canonicalize) {
	if (domain == null || cookieDomain == null) return;
	let _str;
	let _domStr;
	if (canonicalize !== false) {
		_str = canonicalDomain(domain);
		_domStr = canonicalDomain(cookieDomain);
	} else {
		_str = domain;
		_domStr = cookieDomain;
	}
	if (_str == null || _domStr == null) return;
	if (_str == _domStr) return true;
	const idx = _str.lastIndexOf(_domStr);
	if (idx <= 0) return false;
	if (_str.length !== _domStr.length + idx) return false;
	if (_str.substring(idx - 1, idx) !== ".") return false;
	return !IP_REGEX_LOWERCASE.test(_str);
}
function isLoopbackV4(address) {
	const octets = address.split(".");
	return octets.length === 4 && octets[0] !== void 0 && parseInt(octets[0], 10) === 127;
}
function isLoopbackV6(address) {
	return address === "::1";
}
function isNormalizedLocalhostTLD(lowerHost) {
	return lowerHost.endsWith(".localhost");
}
function isLocalHostname(host) {
	const lowerHost = host.toLowerCase();
	return lowerHost === "localhost" || isNormalizedLocalhostTLD(lowerHost);
}
function hostNoBrackets(host) {
	if (host.length >= 2 && host.startsWith("[") && host.endsWith("]")) return host.substring(1, host.length - 1);
	return host;
}
function isPotentiallyTrustworthy(inputUrl, allowSecureOnLocal = true) {
	let url;
	if (typeof inputUrl === "string") try {
		url = new URL(inputUrl);
	} catch {
		return false;
	}
	else url = inputUrl;
	const scheme = url.protocol.replace(":", "").toLowerCase();
	const hostname = hostNoBrackets(url.hostname).replace(/\.+$/, "");
	if (scheme === "https" || scheme === "wss") return true;
	if (!allowSecureOnLocal) return false;
	if (IP_V4_REGEX_OBJECT.test(hostname)) return isLoopbackV4(hostname);
	if (IP_V6_REGEX_OBJECT.test(hostname)) return isLoopbackV6(hostname);
	return isLocalHostname(hostname);
}
var defaultSetCookieOptions = {
	loose: false,
	sameSiteContext: void 0,
	ignoreError: false,
	http: true
};
var defaultGetCookieOptions = {
	http: true,
	expire: true,
	allPaths: false,
	sameSiteContext: void 0,
	sort: void 0
};
var SAME_SITE_CONTEXT_VAL_ERR = "Invalid sameSiteContext option for getCookies(); expected one of \"strict\", \"lax\", or \"none\"";
function getCookieContext(url) {
	if (url && typeof url === "object" && "hostname" in url && typeof url.hostname === "string" && "pathname" in url && typeof url.pathname === "string" && "protocol" in url && typeof url.protocol === "string") return {
		hostname: url.hostname,
		pathname: url.pathname,
		protocol: url.protocol
	};
	else if (typeof url === "string") try {
		return new URL(decodeURI(url));
	} catch {
		return new URL(url);
	}
	else throw new ParameterError("`url` argument is not a string or URL.");
}
function checkSameSiteContext(value) {
	const context = String(value).toLowerCase();
	if (context === "none" || context === "lax" || context === "strict") return context;
	else return;
}
function isSecurePrefixConditionMet(cookie$1) {
	return !(typeof cookie$1.key === "string" && cookie$1.key.startsWith("__Secure-")) || cookie$1.secure;
}
function isHostPrefixConditionMet(cookie$1) {
	return !(typeof cookie$1.key === "string" && cookie$1.key.startsWith("__Host-")) || Boolean(cookie$1.secure && cookie$1.hostOnly && cookie$1.path != null && cookie$1.path === "/");
}
function getNormalizedPrefixSecurity(prefixSecurity) {
	const normalizedPrefixSecurity = prefixSecurity.toLowerCase();
	switch (normalizedPrefixSecurity) {
		case PrefixSecurityEnum.STRICT:
		case PrefixSecurityEnum.SILENT:
		case PrefixSecurityEnum.DISABLED: return normalizedPrefixSecurity;
		default: return PrefixSecurityEnum.SILENT;
	}
}
var CookieJar = class _CookieJar {
	/**
	* Creates a new `CookieJar` instance.
	*
	* @remarks
	* - If a custom store is not passed to the constructor, an in-memory store ({@link MemoryCookieStore} will be created and used.
	* - If a boolean value is passed as the `options` parameter, this is equivalent to passing `{ rejectPublicSuffixes: <value> }`
	*
	* @param store - a custom {@link Store} implementation (defaults to {@link MemoryCookieStore})
	* @param options - configures how cookies are processed by the cookie jar
	*/
	constructor(store, options) {
		if (typeof options === "boolean") options = { rejectPublicSuffixes: options };
		this.rejectPublicSuffixes = options?.rejectPublicSuffixes ?? true;
		this.enableLooseMode = options?.looseMode ?? false;
		this.allowSpecialUseDomain = options?.allowSpecialUseDomain ?? true;
		this.allowSecureOnLocal = options?.allowSecureOnLocal ?? true;
		this.prefixSecurity = getNormalizedPrefixSecurity(options?.prefixSecurity ?? "silent");
		this.store = store ?? new MemoryCookieStore();
	}
	callSync(fn) {
		if (!this.store.synchronous) throw new Error("CookieJar store is not synchronous; use async API instead.");
		let syncErr = null;
		let syncResult = void 0;
		try {
			fn.call(this, (error$1, result) => {
				syncErr = error$1;
				syncResult = result;
			});
		} catch (err) {
			syncErr = err;
		}
		if (syncErr) throw syncErr;
		return syncResult;
	}
	/**
	* @internal No doc because this is the overload implementation
	*/
	setCookie(cookie$1, url, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = void 0;
		}
		const promiseCallback = createPromiseCallback(callback);
		const cb = promiseCallback.callback;
		let context;
		try {
			if (typeof url === "string") validate(isNonEmptyString(url), callback, safeToString(options));
			context = getCookieContext(url);
			if (typeof url === "function") return promiseCallback.reject(/* @__PURE__ */ new Error("No URL was specified"));
			if (typeof options === "function") options = defaultSetCookieOptions;
			validate(typeof cb === "function", cb);
			if (!isNonEmptyString(cookie$1) && !isObject(cookie$1) && cookie$1 instanceof String && cookie$1.length == 0) return promiseCallback.resolve(void 0);
		} catch (err) {
			return promiseCallback.reject(err);
		}
		const host = canonicalDomain(context.hostname) ?? null;
		const loose = options?.loose || this.enableLooseMode;
		let sameSiteContext = null;
		if (options?.sameSiteContext) {
			sameSiteContext = checkSameSiteContext(options.sameSiteContext);
			if (!sameSiteContext) return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
		}
		if (typeof cookie$1 === "string" || cookie$1 instanceof String) {
			const parsedCookie = Cookie.parse(cookie$1.toString(), { loose });
			if (!parsedCookie) {
				const err = /* @__PURE__ */ new Error("Cookie failed to parse");
				return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
			}
			cookie$1 = parsedCookie;
		} else if (!(cookie$1 instanceof Cookie)) {
			const err = /* @__PURE__ */ new Error("First argument to setCookie must be a Cookie object or string");
			return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
		}
		const now = options?.now || /* @__PURE__ */ new Date();
		if (this.rejectPublicSuffixes && cookie$1.domain) try {
			const cdomain = cookie$1.cdomain();
			if ((typeof cdomain === "string" ? getPublicSuffix(cdomain, {
				allowSpecialUseDomain: this.allowSpecialUseDomain,
				ignoreError: options?.ignoreError
			}) : null) == null && !IP_V6_REGEX_OBJECT.test(cookie$1.domain)) {
				const err = /* @__PURE__ */ new Error("Cookie has domain set to a public suffix");
				return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
			}
		} catch (err) {
			return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
		}
		if (cookie$1.domain) {
			if (!domainMatch(host ?? void 0, cookie$1.cdomain() ?? void 0, false)) {
				const err = /* @__PURE__ */ new Error(`Cookie not in this host's domain. Cookie:${cookie$1.cdomain() ?? "null"} Request:${host ?? "null"}`);
				return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
			}
			if (cookie$1.hostOnly == null) cookie$1.hostOnly = false;
		} else {
			cookie$1.hostOnly = true;
			cookie$1.domain = host;
		}
		if (!cookie$1.path || cookie$1.path[0] !== "/") {
			cookie$1.path = defaultPath(context.pathname);
			cookie$1.pathIsDefault = true;
		}
		if (options?.http === false && cookie$1.httpOnly) {
			const err = /* @__PURE__ */ new Error("Cookie is HttpOnly and this isn't an HTTP API");
			return options.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
		}
		if (cookie$1.sameSite !== "none" && cookie$1.sameSite !== void 0 && sameSiteContext) {
			if (sameSiteContext === "none") {
				const err = /* @__PURE__ */ new Error("Cookie is SameSite but this is a cross-origin request");
				return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
			}
		}
		const ignoreErrorForPrefixSecurity = this.prefixSecurity === PrefixSecurityEnum.SILENT;
		if (!(this.prefixSecurity === PrefixSecurityEnum.DISABLED)) {
			let errorFound = false;
			let errorMsg;
			if (!isSecurePrefixConditionMet(cookie$1)) {
				errorFound = true;
				errorMsg = "Cookie has __Secure prefix but Secure attribute is not set";
			} else if (!isHostPrefixConditionMet(cookie$1)) {
				errorFound = true;
				errorMsg = "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'";
			}
			if (errorFound) return options?.ignoreError || ignoreErrorForPrefixSecurity ? promiseCallback.resolve(void 0) : promiseCallback.reject(new Error(errorMsg));
		}
		const store = this.store;
		if (!store.updateCookie) store.updateCookie = async function(_oldCookie, newCookie, cb2) {
			return this.putCookie(newCookie).then(() => cb2?.(null), (error$1) => cb2?.(error$1));
		};
		store.findCookie(cookie$1.domain, cookie$1.path, cookie$1.key, function withCookie2(err, oldCookie) {
			if (err) {
				cb(err);
				return;
			}
			const next = function(err2) {
				if (err2) cb(err2);
				else if (typeof cookie$1 === "string") cb(null, void 0);
				else cb(null, cookie$1);
			};
			if (oldCookie) {
				if (options && "http" in options && options.http === false && oldCookie.httpOnly) {
					err = /* @__PURE__ */ new Error("old Cookie is HttpOnly and this isn't an HTTP API");
					if (options.ignoreError) cb(null, void 0);
					else cb(err);
					return;
				}
				if (cookie$1 instanceof Cookie) {
					cookie$1.creation = oldCookie.creation;
					cookie$1.creationIndex = oldCookie.creationIndex;
					cookie$1.lastAccessed = now;
					store.updateCookie(oldCookie, cookie$1, next);
				}
			} else if (cookie$1 instanceof Cookie) {
				cookie$1.creation = cookie$1.lastAccessed = now;
				store.putCookie(cookie$1, next);
			}
		});
		return promiseCallback.promise;
	}
	/**
	* Synchronously attempt to set the {@link Cookie} in the {@link CookieJar}.
	*
	* <strong>Note:</strong> Only works if the configured {@link Store} is also synchronous.
	*
	* @remarks
	* - If successfully persisted, the {@link Cookie} will have updated
	*     {@link Cookie.creation}, {@link Cookie.lastAccessed} and {@link Cookie.hostOnly}
	*     properties.
	*
	* - As per the RFC, the {@link Cookie.hostOnly} flag is set if there was no `Domain={value}`
	*     attribute on the cookie string. The {@link Cookie.domain} property is set to the
	*     fully-qualified hostname of `currentUrl` in this case. Matching this cookie requires an
	*     exact hostname match (not a {@link domainMatch} as per usual)
	*
	* @param cookie - The cookie object or cookie string to store. A string value will be parsed into a cookie using {@link Cookie.parse}.
	* @param url - The domain to store the cookie with.
	* @param options - Configuration settings to use when storing the cookie.
	* @public
	*/
	setCookieSync(cookie$1, url, options) {
		const setCookieFn = options ? this.setCookie.bind(this, cookie$1, url, options) : this.setCookie.bind(this, cookie$1, url);
		return this.callSync(setCookieFn);
	}
	/**
	* @internal No doc because this is the overload implementation
	*/
	getCookies(url, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = defaultGetCookieOptions;
		} else if (options === void 0) options = defaultGetCookieOptions;
		const promiseCallback = createPromiseCallback(callback);
		const cb = promiseCallback.callback;
		let context;
		try {
			if (typeof url === "string") validate(isNonEmptyString(url), cb, url);
			context = getCookieContext(url);
			validate(isObject(options), cb, safeToString(options));
			validate(typeof cb === "function", cb);
		} catch (parameterError) {
			return promiseCallback.reject(parameterError);
		}
		const host = canonicalDomain(context.hostname);
		const path = context.pathname || "/";
		const potentiallyTrustworthy = isPotentiallyTrustworthy(url, this.allowSecureOnLocal);
		let sameSiteLevel = 0;
		if (options.sameSiteContext) {
			const sameSiteContext = checkSameSiteContext(options.sameSiteContext);
			if (sameSiteContext == null) return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
			sameSiteLevel = Cookie.sameSiteLevel[sameSiteContext];
			if (!sameSiteLevel) return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
		}
		const http$1 = options.http ?? true;
		const now = Date.now();
		const expireCheck = options.expire ?? true;
		const allPaths = options.allPaths ?? false;
		const store = this.store;
		function matchingCookie(c) {
			if (c.hostOnly) {
				if (c.domain != host) return false;
			} else if (!domainMatch(host ?? void 0, c.domain ?? void 0, false)) return false;
			if (!allPaths && typeof c.path === "string" && !pathMatch(path, c.path)) return false;
			if (c.secure && !potentiallyTrustworthy) return false;
			if (c.httpOnly && !http$1) return false;
			if (sameSiteLevel) {
				let cookieLevel;
				if (c.sameSite === "lax") cookieLevel = Cookie.sameSiteLevel.lax;
				else if (c.sameSite === "strict") cookieLevel = Cookie.sameSiteLevel.strict;
				else cookieLevel = Cookie.sameSiteLevel.none;
				if (cookieLevel > sameSiteLevel) return false;
			}
			const expiryTime = c.expiryTime();
			if (expireCheck && expiryTime != void 0 && expiryTime <= now) {
				store.removeCookie(c.domain, c.path, c.key, () => {});
				return false;
			}
			return true;
		}
		store.findCookies(host, allPaths ? null : path, this.allowSpecialUseDomain, (err, cookies) => {
			if (err) {
				cb(err);
				return;
			}
			if (cookies == null) {
				cb(null, []);
				return;
			}
			cookies = cookies.filter(matchingCookie);
			if ("sort" in options && options.sort !== false) cookies = cookies.sort(cookieCompare);
			const now2 = /* @__PURE__ */ new Date();
			for (const cookie$1 of cookies) cookie$1.lastAccessed = now2;
			cb(null, cookies);
		});
		return promiseCallback.promise;
	}
	/**
	* Synchronously retrieve the list of cookies that can be sent in a Cookie header for the
	* current URL.
	*
	* <strong>Note</strong>: Only works if the configured Store is also synchronous.
	*
	* @remarks
	* - The array of cookies returned will be sorted according to {@link cookieCompare}.
	*
	* - The {@link Cookie.lastAccessed} property will be updated on all returned cookies.
	*
	* @param url - The domain to store the cookie with.
	* @param options - Configuration settings to use when retrieving the cookies.
	*/
	getCookiesSync(url, options) {
		return this.callSync(this.getCookies.bind(this, url, options)) ?? [];
	}
	/**
	* @internal No doc because this is the overload implementation
	*/
	getCookieString(url, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = void 0;
		}
		const promiseCallback = createPromiseCallback(callback);
		const next = function(err, cookies) {
			if (err) promiseCallback.callback(err);
			else promiseCallback.callback(null, cookies?.sort(cookieCompare).map((c) => c.cookieString()).join("; "));
		};
		this.getCookies(url, options, next);
		return promiseCallback.promise;
	}
	/**
	* Synchronous version of `.getCookieString()`. Accepts the same options as `.getCookies()` but returns a string suitable for a
	* `Cookie` header rather than an Array.
	*
	* <strong>Note</strong>: Only works if the configured Store is also synchronous.
	*
	* @param url - The domain to store the cookie with.
	* @param options - Configuration settings to use when retrieving the cookies.
	*/
	getCookieStringSync(url, options) {
		return this.callSync(options ? this.getCookieString.bind(this, url, options) : this.getCookieString.bind(this, url)) ?? "";
	}
	/**
	* @internal No doc because this is the overload implementation
	*/
	getSetCookieStrings(url, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = void 0;
		}
		const promiseCallback = createPromiseCallback(callback);
		const next = function(err, cookies) {
			if (err) promiseCallback.callback(err);
			else promiseCallback.callback(null, cookies?.map((c) => {
				return c.toString();
			}));
		};
		this.getCookies(url, options, next);
		return promiseCallback.promise;
	}
	/**
	* Synchronous version of `.getSetCookieStrings()`. Returns an array of strings suitable for `Set-Cookie` headers.
	* Accepts the same options as `.getCookies()`.
	*
	* <strong>Note</strong>: Only works if the configured Store is also synchronous.
	*
	* @param url - The domain to store the cookie with.
	* @param options - Configuration settings to use when retrieving the cookies.
	*/
	getSetCookieStringsSync(url, options = {}) {
		return this.callSync(this.getSetCookieStrings.bind(this, url, options)) ?? [];
	}
	/**
	* @internal No doc because this is the overload implementation
	*/
	serialize(callback) {
		const promiseCallback = createPromiseCallback(callback);
		let type = this.store.constructor.name;
		if (isObject(type)) type = null;
		const serialized = {
			version: `tough-cookie@${version}`,
			storeType: type,
			rejectPublicSuffixes: this.rejectPublicSuffixes,
			enableLooseMode: this.enableLooseMode,
			allowSpecialUseDomain: this.allowSpecialUseDomain,
			prefixSecurity: getNormalizedPrefixSecurity(this.prefixSecurity),
			cookies: []
		};
		if (typeof this.store.getAllCookies !== "function") return promiseCallback.reject(/* @__PURE__ */ new Error("store does not support getAllCookies and cannot be serialized"));
		this.store.getAllCookies((err, cookies) => {
			if (err) {
				promiseCallback.callback(err);
				return;
			}
			if (cookies == null) {
				promiseCallback.callback(null, serialized);
				return;
			}
			serialized.cookies = cookies.map((cookie$1) => {
				const serializedCookie = cookie$1.toJSON();
				delete serializedCookie.creationIndex;
				return serializedCookie;
			});
			promiseCallback.callback(null, serialized);
		});
		return promiseCallback.promise;
	}
	/**
	* Serialize the CookieJar if the underlying store supports `.getAllCookies`.
	*
	* <strong>Note</strong>: Only works if the configured Store is also synchronous.
	*/
	serializeSync() {
		return this.callSync((callback) => {
			this.serialize(callback);
		});
	}
	/**
	* Alias of {@link CookieJar.serializeSync}. Allows the cookie to be serialized
	* with `JSON.stringify(cookieJar)`.
	*/
	toJSON() {
		return this.serializeSync();
	}
	/**
	* Use the class method CookieJar.deserialize instead of calling this directly
	* @internal
	*/
	_importCookies(serialized, callback) {
		let cookies = void 0;
		if (serialized && typeof serialized === "object" && inOperator("cookies", serialized) && Array.isArray(serialized.cookies)) cookies = serialized.cookies;
		if (!cookies) {
			callback(/* @__PURE__ */ new Error("serialized jar has no cookies array"), void 0);
			return;
		}
		cookies = cookies.slice();
		const putNext = (err) => {
			if (err) {
				callback(err, void 0);
				return;
			}
			if (Array.isArray(cookies)) {
				if (!cookies.length) {
					callback(err, this);
					return;
				}
				let cookie$1;
				try {
					cookie$1 = Cookie.fromJSON(cookies.shift());
				} catch (e) {
					callback(e instanceof Error ? e : /* @__PURE__ */ new Error(), void 0);
					return;
				}
				if (cookie$1 === void 0) {
					putNext(null);
					return;
				}
				this.store.putCookie(cookie$1, putNext);
			}
		};
		putNext(null);
	}
	/**
	* @internal
	*/
	_importCookiesSync(serialized) {
		this.callSync(this._importCookies.bind(this, serialized));
	}
	/**
	* @internal No doc because this is the overload implementation
	*/
	clone(newStore, callback) {
		if (typeof newStore === "function") {
			callback = newStore;
			newStore = void 0;
		}
		const promiseCallback = createPromiseCallback(callback);
		const cb = promiseCallback.callback;
		this.serialize((err, serialized) => {
			if (err) return promiseCallback.reject(err);
			return _CookieJar.deserialize(serialized ?? "", newStore, cb);
		});
		return promiseCallback.promise;
	}
	/**
	* @internal
	*/
	_cloneSync(newStore) {
		const cloneFn = newStore && typeof newStore !== "function" ? this.clone.bind(this, newStore) : this.clone.bind(this);
		return this.callSync((callback) => {
			cloneFn(callback);
		});
	}
	/**
	* Produces a deep clone of this CookieJar. Modifications to the original do
	* not affect the clone, and vice versa.
	*
	* <strong>Note</strong>: Only works if both the configured Store and destination
	* Store are synchronous.
	*
	* @remarks
	* - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
	*
	* - Transferring between store types is supported so long as the source
	*     implements `.getAllCookies()` and the destination implements `.putCookie()`.
	*
	* @param newStore - The target {@link Store} to clone cookies into.
	*/
	cloneSync(newStore) {
		if (!newStore) return this._cloneSync();
		if (!newStore.synchronous) throw new Error("CookieJar clone destination store is not synchronous; use async API instead.");
		return this._cloneSync(newStore);
	}
	/**
	* @internal No doc because this is the overload implementation
	*/
	removeAllCookies(callback) {
		const promiseCallback = createPromiseCallback(callback);
		const cb = promiseCallback.callback;
		const store = this.store;
		if (typeof store.removeAllCookies === "function" && store.removeAllCookies !== Store.prototype.removeAllCookies) {
			store.removeAllCookies(cb);
			return promiseCallback.promise;
		}
		store.getAllCookies((err, cookies) => {
			if (err) {
				cb(err);
				return;
			}
			if (!cookies) cookies = [];
			if (cookies.length === 0) {
				cb(null, void 0);
				return;
			}
			let completedCount = 0;
			const removeErrors = [];
			const removeCookieCb = function removeCookieCb2(removeErr) {
				if (removeErr) removeErrors.push(removeErr);
				completedCount++;
				if (completedCount === cookies.length) {
					if (removeErrors[0]) cb(removeErrors[0]);
					else cb(null, void 0);
					return;
				}
			};
			cookies.forEach((cookie$1) => {
				store.removeCookie(cookie$1.domain, cookie$1.path, cookie$1.key, removeCookieCb);
			});
		});
		return promiseCallback.promise;
	}
	/**
	* Removes all cookies from the CookieJar.
	*
	* <strong>Note</strong>: Only works if the configured Store is also synchronous.
	*
	* @remarks
	* - This is a new backwards-compatible feature of tough-cookie version 2.5,
	*     so not all Stores will implement it efficiently. For Stores that do not
	*     implement `removeAllCookies`, the fallback is to call `removeCookie` after
	*     `getAllCookies`.
	*
	* - If `getAllCookies` fails or isn't implemented in the Store, an error is returned.
	*
	* - If one or more of the `removeCookie` calls fail, only the first error is returned.
	*/
	removeAllCookiesSync() {
		this.callSync((callback) => {
			this.removeAllCookies(callback);
		});
	}
	/**
	* @internal No doc because this is the overload implementation
	*/
	static deserialize(strOrObj, store, callback) {
		if (typeof store === "function") {
			callback = store;
			store = void 0;
		}
		const promiseCallback = createPromiseCallback(callback);
		let serialized;
		if (typeof strOrObj === "string") try {
			serialized = JSON.parse(strOrObj);
		} catch (e) {
			return promiseCallback.reject(e instanceof Error ? e : /* @__PURE__ */ new Error());
		}
		else serialized = strOrObj;
		const readSerializedProperty = (property) => {
			return serialized && typeof serialized === "object" && inOperator(property, serialized) ? serialized[property] : void 0;
		};
		const readSerializedBoolean = (property) => {
			const value = readSerializedProperty(property);
			return typeof value === "boolean" ? value : void 0;
		};
		const readSerializedString = (property) => {
			const value = readSerializedProperty(property);
			return typeof value === "string" ? value : void 0;
		};
		const jar = new _CookieJar(store, {
			rejectPublicSuffixes: readSerializedBoolean("rejectPublicSuffixes"),
			looseMode: readSerializedBoolean("enableLooseMode"),
			allowSpecialUseDomain: readSerializedBoolean("allowSpecialUseDomain"),
			prefixSecurity: getNormalizedPrefixSecurity(readSerializedString("prefixSecurity") ?? "silent")
		});
		jar._importCookies(serialized, (err) => {
			if (err) {
				promiseCallback.callback(err);
				return;
			}
			promiseCallback.callback(null, jar);
		});
		return promiseCallback.promise;
	}
	/**
	* A new CookieJar is created and the serialized {@link Cookie} values are added to
	* the underlying store. Each {@link Cookie} is added via `store.putCookie(...)` in
	* the order in which they appear in the serialization.
	*
	* <strong>Note</strong>: Only works if the configured Store is also synchronous.
	*
	* @remarks
	* - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
	*
	* - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
	*
	* @param strOrObj - A JSON string or object representing the deserialized cookies.
	* @param store - The underlying store to persist the deserialized cookies into.
	*/
	static deserializeSync(strOrObj, store) {
		const serialized = typeof strOrObj === "string" ? JSON.parse(strOrObj) : strOrObj;
		const readSerializedProperty = (property) => {
			return serialized && typeof serialized === "object" && inOperator(property, serialized) ? serialized[property] : void 0;
		};
		const readSerializedBoolean = (property) => {
			const value = readSerializedProperty(property);
			return typeof value === "boolean" ? value : void 0;
		};
		const readSerializedString = (property) => {
			const value = readSerializedProperty(property);
			return typeof value === "string" ? value : void 0;
		};
		const jar = new _CookieJar(store, {
			rejectPublicSuffixes: readSerializedBoolean("rejectPublicSuffixes"),
			looseMode: readSerializedBoolean("enableLooseMode"),
			allowSpecialUseDomain: readSerializedBoolean("allowSpecialUseDomain"),
			prefixSecurity: getNormalizedPrefixSecurity(readSerializedString("prefixSecurity") ?? "silent")
		});
		if (!jar.store.synchronous) throw new Error("CookieJar store is not synchronous; use async API instead.");
		jar._importCookiesSync(serialized);
		return jar;
	}
	/**
	* Alias of {@link CookieJar.deserializeSync}.
	*
	* @remarks
	* - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
	*
	* - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
	*
	* @param jsonString - A JSON string or object representing the deserialized cookies.
	* @param store - The underlying store to persist the deserialized cookies into.
	*/
	static fromJSON(jsonString, store) {
		return _CookieJar.deserializeSync(jsonString, store);
	}
};
/*!
* Copyright (c) 2015-2020, Salesforce.com, Inc.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice,
* this list of conditions and the following disclaimer.
*
* 2. Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following disclaimer in the documentation
* and/or other materials provided with the distribution.
*
* 3. Neither the name of Salesforce.com nor the names of its contributors may
* be used to endorse or promote products derived from this software without
* specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
* LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
* CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
* SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
* INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
* CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*/
function jsonParse(value) {
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
var CookieStore = class {
	#storageKey = "__msw-cookie-store__";
	#jar;
	#memoryStore;
	constructor() {
		if (!isNodeProcess()) invariant(typeof localStorage !== "undefined", "Failed to create a CookieStore: `localStorage` is not available in this environment. This is likely an issue with your environment, which has been detected as browser (or browser-like) environment and must implement global browser APIs correctly.");
		this.#memoryStore = new MemoryCookieStore();
		this.#memoryStore.idx = this.getCookieStoreIndex();
		this.#jar = new CookieJar(this.#memoryStore);
	}
	getCookies(url) {
		return this.#jar.getCookiesSync(url);
	}
	async setCookie(cookieName, url) {
		await this.#jar.setCookie(cookieName, url);
		this.persist();
	}
	getCookieStoreIndex() {
		if (typeof localStorage === "undefined") return {};
		const cookiesString = localStorage.getItem(this.#storageKey);
		if (cookiesString == null) return {};
		const rawCookies = jsonParse(cookiesString);
		if (rawCookies == null) return {};
		const cookies = {};
		for (const rawCookie of rawCookies) {
			const cookie$1 = Cookie.fromJSON(rawCookie);
			if (cookie$1 != null && cookie$1.domain != null && cookie$1.path != null) {
				cookies[cookie$1.domain] ||= {};
				cookies[cookie$1.domain][cookie$1.path] ||= {};
				cookies[cookie$1.domain][cookie$1.path][cookie$1.key] = cookie$1;
			}
		}
		return cookies;
	}
	persist() {
		if (typeof localStorage === "undefined") return;
		const data = [];
		const { idx } = this.#memoryStore;
		for (const domain in idx) for (const path in idx[domain]) for (const key in idx[domain][path]) data.push(idx[domain][path][key].toJSON());
		localStorage.setItem(this.#storageKey, JSON.stringify(data));
	}
};
const cookieStore = new CookieStore();
function parseCookies(input) {
	const parsedCookies = parse(input);
	const cookies = {};
	for (const cookieName in parsedCookies) if (typeof parsedCookies[cookieName] !== "undefined") cookies[cookieName] = parsedCookies[cookieName];
	return cookies;
}
function getAllDocumentCookies() {
	return parseCookies(document.cookie);
}
function getDocumentCookies(request) {
	if (typeof document === "undefined" || typeof location === "undefined") return {};
	switch (request.credentials) {
		case "same-origin": {
			const requestUrl = new URL(request.url);
			return location.origin === requestUrl.origin ? getAllDocumentCookies() : {};
		}
		case "include": return getAllDocumentCookies();
		default: return {};
	}
}
function getAllRequestCookies(request) {
	const requestCookieHeader = request.headers.get("cookie");
	const cookiesFromHeaders = requestCookieHeader ? parseCookies(requestCookieHeader) : {};
	const cookiesFromDocument = getDocumentCookies(request);
	for (const name in cookiesFromDocument) request.headers.append("cookie", serialize(name, cookiesFromDocument[name]));
	const cookiesFromStore = cookieStore.getCookies(request.url);
	const storedCookiesObject = Object.fromEntries(cookiesFromStore.map((cookie$1) => [cookie$1.key, cookie$1.value]));
	for (const cookie$1 of cookiesFromStore) request.headers.append("cookie", cookie$1.toString());
	return {
		...cookiesFromDocument,
		...storedCookiesObject,
		...cookiesFromHeaders
	};
}
var HttpMethods = /* @__PURE__ */ ((HttpMethods2) => {
	HttpMethods2["HEAD"] = "HEAD";
	HttpMethods2["GET"] = "GET";
	HttpMethods2["POST"] = "POST";
	HttpMethods2["PUT"] = "PUT";
	HttpMethods2["PATCH"] = "PATCH";
	HttpMethods2["OPTIONS"] = "OPTIONS";
	HttpMethods2["DELETE"] = "DELETE";
	return HttpMethods2;
})(HttpMethods || {});
var HttpHandler = class extends RequestHandler {
	constructor(method, predicate, resolver, options) {
		const displayPath = typeof predicate === "function" ? "[custom predicate]" : predicate;
		super({
			info: {
				header: `${method}${displayPath ? ` ${displayPath}` : ""}`,
				path: predicate,
				method
			},
			resolver,
			options
		});
		this.checkRedundantQueryParameters();
	}
	checkRedundantQueryParameters() {
		const { method, path } = this.info;
		if (!path || path instanceof RegExp || typeof path === "function") return;
		if (cleanUrl(path) === path) return;
		devUtils.warn(`Found a redundant usage of query parameters in the request handler URL for "${method} ${path}". Please match against a path instead and access query parameters using "new URL(request.url).searchParams" instead. Learn more: https://mswjs.io/docs/http/intercepting-requests#querysearch-parameters`);
	}
	async parse(args) {
		const url = new URL(args.request.url);
		const cookies = getAllRequestCookies(args.request);
		if (typeof this.info.path === "function") {
			const customPredicateResult = await this.info.path({
				request: args.request,
				cookies
			});
			return {
				match: typeof customPredicateResult === "boolean" ? {
					matches: customPredicateResult,
					params: {}
				} : customPredicateResult,
				cookies
			};
		}
		return {
			match: this.info.path ? matchRequestUrl(url, this.info.path, args.resolutionContext?.baseUrl) : {
				matches: false,
				params: {}
			},
			cookies
		};
	}
	async predicate(args) {
		const hasMatchingMethod = this.matchMethod(args.request.method);
		const hasMatchingUrl = args.parsedResult.match.matches;
		return hasMatchingMethod && hasMatchingUrl;
	}
	matchMethod(actualMethod) {
		return this.info.method instanceof RegExp ? this.info.method.test(actualMethod) : isStringEqual(this.info.method, actualMethod);
	}
	extendResolverArgs(args) {
		return {
			params: args.parsedResult.match?.params || {},
			cookies: args.parsedResult.cookies
		};
	}
	async log(args) {
		const publicUrl = toPublicUrl(args.request.url);
		const loggedRequest = await serializeRequest(args.request);
		const loggedResponse = await serializeResponse(args.response);
		const statusColor = getStatusCodeColor(loggedResponse.status);
		console.groupCollapsed(devUtils.formatMessage(`${getTimestamp()} ${args.request.method} ${publicUrl} (%c${loggedResponse.status} ${loggedResponse.statusText}%c)`), `color:${statusColor}`, "color:inherit");
		console.log("Request", loggedRequest);
		console.log("Handler:", this);
		console.log("Response", loggedResponse);
		console.groupEnd();
	}
};
function createHttpHandler(method) {
	return (predicate, resolver, options = {}) => {
		return new HttpHandler(method, predicate, resolver, options);
	};
}
const http = {
	all: createHttpHandler(/.+/),
	head: createHttpHandler(HttpMethods.HEAD),
	get: createHttpHandler(HttpMethods.GET),
	post: createHttpHandler(HttpMethods.POST),
	put: createHttpHandler(HttpMethods.PUT),
	delete: createHttpHandler(HttpMethods.DELETE),
	patch: createHttpHandler(HttpMethods.PATCH),
	options: createHttpHandler(HttpMethods.OPTIONS)
};
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var import_set_cookie_parser = __toESM(__commonJS({ "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
	var defaultParseOptions = {
		decodeValues: true,
		map: false,
		silent: false
	};
	function isNonEmptyString$1(str) {
		return typeof str === "string" && !!str.trim();
	}
	function parseString(setCookieValue, options) {
		var parts = setCookieValue.split(";").filter(isNonEmptyString$1);
		var parsed = parseNameValuePair(parts.shift());
		var name = parsed.name;
		var value = parsed.value;
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		try {
			value = options.decodeValues ? decodeURIComponent(value) : value;
		} catch (e) {
			console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e);
		}
		var cookie$1 = {
			name,
			value
		};
		parts.forEach(function(part) {
			var sides = part.split("=");
			var key = sides.shift().trimLeft().toLowerCase();
			var value2 = sides.join("=");
			if (key === "expires") cookie$1.expires = new Date(value2);
			else if (key === "max-age") cookie$1.maxAge = parseInt(value2, 10);
			else if (key === "secure") cookie$1.secure = true;
			else if (key === "httponly") cookie$1.httpOnly = true;
			else if (key === "samesite") cookie$1.sameSite = value2;
			else cookie$1[key] = value2;
		});
		return cookie$1;
	}
	function parseNameValuePair(nameValuePairStr) {
		var name = "";
		var value = "";
		var nameValueArr = nameValuePairStr.split("=");
		if (nameValueArr.length > 1) {
			name = nameValueArr.shift();
			value = nameValueArr.join("=");
		} else value = nameValuePairStr;
		return {
			name,
			value
		};
	}
	function parse$2(input, options) {
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		if (!input) if (!options.map) return [];
		else return {};
		if (input.headers) if (typeof input.headers.getSetCookie === "function") input = input.headers.getSetCookie();
		else if (input.headers["set-cookie"]) input = input.headers["set-cookie"];
		else {
			var sch = input.headers[Object.keys(input.headers).find(function(key) {
				return key.toLowerCase() === "set-cookie";
			})];
			if (!sch && input.headers.cookie && !options.silent) console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
			input = sch;
		}
		if (!Array.isArray(input)) input = [input];
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		if (!options.map) return input.filter(isNonEmptyString$1).map(function(str) {
			return parseString(str, options);
		});
		else return input.filter(isNonEmptyString$1).reduce(function(cookies2, str) {
			var cookie$1 = parseString(str, options);
			cookies2[cookie$1.name] = cookie$1;
			return cookies2;
		}, {});
	}
	function splitCookiesString2(cookiesString) {
		if (Array.isArray(cookiesString)) return cookiesString;
		if (typeof cookiesString !== "string") return [];
		var cookiesStrings = [];
		var pos = 0;
		var start;
		var ch;
		var lastComma;
		var nextStart;
		var cookiesSeparatorFound;
		function skipWhitespace() {
			while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
			return pos < cookiesString.length;
		}
		function notSpecialChar() {
			ch = cookiesString.charAt(pos);
			return ch !== "=" && ch !== ";" && ch !== ",";
		}
		while (pos < cookiesString.length) {
			start = pos;
			cookiesSeparatorFound = false;
			while (skipWhitespace()) {
				ch = cookiesString.charAt(pos);
				if (ch === ",") {
					lastComma = pos;
					pos += 1;
					skipWhitespace();
					nextStart = pos;
					while (pos < cookiesString.length && notSpecialChar()) pos += 1;
					if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
						cookiesSeparatorFound = true;
						pos = nextStart;
						cookiesStrings.push(cookiesString.substring(start, lastComma));
						start = pos;
					} else pos = lastComma + 1;
				} else pos += 1;
			}
			if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
		}
		return cookiesStrings;
	}
	module.exports = parse$2;
	module.exports.parse = parse$2;
	module.exports.parseString = parseString;
	module.exports.splitCookiesString = splitCookiesString2;
} })());
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
	if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") throw new TypeError("Invalid character in header field name");
	return name.trim().toLowerCase();
}
var charCodesToRemove = [
	String.fromCharCode(10),
	String.fromCharCode(13),
	String.fromCharCode(9),
	String.fromCharCode(32)
];
var HEADER_VALUE_REMOVE_REGEXP = new RegExp(`(^[${charCodesToRemove.join("")}]|$[${charCodesToRemove.join("")}])`, "g");
function normalizeHeaderValue(value) {
	return value.replace(HEADER_VALUE_REMOVE_REGEXP, "");
}
function isValidHeaderName(value) {
	if (typeof value !== "string") return false;
	if (value.length === 0) return false;
	for (let i = 0; i < value.length; i++) {
		const character = value.charCodeAt(i);
		if (character > 127 || !isToken(character)) return false;
	}
	return true;
}
function isToken(value) {
	return ![
		127,
		32,
		"(",
		")",
		"<",
		">",
		"@",
		",",
		";",
		":",
		"\\",
		"\"",
		"/",
		"[",
		"]",
		"?",
		"=",
		"{",
		"}"
	].includes(value);
}
function isValidHeaderValue(value) {
	if (typeof value !== "string") return false;
	if (value.trim() !== value) return false;
	for (let i = 0; i < value.length; i++) {
		const character = value.charCodeAt(i);
		if (character === 0 || character === 10 || character === 13) return false;
	}
	return true;
}
var NORMALIZED_HEADERS = Symbol("normalizedHeaders");
var RAW_HEADER_NAMES = Symbol("rawHeaderNames");
var HEADER_VALUE_DELIMITER = ", ";
var _a, _b, _c;
var Headers$1 = class _Headers {
	constructor(init) {
		this[_a] = {};
		this[_b] = /* @__PURE__ */ new Map();
		this[_c] = "Headers";
		if (["Headers", "HeadersPolyfill"].includes(init?.constructor.name) || init instanceof _Headers || typeof globalThis.Headers !== "undefined" && init instanceof globalThis.Headers) init.forEach((value, name) => {
			this.append(name, value);
		}, this);
		else if (Array.isArray(init)) init.forEach(([name, value]) => {
			this.append(name, Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value);
		});
		else if (init) Object.getOwnPropertyNames(init).forEach((name) => {
			const value = init[name];
			this.append(name, Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value);
		});
	}
	[(_a = NORMALIZED_HEADERS, _b = RAW_HEADER_NAMES, _c = Symbol.toStringTag, Symbol.iterator)]() {
		return this.entries();
	}
	*keys() {
		for (const [name] of this.entries()) yield name;
	}
	*values() {
		for (const [, value] of this.entries()) yield value;
	}
	*entries() {
		let sortedKeys = Object.keys(this[NORMALIZED_HEADERS]).sort((a, b) => a.localeCompare(b));
		for (const name of sortedKeys) if (name === "set-cookie") for (const value of this.getSetCookie()) yield [name, value];
		else yield [name, this.get(name)];
	}
	/**
	* Returns a boolean stating whether a `Headers` object contains a certain header.
	*/
	has(name) {
		if (!isValidHeaderName(name)) throw new TypeError(`Invalid header name "${name}"`);
		return this[NORMALIZED_HEADERS].hasOwnProperty(normalizeHeaderName(name));
	}
	/**
	* Returns a `ByteString` sequence of all the values of a header with a given name.
	*/
	get(name) {
		if (!isValidHeaderName(name)) throw TypeError(`Invalid header name "${name}"`);
		return this[NORMALIZED_HEADERS][normalizeHeaderName(name)] ?? null;
	}
	/**
	* Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
	*/
	set(name, value) {
		if (!isValidHeaderName(name) || !isValidHeaderValue(value)) return;
		const normalizedName = normalizeHeaderName(name);
		const normalizedValue = normalizeHeaderValue(value);
		this[NORMALIZED_HEADERS][normalizedName] = normalizeHeaderValue(normalizedValue);
		this[RAW_HEADER_NAMES].set(normalizedName, name);
	}
	/**
	* Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
	*/
	append(name, value) {
		if (!isValidHeaderName(name) || !isValidHeaderValue(value)) return;
		const normalizedName = normalizeHeaderName(name);
		const normalizedValue = normalizeHeaderValue(value);
		let resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${normalizedValue}` : normalizedValue;
		this.set(name, resolvedValue);
	}
	/**
	* Deletes a header from the `Headers` object.
	*/
	delete(name) {
		if (!isValidHeaderName(name)) return;
		if (!this.has(name)) return;
		const normalizedName = normalizeHeaderName(name);
		delete this[NORMALIZED_HEADERS][normalizedName];
		this[RAW_HEADER_NAMES].delete(normalizedName);
	}
	/**
	* Traverses the `Headers` object,
	* calling the given callback for each header.
	*/
	forEach(callback, thisArg) {
		for (const [name, value] of this.entries()) callback.call(thisArg, value, name, this);
	}
	/**
	* Returns an array containing the values
	* of all Set-Cookie headers associated
	* with a response
	*/
	getSetCookie() {
		const setCookieHeader = this.get("set-cookie");
		if (setCookieHeader === null) return [];
		if (setCookieHeader === "") return [""];
		return (0, import_set_cookie_parser.splitCookiesString)(setCookieHeader);
	}
};
const { message } = statuses_default;
const kSetCookie = Symbol("kSetCookie");
function normalizeResponseInit(init = {}) {
	const status = init?.status || 200;
	const statusText = init?.statusText || message[status] || "";
	const headers = new Headers(init?.headers);
	return {
		...init,
		headers,
		status,
		statusText
	};
}
function decorateResponse(response, init) {
	if (init.type) Object.defineProperty(response, "type", {
		value: init.type,
		enumerable: true,
		writable: false
	});
	const responseCookies = init.headers.get("set-cookie");
	if (responseCookies) {
		Object.defineProperty(response, kSetCookie, {
			value: responseCookies,
			enumerable: false,
			writable: false
		});
		if (typeof document !== "undefined") {
			const responseCookiePairs = Headers$1.prototype.getSetCookie.call(init.headers);
			for (const cookieString of responseCookiePairs) document.cookie = cookieString;
		}
	}
	return response;
}
const bodyType = Symbol("bodyType");
var HttpResponse = class HttpResponse$1 extends FetchResponse {
	[bodyType] = null;
	constructor(body, init) {
		const responseInit = normalizeResponseInit(init);
		super(body, responseInit);
		decorateResponse(this, responseInit);
	}
	static error() {
		return super.error();
	}
	/**
	* Create a `Response` with a `Content-Type: "text/plain"` body.
	* @example
	* HttpResponse.text('hello world')
	* HttpResponse.text('Error', { status: 500 })
	*/
	static text(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "text/plain");
		if (!responseInit.headers.has("Content-Length")) responseInit.headers.set("Content-Length", body ? new Blob([body]).size.toString() : "0");
		return new HttpResponse$1(body, responseInit);
	}
	/**
	* Create a `Response` with a `Content-Type: "application/json"` body.
	* @example
	* HttpResponse.json({ firstName: 'John' })
	* HttpResponse.json({ error: 'Not Authorized' }, { status: 401 })
	*/
	static json(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "application/json");
		const responseText = JSON.stringify(body);
		if (!responseInit.headers.has("Content-Length")) responseInit.headers.set("Content-Length", responseText ? new Blob([responseText]).size.toString() : "0");
		return new HttpResponse$1(responseText, responseInit);
	}
	/**
	* Create a `Response` with a `Content-Type: "application/xml"` body.
	* @example
	* HttpResponse.xml(`<user name="John" />`)
	* HttpResponse.xml(`<article id="abc-123" />`, { status: 201 })
	*/
	static xml(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "text/xml");
		return new HttpResponse$1(body, responseInit);
	}
	/**
	* Create a `Response` with a `Content-Type: "text/html"` body.
	* @example
	* HttpResponse.html(`<p class="author">Jane Doe</p>`)
	* HttpResponse.html(`<main id="abc-123">Main text</main>`, { status: 201 })
	*/
	static html(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "text/html");
		return new HttpResponse$1(body, responseInit);
	}
	/**
	* Create a `Response` with an `ArrayBuffer` body.
	* @example
	* const buffer = new ArrayBuffer(3)
	* const view = new Uint8Array(buffer)
	* view.set([1, 2, 3])
	*
	* HttpResponse.arrayBuffer(buffer)
	*/
	static arrayBuffer(body, init) {
		const responseInit = normalizeResponseInit(init);
		if (!responseInit.headers.has("Content-Type")) responseInit.headers.set("Content-Type", "application/octet-stream");
		if (body && !responseInit.headers.has("Content-Length")) responseInit.headers.set("Content-Length", body.byteLength.toString());
		return new HttpResponse$1(body, responseInit);
	}
	/**
	* Create a `Response` with a `FormData` body.
	* @example
	* const data = new FormData()
	* data.set('name', 'Alice')
	*
	* HttpResponse.formData(data)
	*/
	static formData(body, init) {
		return new HttpResponse$1(body, normalizeResponseInit(init));
	}
};

//#endregion
//#region ../api/dist/marketplace.msw.js
let SortOrder = /* @__PURE__ */ function(SortOrder$1) {
	SortOrder$1["ASC"] = "ASC";
	SortOrder$1["DESC"] = "DESC";
	return SortOrder$1;
}({});
let PropertyType$1 = /* @__PURE__ */ function(PropertyType$1$1) {
	PropertyType$1$1["INT"] = "INT";
	PropertyType$1$1["STRING"] = "STRING";
	PropertyType$1$1["ARRAY"] = "ARRAY";
	PropertyType$1$1["GENERIC"] = "GENERIC";
	return PropertyType$1$1;
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
let OrderStatus$1 = /* @__PURE__ */ function(OrderStatus$1$1) {
	OrderStatus$1$1["unknown"] = "unknown";
	OrderStatus$1$1["active"] = "active";
	OrderStatus$1$1["inactive"] = "inactive";
	OrderStatus$1$1["expired"] = "expired";
	OrderStatus$1$1["cancelled"] = "cancelled";
	OrderStatus$1$1["filled"] = "filled";
	OrderStatus$1$1["decimals_missing"] = "decimals_missing";
	return OrderStatus$1$1;
}({});
let ContractType$1 = /* @__PURE__ */ function(ContractType$1$1) {
	ContractType$1$1["UNKNOWN"] = "UNKNOWN";
	ContractType$1$1["ERC20"] = "ERC20";
	ContractType$1$1["ERC721"] = "ERC721";
	ContractType$1$1["ERC1155"] = "ERC1155";
	return ContractType$1$1;
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
		return this.fetch(this.url("ListCurrencies"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListCurrenciesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCollectionDetail = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionDetail"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionDetailResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCollectionActiveListingsCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionActiveListingsCurrencies"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionActiveListingsCurrenciesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCollectionActiveOffersCurrencies = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectionActiveOffersCurrencies"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCollectionActiveOffersCurrenciesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getLowestPriceOfferForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetLowestPriceOfferForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetLowestPriceOfferForCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getHighestPriceOfferForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetHighestPriceOfferForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetHighestPriceOfferForCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getLowestPriceListingForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetLowestPriceListingForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetLowestPriceListingForCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getHighestPriceListingForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetHighestPriceListingForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetHighestPriceListingForCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listListingsForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("ListListingsForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListListingsForCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listOffersForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("ListOffersForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListOffersForCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listOrdersWithCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("ListOrdersWithCollectibles"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListOrdersWithCollectiblesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCountOfAllOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfAllOrders"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfAllOrdersResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCountOfFilteredOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfFilteredOrders"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfFilteredOrdersResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listListings = (req, headers, signal) => {
		return this.fetch(this.url("ListListings"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListListingsResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listOffers = (req, headers, signal) => {
		return this.fetch(this.url("ListOffers"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListOffersResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCountOfListingsForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfListingsForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfListingsForCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCountOfOffersForCollectible = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfOffersForCollectible"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfOffersForCollectibleResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCollectibleLowestOffer = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleLowestOffer"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleLowestOfferResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCollectibleHighestOffer = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleHighestOffer"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleHighestOfferResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCollectibleLowestListing = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleLowestListing"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleLowestListingResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCollectibleHighestListing = (req, headers, signal) => {
		return this.fetch(this.url("GetCollectibleHighestListing"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCollectibleHighestListingResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listCollectibleListings = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibleListings"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListCollectibleListingsResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listCollectibleOffers = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibleOffers"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListCollectibleOffersResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	generateBuyTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateBuyTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GenerateBuyTransactionResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	generateSellTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateSellTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GenerateSellTransactionResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	generateListingTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateListingTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GenerateListingTransactionResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	generateOfferTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateOfferTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GenerateOfferTransactionResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	generateCancelTransaction = (req, headers, signal) => {
		return this.fetch(this.url("GenerateCancelTransaction"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GenerateCancelTransactionResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	execute = (req, headers, signal) => {
		return this.fetch(this.url("Execute"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ExecuteResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibles"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCountOfAllCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfAllCollectibles"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfAllCollectiblesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCountOfFilteredCollectibles = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfFilteredCollectibles"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfFilteredCollectiblesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getFloorOrder = (req, headers, signal) => {
		return this.fetch(this.url("GetFloorOrder"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetFloorOrderResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listCollectionActivities = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectionActivities"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListCollectionActivitiesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listCollectibleActivities = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectibleActivities"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListCollectibleActivitiesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listCollectiblesWithLowestListing = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectiblesWithLowestListing"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesWithLowestListingResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listCollectiblesWithHighestOffer = (req, headers, signal) => {
		return this.fetch(this.url("ListCollectiblesWithHighestOffer"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListCollectiblesWithHighestOfferResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	syncOrder = (req, headers, signal) => {
		return this.fetch(this.url("SyncOrder"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "SyncOrderResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	syncOrders = (req, headers, signal) => {
		return this.fetch(this.url("SyncOrders"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "SyncOrdersResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getOrders = (req, headers, signal) => {
		return this.fetch(this.url("GetOrders"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetOrdersResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	checkoutOptionsMarketplace = (req, headers, signal) => {
		return this.fetch(this.url("CheckoutOptionsMarketplace"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "CheckoutOptionsMarketplaceResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	checkoutOptionsSalesContract = (req, headers, signal) => {
		return this.fetch(this.url("CheckoutOptionsSalesContract"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "CheckoutOptionsSalesContractResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	supportedMarketplaces = (req, headers, signal) => {
		return this.fetch(this.url("SupportedMarketplaces"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "SupportedMarketplacesResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getPrimarySaleItem = (req, headers, signal) => {
		return this.fetch(this.url("GetPrimarySaleItem"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetPrimarySaleItemResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	listPrimarySaleItems = (req, headers, signal) => {
		return this.fetch(this.url("ListPrimarySaleItems"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "ListPrimarySaleItemsResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
	getCountOfPrimarySaleItems = (req, headers, signal) => {
		return this.fetch(this.url("GetCountOfPrimarySaleItems"), createHttpRequest(JsonEncode(req), headers, signal)).then((res) => {
			return buildResponse$1(res).then((_data) => {
				return JsonDecode(_data, "GetCountOfPrimarySaleItemsResponse");
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError$1.new({ cause: `fetch(): ${error$1 instanceof Error ? error$1.message : String(error$1)}` });
		});
	};
};
const createHttpRequest = (body = "{}", headers = {}, signal = null) => {
	return {
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json",
			[WebrpcHeader$1]: WebrpcHeaderValue$1
		},
		body,
		signal
	};
};
const buildResponse$1 = (res) => {
	return res.text().then((text) => {
		let data;
		try {
			data = JSON.parse(text);
		} catch (error$1) {
			throw WebrpcBadResponseError$1.new({
				status: res.status,
				cause: `JSON.parse(): ${error$1 instanceof Error ? error$1.message : String(error$1)}: response text: ${text}`
			});
		}
		if (!res.ok) throw (webrpcErrorByCode$1[typeof data.code === "number" ? data.code : 0] || WebrpcError$1).new(data);
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
	constructor(error$1 = {}) {
		super(error$1.message);
		this.name = error$1.name || "WebrpcEndpointError";
		this.code = typeof error$1.code === "number" ? error$1.code : 0;
		this.message = error$1.message || `endpoint error`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
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
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcEndpoint";
		this.code = typeof error$1.code === "number" ? error$1.code : 0;
		this.message = error$1.message || `endpoint error`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcEndpointError$2.prototype);
	}
};
var WebrpcRequestFailedError$1 = class WebrpcRequestFailedError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcRequestFailed";
		this.code = typeof error$1.code === "number" ? error$1.code : -1;
		this.message = error$1.message || `request failed`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcRequestFailedError$2.prototype);
	}
};
var WebrpcBadRouteError$1 = class WebrpcBadRouteError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcBadRoute";
		this.code = typeof error$1.code === "number" ? error$1.code : -2;
		this.message = error$1.message || `bad route`;
		this.status = typeof error$1.status === "number" ? error$1.status : 404;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcBadRouteError$2.prototype);
	}
};
var WebrpcBadMethodError$1 = class WebrpcBadMethodError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcBadMethod";
		this.code = typeof error$1.code === "number" ? error$1.code : -3;
		this.message = error$1.message || `bad method`;
		this.status = typeof error$1.status === "number" ? error$1.status : 405;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcBadMethodError$2.prototype);
	}
};
var WebrpcBadRequestError$1 = class WebrpcBadRequestError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcBadRequest";
		this.code = typeof error$1.code === "number" ? error$1.code : -4;
		this.message = error$1.message || `bad request`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcBadRequestError$2.prototype);
	}
};
var WebrpcBadResponseError$1 = class WebrpcBadResponseError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcBadResponse";
		this.code = typeof error$1.code === "number" ? error$1.code : -5;
		this.message = error$1.message || `bad response`;
		this.status = typeof error$1.status === "number" ? error$1.status : 500;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcBadResponseError$2.prototype);
	}
};
var WebrpcServerPanicError$1 = class WebrpcServerPanicError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcServerPanic";
		this.code = typeof error$1.code === "number" ? error$1.code : -6;
		this.message = error$1.message || `server panic`;
		this.status = typeof error$1.status === "number" ? error$1.status : 500;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcServerPanicError$2.prototype);
	}
};
var WebrpcInternalErrorError$1 = class WebrpcInternalErrorError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcInternalError";
		this.code = typeof error$1.code === "number" ? error$1.code : -7;
		this.message = error$1.message || `internal error`;
		this.status = typeof error$1.status === "number" ? error$1.status : 500;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcInternalErrorError$2.prototype);
	}
};
var WebrpcClientAbortedError = class WebrpcClientAbortedError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcClientAborted";
		this.code = typeof error$1.code === "number" ? error$1.code : -8;
		this.message = error$1.message || `request aborted by client`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcClientAbortedError$1.prototype);
	}
};
var WebrpcStreamLostError$1 = class WebrpcStreamLostError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcStreamLost";
		this.code = typeof error$1.code === "number" ? error$1.code : -9;
		this.message = error$1.message || `stream lost`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcStreamLostError$2.prototype);
	}
};
var WebrpcStreamFinishedError$1 = class WebrpcStreamFinishedError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "WebrpcStreamFinished";
		this.code = typeof error$1.code === "number" ? error$1.code : -10;
		this.message = error$1.message || `stream finished`;
		this.status = typeof error$1.status === "number" ? error$1.status : 200;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, WebrpcStreamFinishedError$2.prototype);
	}
};
var UnauthorizedError$1 = class UnauthorizedError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "Unauthorized";
		this.code = typeof error$1.code === "number" ? error$1.code : 1e3;
		this.message = error$1.message || `Unauthorized access`;
		this.status = typeof error$1.status === "number" ? error$1.status : 401;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, UnauthorizedError$2.prototype);
	}
};
var PermissionDeniedError$1 = class PermissionDeniedError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "PermissionDenied";
		this.code = typeof error$1.code === "number" ? error$1.code : 1001;
		this.message = error$1.message || `Permission denied`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, PermissionDeniedError$2.prototype);
	}
};
var SessionExpiredError$1 = class SessionExpiredError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "SessionExpired";
		this.code = typeof error$1.code === "number" ? error$1.code : 1002;
		this.message = error$1.message || `Session expired`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, SessionExpiredError$2.prototype);
	}
};
var MethodNotFoundError$1 = class MethodNotFoundError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "MethodNotFound";
		this.code = typeof error$1.code === "number" ? error$1.code : 1003;
		this.message = error$1.message || `Method not found`;
		this.status = typeof error$1.status === "number" ? error$1.status : 404;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, MethodNotFoundError$2.prototype);
	}
};
var RequestConflictError$1 = class RequestConflictError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "RequestConflict";
		this.code = typeof error$1.code === "number" ? error$1.code : 1004;
		this.message = error$1.message || `Conflict with target resource`;
		this.status = typeof error$1.status === "number" ? error$1.status : 409;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, RequestConflictError$2.prototype);
	}
};
var AbortedError = class AbortedError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "Aborted";
		this.code = typeof error$1.code === "number" ? error$1.code : 1005;
		this.message = error$1.message || `Request aborted`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, AbortedError$1.prototype);
	}
};
var GeoblockedError = class GeoblockedError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "Geoblocked";
		this.code = typeof error$1.code === "number" ? error$1.code : 1006;
		this.message = error$1.message || `Geoblocked region`;
		this.status = typeof error$1.status === "number" ? error$1.status : 451;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, GeoblockedError$1.prototype);
	}
};
var RateLimitedError = class RateLimitedError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "RateLimited";
		this.code = typeof error$1.code === "number" ? error$1.code : 1007;
		this.message = error$1.message || `Rate-limited. Please slow down.`;
		this.status = typeof error$1.status === "number" ? error$1.status : 429;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, RateLimitedError$1.prototype);
	}
};
var ProjectNotFoundError$1 = class ProjectNotFoundError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "ProjectNotFound";
		this.code = typeof error$1.code === "number" ? error$1.code : 1008;
		this.message = error$1.message || `Project not found`;
		this.status = typeof error$1.status === "number" ? error$1.status : 401;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, ProjectNotFoundError$2.prototype);
	}
};
var SecretKeyCorsDisallowedError = class SecretKeyCorsDisallowedError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "SecretKeyCorsDisallowed";
		this.code = typeof error$1.code === "number" ? error$1.code : 1009;
		this.message = error$1.message || `CORS disallowed. Admin API Secret Key can't be used from a web app.`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, SecretKeyCorsDisallowedError$1.prototype);
	}
};
var AccessKeyNotFoundError = class AccessKeyNotFoundError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "AccessKeyNotFound";
		this.code = typeof error$1.code === "number" ? error$1.code : 1101;
		this.message = error$1.message || `Access key not found`;
		this.status = typeof error$1.status === "number" ? error$1.status : 401;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, AccessKeyNotFoundError$1.prototype);
	}
};
var AccessKeyMismatchError = class AccessKeyMismatchError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "AccessKeyMismatch";
		this.code = typeof error$1.code === "number" ? error$1.code : 1102;
		this.message = error$1.message || `Access key mismatch`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, AccessKeyMismatchError$1.prototype);
	}
};
var InvalidOriginError = class InvalidOriginError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "InvalidOrigin";
		this.code = typeof error$1.code === "number" ? error$1.code : 1103;
		this.message = error$1.message || `Invalid origin for Access Key`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, InvalidOriginError$1.prototype);
	}
};
var InvalidServiceError = class InvalidServiceError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "InvalidService";
		this.code = typeof error$1.code === "number" ? error$1.code : 1104;
		this.message = error$1.message || `Service not enabled for Access key`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, InvalidServiceError$1.prototype);
	}
};
var UnauthorizedUserError = class UnauthorizedUserError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "UnauthorizedUser";
		this.code = typeof error$1.code === "number" ? error$1.code : 1105;
		this.message = error$1.message || `Unauthorized user`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, UnauthorizedUserError$1.prototype);
	}
};
var InvalidChainError = class InvalidChainError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "InvalidChain";
		this.code = typeof error$1.code === "number" ? error$1.code : 1106;
		this.message = error$1.message || `Network not enabled for Access key`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, InvalidChainError$1.prototype);
	}
};
var QuotaExceededError = class QuotaExceededError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "QuotaExceeded";
		this.code = typeof error$1.code === "number" ? error$1.code : 1200;
		this.message = error$1.message || `Quota request exceeded`;
		this.status = typeof error$1.status === "number" ? error$1.status : 429;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, QuotaExceededError$1.prototype);
	}
};
var QuotaRateLimitError = class QuotaRateLimitError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "QuotaRateLimit";
		this.code = typeof error$1.code === "number" ? error$1.code : 1201;
		this.message = error$1.message || `Quota rate limit exceeded`;
		this.status = typeof error$1.status === "number" ? error$1.status : 429;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, QuotaRateLimitError$1.prototype);
	}
};
var NoDefaultKeyError = class NoDefaultKeyError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "NoDefaultKey";
		this.code = typeof error$1.code === "number" ? error$1.code : 1300;
		this.message = error$1.message || `No default access key found`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, NoDefaultKeyError$1.prototype);
	}
};
var MaxAccessKeysError = class MaxAccessKeysError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "MaxAccessKeys";
		this.code = typeof error$1.code === "number" ? error$1.code : 1301;
		this.message = error$1.message || `Access keys limit reached`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, MaxAccessKeysError$1.prototype);
	}
};
var AtLeastOneKeyError = class AtLeastOneKeyError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "AtLeastOneKey";
		this.code = typeof error$1.code === "number" ? error$1.code : 1302;
		this.message = error$1.message || `You need at least one Access Key`;
		this.status = typeof error$1.status === "number" ? error$1.status : 403;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, AtLeastOneKeyError$1.prototype);
	}
};
var TimeoutError$2 = class TimeoutError$3 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "Timeout";
		this.code = typeof error$1.code === "number" ? error$1.code : 1900;
		this.message = error$1.message || `Request timed out`;
		this.status = typeof error$1.status === "number" ? error$1.status : 408;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, TimeoutError$3.prototype);
	}
};
var NotFoundError$1 = class NotFoundError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "NotFound";
		this.code = typeof error$1.code === "number" ? error$1.code : 2e3;
		this.message = error$1.message || `Resource not found`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, NotFoundError$2.prototype);
	}
};
var InvalidArgumentError$1 = class InvalidArgumentError$2 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "InvalidArgument";
		this.code = typeof error$1.code === "number" ? error$1.code : 2001;
		this.message = error$1.message || `Invalid argument`;
		this.status = typeof error$1.status === "number" ? error$1.status : 400;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, InvalidArgumentError$2.prototype);
	}
};
var NotImplementedError = class NotImplementedError$1 extends WebrpcError$1 {
	constructor(error$1 = {}) {
		super(error$1);
		this.name = error$1.name || "NotImplemented";
		this.code = typeof error$1.code === "number" ? error$1.code : 9999;
		this.message = error$1.message || `Not Implemented`;
		this.status = typeof error$1.status === "number" ? error$1.status : 500;
		if (error$1.cause !== void 0) this.cause = error$1.cause;
		Object.setPrototypeOf(this, NotImplementedError$1.prototype);
	}
};
const webrpcErrorByCode$1 = {
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
	[1e3]: UnauthorizedError$1,
	[1001]: PermissionDeniedError$1,
	[1002]: SessionExpiredError$1,
	[1003]: MethodNotFoundError$1,
	[1004]: RequestConflictError$1,
	[1005]: AbortedError,
	[1006]: GeoblockedError,
	[1007]: RateLimitedError,
	[1008]: ProjectNotFoundError$1,
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
	[1900]: TimeoutError$2,
	[2e3]: NotFoundError$1,
	[2001]: InvalidArgumentError$1,
	[9999]: NotImplementedError
};
const WebrpcHeader$1 = "Webrpc";
const WebrpcHeaderValue$1 = "webrpc@v0.31.1;gen-typescript@v0.23.1;api-client@v0-25.11.10+051e186";
const mockCurrencies = [{
	chainId: 1,
	contractAddress: zeroAddress,
	status: CurrencyStatus.active,
	name: "Ethereum",
	symbol: "ETH",
	decimals: 18,
	imageUrl: "https://example.com/eth.png",
	exchangeRate: 1800,
	defaultChainCurrency: false,
	nativeCurrency: true,
	openseaListing: true,
	openseaOffer: true,
	createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
}, {
	chainId: 1,
	contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
	name: "USD Coin",
	symbol: "USDC",
	decimals: 6,
	imageUrl: "https://example.com/usdc.png",
	exchangeRate: 1,
	defaultChainCurrency: true,
	nativeCurrency: false,
	openseaListing: true,
	openseaOffer: true,
	status: CurrencyStatus.active,
	createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
}];
const mockTokenMetadata$2 = {
	tokenId: 1n,
	name: "Mock NFT",
	description: "A mock NFT for testing",
	image: "https://example.com/nft.png",
	attributes: [{
		trait_type: "Type",
		value: "Mock"
	}],
	status: MetadataStatus.AVAILABLE
};
const mockOrder = {
	orderId: "0x9876543210987654321098765432109876543210",
	marketplace: MarketplaceKind.sequence_marketplace_v2,
	side: OrderSide.listing,
	status: OrderStatus$1.active,
	chainId: 1,
	originName: "Sequence",
	collectionContractAddress: "0x1234567890123456789012345678901234567890",
	createdBy: "0xabcdef0123456789abcdef0123456789abcdef01",
	priceAmount: 1000000000000000000n,
	priceAmountFormatted: "1.0",
	priceAmountNet: 950000000000000000n,
	priceAmountNetFormatted: "0.95",
	priceCurrencyAddress: "0x1234567890123456789012345678901234567890",
	priceDecimals: 18,
	priceUSD: 1800,
	priceUSDFormatted: "1800.0",
	quantityInitial: 1n,
	quantityInitialFormatted: "1",
	quantityRemaining: 1n,
	quantityRemainingFormatted: "1",
	quantityAvailable: 1n,
	quantityAvailableFormatted: "1",
	quantityDecimals: 0,
	feeBps: 500,
	feeBreakdown: [],
	validFrom: (/* @__PURE__ */ new Date()).toISOString(),
	validUntil: new Date(Date.now() + 864e5).toISOString(),
	blockNumber: 1234567,
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
	slug: "test-order"
};
const mockCollectibleOrder = {
	metadata: mockTokenMetadata$2,
	order: mockOrder
};
const mockActivity = {
	chainId: 1,
	contractAddress: "0x1234567890123456789012345678901234567890",
	tokenId: 1n,
	action: ActivityAction.listing,
	txHash: "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
	from: "0x1234567890123456789012345678901234567890",
	to: "0xabcdef0123456789abcdef0123456789abcdef01",
	quantity: 1n,
	quantityDecimals: 0,
	priceAmount: 1000000000000000000n,
	priceAmountFormatted: "1.0",
	priceCurrencyAddress: "0x1234567890123456789012345678901234567890",
	priceDecimals: 18,
	activityCreatedAt: (/* @__PURE__ */ new Date()).toISOString(),
	uniqueHash: "0x9876543210987654321098765432109876543210",
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
const mockCollection = {
	status: CollectionStatus.active,
	chainId: 1,
	contractAddress: "0x1234567890123456789012345678901234567890",
	contractType: ContractType$1.ERC721,
	priority: CollectionPriority.normal,
	tokenQuantityDecimals: 0,
	config: {
		lastSynced: {},
		collectiblesSynced: (/* @__PURE__ */ new Date()).toISOString(),
		activitiesSynced: (/* @__PURE__ */ new Date()).toISOString(),
		activitiesSyncedContinuity: (/* @__PURE__ */ new Date()).toISOString()
	},
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
const createMockStep = (step) => ({
	id: step,
	data: "0x...",
	to: "0x1234567890123456789012345678901234567890",
	value: 0n,
	price: 0n
});
const createMockSteps = (steps) => steps.map(createMockStep);
const mockCheckoutOptions = { options: {
	crypto: TransactionCrypto.all,
	swap: [],
	nftCheckout: [],
	onRamp: []
} };
let isDebugEnabled$2 = false;
const debugLog$2 = (endpoint, request, response) => {
	if (isDebugEnabled$2) console.log(`[MSW Debug] ${endpoint}:`, {
		request,
		response
	});
};
const mockMarketplaceEndpoint = (endpoint) => `*/rpc/Marketplace/${endpoint}`;
const mockMarketplaceHandler = (endpoint, response) => {
	return http.post(mockMarketplaceEndpoint(endpoint), (request) => {
		debugLog$2(endpoint, request, response);
		return HttpResponse.json(response);
	});
};
const mockOrderBigInt = {
	...mockOrder,
	priceAmount: BigInt(mockOrder.priceAmount),
	priceAmountNet: BigInt(mockOrder.priceAmountNet)
};
const handlers$3 = [
	mockMarketplaceHandler("ListCurrencies", { currencies: mockCurrencies }),
	mockMarketplaceHandler("GetCollectible", { metadata: mockTokenMetadata$2 }),
	mockMarketplaceHandler("ListCollectibles", {
		collectibles: [mockCollectibleOrder],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("GetFloorOrder", { collectible: mockCollectibleOrder }),
	mockMarketplaceHandler("ListCollectionActivities", {
		activities: [mockActivity],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("ListCollectibleActivities", {
		activities: [mockActivity],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("GetOrders", {
		orders: [mockOrder],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("GetLowestPriceOfferForCollectible", { order: mockOrder }),
	mockMarketplaceHandler("GetHighestPriceOfferForCollectible", { order: mockOrder }),
	mockMarketplaceHandler("GetLowestPriceListingForCollectible", { order: mockOrder }),
	mockMarketplaceHandler("GetHighestPriceListingForCollectible", { order: mockOrder }),
	mockMarketplaceHandler("ListListingsForCollectible", {
		listings: [mockOrder],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("ListOffersForCollectible", {
		offers: [mockOrder],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("GetCountOfListingsForCollectible", { count: 1 }),
	mockMarketplaceHandler("GetCountOfOffersForCollectible", { count: 1 }),
	mockMarketplaceHandler("GetCollectionDetail", { collection: mockCollection }),
	mockMarketplaceHandler("GetCollectionActiveListingsCurrencies", { currencies: mockCurrencies }),
	mockMarketplaceHandler("GetCollectionActiveOffersCurrencies", { currencies: mockCurrencies }),
	mockMarketplaceHandler("GetCollectibleLowestOffer", { order: mockOrder }),
	mockMarketplaceHandler("GetCollectibleHighestOffer", { order: mockOrder }),
	mockMarketplaceHandler("GetCollectibleLowestListing", { order: mockOrder }),
	mockMarketplaceHandler("GetCollectibleHighestListing", { order: mockOrder }),
	mockMarketplaceHandler("ListCollectibleListings", {
		listings: [mockOrder],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("ListCollectibleOffers", {
		offers: [mockOrder],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("GenerateBuyTransaction", {
		resp: {
			steps: createMockSteps([StepType.buy]),
			canBeUsedWithTrails: false
		},
		steps: createMockSteps([StepType.buy])
	}),
	mockMarketplaceHandler("GenerateSellTransaction", {
		resp: {
			steps: createMockSteps([StepType.tokenApproval, StepType.sell]),
			canBeUsedWithTrails: false
		},
		steps: createMockSteps([StepType.tokenApproval, StepType.sell])
	}),
	mockMarketplaceHandler("GenerateListingTransaction", { steps: createMockSteps([StepType.tokenApproval, StepType.createListing]) }),
	http.post(mockMarketplaceEndpoint("GenerateOfferTransaction"), async ({ request }) => {
		const body = await request.json();
		const steps = body?.walletType === WalletKind.sequence ? createMockSteps([StepType.createOffer]) : createMockSteps([StepType.tokenApproval, StepType.createOffer]);
		debugLog$2("GenerateOfferTransaction", body, { steps });
		return HttpResponse.json({ steps });
	}),
	mockMarketplaceHandler("GenerateCancelTransaction", { steps: createMockSteps([StepType.cancel]) }),
	mockMarketplaceHandler("Execute", { orderId: "0x9876543210987654321098765432109876543210" }),
	mockMarketplaceHandler("GetCountOfAllCollectibles", { count: 100 }),
	mockMarketplaceHandler("GetCountOfFilteredCollectibles", { count: 50 }),
	mockMarketplaceHandler("ListCollectiblesWithLowestListing", {
		collectibles: [mockCollectibleOrder],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("ListCollectiblesWithHighestOffer", {
		collectibles: [mockCollectibleOrder],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	mockMarketplaceHandler("SyncOrder", {}),
	mockMarketplaceHandler("SyncOrders", {}),
	mockMarketplaceHandler("CheckoutOptionsSalesContract", { options: {
		crypto: TransactionCrypto.all,
		swap: [],
		nftCheckout: [],
		onRamp: []
	} }),
	mockMarketplaceHandler("CheckoutOptionsMarketplace", mockCheckoutOptions)
];

//#endregion
//#region ../api/dist/builder.msw.js
var builder_gen_exports = /* @__PURE__ */ __export({
	AlreadyCollaboratorError: () => AlreadyCollaboratorError,
	EmailTemplateExistsError: () => EmailTemplateExistsError,
	FeatureNotIncludedError: () => FeatureNotIncludedError,
	FilterCondition: () => FilterCondition,
	InvalidArgumentError: () => InvalidArgumentError,
	InvalidNetworkError: () => InvalidNetworkError,
	InvalidTierError: () => InvalidTierError,
	InvitationExpiredError: () => InvitationExpiredError,
	MarketplaceService: () => MarketplaceService,
	MarketplaceWalletType: () => MarketplaceWalletType,
	MethodNotFoundError: () => MethodNotFoundError,
	NotFoundError: () => NotFoundError,
	PermissionDeniedError: () => PermissionDeniedError,
	ProjectNotFoundError: () => ProjectNotFoundError,
	RequestConflictError: () => RequestConflictError,
	ServiceDisabledError: () => ServiceDisabledError,
	SessionExpiredError: () => SessionExpiredError,
	SubscriptionLimitError: () => SubscriptionLimitError,
	TimeoutError: () => TimeoutError$1,
	UnauthorizedError: () => UnauthorizedError,
	UserNotFoundError: () => UserNotFoundError,
	WebrpcBadMethodError: () => WebrpcBadMethodError,
	WebrpcBadRequestError: () => WebrpcBadRequestError,
	WebrpcBadResponseError: () => WebrpcBadResponseError,
	WebrpcBadRouteError: () => WebrpcBadRouteError,
	WebrpcClientDisconnectedError: () => WebrpcClientDisconnectedError,
	WebrpcEndpointError: () => WebrpcEndpointError,
	WebrpcError: () => WebrpcError,
	WebrpcErrorCodes: () => WebrpcErrorCodes,
	WebrpcHeader: () => WebrpcHeader,
	WebrpcHeaderValue: () => WebrpcHeaderValue,
	WebrpcInternalErrorError: () => WebrpcInternalErrorError,
	WebrpcRequestFailedError: () => WebrpcRequestFailedError,
	WebrpcServerPanicError: () => WebrpcServerPanicError,
	WebrpcStreamFinishedError: () => WebrpcStreamFinishedError,
	WebrpcStreamLostError: () => WebrpcStreamLostError,
	errors: () => errors,
	webrpcErrorByCode: () => webrpcErrorByCode
});
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
var WebrpcError = class WebrpcError$2 extends Error {
	name;
	code;
	message;
	status;
	cause;
	/** @deprecated Use message instead of msg. Deprecated in webrpc v0.11.0. */
	msg;
	constructor(name, code, message$2, status, cause) {
		super(message$2);
		this.name = name || "WebrpcError";
		this.code = typeof code === "number" ? code : 0;
		this.message = message$2 || `endpoint error ${this.code}`;
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
	constructor(name = "WebrpcEndpoint", code = 0, message$2 = "endpoint error", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcEndpointError$2.prototype);
	}
};
var WebrpcRequestFailedError = class WebrpcRequestFailedError$2 extends WebrpcError {
	constructor(name = "WebrpcRequestFailed", code = -1, message$2 = "request failed", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcRequestFailedError$2.prototype);
	}
};
var WebrpcBadRouteError = class WebrpcBadRouteError$2 extends WebrpcError {
	constructor(name = "WebrpcBadRoute", code = -2, message$2 = "bad route", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcBadRouteError$2.prototype);
	}
};
var WebrpcBadMethodError = class WebrpcBadMethodError$2 extends WebrpcError {
	constructor(name = "WebrpcBadMethod", code = -3, message$2 = "bad method", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcBadMethodError$2.prototype);
	}
};
var WebrpcBadRequestError = class WebrpcBadRequestError$2 extends WebrpcError {
	constructor(name = "WebrpcBadRequest", code = -4, message$2 = "bad request", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcBadRequestError$2.prototype);
	}
};
var WebrpcBadResponseError = class WebrpcBadResponseError$2 extends WebrpcError {
	constructor(name = "WebrpcBadResponse", code = -5, message$2 = "bad response", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcBadResponseError$2.prototype);
	}
};
var WebrpcServerPanicError = class WebrpcServerPanicError$2 extends WebrpcError {
	constructor(name = "WebrpcServerPanic", code = -6, message$2 = "server panic", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcServerPanicError$2.prototype);
	}
};
var WebrpcInternalErrorError = class WebrpcInternalErrorError$2 extends WebrpcError {
	constructor(name = "WebrpcInternalError", code = -7, message$2 = "internal error", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcInternalErrorError$2.prototype);
	}
};
var WebrpcClientDisconnectedError = class WebrpcClientDisconnectedError$1 extends WebrpcError {
	constructor(name = "WebrpcClientDisconnected", code = -8, message$2 = "client disconnected", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcClientDisconnectedError$1.prototype);
	}
};
var WebrpcStreamLostError = class WebrpcStreamLostError$2 extends WebrpcError {
	constructor(name = "WebrpcStreamLost", code = -9, message$2 = "stream lost", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcStreamLostError$2.prototype);
	}
};
var WebrpcStreamFinishedError = class WebrpcStreamFinishedError$2 extends WebrpcError {
	constructor(name = "WebrpcStreamFinished", code = -10, message$2 = "stream finished", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, WebrpcStreamFinishedError$2.prototype);
	}
};
var UnauthorizedError = class UnauthorizedError$2 extends WebrpcError {
	constructor(name = "Unauthorized", code = 1e3, message$2 = "Unauthorized access", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, UnauthorizedError$2.prototype);
	}
};
var PermissionDeniedError = class PermissionDeniedError$2 extends WebrpcError {
	constructor(name = "PermissionDenied", code = 1001, message$2 = "Permission denied", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, PermissionDeniedError$2.prototype);
	}
};
var SessionExpiredError = class SessionExpiredError$2 extends WebrpcError {
	constructor(name = "SessionExpired", code = 1002, message$2 = "Session expired", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, SessionExpiredError$2.prototype);
	}
};
var MethodNotFoundError = class MethodNotFoundError$2 extends WebrpcError {
	constructor(name = "MethodNotFound", code = 1003, message$2 = "Method not found", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, MethodNotFoundError$2.prototype);
	}
};
var RequestConflictError = class RequestConflictError$2 extends WebrpcError {
	constructor(name = "RequestConflict", code = 1004, message$2 = "Conflict with target resource", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, RequestConflictError$2.prototype);
	}
};
var ServiceDisabledError = class ServiceDisabledError$1 extends WebrpcError {
	constructor(name = "ServiceDisabled", code = 1005, message$2 = "Service disabled", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, ServiceDisabledError$1.prototype);
	}
};
var TimeoutError$1 = class TimeoutError$3 extends WebrpcError {
	constructor(name = "Timeout", code = 2e3, message$2 = "Request timed out", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, TimeoutError$3.prototype);
	}
};
var InvalidArgumentError = class InvalidArgumentError$2 extends WebrpcError {
	constructor(name = "InvalidArgument", code = 2001, message$2 = "Invalid argument", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, InvalidArgumentError$2.prototype);
	}
};
var NotFoundError = class NotFoundError$2 extends WebrpcError {
	constructor(name = "NotFound", code = 3e3, message$2 = "Resource not found", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, NotFoundError$2.prototype);
	}
};
var UserNotFoundError = class UserNotFoundError$1 extends WebrpcError {
	constructor(name = "UserNotFound", code = 3001, message$2 = "User not found", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, UserNotFoundError$1.prototype);
	}
};
var ProjectNotFoundError = class ProjectNotFoundError$2 extends WebrpcError {
	constructor(name = "ProjectNotFound", code = 3002, message$2 = "Project not found", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, ProjectNotFoundError$2.prototype);
	}
};
var InvalidTierError = class InvalidTierError$1 extends WebrpcError {
	constructor(name = "InvalidTier", code = 3003, message$2 = "Invalid subscription tier", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, InvalidTierError$1.prototype);
	}
};
var EmailTemplateExistsError = class EmailTemplateExistsError$1 extends WebrpcError {
	constructor(name = "EmailTemplateExists", code = 3004, message$2 = "Email Template exists", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, EmailTemplateExistsError$1.prototype);
	}
};
var SubscriptionLimitError = class SubscriptionLimitError$1 extends WebrpcError {
	constructor(name = "SubscriptionLimit", code = 3005, message$2 = "Subscription limit reached", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, SubscriptionLimitError$1.prototype);
	}
};
var FeatureNotIncludedError = class FeatureNotIncludedError$1 extends WebrpcError {
	constructor(name = "FeatureNotIncluded", code = 3006, message$2 = "Feature not included", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, FeatureNotIncludedError$1.prototype);
	}
};
var InvalidNetworkError = class InvalidNetworkError$1 extends WebrpcError {
	constructor(name = "InvalidNetwork", code = 3007, message$2 = "Invalid network", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, InvalidNetworkError$1.prototype);
	}
};
var InvitationExpiredError = class InvitationExpiredError$1 extends WebrpcError {
	constructor(name = "InvitationExpired", code = 4e3, message$2 = "Invitation code is expired", status = 0, cause) {
		super(name, code, message$2, status, cause);
		Object.setPrototypeOf(this, InvitationExpiredError$1.prototype);
	}
};
var AlreadyCollaboratorError = class AlreadyCollaboratorError$1 extends WebrpcError {
	constructor(name = "AlreadyCollaborator", code = 4001, message$2 = "Already a collaborator", status = 0, cause) {
		super(name, code, message$2, status, cause);
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
const webrpcErrorByCode = {
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
	1e3: UnauthorizedError,
	1001: PermissionDeniedError,
	1002: SessionExpiredError,
	1003: MethodNotFoundError,
	1004: RequestConflictError,
	1005: ServiceDisabledError,
	2e3: TimeoutError$1,
	2001: InvalidArgumentError,
	3e3: NotFoundError,
	3001: UserNotFoundError,
	3002: ProjectNotFoundError,
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
			return buildResponse(res).then((_data) => {
				return {
					marketplace: _data.marketplace,
					marketCollections: _data.marketCollections,
					shopCollections: _data.shopCollections
				};
			});
		}, (error$1) => {
			throw WebrpcRequestFailedError.new({ cause: `lookupMarketplace(): ${error$1.message || ""}` });
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
		} catch (error$1) {
			let message$2 = "";
			if (error$1 instanceof Error) message$2 = error$1.message;
			throw WebrpcBadResponseError.new({
				status: res.status,
				cause: `JSON.parse(): ${message$2}: response text: ${text}`
			});
		}
		if (!res.ok) throw (webrpcErrorByCode[typeof data.code === "number" ? data.code : 0] || WebrpcError).new(data);
		return data;
	});
};
const mockMarketCollections = [{
	id: 1,
	projectId: 1,
	contractType: "ERC721",
	itemsAddress: zeroAddress,
	chainId: 1,
	currencyOptions: mockCurrencies.map((c) => c.contractAddress),
	bannerUrl: "",
	feePercentage: 3.5,
	destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
	filterSettings: {
		filterOrder: ["Type", "Rarity"],
		exclusions: [{
			key: "Type",
			condition: FilterCondition.SPECIFIC_VALUE,
			value: "Sample"
		}]
	},
	createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
}, {
	id: 2,
	projectId: 1,
	contractType: "ERC1155",
	itemsAddress: "0x1234567890123456789012345678901234567890",
	chainId: 137,
	currencyOptions: [mockCurrencies[0].contractAddress],
	bannerUrl: "https://example.com/collection-banner.png",
	feePercentage: 2.5,
	destinationMarketplace: OrderbookKind.opensea,
	filterSettings: {
		filterOrder: [
			"Category",
			"Level",
			"Element"
		],
		exclusions: [{
			key: "Category",
			condition: FilterCondition.ENTIRE_KEY
		}, {
			key: "Level",
			condition: FilterCondition.SPECIFIC_VALUE,
			value: "Legendary"
		}]
	},
	createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
}];
const mockShopCollections = [{
	id: 1,
	projectId: 1,
	chainId: 1,
	itemsAddress: zeroAddress,
	saleAddress: zeroAddress,
	name: "Mock Shop Collection",
	bannerUrl: "https://example.com/shop-banner.png",
	saleBannerUrl: "https://example.com/shop-sale-banner.png",
	tokenIds: [
		"1",
		"2",
		"3"
	],
	customTokenIds: [],
	private: false,
	createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
}, {
	id: 2,
	projectId: 1,
	chainId: 137,
	itemsAddress: "0x1234567890123456789012345678901234567890",
	saleAddress: "0x1234567890123456789012345678901234567890",
	name: "Polygon Shop Collection",
	bannerUrl: "https://example.com/polygon-shop-banner.png",
	saleBannerUrl: "https://example.com/polygon-shop-sale-banner.png",
	tokenIds: [
		"4",
		"5",
		"6"
	],
	customTokenIds: [],
	private: false,
	createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
	updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
}];
const mockConfig = {
	marketplace: {
		projectId: 1,
		settings: {
			style: {},
			publisherId: "publisher-1",
			title: "Mock Marketplace",
			socials: {
				twitter: "https://twitter.com/mock",
				discord: "https://discord.gg/mock",
				website: "https://mock.com",
				tiktok: "https://tiktok.com/@mock",
				instagram: "https://instagram.com/mock",
				youtube: "https://youtube.com/mock"
			},
			faviconUrl: "https://example.com/favicon.ico",
			walletOptions: {
				walletType: MarketplaceWalletType.UNIVERSAL,
				oidcIssuers: {},
				connectors: [],
				includeEIP6963Wallets: true
			},
			logoUrl: "https://example.com/logo.png",
			fontUrl: "https://example.com/font.woff2",
			accessKey: "mock-access-key"
		},
		market: {
			enabled: true,
			bannerUrl: "https://example.com/market-banner.png",
			ogImage: "https://example.com/og-image.png",
			private: false
		},
		shop: {
			enabled: true,
			bannerUrl: "https://example.com/shop-banner.png",
			ogImage: "https://example.com/shop-og-image.png",
			private: false
		},
		createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
	},
	marketCollections: [{
		id: 1,
		projectId: 1,
		chainId: 1,
		itemsAddress: zeroAddress,
		contractType: "ERC721",
		bannerUrl: "https://example.com/market-banner.png",
		feePercentage: 3.5,
		currencyOptions: mockCurrencies.map((c) => c.contractAddress),
		destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
		filterSettings: {
			filterOrder: ["Type", "Rarity"],
			exclusions: [{
				key: "Type",
				condition: FilterCondition.SPECIFIC_VALUE,
				value: "Sample"
			}]
		},
		private: false,
		createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
	}, {
		id: 2,
		projectId: 1,
		chainId: 137,
		itemsAddress: "0x1234567890123456789012345678901234567890",
		contractType: "ERC1155",
		bannerUrl: "https://example.com/collection-banner.png",
		feePercentage: 2.5,
		currencyOptions: [mockCurrencies[0].contractAddress],
		destinationMarketplace: OrderbookKind.opensea,
		filterSettings: {
			filterOrder: [
				"Category",
				"Level",
				"Element"
			],
			exclusions: [{
				key: "Category",
				condition: FilterCondition.ENTIRE_KEY
			}, {
				key: "Level",
				condition: FilterCondition.SPECIFIC_VALUE,
				value: "Legendary"
			}]
		},
		private: false,
		createdAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString(),
		updatedAt: (/* @__PURE__ */ new Date("2025-03-16T13:04:16.098Z")).toISOString()
	}],
	shopCollections: mockShopCollections
};
const mockLookupMarketplaceError = () => {
	return HttpResponse.json({
		code: 3e3,
		msg: "Project not found"
	}, { status: 404 });
};
const createLookupMarketplaceHandler = (config = mockConfig) => http.post("*/rpc/MarketplaceService/LookupMarketplace", () => {
	return HttpResponse.json({ ...config });
});
const createLookupMarketplaceErrorHandler = () => http.post("*/rpc/MarketplaceService/LookupMarketplace", () => {
	return mockLookupMarketplaceError();
});
const handlers$2 = [createLookupMarketplaceHandler(), createLookupMarketplaceErrorHandler()];

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
//#region ../api/dist/indexer.msw.js
function toContractInfo(raw) {
	return spreadWith(raw, {
		chainId: normalizeChainId(raw.chainId),
		address: normalizeAddress(raw.address),
		extensions: transformOptional(raw.extensions, (ext) => {
			const result = { ...ext };
			if (ext.originChainId !== void 0) result.originChainId = normalizeChainId(ext.originChainId);
			if (ext.originAddress !== void 0) result.originAddress = normalizeAddress(ext.originAddress);
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
	return {
		accountAddress: normalizeAddress(raw.accountAddress),
		chainId: normalizeChainId(raw.chainId),
		balance: BigInt(raw.balance),
		errorReason: raw.error
	};
}
function toTokenBalance(raw) {
	const { tokenID, ...rest } = raw;
	return spreadWith(rest, {
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
	const result = {
		txnHash: raw.txnHash,
		blockHash: raw.blockHash,
		blockNumber: raw.blockNumber,
		txnIndex: raw.txnIndex,
		gasUsed: raw.gasUsed,
		effectiveGasPrice: transformOptional(raw.effectiveGasPrice, BigInt),
		logs: transformOptionalArray(raw.logs, (log) => ({
			address: normalizeAddress(log.contractAddress),
			topics: log.topics,
			data: log.data,
			logIndex: log.index
		}))
	};
	if (raw.from !== void 0) result.from = normalizeAddress(raw.from);
	if (raw.to !== void 0) result.to = normalizeAddress(raw.to);
	return result;
}
function toTokenIDRange(raw) {
	return {
		startTokenId: normalizeTokenId(raw.start),
		endTokenId: normalizeTokenId(raw.end)
	};
}
function toPage(raw) {
	if (!raw) return void 0;
	return {
		page: raw.page || 0,
		pageSize: raw.pageSize || 0,
		more: raw.more || false
	};
}
function toGetTokenBalancesResponse(raw) {
	return {
		balances: transformArray(raw.balances, toTokenBalance),
		page: toPage(raw.page)
	};
}
function toGetTokenSuppliesResponse(raw, contractAddress) {
	return {
		contractType: raw.contractType,
		contractAddress,
		supplies: transformOptionalArray(raw.tokenIDs, (tokenSupply) => toTokenSupply(tokenSupply, contractAddress)) || [],
		page: toPage(raw.page)
	};
}
function toGetTokenIDRangesResponse(raw, contractAddress) {
	return {
		contractAddress,
		ranges: transformOptionalArray(raw.tokenIDRanges, toTokenIDRange) || []
	};
}
function toGetTokenBalancesArgs(req) {
	const { tokenId, ...rest } = req;
	const contractAddress = "collectionAddress" in req && req.collectionAddress ? req.collectionAddress : "contractAddress" in req && req.contractAddress ? req.contractAddress : void 0;
	return {
		...rest,
		...contractAddress && { contractAddress },
		...tokenId !== void 0 && { tokenID: tokenId.toString() }
	};
}
const mockTokenMetadata$1 = {
	tokenId: "1",
	name: "Mock NFT",
	status: ResourceStatus.AVAILABLE,
	description: "A mock NFT for testing",
	image: "https://example.com/nft.png",
	source: "",
	properties: {
		series: "Mock Series",
		edition: 1
	},
	attributes: [{
		trait_type: "Type",
		value: "Mock"
	}, {
		trait_type: "Rarity",
		value: "Common"
	}]
};
const mockContractInfo = {
	chainId: 1,
	address: zeroAddress,
	name: "Mock Contract",
	type: ContractType.ERC721,
	symbol: "MOCK",
	status: ResourceStatus.AVAILABLE,
	decimals: 18,
	logoURI: "https://example.com/logo.png",
	deployed: true,
	bytecodeHash: "0x1234567890",
	extensions: {
		link: "https://example.com",
		description: "A mock contract for testing",
		ogImage: "https://example.com/og.png",
		categories: ["Mock"],
		ogName: "Mock Contract",
		originChainId: 1,
		originAddress: zeroAddress,
		blacklist: false,
		verified: true,
		verifiedBy: "0x",
		featured: true,
		featureIndex: 0
	},
	updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
	source: ""
};
const mockTokenBalance = {
	contractType: ContractType.ERC721,
	contractAddress: zeroAddress,
	accountAddress: "0x1234567890123456789012345678901234567890",
	tokenID: "1",
	balance: "1",
	blockHash: "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
	blockNumber: 1234567,
	chainId: 1,
	uniqueCollectibles: "1",
	isSummary: false,
	contractInfo: mockContractInfo,
	tokenMetadata: mockTokenMetadata$1
};
const mockTokenBalanceNormalized = toTokenBalance(mockTokenBalance);
const mockTokenSupply = {
	tokenID: "1",
	supply: "100",
	chainId: 1,
	contractInfo: mockContractInfo,
	tokenMetadata: mockTokenMetadata$1
};
const mockTransactionReceipt = {
	txnHash: "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
	txnStatus: TransactionStatus.SUCCESSFUL,
	txnIndex: 0,
	txnType: TransactionType.LegacyTxnType,
	blockHash: "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
	blockNumber: 1234567,
	gasUsed: 1e5,
	effectiveGasPrice: "20000000000",
	from: "0x1234567890123456789012345678901234567890",
	to: "0x0987654321098765432109876543210987654321",
	logs: [],
	final: true,
	reorged: false
};
const mockOrderbookOrder = {
	orderId: "0x9876543210987654321098765432109876543210",
	tokenContract: zeroAddress,
	tokenId: "1",
	isListing: true,
	quantity: "1",
	quantityRemaining: "1",
	currencyAddress: zeroAddress,
	pricePerToken: "1000000000000000000",
	expiry: new Date(Date.now() + 864e5).toISOString(),
	orderStatus: OrderStatus.OPEN,
	createdBy: "0x1234567890123456789012345678901234567890",
	blockNumber: 1234567,
	orderbookContractAddress: zeroAddress,
	createdAt: Date.now()
};
let isDebugEnabled$1 = false;
const debugLog$1 = (endpoint, request, response) => {
	if (isDebugEnabled$1) console.log(`[MSW Debug] ${endpoint}:`, {
		request,
		response
	});
};
const mockIndexerEndpoint = (endpoint) => `*/rpc/Indexer/${endpoint}`;
const mockIndexerHandler = (endpoint, response) => {
	return http.post(mockIndexerEndpoint(endpoint), () => {
		debugLog$1(endpoint, {}, response);
		return HttpResponse.json(response);
	});
};
const handlers$1 = Object.values({
	GetTokenBalances: mockIndexerHandler("GetTokenBalances", {
		page: {
			page: 1,
			pageSize: 10,
			more: false
		},
		balances: [mockTokenBalance]
	}),
	GetTokenBalancesDetails: mockIndexerHandler("GetTokenBalancesDetails", {
		page: {
			page: 1,
			pageSize: 10,
			more: false
		},
		balances: [mockTokenBalance],
		nativeBalances: []
	}),
	GetTokenSupplies: mockIndexerHandler("GetTokenSupplies", {
		page: {
			page: 1,
			pageSize: 10,
			more: false
		},
		contractType: ContractType.ERC721,
		tokenIDs: [mockTokenSupply]
	}),
	FetchTransactionReceipt: mockIndexerHandler("FetchTransactionReceipt", { receipt: mockTransactionReceipt }),
	GetOrderbookOrders: mockIndexerHandler("GetOrderbookOrders", {
		page: {
			page: 1,
			pageSize: 10,
			more: false
		},
		orders: [mockOrderbookOrder]
	}),
	GetTopOrders: mockIndexerHandler("GetTopOrders", { orders: [mockOrderbookOrder] }),
	GetTokenIDRanges: mockIndexerHandler("GetTokenIDRanges", {
		contractType: ContractType.ERC721,
		tokenIDRanges: [{
			start: "1",
			end: "100"
		}, {
			start: "200",
			end: "299"
		}],
		moreRanges: false
	})
});

//#endregion
//#region ../api/dist/metadata.msw.js
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
let isDebugEnabled = false;
const debugLog = (endpoint, request, response) => {
	if (isDebugEnabled) console.log(`[MSW Debug] ${endpoint}:`, {
		request,
		response
	});
};
const mockEthCollection = {
	address: zeroAddress,
	chainId: 1,
	name: "Mock Collection",
	symbol: "MOCK",
	source: "https://example.com/source",
	status: ResourceStatus$1.AVAILABLE,
	type: "ERC721",
	deployed: true,
	updatedAt: (/* @__PURE__ */ new Date("2025-05-01T04:39:56.936Z")).toISOString(),
	bytecodeHash: "0x1234567890",
	extensions: {
		description: "A mock collection for testing",
		link: "https://example.com",
		ogImage: "https://example.com/image.png",
		ogName: "Mock Collection",
		originAddress: "0x0000000000000000000000000000000000000000",
		originChainId: 1,
		verified: true,
		categories: ["Mock"],
		blacklist: false,
		verifiedBy: "0x",
		featured: true,
		featureIndex: 0
	},
	logoURI: "https://example.com/logo.png"
};
const mockPolCollection = {
	...mockEthCollection,
	address: "0x1234567890123456789012345678901234567890",
	chainId: 137
};
const mockCollections = [mockEthCollection, mockPolCollection];
const mockTokenMetadata = {
	tokenId: "1",
	name: "Mock NFT #1",
	description: "A mock NFT for testing purposes",
	image: "https://example.com/nft.png",
	video: "https://example.com/nft.mp4",
	audio: "https://example.com/nft.mp3",
	properties: {
		series: "Mock Series",
		edition: 1
	},
	attributes: [{
		trait_type: "Type",
		value: "Mock"
	}, {
		trait_type: "Rarity",
		value: "Common"
	}],
	image_data: "data:image/svg+xml;base64,...",
	external_url: "https://example.com/nft/1",
	background_color: "#ffffff",
	animation_url: "https://example.com/nft/1/animation",
	decimals: 0,
	updatedAt: (/* @__PURE__ */ new Date("2025-05-01T04:39:56.936Z")).toISOString(),
	assets: [{
		id: 1,
		collectionId: 1,
		tokenId: "1",
		url: "https://example.com/nft.png",
		metadataField: "image",
		name: "Main Image",
		filesize: 1024,
		mimeType: "image/png",
		width: 1e3,
		height: 1e3,
		updatedAt: (/* @__PURE__ */ new Date("2025-05-01T04:39:56.936Z")).toISOString()
	}],
	source: "",
	status: ResourceStatus$1.NOT_AVAILABLE
};
const mockPropertyFilters = [{
	name: "Type",
	type: PropertyType.STRING,
	values: [
		"Mock",
		"Test",
		"Sample"
	]
}, {
	name: "Rarity",
	type: PropertyType.STRING,
	values: [
		"Common",
		"Uncommon",
		"Rare",
		"Epic",
		"Legendary"
	]
}];
const mockTokenMetadataNormalized = toTokenMetadata$1(mockTokenMetadata);
const mockEthCollectionNormalized = toContractInfo$1(mockEthCollection);
const mockPolCollectionNormalized = toContractInfo$1(mockPolCollection);
const mockMetadataEndpoint = (endpoint) => `*/rpc/Metadata/${endpoint}`;
const mockMetadataHandler = (endpoint, response) => {
	return http.post(mockMetadataEndpoint(endpoint), () => {
		debugLog(endpoint, {}, response);
		return HttpResponse.json(response);
	});
};
const handlers = [
	mockMetadataHandler("GetContractInfo", { contractInfo: mockEthCollection }),
	mockMetadataHandler("GetTokenMetadata", { tokenMetadata: [mockTokenMetadata] }),
	mockMetadataHandler("GetTokenMetadataPropertyFilters", { filters: mockPropertyFilters }),
	mockMetadataHandler("SearchTokenMetadata", {
		tokenMetadata: [mockTokenMetadata],
		page: {
			page: 1,
			pageSize: 10,
			more: false
		}
	}),
	http.post(mockMetadataEndpoint("GetContractInfoBatch"), async (request) => {
		const body = await request.request.json();
		const chainId = Number(body.chainID);
		const contractAddresses = body.contractAddresses;
		const response = { contractInfoMap: mockCollections.filter((collection) => {
			return collection.chainId === chainId && contractAddresses.includes(collection.address);
		}) };
		debugLog("GetContractInfoBatch", request, response);
		return HttpResponse.json(response);
	})
];

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
		const rawResponse = await this.client.getTokenBalancesDetails(args);
		return {
			page: toPage(rawResponse.page) || {
				page: 0,
				pageSize: 0,
				more: false
			},
			nativeBalances: (rawResponse.nativeBalances || []).map(toNativeTokenBalance),
			balances: rawResponse.balances.map(toTokenBalance)
		};
	}
	/**
	* Get token balances by contract with normalized types (bigint)
	*/
	async getTokenBalancesByContract(args) {
		const rawResponse = await this.client.getTokenBalancesByContract(args);
		return {
			page: toPage(rawResponse.page) || {
				page: 0,
				pageSize: 0,
				more: false
			},
			balances: rawResponse.balances.map(toTokenBalance)
		};
	}
	/**
	* Get native token balance with normalized types (bigint)
	*/
	async getNativeTokenBalance(args) {
		return { balance: toNativeTokenBalance((await this.client.getNativeTokenBalance(args)).balance) };
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
	const baseStep = {
		...raw,
		to: normalizeAddress(raw.to)
	};
	if (raw.id === StepType.tokenApproval || raw.id === StepType.buy || raw.id === StepType.sell || raw.id === StepType.cancel || raw.id === StepType.createOffer || raw.id === StepType.createListing) return {
		...baseStep,
		id: raw.id,
		data: raw.data
	};
	if (raw.id === StepType.signEIP191) return {
		...baseStep,
		id: raw.id,
		post: raw.post
	};
	if (raw.id === StepType.signEIP712) {
		if (!raw.signature) throw new Error("EIP-712 step missing signature data");
		return {
			...baseStep,
			id: raw.id,
			post: raw.post,
			signature: toSignature(raw.signature)
		};
	}
	throw new Error(`Unknown step type: ${raw.id}`);
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
	listCollectibleActivities;
	listCollectionActivities;
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
		this.listCollectibleActivities = wrapCollectionAddress((req) => this.client.listCollectibleActivities(req));
		this.listCollectionActivities = wrapCollectionAddress((req) => this.client.listCollectionActivities(req));
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
	constructor(hostname, jwtAuth) {
		if (typeof jwtAuth === "string" || jwtAuth === void 0) this.client = new Metadata(hostname, globalThis.fetch);
		else this.client = new Metadata(hostname, jwtAuth);
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
export { TransactionCrypto as C, StepType as S, WalletKind as T, OrderSide as _, builder_exports as a, PropertyType$1 as b, FilterCondition as c, CollectionStatus as d, CurrencyStatus as f, OfferType as g, MetadataStatus as h, MetadataClient as i, MarketplaceService as l, MarketplaceKind as m, IndexerClient as n, isSignatureStep as o, ExecuteType as p, MarketplaceClient as r, isTransactionStep as s, ContractType$2 as t, MarketplaceWalletType as u, OrderStatus$1 as v, TransactionOnRampProvider as w, SortOrder as x, OrderbookKind as y };
//# sourceMappingURL=dist.js.map