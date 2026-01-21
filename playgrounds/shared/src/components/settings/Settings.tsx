'use client';

import {
	Badge,
	Button,
	Collapsible,
	Field,
	FieldLabel,
	Select,
	Separator,
	Switch,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import type {
	ApiConfig,
	CheckoutMode,
	Env,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import { OrderbookKind as OrderbookKindEnum } from '@0xsequence/marketplace-sdk';
import { useOpenConnectModal } from '@0xsequence/marketplace-sdk/react';
import { useMemo, useState } from 'react';
import type { Address } from 'viem';
import { isAddress } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { useMarketplace } from '../../store';
import type { ApiOverrides, CollectionOverride } from '../../store/store';

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

const CHECKOUT_MODE_OPTIONS = [
	{ label: 'API Default (isTrailsEnabled)', value: 'api-default' },
	{ label: 'Trails', value: 'trails' },
	{ label: 'Crypto', value: 'crypto' },
];

function getCheckoutModeSelectValue(mode: CheckoutMode | undefined): string {
	if (mode === undefined) return 'api-default';
	if (mode === 'trails') return 'trails';
	if (mode === 'crypto') return 'crypto';
	return 'api-default';
}

function parseCheckoutModeSelectValue(value: string): CheckoutMode | undefined {
	if (value === 'api-default') return undefined;
	if (value === 'trails') return 'trails';
	if (value === 'crypto') return 'crypto';
	return undefined;
}

type SettingsProps = {
	collectionAddress: Address;
};

export function Settings({ collectionAddress }: SettingsProps) {
	const { openConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	const {
		sdkConfig,
		setOrderbookKind,
		orderbookKind,
		paginationMode,
		setPaginationMode,
		checkoutModeOverride,
		setCheckoutModeOverride,
		resetSettings,
		setApiOverride,
		addCollectionOverride,
		removeCollectionOverride,
		updateCollectionOverride,
		clearAllOverrides,
		setProjectId,
	} = useMarketplace();

	const [pendingProjectId, setPendingProjectId] = useState(sdkConfig.projectId);
	const chainId = 1; // Default to mainnet if not available from context

	function toggleConnect() {
		if (address) {
			disconnect();
		} else {
			openConnectModal();
		}
	}

	const handleReset = () => {
		resetSettings();
		clearAllOverrides();
		// Reset local state as well
		setPendingProjectId(sdkConfig.projectId);
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
		if (overrides?.collections && overrides.collections.length > 0) count++;
		if (overrides?.api) {
			count += Object.keys(overrides.api).length;
		}
		return count;
	}, [sdkConfig]);

	return (
		<Collapsible
			className="!bg-background-raised mb-2"
			defaultOpen={false}
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
					<div className="flex w-full items-end gap-3">
						<Field>
							<FieldLabel>Project ID</FieldLabel>

							<TextInput
								value={pendingProjectId}
								onChange={(ev) => setPendingProjectId(ev.target.value)}
								name="projectId"
							/>
						</Field>

						<Button
							shape="square"
							size="lg"
							className="rounded-xl"
							onClick={() => setProjectId(pendingProjectId)}
						>
							Apply Configuration
						</Button>
					</div>
					<TextInput
						placeholder="No wallet connected"
						value={address || ''}
						name="wallet"
						controls={
							<div>
								<Button size="xs" shape="square" onClick={toggleConnect}>
									{address ? 'Disconnect' : 'Connect'}
								</Button>
							</div>
						}
					/>

					<div className="flex items-center gap-3">
						<Field>
							<FieldLabel>Orderbook</FieldLabel>

							<Select.Helper
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
						</Field>

						<Field>
							<FieldLabel>Checkout Mode</FieldLabel>

							<Select.Helper
								name="checkoutMode"
								value={getCheckoutModeSelectValue(checkoutModeOverride)}
								options={CHECKOUT_MODE_OPTIONS}
								onValueChange={(value) =>
									setCheckoutModeOverride(
										parseCheckoutModeSelectValue(value),
									)
								}
							/>
						</Field>

						<div className="flex flex-col">
							<Text variant="small" color="text80">
								Pagination Mode
							</Text>
							<div className="flex items-center gap-2">
								<Switch
									checked={paginationMode === 'paged'}
									onCheckedChange={(checked) =>
										setPaginationMode(checked ? 'paged' : 'infinite')
									}
								/>
								<Text variant="small" color="text80">
									{paginationMode === 'paged' ? 'Paginated' : 'Infinite Scroll'}
								</Text>
							</div>
						</div>
					</div>
				</div>

				<Separator />

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

				<Separator />

				{/* Collection Overrides */}
				<Collapsible
					label={
						<div className="flex items-center gap-2">
							<Text variant="medium" color="text80">
								Collection Overrides
							</Text>
							{sdkConfig._internal?.overrides?.collections &&
								sdkConfig._internal.overrides.collections.length > 0 && (
									<Badge
										value={sdkConfig._internal.overrides.collections.length}
										variant="info"
									/>
								)}
						</div>
					}
					defaultOpen={false}
				>
					<CollectionOverridesList
						collections={sdkConfig._internal?.overrides?.collections || []}
						currentChainId={chainId}
						currentCollectionAddress={collectionAddress}
						onAdd={addCollectionOverride}
						onRemove={removeCollectionOverride}
						onUpdate={updateCollectionOverride}
					/>
				</Collapsible>

				<Separator />

				<div className="flex gap-3 pt-3">
					<Button variant="ghost" shape="square" onClick={handleReset}>
						Reset All Settings
					</Button>
					<Button variant="ghost" shape="square" onClick={clearAllOverrides}>
						Clear Overrides Only
					</Button>
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
					<Select.Helper
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
				<Select.Helper
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
				<Button size="xs" shape="square" onClick={applyToAll}>
					Apply to All
				</Button>
				<Button size="xs" shape="square" variant="ghost" onClick={clearAll}>
					Clear All
				</Button>
			</div>
		</div>
	);
}

interface CollectionOverridesListProps {
	collections: CollectionOverride[];
	currentChainId?: number;
	currentCollectionAddress?: string;
	onAdd: (config: CollectionOverride) => void;
	onRemove: (index: number) => void;
	onUpdate: (index: number, config: CollectionOverride) => void;
}

function CollectionOverridesList({
	collections,
	currentChainId,
	currentCollectionAddress,
	onAdd,
	onRemove,
}: CollectionOverridesListProps) {
	const [newCollection, setNewCollection] = useState<CollectionOverride>({
		chainId: currentChainId || 1,
		contractAddress: currentCollectionAddress || '',
	});

	const handleAdd = () => {
		if (
			newCollection.contractAddress &&
			isAddress(newCollection.contractAddress as Address)
		) {
			onAdd(newCollection);
			setNewCollection({
				chainId: currentChainId || 1,
				contractAddress: '',
			});
		}
	};

	const handleRemove = (index: number) => {
		onRemove(index);
	};

	const handleChange = (
		field: keyof CollectionOverride,
		value: string | number,
	) => {
		setNewCollection((prev) => ({
			...prev,
			[field]: field === 'chainId' ? Number(value) : value,
		}));
	};

	const isValidAddress =
		newCollection.contractAddress === '' ||
		isAddress(newCollection.contractAddress as Address);

	const canAdd =
		newCollection.contractAddress && isValidAddress && newCollection.chainId;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<Text variant="small" color="text50">
					Add new collection override
				</Text>
			</div>

			<div className="flex flex-col gap-3 rounded bg-background-secondary p-3">
				<Text variant="small" color="text80" className="mb-2">
					Collection Details
				</Text>
				<div className="flex gap-2">
					<Field>
						<FieldLabel>Chain ID</FieldLabel>

						<TextInput
							name="chainId"
							value={newCollection.chainId.toString()}
							onChange={(e) => handleChange('chainId', e.target.value)}
						/>

						{Number.isNaN(newCollection.chainId) ? (
							<Text variant="small" color="text50">
								Invalid chain ID
							</Text>
						) : undefined}
					</Field>

					<Field>
						<FieldLabel>Contract Address</FieldLabel>

						<TextInput
							name="contractAddress"
							value={newCollection.contractAddress}
							onChange={(e) => handleChange('contractAddress', e.target.value)}
							className="flex-1"
						/>

						{!isValidAddress ? (
							<Text variant="small" color="text50">
								Invalid contract address
							</Text>
						) : undefined}
					</Field>
				</div>
				<Button shape="square" onClick={handleAdd} disabled={!canAdd}>
					Add Collection
				</Button>
			</div>

			{collections.length > 0 && (
				<div className="flex flex-col gap-3">
					<Text variant="small" color="text80">
						Collection Overrides
					</Text>
					{collections.map((collection, index) => (
						<div
							key={`${collection.chainId}-${collection.contractAddress}`}
							className="flex items-center justify-between rounded bg-background-secondary p-3"
						>
							<div className="flex flex-col gap-1">
								<Text variant="small" color="text80">
									Chain {collection.chainId}: {collection.contractAddress}
								</Text>
								{collection.name && (
									<Text variant="small" color="text50">
										{collection.name} ({collection.symbol})
									</Text>
								)}
							</div>
							<Button
								variant="ghost"
								size="xs"
								shape="square"
								onClick={() => handleRemove(index)}
							>
								Remove
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
