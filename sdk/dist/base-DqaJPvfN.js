//#region src/utils/_internal/error/base.ts
var BaseError = class extends Error {
	details;
	shortMessage;
	name = "MarketplaceSdkBaseError";
	constructor(shortMessage, options = {}) {
		super();
		const details = "details" in options ? options.details : "";
		this.message = [
			shortMessage || "An error occurred.",
			"",
			...details ? [`Details: ${details}`] : []
		].join("\n");
		if ("cause" in options && options.cause) this.cause = options.cause;
		this.details = details || "";
		this.shortMessage = shortMessage;
	}
};

//#endregion
export { BaseError };
//# sourceMappingURL=base-DqaJPvfN.js.map