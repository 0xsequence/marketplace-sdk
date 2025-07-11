'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { useWallet } from '../src/react/_internal/wallet/useWallet';
import { TEST_ACCOUNTS } from '../test/const';

export const ConnectionStatus: React.FC = () => {
	const {
		wallet,
		isLoading: walletLoading,
		isError: walletError,
	} = useWallet();
	const {
		connect,
		connectors,
		error: connectError,
		isPending: isConnecting,
	} = useConnect();
	const [debugInfo, setDebugInfo] = useState<string>('');
	const [walletAddress, setWalletAddress] = useState<string>('');
	const [walletChainId, setWalletChainId] = useState<number | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	// Auto-connect to mock connector when needed
	useEffect(() => {
		// Log available connectors for debugging
		if (connectors.length > 0) {
			const connectorInfo = connectors
				.map((c) => `${c.name} (${c.id})`)
				.join(', ');
			setDebugInfo(`Available: ${connectorInfo}`);
		}

		// Only try to connect if not connected and not connecting
		if (!isConnected && !isConnecting && connectors.length > 0 && !wallet) {
			// Find mock connector
			let targetConnector = connectors.find((c) => c.id === 'mock');

			// Fallback to any connector with 'mock' in name
			if (!targetConnector) {
				targetConnector = connectors.find(
					(c) =>
						c.name.toLowerCase().includes('mock') ||
						c.id.toLowerCase().includes('mock'),
				);
			}

			// Use first available connector as last resort
			if (!targetConnector && connectors.length > 0) {
				targetConnector = connectors[0];
			}

			if (targetConnector) {
				console.log(
					'Auto-connecting to Anvil via:',
					targetConnector.name,
					targetConnector.id,
				);
				connect({ connector: targetConnector });
			}
		}
	}, [isConnected, isConnecting, connectors, connect, wallet]);

	// Get wallet details when wallet is available
	useEffect(() => {
		if (wallet && !walletLoading) {
			const getWalletDetails = async () => {
				try {
					const [address, chainId] = await Promise.all([
						wallet.address(),
						wallet.getChainId(),
					]);
					setWalletAddress(address);
					setWalletChainId(chainId);
					setIsConnected(true);
				} catch (error) {
					console.error('Error getting wallet details:', error);
					setIsConnected(false);
				}
			};

			getWalletDetails();
		} else if (!wallet) {
			setWalletAddress('');
			setWalletChainId(null);
			setIsConnected(false);
		}
	}, [wallet, walletLoading]);

	const getConnectionStatus = () => {
		if (isConnecting || walletLoading) {
			return { status: 'Connecting to Anvil...', color: '#f59e0b' }; // amber
		}

		// Show loading status if wallet instance isn't ready yet
		if (isConnected && !wallet) {
			return {
				status: 'Wallet loading...',
				color: '#f59e0b',
			}; // amber
		}

		if (wallet && walletAddress) {
			const accountIndex = TEST_ACCOUNTS.findIndex(
				(acc) => acc.toLowerCase() === walletAddress.toLowerCase(),
			);
			const accountLabel =
				accountIndex >= 0 ? `Account ${accountIndex}` : 'Custom';

			return {
				status: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} (${accountLabel})`,
				color: '#10b981', // green
			};
		}

		if (walletError || connectError) {
			return {
				status: `Error: ${connectError?.message || 'Connection failed'}`,
				color: '#ef4444', // red
			};
		}

		return { status: 'Disconnected from Anvil', color: '#ef4444' }; // red
	};

	const { status, color } = getConnectionStatus();

	const getWalletInfo = () => {
		if (!wallet) return null;

		const walletType = wallet.isWaaS ? 'WaaS' : 'External';
		const walletKind = wallet.walletKind || 'Unknown';
		return `${walletType} (${walletKind})`;
	};

	const getAnvilInfo = () => {
		if (!walletChainId && !isConnected) return null;

		const displayChainId = walletChainId || 'Unknown';
		return `Anvil Chain: ${displayChainId}`;
	};

	return (
		<div
			style={{
				position: 'fixed',
				top: '16px',
				right: '16px',
				zIndex: 9999,
				backgroundColor: '#1f2937',
				color: 'white',
				padding: '8px 12px',
				borderRadius: '8px',
				fontSize: '12px',
				fontFamily: 'monospace',
				border: `2px solid ${color}`,
				boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				gap: '4px',
				maxWidth: '320px',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				<div
					style={{
						width: '8px',
						height: '8px',
						borderRadius: '50%',
						backgroundColor: color,
					}}
				/>
				<span>{status}</span>
			</div>

			{getWalletInfo() && (
				<div style={{ fontSize: '10px', color: '#9ca3af' }}>
					Connector: {getWalletInfo()}
				</div>
			)}

			{getAnvilInfo() && (
				<div style={{ fontSize: '10px', color: '#9ca3af' }}>
					{getAnvilInfo()}
				</div>
			)}

			{debugInfo && (
				<div style={{ fontSize: '10px', color: '#9ca3af' }}>{debugInfo}</div>
			)}

			{(walletError || connectError) && (
				<div
					style={{
						fontSize: '10px',
						color: '#ef4444',
						wordBreak: 'break-word',
					}}
				>
					{connectError?.message || 'Wallet connection failed'}
				</div>
			)}
		</div>
	);
};
