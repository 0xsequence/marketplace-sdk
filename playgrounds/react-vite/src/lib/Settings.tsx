import {
	Button,
	Collapsible,
	Divider,
	Select,
	Switch,
	Text,
	TextInput,
} from '@0xsequence/design-system2';
import { useOpenConnectModal } from '@0xsequence/kit';
import { useState } from 'react';
import type { Hex } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { OrderbookKind } from '../../../../packages/sdk/src';
import { useMarketplace } from './MarketplaceContext';

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
		paginationMode,
		setPaginationMode,
	} = useMarketplace();

	const [pendingProjectId, setPendingProjectId] = useState(projectId);

	const handleReset = () => {
		localStorage.removeItem('marketplace_settings');
		window.location.reload();
	};

	const orderbookOptions: {
		label: string;
		value: string | undefined;
	}[] = [{ label: 'Collection default', value: undefined }].concat(
		// @ts-ignore
		Object.keys(OrderbookKind).map((key) => ({
			label: key,
			value: key,
		})),
	);

	return (
		<Collapsible defaultOpen={true} label="Settings">
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
				<div className="flex gap-3">
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
						defaultValue={undefined}
						//@ts-ignore
						options={orderbookOptions}
						onValueChange={(value) => setOrderbookKind(value as OrderbookKind)}
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
						variant="raised"
						shape="square"
						onClick={handleReset}
					/>
				</div>
			</div>
		</Collapsible>
	);
}
