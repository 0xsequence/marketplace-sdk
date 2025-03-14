'use client';

import type { OrderbookKind, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import type { Hex } from 'viem';

export type Tab = 'collections' | 'collectibles' | 'collectible';
export type PaginationMode = 'paginated' | 'infinite';

interface PlaygroundContextType {
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
	orderbookKind: OrderbookKind | undefined;
	setOrderbookKind: (kind: OrderbookKind | undefined) => void;
	paginationMode: PaginationMode;
	setPaginationMode: (mode: PaginationMode) => void;
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(
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
	orderbookKind: OrderbookKind | undefined;
	paginationMode: PaginationMode;
}

function loadStoredSettings(): Partial<StoredSettings> {
	if (typeof window === 'undefined') return {};

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : {};
	} catch (err) {
		console.error('Failed to load settings from localStorage:', err);
		return {};
	}
}

function saveSettings(settings: StoredSettings) {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (err) {
		console.error('Failed to save settings to localStorage:', err);
	}
}

export function PlaygroundProvider({ children }: { children: ReactNode }) {
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
	const projectAccessKey = 'AQAAAAAAADVH8R2AGuQhwQ1y8NaEf1T7PJM';

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

	const [orderbookKind, setOrderbookKind] = useState<
		OrderbookKind | undefined
	>();

	const [paginationMode, setPaginationMode] = useState<PaginationMode>(
		stored.paginationMode ?? 'infinite',
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
			paginationMode,
		});
	}, [
		collectionAddress,
		chainId,
		collectibleId,
		projectId,
		isEmbeddedWalletEnabled,
		orderbookKind,
		paginationMode,
	]);

	const waasConfigKey =
		'eyJwcm9qZWN0SWQiOjEzNjM5LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0';

	const wallet = isEmbeddedWalletEnabled
		? {
				embedded: {
					waasConfigKey,
				},
			}
		: undefined;

	return (
		<PlaygroundContext.Provider
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
				paginationMode,
				setPaginationMode,
				sdkConfig: {
					projectId,
					projectAccessKey,
					wallet,
				},
			}}
		>
			{children}
		</PlaygroundContext.Provider>
	);
}

export function usePlayground() {
	const context = useContext(PlaygroundContext);
	if (context === undefined) {
		throw new Error('usePlayground must be used within a PlaygroundProvider');
	}
	return context;
}
