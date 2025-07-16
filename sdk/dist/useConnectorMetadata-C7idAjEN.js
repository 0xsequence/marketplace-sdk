import { WalletKind } from "./marketplace.gen-HpnpL5xU.js";
import { useAccount } from "wagmi";

//#region src/react/hooks/config/useConnectorMetadata.tsx
const useConnectorMetadata = () => {
	const { connector } = useAccount();
	const isWaaS = connector?.id.endsWith("waas") ?? false;
	const isSequence = connector?.id.includes("sequence");
	const walletKind = isSequence ? WalletKind.sequence : WalletKind.unknown;
	return {
		isWaaS,
		isSequence,
		walletKind
	};
};

//#endregion
export { useConnectorMetadata };
//# sourceMappingURL=useConnectorMetadata-C7idAjEN.js.map