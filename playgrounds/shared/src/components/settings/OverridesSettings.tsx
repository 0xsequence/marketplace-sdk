'use client';

import { useOpenConnectModal } from '@0xsequence/connect';
import {
	Badge,
	Button,
	Collapsible,
	Divider,
	Select,
	Switch,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import type {
	ApiConfig,
	Env,
	OrderbookKind,
} from '@0xsequence/marketplace-sdk';
import { OrderbookKind as OrderbookKindEnum } from '@0xsequence/marketplace-sdk';
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

export function OverridesSettings() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	const {
		collectionAddress,
		sdkConfig,
		setOrderbookKind,
		orderbookKind,
		paginationMode,
		setPaginationMode,
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
			setOpenConnectModal(true);
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
					<div className="flex w-full items-end gap-3">
						<TextInput
							labelLocation="top"
							label="Project ID"
							value={pendingProjectId}
							onChange={(ev) => setPendingProjectId(ev.target.value)}
							name="projectId"
						/>
						<Button
							label="Apply Configuration"
							shape="square"
							size="lg"
							className="rounded-xl"
							onClick={() => setProjectId(pendingProjectId)}
						/>
					</div>
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

				<Divider />

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
					<TextInput
						name="chainId"
						label="Chain ID"
						labelLocation="top"
						value={newCollection.chainId.toString()}
						onChange={(e) => handleChange('chainId', e.target.value)}
						error={
							Number.isNaN(newCollection.chainId)
								? 'Invalid chain ID'
								: undefined
						}
					/>
					<TextInput
						name="contractAddress"
						label="Contract Address"
						labelLocation="top"
						value={newCollection.contractAddress}
						onChange={(e) => handleChange('contractAddress', e.target.value)}
						error={!isValidAddress ? 'Invalid contract address' : undefined}
						className="flex-1"
					/>
				</div>
				<Button
					label="Add Collection"
					shape="square"
					onClick={handleAdd}
					disabled={!canAdd}
				/>
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
								label="Remove"
								variant="ghost"
								size="xs"
								shape="square"
								onClick={() => handleRemove(index)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
