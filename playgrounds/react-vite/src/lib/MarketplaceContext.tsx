import { OrderbookKind, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	type ReactNode,
	createContext,
	useContext,
	useState,
	useEffect,
} from 'react';
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
	setProjectId: (id: string) => void;
	sdkConfig: SdkConfig;
	isEmbeddedWalletEnabled: boolean;
	setIsEmbeddedWalletEnabled: (enabled: boolean) => void;
	orderbookKind: OrderbookKind;
	setOrderbookKind: (kind: OrderbookKind) => void;
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

const STORAGE_KEY = 'marketplace_settings';

interface StoredSettings {
	collectionAddress: Hex;
	chainId: string;
	collectibleId: string;
	projectId: string;
	isEmbeddedWalletEnabled: boolean;
	orderbookKind: OrderbookKind;
}

function loadStoredSettings(): Partial<StoredSettings> {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : {};
	} catch (err) {
		console.error('Failed to load settings from localStorage:', err);
		return {};
	}
}

function saveSettings(settings: StoredSettings) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (err) {
		console.error('Failed to save settings to localStorage:', err);
	}
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
	// Load initial values from localStorage
	const stored = loadStoredSettings();

	const [
		collectionAddress,
		pendingCollectionAddress,
		setCollectionAddress,
		isCollectionAddressValid,
	] = useValidatedState<Hex>(
		stored.collectionAddress ?? '0xf2ea13ce762226468deac9d69c8e77d291821676',
		isValidHexAddress,
	);

	const [projectId, setProjectId] = useState(stored.projectId ?? '34598');
	const projectAccessKey = 'AQAAAAAAAAJUM7b_hWjaGj-14Em29Z6t9Z4';

	const [chainId, pendingChainId, setChainId, isChainIdValid] =
		useValidatedState<string>(stored.chainId ?? '80002', isNotUndefined);

	const [
		collectibleId,
		pendingCollectibleId,
		setCollectibleId,
		isCollectibleIdValid,
	] = useValidatedState<string>(stored.collectibleId ?? '1', isNotUndefined);

	const [activeTab, setActiveTab] = useState<Tab>('collections');

	const [isEmbeddedWalletEnabled, setIsEmbeddedWalletEnabled] = useState(
		stored.isEmbeddedWalletEnabled ?? false,
	);

	const [orderbookKind, setOrderbookKind] = useState<OrderbookKind>(
		OrderbookKind.sequence_marketplace_v2,
	);

	// Save settings whenever they change
	useEffect(() => {
		saveSettings({
			collectionAddress,
			chainId,
			collectibleId,
			projectId,
			isEmbeddedWalletEnabled,
			orderbookKind,
		});
	}, [
		collectionAddress,
		chainId,
		collectibleId,
		projectId,
		isEmbeddedWalletEnabled,
		orderbookKind,
	]);

	const waasConfigKey =
		'eyJwcm9qZWN0SWQiOjU5NiwiZW1haWxSZWdpb24iOiJjYS1jZW50cmFsLTEiLCJlbWFpbENsaWVudElkIjoiMnBoZW90OTByYXA2cWljdjJoYTI5MGVuN20iLCJycGNTZXJ2ZXIiOiJodHRwczovL2Rldi13YWFzLnNlcXVlbmNlLmFwcCJ9';

	const wallet = isEmbeddedWalletEnabled
		? {
				embedded: {
					waasConfigKey,
				},
			}
		: undefined;

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
				setProjectId,
				isEmbeddedWalletEnabled,
				setIsEmbeddedWalletEnabled,
				orderbookKind,
				setOrderbookKind,
				sdkConfig: {
					projectId,
					projectAccessKey,
					wallet,
					_internal: {
						devAccessKey: 'AQAAAAAAAAJUM7b_hWjaGj-14Em29Z6t9Z4',
						marketplaceEnv: 'development',
						builderEnv: 'development',
						metadataEnv: 'development',
						indexerEnv: 'development',
					}
				},
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
