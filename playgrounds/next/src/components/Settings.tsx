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
		<div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-sm">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold text-gray-100">Settings</h2>
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
					<div className="flex gap-3 w-full items-center">
						<div className="flex flex-col flex-1">
							<label
								htmlFor="projectId"
								className="text-sm font-medium text-gray-300 mb-1"
							>
								Project ID
							</label>
							<input
								id="projectId"
								type="text"
								value={pendingProjectId}
								onChange={(e) => setPendingProjectId(e.target.value)}
								className="px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							/>
						</div>
						<button
							type="button"
							onClick={() => setProjectId(pendingProjectId)}
							className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-6"
						>
							Set Project ID
						</button>
						<div className="flex items-center gap-2 mt-6">
							<label
								htmlFor="embeddedWallet"
								className="text-sm font-medium text-gray-300"
							>
								Enable Embedded Wallet
							</label>
							<input
								id="embeddedWallet"
								type="checkbox"
								checked={isEmbeddedWalletEnabled}
								onChange={(e) => setIsEmbeddedWalletEnabled(e.target.checked)}
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
							/>
						</div>
					</div>

					<hr className="border-gray-700" />

					<div className="grid grid-cols-3 gap-3">
						<div className="flex flex-col">
							<label
								htmlFor="collectionAddress"
								className="text-sm font-medium text-gray-300 mb-1"
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
								className={`px-3 py-2 bg-gray-700 border ${!isCollectionAddressValid ? 'border-red-500' : 'border-gray-600'} text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
							/>
							{!isCollectionAddressValid && (
								<p className="mt-1 text-xs text-red-500">
									Invalid collection address
								</p>
							)}
						</div>
						<div className="flex flex-col">
							<label
								htmlFor="chainId"
								className="text-sm font-medium text-gray-300 mb-1"
							>
								Chain ID
							</label>
							<input
								id="chainId"
								type="text"
								value={pendingChainId}
								onChange={(e) => setChainId(e.target.value)}
								className={`px-3 py-2 bg-gray-700 border ${!isChainIdValid ? 'border-red-500' : 'border-gray-600'} text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
							/>
							{!isChainIdValid && (
								<p className="mt-1 text-xs text-red-500">Chain ID undefined</p>
							)}
						</div>
						<div className="flex flex-col">
							<label
								htmlFor="collectibleId"
								className="text-sm font-medium text-gray-300 mb-1"
							>
								Collectible ID
							</label>
							<input
								id="collectibleId"
								type="text"
								value={pendingCollectibleId}
								onChange={(e) => setCollectibleId(e.target.value)}
								className={`px-3 py-2 bg-gray-700 border ${!isCollectibleIdValid ? 'border-red-500' : 'border-gray-600'} text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
							/>
							{!isCollectibleIdValid && (
								<p className="mt-1 text-xs text-red-500">
									Missing collectible ID
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-col">
						<label
							htmlFor="wallet"
							className="text-sm font-medium text-gray-300 mb-1"
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
								className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md shadow-sm"
							/>
							<button
								type="button"
								onClick={toggleConnect}
								className="ml-2 px-3 py-2 bg-indigo-700 text-white text-sm rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								{address ? 'Disconnect' : 'Connect'}
							</button>
						</div>
					</div>

					<div className="flex gap-4 items-center">
						<div className="flex flex-col">
							<label
								htmlFor="orderbook"
								className="text-sm font-medium text-gray-300 mb-1"
							>
								Orderbook
							</label>
							<select
								id="orderbook"
								value={orderbookKind}
								onChange={(e) =>
									setOrderbookKind(e.target.value as OrderbookKind)
								}
								className="px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
								className="text-sm font-medium text-gray-300 mb-1"
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
									className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
								/>
								<span className="text-sm text-gray-300">
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
							className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
						>
							Reset Settings
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
