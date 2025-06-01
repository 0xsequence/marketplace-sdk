'use client';

import { useOpenConnectModal } from '@0xsequence/connect';
import {
	Badge,
	Button,
	Collapsible,
	Divider,
	Select,
	Switch,
	TabbedNav,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import type {
	ApiConfig,
	CollectionOverride,
	ContractType,
	Env,
	MarketplaceConfig,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import { OrderbookKind as OrderbookKindEnum } from '@0xsequence/marketplace-sdk';
import { useCallback, useMemo, useState } from 'react';
import type { Address, Hex } from 'viem';
import { isAddress } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { useMarketplace } from '../../store';
import type { ApiOverrides } from '../../store/store';
import type { WalletType } from '../../types';

const API_SERVICES: Array<{ key: keyof ApiOverrides; label: string }> = [
	{ key: 'builder', label: 'Builder API' },
	{ key: 'marketplace', label: 'Marketplace API' },
	{ key: 'indexer', label: 'Indexer' },
	{ key: 'metadata', label: 'Metadata' },
	{ key: 'nodeGateway', label: 'Node Gateway' },
	{ key: 'sequenceApi', label: 'Sequence API' },
	{ key: 'sequenceWallet', label: 'Sequence Wallet' },
] as const;

const ENV_OPTIONS = [
	{ label: 'Production', value: 'production' },
	{ label: 'Development', value: 'development' },
	{ label: 'Next', value: 'next' },
];

const CONTRACT_TYPE_OPTIONS = [
	{ label: 'ERC721', value: 'ERC721' },
	{ label: 'ERC1155', value: 'ERC1155' },
	{ label: 'LAOS ERC721', value: 'LAOSERC721' },
];

export function OverridesSettings() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	const {
		chainId,
		collectibleId,
		collectionAddress,
		sdkConfig,
		walletType,
		setWalletType,
		setOrderbookKind,
		orderbookKind,
		paginationMode,
		setPaginationMode,
		resetSettings,
		applySettings,
		setApiOverride,
		setMarketplaceConfigOverride,
		setCollectionOverride,
		clearAllOverrides,
	} = useMarketplace();

	// Local state for pending values
	const [pendingProjectId, setPendingProjectId] = useState(sdkConfig.projectId);
	const [pendingCollectionAddress, setPendingCollectionAddress] =
		useState<string>(collectionAddress || '');
	const [pendingChainId, setPendingChainId] = useState<number>(chainId || 0);
	const [pendingCollectibleId, setPendingCollectibleId] = useState<string>(
		collectibleId || '',
	);

	// Validation functions
	const isCollectionAddressValid = useCallback((address: string) => {
		return address === '' || isAddress(address as Address);
	}, []);

	const isChainIdValid = useCallback((chainId: number) => {
		return !Number.isNaN(chainId);
	}, []);

	const isCollectibleIdValid = useCallback((id: string) => {
		return id === '' || !Number.isNaN(Number(id));
	}, []);

	// Handle changes with validation
	const handleCollectionAddressChange = (value: string) => {
		setPendingCollectionAddress(value);
	};

	const handleChainIdChange = (value: number) => {
		setPendingChainId(value);
	};

	const handleCollectibleIdChange = (value: string) => {
		setPendingCollectibleId(value);
	};

	function toggleConnect() {
		if (address) {
			disconnect();
		} else {
			setOpenConnectModal(true);
		}
	}

	const handleReset = () => {
		resetSettings();
		clearAllOverrides();
		// Reset local state as well
		setPendingProjectId(sdkConfig.projectId);
		setPendingCollectionAddress(collectionAddress || '');
		setPendingChainId(chainId || 0);
		setPendingCollectibleId(collectibleId || '');
	};

	const applyAllSettings = () => {
		if (
			isCollectionAddressValid(pendingCollectionAddress) &&
			isChainIdValid(pendingChainId) &&
			isCollectibleIdValid(pendingCollectibleId)
		) {
			applySettings(
				pendingProjectId,
				pendingCollectionAddress as Hex,
				pendingChainId,
				pendingCollectibleId,
			);
		}
	};

	const orderbookOptions = [
		{ label: 'Collection default', value: 'default' },
		...Object.keys(OrderbookKindEnum).map((key) => ({
			label: key,
			value: key,
		})),
	];

	// Count active overrides
	const activeOverridesCount = useMemo(() => {
		let count = 0;
		const overrides = sdkConfig._internal?.overrides;
		if (overrides?.marketplaceConfig) count++;
		if (overrides?.collection) count++;
		if (overrides?.api) {
			count += Object.keys(overrides.api).length;
		}
		return count;
	}, [sdkConfig]);

	return (
		<Collapsible
			className="!bg-background-raised mb-2"
			defaultOpen={true}
			label={
				<div className="flex items-center gap-2">
					<Text>Configuration & Overrides</Text>
					{activeOverridesCount > 0 && (
						<Badge value={activeOverridesCount} variant="success" />
					)}
				</div>
			}
		>
			<div className="flex flex-col gap-3">
				{/* Basic Settings */}
				<div className="flex flex-col gap-3">
					<Text variant="medium" color="text80">
						Basic Settings
					</Text>
					<div className="flex w-full gap-3">
						<TextInput
							labelLocation="top"
							label="Project ID"
							value={pendingProjectId}
							onChange={(ev) => setPendingProjectId(ev.target.value)}
							name="projectId"
						/>

						<div className="flex-1">
							<TextInput
								label="Collection address"
								labelLocation="top"
								name="collectionAddress"
								value={pendingCollectionAddress}
								className="flex-1"
								onChange={(ev) =>
									handleCollectionAddressChange(ev.target.value)
								}
								error={
									!isCollectionAddressValid(pendingCollectionAddress)
										? 'Invalid collection address'
										: undefined
								}
							/>
						</div>
					</div>

					<div className="flex w-full gap-3">
						<TextInput
							label="Chain ID"
							labelLocation="top"
							name="chainId"
							value={pendingChainId}
							onChange={(ev) => handleChainIdChange(Number(ev.target.value))}
							error={
								!isChainIdValid(pendingChainId) ? 'Invalid chain ID' : undefined
							}
						/>
						<TextInput
							label="Collectible ID"
							labelLocation="top"
							name="collectibleId"
							value={pendingCollectibleId}
							onChange={(ev) => handleCollectibleIdChange(ev.target.value)}
							error={
								!isCollectibleIdValid(pendingCollectibleId)
									? 'Invalid collectible ID'
									: undefined
							}
						/>
					</div>

					<Button
						label="Apply Configuration"
						shape="square"
						onClick={applyAllSettings}
					/>

					<Divider />

					<TabbedNav
						defaultValue={walletType}
						onTabChange={(value) => setWalletType(value as WalletType)}
						size="sm"
						itemType="pill"
						tabs={[
							{
								label: 'Universal',
								value: 'universal',
							},
							{
								label: 'Embedded / Ecosystem',
								value: 'embedded',
							},
						]}
					/>

					<TextInput
						placeholder="No wallet connected"
						value={address || ''}
						disabled={true}
						name="wallet"
						controls={
							<div>
								<Button
									label={address ? 'Disconnect' : 'Connect'}
									size="xs"
									shape="square"
									onClick={toggleConnect}
								/>
							</div>
						}
					/>

					<div className="flex items-center gap-3">
						<Select
							label="Orderbook"
							labelLocation="top"
							name="orderbook"
							defaultValue="default"
							value={orderbookKind ? orderbookKind : 'default'}
							options={orderbookOptions}
							onValueChange={(value) =>
								setOrderbookKind(
									value === 'default' ? undefined : (value as OrderbookKind),
								)
							}
						/>
						<div className="flex flex-col">
							<Text variant="small" color="text80">
								Pagination Mode
							</Text>
							<div className="flex items-center gap-2">
								<Switch
									checked={paginationMode === 'paginated'}
									onCheckedChange={(checked) =>
										setPaginationMode(checked ? 'paginated' : 'infinite')
									}
								/>
								<Text variant="small" color="text80">
									{paginationMode === 'paginated'
										? 'Paginated'
										: 'Infinite Scroll'}
								</Text>
							</div>
						</div>
					</div>
				</div>

				<Divider />

				{/* API Overrides */}
				<Collapsible
					label={
						<div className="flex items-center gap-2">
							<Text variant="medium" color="text80">
								API Overrides
							</Text>
							{Object.keys(sdkConfig._internal?.overrides?.api || {}).length >
								0 && (
								<Badge
									value={
										Object.keys(sdkConfig._internal?.overrides?.api || {})
											.length
									}
									variant="info"
								/>
							)}
						</div>
					}
					defaultOpen={false}
				>
					<div className="flex flex-col gap-3">
						<Text variant="small" color="text50">
							Override API endpoints and access keys for different services
						</Text>

						<div className="mb-4 rounded bg-background-secondary p-3">
							<Text variant="small" color="text80" className="mb-3">
								Bulk Override Settings
							</Text>
							<BulkApiOverride
								currentConfigs={sdkConfig._internal?.overrides?.api || {}}
								onUpdate={setApiOverride}
							/>
						</div>

						{API_SERVICES.map(({ key, label }) => (
							<ApiServiceOverride
								key={key}
								service={key}
								label={label}
								currentConfig={sdkConfig._internal?.overrides?.api?.[key]}
								onUpdate={(config) => setApiOverride(key, config)}
							/>
						))}
					</div>
				</Collapsible>

				<Divider />

				{/* Marketplace Config Overrides */}
				<Collapsible
					label={
						<div className="flex items-center gap-2">
							<Text variant="medium" color="text80">
								Marketplace Settings Overrides
							</Text>
							{sdkConfig._internal?.overrides?.marketplaceConfig && (
								<Badge value="Active" variant="info" />
							)}
						</div>
					}
					defaultOpen={false}
				>
					<MarketplaceConfigOverrides
						currentConfig={sdkConfig._internal?.overrides?.marketplaceConfig}
						onUpdate={setMarketplaceConfigOverride}
					/>
				</Collapsible>

				<Divider />

				{/* Collection Overrides */}
				<Collapsible
					label={
						<div className="flex items-center gap-2">
							<Text variant="medium" color="text80">
								Collection Overrides
							</Text>
							{sdkConfig._internal?.overrides?.collection && (
								<Badge value="Active" variant="info" />
							)}
						</div>
					}
					defaultOpen={false}
				>
					<CollectionOverrideSettings
						currentConfig={sdkConfig._internal?.overrides?.collection}
						currentChainId={chainId}
						currentCollectionAddress={collectionAddress}
						onUpdate={setCollectionOverride}
					/>
				</Collapsible>

				<div className="flex gap-3 pt-3">
					<Button
						label="Reset All Settings"
						variant="ghost"
						shape="square"
						onClick={handleReset}
					/>
					<Button
						label="Clear Overrides Only"
						variant="ghost"
						shape="square"
						onClick={clearAllOverrides}
					/>
				</div>
			</div>
		</Collapsible>
	);
}

interface ApiServiceOverrideProps {
	service: keyof ApiOverrides;
	label: string;
	currentConfig: ApiConfig | undefined;
	onUpdate: (config: ApiConfig | undefined) => void;
}

function ApiServiceOverride({
	service,
	label,
	currentConfig,
	onUpdate,
}: ApiServiceOverrideProps) {
	const [isOverridden, setIsOverridden] = useState(!!currentConfig);
	const [env, setEnv] = useState<Env>(currentConfig?.env || 'production');
	const [accessKey, setAccessKey] = useState(currentConfig?.accessKey || '');

	const handleToggle = (checked: boolean) => {
		setIsOverridden(checked);
		if (checked) {
			onUpdate({ env, accessKey: accessKey || undefined } satisfies ApiConfig);
		} else {
			onUpdate(undefined);
		}
	};

	const handleEnvChange = (newEnv: string) => {
		setEnv(newEnv as Env);
		if (isOverridden) {
			onUpdate({
				env: newEnv as Env,
				accessKey: accessKey || undefined,
			} satisfies ApiConfig);
		}
	};

	const handleAccessKeyChange = (newKey: string) => {
		setAccessKey(newKey);
		if (isOverridden) {
			onUpdate({ env, accessKey: newKey || undefined } satisfies ApiConfig);
		}
	};

	return (
		<div className="flex flex-col gap-2 rounded bg-background-secondary p-3">
			<div className="flex items-center justify-between">
				<Text variant="small" color="text80">
					{label}
				</Text>
				<Switch checked={isOverridden} onCheckedChange={handleToggle} />
			</div>
			{isOverridden && (
				<div className="mt-2 flex gap-2">
					<Select
						name={`${service}-env`}
						value={env}
						options={ENV_OPTIONS}
						onValueChange={handleEnvChange}
						placeholder="Environment"
					/>
					<TextInput
						name={`${service}-key`}
						value={accessKey}
						onChange={(e) => handleAccessKeyChange(e.target.value)}
						placeholder="Access Key (optional)"
					/>
				</div>
			)}
		</div>
	);
}

interface MarketplaceConfigOverridesProps {
	currentConfig: Partial<MarketplaceConfig> | undefined;
	onUpdate: (config: Partial<MarketplaceConfig> | undefined) => void;
}

function MarketplaceConfigOverrides({
	currentConfig,
	onUpdate,
}: MarketplaceConfigOverridesProps) {
	const [isOverridden, setIsOverridden] = useState(!!currentConfig);
	const [title, setTitle] = useState(currentConfig?.settings?.title || '');
	const [logoUrl, setLogoUrl] = useState(
		currentConfig?.settings?.logoUrl || '',
	);
	const [bannerUrl, setBannerUrl] = useState(
		currentConfig?.settings?.style?.bannerUrl || '',
	);
	const [publisherId, setPublisherId] = useState(
		currentConfig?.settings?.publisherId || '',
	);

	const handleToggle = (checked: boolean) => {
		setIsOverridden(checked);
		if (!checked) {
			onUpdate(undefined);
		} else {
			updateConfig();
		}
	};

	const updateConfig = () => {
		if (!isOverridden) return;

		const hasSettings = title || logoUrl || publisherId || bannerUrl;
		if (!hasSettings) {
			onUpdate(undefined);
			return;
		}

		const config: Partial<MarketplaceConfig> = {};

		if (title || logoUrl || publisherId || bannerUrl) {
			const settings: Partial<MarketplaceConfig['settings']> = {};
			if (title) settings.title = title;
			if (logoUrl) settings.logoUrl = logoUrl;
			if (publisherId) settings.publisherId = publisherId;
			if (bannerUrl) {
				settings.style = { bannerUrl };
			}
			config.settings = settings as MarketplaceConfig['settings'];
		}

		onUpdate(config);
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<Text variant="small" color="text50">
					Override marketplace branding and appearance
				</Text>
				<Switch checked={isOverridden} onCheckedChange={handleToggle} />
			</div>
			{isOverridden && (
				<>
					<TextInput
						name="override-title"
						label="Title"
						labelLocation="top"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
							updateConfig();
						}}
						placeholder="Marketplace title"
					/>
					<TextInput
						name="override-publisherId"
						label="Publisher ID"
						labelLocation="top"
						value={publisherId}
						onChange={(e) => {
							setPublisherId(e.target.value);
							updateConfig();
						}}
						placeholder="Publisher ID"
					/>
					<TextInput
						name="override-logoUrl"
						label="Logo URL"
						labelLocation="top"
						value={logoUrl}
						onChange={(e) => {
							setLogoUrl(e.target.value);
							updateConfig();
						}}
						placeholder="https://..."
					/>
					<TextInput
						name="override-bannerUrl"
						label="Banner URL"
						labelLocation="top"
						value={bannerUrl}
						onChange={(e) => {
							setBannerUrl(e.target.value);
							updateConfig();
						}}
						placeholder="https://..."
					/>
				</>
			)}
		</div>
	);
}

