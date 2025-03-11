'use client';

import { useOpenConnectModal } from '@0xsequence/kit';
import { OrderbookKind } from '@0xsequence/marketplace-sdk';
import { useState } from 'react';
import type { Address } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';
import { usePlayground } from '../lib/PlaygroundContext';

export function Settings() {
	const { setOpenConnectModal } = useOpenConnectModal();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

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
		orderbookKind,
		paginationMode,
		setPaginationMode,
	} = usePlayground();

	const [pendingProjectId, setPendingProjectId] = useState(projectId);
	const [isOpen, setIsOpen] = useState(true);

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
		{ label: 'Collection default', value: undefined },
		...Object.keys(OrderbookKind).map((key) => ({
			label: key,
			value: key,
		})),
	];

	return (
		<div className="flex flex-col gap-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-gray-100 text-lg">Settings</h2>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="text-gray-300 hover:text-gray-100"
				>
					{isOpen ? '▲' : '▼'}
				</button>
			</div>

			{isOpen && (
				<div className="flex flex-col gap-4">
					<div className="flex w-full items-center gap-3">
						<div className="flex flex-1 flex-col">
							<label
								htmlFor="projectId"
								className="mb-1 font-medium text-gray-300 text-sm"
							>
								Project ID
							</label>
							<input
								id="projectId"
								type="text"
								value={pendingProjectId}
								onChange={(e) => setPendingProjectId(e.target.value)}
								className="rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
							/>
						</div>
						<button
							type="button"
							onClick={() => setProjectId(pendingProjectId)}
							className="mt-6 rounded-md bg-indigo-700 px-4 py-2 text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Set Project ID
						</button>
						<div className="mt-6 flex items-center gap-2">
							<label
								htmlFor="embeddedWallet"
								className="font-medium text-gray-300 text-sm"
							>
								Enable Embedded Wallet
							</label>
							<input
								id="embeddedWallet"
								type="checkbox"
								checked={isEmbeddedWalletEnabled}
								onChange={(e) => setIsEmbeddedWalletEnabled(e.target.checked)}
								className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
							/>
						</div>
					</div>

					<hr className="border-gray-700" />

					<div className="grid grid-cols-3 gap-3">
						<div className="flex flex-col">
							<label
								htmlFor="collectionAddress"
								className="mb-1 font-medium text-gray-300 text-sm"
							>
								Collection address
							</label>
							<input
								id="collectionAddress"
								type="text"
								value={pendingCollectionAddress}
								onChange={(e) =>
									setCollectionAddress(e.target.value as Address)
								}
								className={`border bg-gray-700 px-3 py-2 ${!isCollectionAddressValid ? 'border-red-500' : 'border-gray-600'} rounded-md text-gray-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
							/>
							{!isCollectionAddressValid && (
								<p className="mt-1 text-red-500 text-xs">
									Invalid collection address
								</p>
							)}
						</div>
						<div className="flex flex-col">
							<label
								htmlFor="chainId"
								className="mb-1 font-medium text-gray-300 text-sm"
							>
								Chain ID
							</label>
							<input
								id="chainId"
								type="text"
								value={pendingChainId}
								onChange={(e) => setChainId(e.target.value)}
								className={`border bg-gray-700 px-3 py-2 ${!isChainIdValid ? 'border-red-500' : 'border-gray-600'} rounded-md text-gray-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
							/>
							{!isChainIdValid && (
								<p className="mt-1 text-red-500 text-xs">Chain ID undefined</p>
							)}
						</div>
						<div className="flex flex-col">
							<label
								htmlFor="collectibleId"
								className="mb-1 font-medium text-gray-300 text-sm"
							>
								Collectible ID
							</label>
							<input
								id="collectibleId"
								type="text"
								value={pendingCollectibleId}
								onChange={(e) => setCollectibleId(e.target.value)}
								className={`border bg-gray-700 px-3 py-2 ${!isCollectibleIdValid ? 'border-red-500' : 'border-gray-600'} rounded-md text-gray-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
							/>
							{!isCollectibleIdValid && (
								<p className="mt-1 text-red-500 text-xs">
									Missing collectible ID
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-col">
						<label
							htmlFor="wallet"
							className="mb-1 font-medium text-gray-300 text-sm"
						>
							Wallet
						</label>
						<div className="flex items-center">
							<input
								id="wallet"
								type="text"
								placeholder="No wallet connected"
								value={address || ''}
								disabled
								className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 shadow-sm"
							/>
							<button
								type="button"
								onClick={toggleConnect}
								className="ml-2 rounded-md bg-indigo-700 px-3 py-2 text-sm text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								{address ? 'Disconnect' : 'Connect'}
							</button>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex flex-col">
							<label
								htmlFor="orderbook"
								className="mb-1 font-medium text-gray-300 text-sm"
							>
								Orderbook
							</label>
							<select
								id="orderbook"
								value={orderbookKind}
								onChange={(e) =>
									setOrderbookKind(e.target.value as OrderbookKind)
								}
								className="rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
							>
								{orderbookOptions.map((option) => (
									<option key={option.label} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col">
							<label
								htmlFor="paginationMode"
								className="mb-1 font-medium text-gray-300 text-sm"
							>
								Pagination Mode
							</label>
							<div className="flex items-center gap-2">
								<input
									id="paginationMode"
									type="checkbox"
									checked={paginationMode === 'paginated'}
									onChange={(e) =>
										setPaginationMode(
											e.target.checked ? 'paginated' : 'infinite',
										)
									}
									className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
								/>
								<span className="text-gray-300 text-sm">
									{paginationMode === 'paginated'
										? 'Paginated'
										: 'Infinite Scroll'}
								</span>
							</div>
						</div>
					</div>

					<div className="pt-3">
						<button
							type="button"
							onClick={handleReset}
							className="rounded-md bg-red-700 px-4 py-2 text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						>
							Reset Settings
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
