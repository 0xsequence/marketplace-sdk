'use client';

import {
	Button,
	Collapsible,
	Divider,
	Select,
	Switch,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import { useOpenConnectModal } from '@0xsequence/kit';
import { OrderbookKind } from '@0xsequence/marketplace-sdk';
import { useCallback, useState } from 'react';
import { useMarketplace } from 'shared-components';
import type { Address } from 'viem';
import { isAddress } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';

export function Settings() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	const {
		setCollectionAddress,
		setChainId,
		setCollectibleId,
		setProjectId,
		sdkConfig: { projectId },
		isEmbeddedWalletEnabled,
		setIsEmbeddedWalletEnabled,
		setOrderbookKind,
		orderbookKind,
		paginationMode,
		setPaginationMode,
		collectionAddress,
		chainId,
		collectibleId,
	} = useMarketplace();

	// Local state for pending values
	const [pendingCollectionAddress, setPendingCollectionAddress] =
		useState<string>(collectionAddress || '');
	const [pendingChainId, setPendingChainId] = useState<string>(chainId || '');
	const [pendingCollectibleId, setPendingCollectibleId] = useState<string>(
		collectibleId || '',
	);
	const [pendingProjectId, setPendingProjectId] = useState(projectId);

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
		if (isCollectionAddressValid(value)) {
			setCollectionAddress(value as Address);
		}
	};

	const handleChainIdChange = (value: string) => {
		setPendingChainId(value);
		if (isChainIdValid(value)) {
			setChainId(value);
		}
	};

	const handleCollectibleIdChange = (value: string) => {
		setPendingCollectibleId(value);
		if (isCollectibleIdValid(value)) {
			setCollectibleId(value);
		}
	};

	function toggleConnect() {
		if (address) {
			disconnect();
		} else {
			setOpenConnectModal(true);
		}
	}

	const handleReset = () => {
		localStorage.removeItem('marketplace_settings');
		window.location.reload();
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
				<div className="flex w-full items-center gap-3">
					<TextInput
						labelLocation="left"
						label="Project ID"
						value={pendingProjectId}
						onChange={(ev) => setPendingProjectId(ev.target.value)}
						name="projectId"
					/>
					<Button
						label="Set Project ID"
						shape="square"
						onClick={() => setProjectId(pendingProjectId)}
					/>
					<Switch
						checked={isEmbeddedWalletEnabled}
						onCheckedChange={setIsEmbeddedWalletEnabled}
						label="Enable Embedded Wallet"
					/>
				</div>

				<Divider />

				<div className="grid grid-cols-3 gap-3">
					<TextInput
						label="Collection address"
						labelLocation="top"
						name="collectionAddress"
						value={pendingCollectionAddress}
						onChange={(ev) => handleCollectionAddressChange(ev.target.value)}
						error={
							!isCollectionAddressValid(pendingCollectionAddress)
								? 'Invalid collection address'
								: undefined
						}
					/>
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

				<TextInput
					label="Wallet"
					labelLocation="top"
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