interface BulkApiOverrideProps {
	currentConfigs: ApiOverrides;
	onUpdate: (
		service: keyof ApiOverrides,
		config: ApiConfig | undefined,
	) => void;
}

function BulkApiOverride({ currentConfigs, onUpdate }: BulkApiOverrideProps) {
	const [env, setEnv] = useState<Env>('production');
	const [accessKey, setAccessKey] = useState('');

	const applyToAll = () => {
		const config = {
			env,
			accessKey: accessKey || undefined,
		} satisfies ApiConfig;
		for (const { key } of API_SERVICES) {
			onUpdate(key, config);
		}
	};

	const clearAll = () => {
		for (const { key } of API_SERVICES) {
			onUpdate(key, undefined);
		}
	};

	const activeOverridesCount = Object.keys(currentConfigs).length;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<Text variant="small" color="text50">
					Apply environment and access key to all services
				</Text>
				{activeOverridesCount > 0 && (
					<Badge value={activeOverridesCount} variant="info" />
				)}
			</div>

			<div className="flex gap-2">
				<Select
					name="bulk-env"
					value={env}
					options={ENV_OPTIONS}
					onValueChange={(value) => setEnv(value as Env)}
					placeholder="Environment"
				/>
				<TextInput
					name="bulk-key"
					value={accessKey}
					onChange={(e) => setAccessKey(e.target.value)}
					placeholder="Access Key (optional)"
				/>
			</div>

			<div className="flex gap-2">
				<Button
					label="Apply to All"
					size="xs"
					shape="square"
					onClick={applyToAll}
				/>
				<Button
					label="Clear All"
					size="xs"
					shape="square"
					variant="ghost"
					onClick={clearAll}
				/>
			</div>
		</div>
	);
}

