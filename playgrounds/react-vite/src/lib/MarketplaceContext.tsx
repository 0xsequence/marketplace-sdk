import { type ReactNode, createContext, useContext, useState } from 'react';
import type { Hex } from 'viem';

export type Tab = 'collections' | 'collectibles' | 'collectible';

interface MarketplaceContextType {
	collectionAddress: Hex;
	pendingCollectionAddress: Hex;
	isCollectionAddressValid: boolean;
	setCollectionAddress: (address: Hex) => void;
	chainId: string;
	pendingChainId: string;
	isChainIdValid: boolean;
	setChainId: (id: string) => void;
	collectibleId: string;
	pendingCollectibleId: string;
	isCollectibleIdValid: boolean;
	setCollectibleId: (id: string) => void;
	activeTab: Tab;
	setActiveTab: (tab: Tab) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(
	undefined,
);

function useValidatedState<T>(
	initialState: T,
	validator: (value: T) => boolean,
): [T, T, (newValue: T) => void, boolean] {
	const [state, setState] = useState<T>(initialState);
	const [pendingState, setPendingState] = useState<T>(initialState);

	const setValidatedState = (newValue: T) => {
		setPendingState(newValue);
		if (validator(newValue)) {
			setState(newValue);
		}
	};

	const isValid = state === pendingState;

	return [state, pendingState, setValidatedState, isValid];
}

const isValidHexAddress = (address: Hex) =>
	typeof address === 'string' &&
	address.startsWith('0x') &&
	address.length === 42;

const isNotUndefined = (value: string) =>
	value !== undefined && value !== null && value !== '';

export function MarketplaceProvider({ children }: { children: ReactNode }) {
	const [
		collectionAddress,
		pendingCollectionAddress,
		setCollectionAddress,
		isCollectionAddressValid,
	] = useValidatedState<Hex>(
		'0xf2ea13ce762226468deac9d69c8e77d291821676',
		isValidHexAddress,
	);

	const [chainId, pendingChainId, setChainId, isChainIdValid] =
		useValidatedState<string>('80002', isNotUndefined);

	const [
		collectibleId,
		pendingCollectibleId,
		setCollectibleId,
		isCollectibleIdValid,
	] = useValidatedState<string>('1', isNotUndefined);

	const [activeTab, setActiveTab] = useState<Tab>('collections');

	return (
		<MarketplaceContext.Provider
			value={{
				collectibleId,
				pendingCollectibleId,
				setCollectibleId,
				isCollectibleIdValid,
				activeTab,
				setActiveTab,
				chainId,
				pendingChainId,
				setChainId,
				isChainIdValid,
				collectionAddress,
				pendingCollectionAddress,
				setCollectionAddress,
				isCollectionAddressValid,
			}}
		>
			{children}
		</MarketplaceContext.Provider>
	);
}

export function useMarketplace() {
	const context = useContext(MarketplaceContext);
	if (context === undefined) {
		throw new Error('useMarketplace must be used within a MarketplaceProvider');
	}
	return context;
}
