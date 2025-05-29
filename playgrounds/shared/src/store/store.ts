import { createStore } from '@xstate/store';
import type { Hex } from 'viem';
import {
	ContractType,
	type MarketplaceType,
	type OrderbookKind,
	type SdkConfig,
} from '../../../../sdk/src';
import {
	DEFAULT_ACTIVE_TAB,
	DEFAULT_CHAIN_ID,
	DEFAULT_COLLECTIBLE_ID,
	DEFAULT_COLLECTION_ADDRESS,
	DEFAULT_MARKETPLACE_TYPE,
	DEFAULT_PAGINATION_MODE,
	DEFAULT_PROJECT_ACCESS_KEY,
	DEFAULT_PROJECT_ID,
	DEFAULT_WALLET_TYPE,
	STORAGE_KEY,
	WAAS_CONFIG_KEY,
} from '../consts';
import type { PaginationMode, Tab, WalletType } from '../types';

const defaultContext = {
	collectionAddress: DEFAULT_COLLECTION_ADDRESS,
	chainId: DEFAULT_CHAIN_ID,
	collectibleId: DEFAULT_COLLECTIBLE_ID,
	activeTab:
		typeof window !== 'undefined'
			? ((window.location.pathname.slice(1) || DEFAULT_ACTIVE_TAB) as Tab)
			: DEFAULT_ACTIVE_TAB,
	projectId: DEFAULT_PROJECT_ID,
	walletType: DEFAULT_WALLET_TYPE,
	marketplaceKind: DEFAULT_MARKETPLACE_TYPE,
	orderbookKind: undefined as OrderbookKind | undefined,
	paginationMode: DEFAULT_PAGINATION_MODE,
	sdkConfig: {
		projectId: DEFAULT_PROJECT_ID,
		projectAccessKey: DEFAULT_PROJECT_ACCESS_KEY,
		tmpShopConfig: {
			title: '',
			bannerUrl: '',
			collections: [
				{
					address: '0xf2ea13ce762226468deac9d69c8e77d291821676',
					chainId: 80002,
					tokenIds: ['1', '2', '3', '18', '27', '28'],
					bannerUrl: '',
					primarySalesContractAddress:
						'0x30131575129ee043f9c7409ca599bfd8ffe1b4e0',
					contractType: ContractType.ERC721,
				},
				{
					address: '0x30a2aa8fc50bc6af16b1abfdd84fcf7ba6dbdb9c',
					chainId: 80002,
					tokenIds: ['20', '0', '1', '2', '25'],
					bannerUrl: '',
					primarySalesContractAddress:
						'0x3697dd20cff7411338bf6a67d47cba1bb7d211d7',
					contractType: ContractType.ERC1155,
				},
				{
					address: '0xcb5410d37e5e90ac0683fcff143dc5cd4ba9423f',
					chainId: 80002,
					tokenIds: ['0', '1', '2', '3', '4', '5', '6', '7'],
					bannerUrl:
						'https://media.canva.com/v2/image-resize/format:JPG/height:452/quality:92/uri:ifs%3A%2F%2FM%2Ff290aa0c-7ddf-4387-8237-dc7bf683d01d/watermark:F/width:800?csig=AAAAAAAAAAAAAAAAAAAAACNuBRpBBn7OmMqIz3x8v8wP1328myxX0RqsjcRXX5H1&exp=1748526262&osig=AAAAAAAAAAAAAAAAAAAAAHoHEkISbJE7wBrkusP2ijDyINbFkgeY9fGXyhGBJlZP&signer=media-rpc&x-canva-quality=screen',
					primarySalesContractAddress:
						'0xf5baf9197964a19bb0d5224e47ddf2da18158f2c',
					contractType: ContractType.ERC1155,
				},
				{
					address: '0x51299ac9b2f2529d721b7aba5dd06951e0bf4f6b',
					chainId: 80002,
					tokenIds: ['0', '1', '2', '3', '4', '5', '6', '7'],
					bannerUrl:
						'https://media.canva.com/v2/image-resize/format:JPG/height:452/quality:92/uri:ifs%3A%2F%2FM%2F8ba0ef31-38d3-4d67-8f78-0ee6b54a4cb9/watermark:F/width:800?csig=AAAAAAAAAAAAAAAAAAAAAA4WbQM0W22L945fu9cA8iw_Zptu4j-B5_JusJu6u6x4&exp=1748525796&osig=AAAAAAAAAAAAAAAAAAAAALZBdv4dzYWV_9j-TyIeFfzPKT3b8lhuvDlhfaUnbi6-&signer=media-rpc&x-canva-quality=screen',
					primarySalesContractAddress:
						'0x94e8058a0206a31f08da9a35a7e92e0f6d8d9294',
					contractType: ContractType.ERC1155,
				},
			],
		},
	} satisfies SdkConfig,
};

//TODO: This really really should be validated
const savedSnapshot =
	typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

//ChainId was stored as string at some point, so we need to parse it
const savedSnapshotParsed = savedSnapshot ? JSON.parse(savedSnapshot) : null;
if (savedSnapshotParsed?.chainId) {
	savedSnapshotParsed.chainId = Number(savedSnapshotParsed.chainId);
}
const initialSnapshot: typeof defaultContext = savedSnapshotParsed
	? savedSnapshotParsed
	: structuredClone(defaultContext);

export const marketplaceStore = createStore({
	context: initialSnapshot,
	on: {
		setWalletType: (context, { walletType }: { walletType: WalletType }) => {
			const wallet =
				walletType !== 'universal'
					? {
							embedded: {
								waasConfigKey: WAAS_CONFIG_KEY,
							},
						}
					: undefined;

			const newSdkConfig = {
				...context.sdkConfig,
				wallet,
			};

			return {
				...context,
				walletType,
				sdkConfig: newSdkConfig,
			};
		},

		setActiveTab: (context, { tab }: { tab: Tab }) => ({
			...context,
			activeTab: tab,
		}),

		setProjectId: (context, { id }: { id: string }) => ({
			...context,
			projectId: id,
		}),

		setOrderbookKind: (
			context,
			{ kind }: { kind: OrderbookKind | undefined },
		) => ({
			...context,
			orderbookKind: kind,
		}),

		setPaginationMode: (context, { mode }: { mode: PaginationMode }) => ({
			...context,
			paginationMode: mode,
		}),

		resetSettings: () => structuredClone(defaultContext),

		setCollectionAddress: (context, { address }: { address: Hex }) => ({
			...context,
			collectionAddress: address,
		}),

		setChainId: (context, { id }: { id: number }) => ({
			...context,
			chainId: id,
		}),

		setCollectibleId: (context, { id }: { id: string }) => ({
			...context,
			collectibleId: id,
		}),

		setMarketplaceKind: (context, { kind }: { kind: MarketplaceType }) => ({
			...context,
			marketplaceKind: kind,
		}),

		applySettings: (
			context,
			{
				projectId,
				collectionAddress,
				chainId,
				collectibleId,
			}: {
				projectId: string;
				collectionAddress: Hex;
				chainId: number;
				collectibleId: string;
			},
		) => {
			return {
				...context,
				projectId,
				collectionAddress,
				chainId,
				collectibleId,
			};
		},
	},
});

marketplaceStore.subscribe((state) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state.context));
});
