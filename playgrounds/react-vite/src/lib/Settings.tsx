import {
	Box,
	Button,
	Collapsible,
	Divider,
	Select,
	Switch,
	TextInput,
} from '@0xsequence/design-system';
import { useOpenConnectModal } from '@0xsequence/kit';
import { useState } from 'react';
import type { Hex } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { OrderbookKind } from '../../../../packages/sdk/src';
import { useMarketplace } from './MarketplaceContext';

/*
export enum OrderbookKind {
  unknown = 'unknown',
  sequence_marketplace_v1 = 'sequence_marketplace_v1',
  sequence_marketplace_v2 = 'sequence_marketplace_v2',
  blur = 'blur',
  opensea = 'opensea',
  looks_rare = 'looks_rare',
  reservoir = 'reservoir',
  x2y2 = 'x2y2'
}
*/

export function Settings() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	function toggleConnect() {
		if (address) {
			disconnect();
		} else {
			setOpenConnectModal(true);
		}
	}
	const {
		pendingCollectionAddress,
		setCollectionAddress,
		isCollectionAddressValid,
		pendingChainId,
		setChainId,
		isChainIdValid,
		pendingCollectibleId,
		setCollectibleId,
		isCollectibleIdValid,
		setProjectId,
		sdkConfig: { projectId },
		isEmbeddedWalletEnabled,
		setIsEmbeddedWalletEnabled,
		setOrderbookKind,
	} = useMarketplace();

	const [pendingProjectId, setPendingProjectId] = useState(projectId);

	const handleReset = () => {
		localStorage.removeItem('marketplace_settings');
		window.location.reload();
	};

	const orderbookOptions = Object.keys(OrderbookKind).map((key) => ({
		label: key,
		value: key,
	}));

	return (
		<Collapsible defaultOpen={true} label="Settings">
			<Box gap="3" flexDirection="column">
				<Box gap="3" width="full" alignItems="center">
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
				</Box>
				<Divider />
				<Box gap="3">
					<TextInput
						label="Collection address"
						style={{ width: '250px' }}
						labelLocation="top"
						name="collectionAddress"
						value={pendingCollectionAddress}
						onChange={(ev) => setCollectionAddress(ev.target.value as Hex)}
						error={
							!isCollectionAddressValid
								? 'Invalid collection address'
								: undefined
						}
					/>
					<TextInput
						label="Chain ID"
						labelLocation="top"
						name="chainId"
						value={pendingChainId}
						onChange={(ev) => setChainId(ev.target.value)}
						error={!isChainIdValid ? 'Chainid undefined' : undefined}
					/>
					<TextInput
						label="Collectible ID"
						labelLocation="top"
						name="collectibleId"
						value={pendingCollectibleId}
						onChange={(ev) => setCollectibleId(ev.target.value)}
						error={!isCollectibleIdValid ? 'Missing collectable id' : undefined}
					/>
				</Box>
				<TextInput
					label="Wallet"
					labelLocation="top"
					placeholder="No wallet connected"
					value={address || ''}
					disabled={true}
					name="wallet"
					controls={
						<Box>
							<Button
								label={address ? 'Disconnect' : 'Connect'}
								size="xs"
								shape="square"
								onClick={toggleConnect}
							/>
						</Box>
					}
				/>
				<Select
					label="Orderbook"
					labelLocation="top"
					name="orderbook"
					defaultValue={OrderbookKind.sequence_marketplace_v2}
					options={orderbookOptions}
					onValueChange={(value) => setOrderbookKind(value as OrderbookKind)}
				/>

				<Box paddingTop="3">
					<Button
						label="Reset Settings"
						variant="raised"
						shape="square"
						onClick={handleReset}
					/>
				</Box>
			</Box>
		</Collapsible>
	);
}
