'use client';

import { useOpenConnectModal } from '@0xsequence/connect';
import {
	Button,
	Collapsible,
	Divider,
	Select,
	Switch,
	Text,
	TextInput,
} from '@0xsequence/design-system';
import { OrderbookKind } from '@0xsequence/marketplace-sdk';
import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useMarketplace } from '../../store';

export function Settings() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	const {
		sdkConfig: { projectId },
		setOrderbookKind,
		orderbookKind,
		paginationMode,
		setPaginationMode,
		resetSettings,
	} = useMarketplace();

	// Local state for pending values
	const [pendingProjectId, setPendingProjectId] = useState(projectId);

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
					<Button
						label="Set Project ID"
						shape="square"
						onClick={() => setProjectId(pendingProjectId)}
					/>
				</div>

				<Divider />

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
