//#region src/react/_internal/get-provider.ts
const PROVIDER_ID = "sdk-provider";
function getProviderEl() {
	if (!globalThis.document) return null;
	return document.getElementById(PROVIDER_ID);
}

//#endregion
export { PROVIDER_ID, getProviderEl };
//# sourceMappingURL=get-provider-CYYHfrlg.js.map