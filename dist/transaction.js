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
//#region src/utils/_internal/error/transaction.ts
var TransactionError = class extends BaseError {
	name = "TransactionError";
};
var ChainSwitchError = class extends TransactionError {
	name = "ChainSwitchError";
	constructor(currentChainId, targetChainId) {
		super(`Failed to switch network from ${currentChainId} to ${targetChainId}`, { details: "The user may have rejected the network switch or there might be a network connectivity issue." });
	}
};
var TransactionExecutionError = class extends TransactionError {
	name = "TransactionExecutionError";
	constructor(stepId, cause) {
		super(`Failed to execute transaction step: ${stepId}`, {
			details: cause?.message || "The transaction may have been rejected or failed during execution.",
			cause
		});
	}
};
var TransactionSignatureError = class extends TransactionError {
	name = "TransactionSignatureError";
	constructor(stepId, cause) {
		super(`Failed to sign transaction step: ${stepId}`, {
			details: cause?.message || "The signature request may have been rejected by the user.",
			cause
		});
	}
};
var NoWalletConnectedError = class extends TransactionError {
	name = "NoWalletConnectedError";
	constructor() {
		super("No wallet connected", { details: "Please connect your wallet before attempting this transaction." });
	}
};
var UserRejectedRequestError = class extends TransactionError {
	name = "UserRejectedRequestError";
	constructor() {
		super("User rejected the request", { details: "The user cancelled or rejected the transaction request." });
	}
};
var MissingConfigError = class extends TransactionError {
	name = "MissingConfigError";
	constructor(configName) {
		super(`Missing required config: ${configName}`, { details: "A required configuration parameter is missing." });
	}
};

//#endregion
export { TransactionSignatureError as a, TransactionExecutionError as i, MissingConfigError as n, UserRejectedRequestError as o, NoWalletConnectedError as r, BaseError as s, ChainSwitchError as t };
//# sourceMappingURL=transaction.js.map