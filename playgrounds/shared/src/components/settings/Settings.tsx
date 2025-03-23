'use client';

import { useOpenConnectModal } from '@0xsequence/connect';
import {
	Button,
	Collapsible,
	Divider,
	Select,
	Switch,
	TabbedNav,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import { OrderbookKind } from '@0xsequence/marketplace-sdk';
import { useCallback, useState } from 'react';
import type { Address, Hex } from 'viem';
import { isAddress } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { useMarketplace } from '../../store';
import type { WalletType } from '../../types';

export function Settings() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	const {
		chainId,
		collectibleId,
		collectionAddress,
		sdkConfig: { projectId },
		walletType,
		setWalletType,
		setOrderbookKind,
		orderbookKind,
		paginationMode,
		setPaginationMode,
		resetSettings,
		applySettings,
	} = useMarketplace();

	// Local state for pending values
	const [pendingProjectId, setPendingProjectId] = useState(projectId);
	const [pendingCollectionAddress, setPendingCollectionAddress] =
		useState<string>(collectionAddress || '');
	const [pendingChainId, setPendingChainId] = useState<string>(chainId || '');
	const [pendingCollectibleId, setPendingCollectibleId] = useState<string>(
		collectibleId || '',
	);

	// Validation functions
	const isCollectionAddressValid = useCallback((address: string) => {
		return address === '' || isAddress(address as Address);
	}, []);

	const isChainIdValid = useCallback((chainId: string) => {
		return chainId === '' || !Number.isNaN(Number(chainId));
	}, []);

	const isCollectibleIdValid = useCallback((id: string) => {
		return id === '' || !Number.isNaN(Number(id));
	}, []);

	// Handle changes with validation
	const handleCollectionAddressChange = (value: string) => {
		setPendingCollectionAddress(value);
	};

	const handleChainIdChange = (value: string) => {
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
		// Reset local state as well
		setPendingProjectId(projectId);
		setPendingCollectionAddress(collectionAddress || '');
		setPendingChainId(chainId || '');
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
		...Object.keys(OrderbookKind).map((key) => ({
			label: key,
			value: key,
		})),
	];

	return (
		<Collapsible
			className="!bg-background-raised mb-2"
			defaultOpen={true}
			label="Settings"
		>
			<div className="flex flex-col gap-3">
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
							onChange={(ev) => handleCollectionAddressChange(ev.target.value)}
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
						onChange={(ev) => handleChainIdChange(ev.target.value)}
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
							label: 'Embedded',
							value: 'embedded',
						},
						{
							label: 'Ecosystem',
							value: 'ecosystem',
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

				<div className="pt-3">
					<Button
						label="Reset Settings"
						variant="ghost"
						shape="square"
						onClick={handleReset}
					/>
				</div>
			</div>
		</Collapsible>
	);
}
