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
import { useState } from 'react';
import { useMarketplace } from 'shared-components';
import type { Hex } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { OrderbookKind } from '../../../../packages/sdk/src';

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
		chainId,
		collectibleId,
		collectionAddress,
		sdkConfig: { projectId },
		isEmbeddedWalletEnabled,
		setIsEmbeddedWalletEnabled,
		setOrderbookKind,
		paginationMode,
		setPaginationMode,
		resetSettings,
		applySettings,
	} = useMarketplace();

	const [projectIdState, setProjectIdState] = useState(projectId);
	const [collectionAddressState, setCollectionAddressState] =
		useState<Hex>(collectionAddress);
	const [chainIdState, setChainIdState] = useState(chainId);
	const [collectibleIdState, setCollectibleIdState] = useState(collectibleId);

	const applyAllSettings = () => {
		applySettings(
			projectIdState,
			collectionAddressState,
			chainIdState,
			collectibleIdState,
		);
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
				<div className="flex flex-col gap-3">
					<div className="flex w-full items-center gap-3">
						<TextInput
							labelLocation="left"
							label="Project ID"
							value={projectIdState}
							onChange={(ev) => setProjectIdState(ev.target.value)}
							name="projectId"
						/>
					</div>
					<div className="flex gap-3">
						<TextInput
							label="Collection address"
							style={{ width: '250px' }}
							labelLocation="top"
							name="collectionAddress"
							value={collectionAddressState}
							onChange={(ev) =>
								setCollectionAddressState(ev.target.value as Hex)
							}
						/>
						<TextInput
							label="Chain ID"
							labelLocation="top"
							name="chainId"
							value={chainIdState}
							onChange={(ev) => setChainIdState(ev.target.value)}
						/>
						<TextInput
							label="Collectible ID"
							labelLocation="top"
							name="collectibleId"
							value={collectibleIdState}
							onChange={(ev) => setCollectibleIdState(ev.target.value)}
						/>
					</div>
					<Button
						label="Apply Configuration"
						shape="square"
						onClick={applyAllSettings}
					/>
				</div>
				<Divider />
				<div className="flex flex-col">
					<Switch
						checked={isEmbeddedWalletEnabled}
						onCheckedChange={setIsEmbeddedWalletEnabled}
						label="Enable Embedded Wallet"
					/>
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
				</div>
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
						onClick={resetSettings}
					/>
				</div>
			</div>
		</Collapsible>
	);
}
