'use client';
import { BaseError } from "./base-DqaJPvfN.js";
import { MarketplaceSdkContext } from "./provider-DPGUA10G.js";
import { useContext } from "react";

//#region src/utils/_internal/error/context.ts
var MarketplaceSdkProviderNotFoundError = class extends BaseError {
	name = "MarketplaceSDKProviderNotFoundError";
	constructor() {
		super("`useConfig` must be used within `MarketplaceSdkProvider`.");
	}
};

//#endregion
//#region src/react/hooks/config/useConfig.tsx
function useConfig() {
	const context = useContext(MarketplaceSdkContext);
	if (!context) throw new MarketplaceSdkProviderNotFoundError();
	return context;
}

//#endregion
export { useConfig };
//# sourceMappingURL=useConfig-Ct2Tt1XY.js.map