interface CollectionOverrideSettingsProps {
	currentConfig: CollectionOverride | undefined;
	currentChainId?: number;
	currentCollectionAddress?: string;
	onUpdate: (config: CollectionOverride | undefined) => void;
}

function CollectionOverrideSettings({
	currentConfig,
	currentChainId,
	currentCollectionAddress,
	onUpdate,
}: CollectionOverrideSettingsProps) {
	const [isOverridden, setIsOverridden] = useState(!!currentConfig);

	// Basic identifiers - auto-populate from current context
	const [chainId, setChainId] = useState(
		currentConfig?.chainId || currentChainId || 1,
	);
	const [contractAddress, setContractAddress] = useState(
		currentConfig?.contractAddress || currentCollectionAddress || '',
	);

	// Display metadata overrides
	const [name, setName] = useState(currentConfig?.name || '');
	const [symbol, setSymbol] = useState(currentConfig?.symbol || '');
	const [description, setDescription] = useState(
		currentConfig?.description || '',
	);
	const [bannerUrl, setBannerUrl] = useState(currentConfig?.bannerUrl || '');
	const [ogImage, setOgImage] = useState(currentConfig?.ogImage || '');

	// Marketplace settings - collapsed by default
	const [contractType, setContractType] = useState<ContractType | undefined>(
		currentConfig?.contractType,
	);
	const [feePercentage, setFeePercentage] = useState(
		currentConfig?.feePercentage || 2.5,
	);
	const [currencyOptions, setCurrencyOptions] = useState(
		currentConfig?.currencyOptions?.join(', ') || 'ETH, USDC',
	);

	// Shop settings - collapsed by default
	const [saleAddress, setSaleAddress] = useState(
		currentConfig?.saleAddress || '',
	);

	const handleToggle = (checked: boolean) => {
		setIsOverridden(checked);
		if (!checked) {
			onUpdate(undefined);
		} else {
			updateConfig();
		}
	};

	const updateConfig = () => {
		if (!isOverridden || !contractAddress) return;

		const config: CollectionOverride = {
			chainId,
			contractAddress,
		};

		// Only include non-empty optional fields
		if (name) config.name = name;
		if (symbol) config.symbol = symbol;
		if (description) config.description = description;
		if (bannerUrl) config.bannerUrl = bannerUrl;
		if (ogImage) config.ogImage = ogImage;
		if (contractType) config.contractType = contractType;
		if (feePercentage !== 2.5) config.feePercentage = feePercentage;
		if (currencyOptions.trim()) {
			config.currencyOptions = currencyOptions
				.split(',')
				.map((c) => c.trim())
				.filter((c) => c);
		}
		if (saleAddress) config.saleAddress = saleAddress;

		onUpdate(config);
	};

	// Validation
	const isValidAddress =
		contractAddress === '' || isAddress(contractAddress as Address);
	const isValidSaleAddress =
		saleAddress === '' || isAddress(saleAddress as Address);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<Text variant="small" color="text50">
					Override collection metadata and marketplace settings
				</Text>
				<Switch checked={isOverridden} onCheckedChange={handleToggle} />
			</div>

			{isOverridden && (
				<>
					{/* Required Identifiers */}
					<div className="flex flex-col gap-3 rounded bg-background-secondary p-3">
						<Text variant="small" color="text80" className="mb-2">
							Collection Identifiers
						</Text>
						<div className="flex gap-2">
							<TextInput
								name="override-chainId"
								label="Chain ID"
								labelLocation="top"
								value={chainId}
								onChange={(e) => {
									setChainId(Number(e.target.value));
									updateConfig();
								}}
								error={Number.isNaN(chainId) ? 'Invalid chain ID' : undefined}
							/>
							<TextInput
								name="override-contractAddress"
								label="Contract Address"
								labelLocation="top"
								value={contractAddress}
								onChange={(e) => {
									setContractAddress(e.target.value);
									updateConfig();
								}}
								error={!isValidAddress ? 'Invalid contract address' : undefined}
								className="flex-1"
							/>
						</div>
					</div>

					{/* Display Metadata */}
					<div className="flex flex-col gap-3">
						<Text variant="small" color="text80">
							Display Overrides
						</Text>
						<div className="flex gap-2">
							<TextInput
								name="override-name"
								label="Name"
								labelLocation="top"
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									updateConfig();
								}}
								placeholder="Collection name"
							/>
							<TextInput
								name="override-symbol"
								label="Symbol"
								labelLocation="top"
								value={symbol}
								onChange={(e) => {
									setSymbol(e.target.value);
									updateConfig();
								}}
								placeholder="Symbol"
							/>
						</div>
						<TextInput
							name="override-description"
							label="Description"
							labelLocation="top"
							value={description}
							onChange={(e) => {
								setDescription(e.target.value);
								updateConfig();
							}}
							placeholder="Collection description"
						/>
						<div className="flex gap-2">
							<TextInput
								name="override-bannerUrl"
								label="Banner URL"
								labelLocation="top"
								value={bannerUrl}
								onChange={(e) => {
									setBannerUrl(e.target.value);
									updateConfig();
								}}
								placeholder="https://..."
								className="flex-1"
							/>
							<TextInput
								name="override-ogImage"
								label="OG Image URL"
								labelLocation="top"
								value={ogImage}
								onChange={(e) => {
									setOgImage(e.target.value);
									updateConfig();
								}}
								placeholder="https://..."
								className="flex-1"
							/>
						</div>
					</div>

					{/* Advanced Marketplace Settings */}
					<Collapsible
						label={
							<Text variant="small" color="text80">
								Advanced Marketplace Settings
							</Text>
						}
						defaultOpen={false}
					>
						<div className="mt-2 flex flex-col gap-3">
							<div className="flex gap-2">
								<Select
									name="override-contractType"
									label="Contract Type"
									labelLocation="top"
									value={contractType || ''}
									options={[
										{ label: 'Not set', value: '' },
										...CONTRACT_TYPE_OPTIONS,
									]}
									onValueChange={(value) => {
										setContractType((value as ContractType) || undefined);
										updateConfig();
									}}
								/>
								<TextInput
									name="override-feePercentage"
									label="Fee Percentage"
									labelLocation="top"
									value={feePercentage}
									onChange={(e) => {
										setFeePercentage(Number(e.target.value));
										updateConfig();
									}}
									placeholder="2.5"
									type="number"
									step="0.1"
									min="0"
									max="100"
								/>
							</div>
							<TextInput
								name="override-currencies"
								label="Currency Options (comma-separated)"
								labelLocation="top"
								value={currencyOptions}
								onChange={(e) => {
									setCurrencyOptions(e.target.value);
									updateConfig();
								}}
								placeholder="ETH, USDC, WETH"
							/>
						</div>
					</Collapsible>

					{/* Shop Settings */}
					<Collapsible
						label={
							<Text variant="small" color="text80">
								Shop Settings
							</Text>
						}
						defaultOpen={false}
					>
						<div className="mt-2">
							<TextInput
								name="override-saleAddress"
								label="Sale Contract Address"
								labelLocation="top"
								value={saleAddress}
								onChange={(e) => {
									setSaleAddress(e.target.value);
									updateConfig();
								}}
								placeholder="0x..."
								error={
									!isValidSaleAddress
										? 'Invalid sale contract address'
										: undefined
								}
							/>
						</div>
					</Collapsible>
				</>
			)}
		</div>
	);
}
