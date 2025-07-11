'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWallet } from '../src/react/_internal/wallet/useWallet';
import { TEST_ACCOUNTS } from '../test/const';

type ConnectorType = 'mock' | 'waas' | 'sequence' | 'auto';

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
	const { disconnect } = useDisconnect();
	const { isConnected: wagmiConnected } = useAccount();
	const [debugInfo, setDebugInfo] = useState<string>('');
	const [walletAddress, setWalletAddress] = useState<string>('');
	const [walletChainId, setWalletChainId] = useState<number | null>(null);
	const [preferredConnector, setPreferredConnector] =
		useState<ConnectorType>('auto');
	const [manuallyDisconnected, setManuallyDisconnected] =
		useState<boolean>(false);

	useEffect(() => {
		const storedConnector = localStorage.getItem(
			'storybook-connector',
		) as ConnectorType;
		const defaultConnector = storedConnector || 'auto';
		setPreferredConnector(defaultConnector);
	}, []);

	useEffect(() => {
		if (preferredConnector !== 'auto') {
			localStorage.setItem('storybook-connector', preferredConnector);
		}
	}, [preferredConnector]);

	useEffect(() => {
		if (wagmiConnected) {
			setManuallyDisconnected(false);
		}
	}, [wagmiConnected]);

	useEffect(() => {
		if (connectors.length > 0) {
			const connectorInfo = connectors
				.map((c) => `${c.name || 'unnamed'} (${c.id || 'no-id'})`)
				.join(', ');
			setDebugInfo(`Available: ${connectorInfo}`);
		}

		// Only try to connect if not connected and not connecting and not manually disconnected
		if (
			!wagmiConnected &&
			!isConnecting &&
			!manuallyDisconnected &&
			connectors.length > 0 &&
			!wallet
		) {
			let targetConnector: (typeof connectors)[0] | undefined;

			if (preferredConnector === 'auto') {
				targetConnector = connectors[0];
			} else {
				targetConnector = connectors.find((c) => c.id === preferredConnector);

				// Fallback to any connector with the preferred type in name
				if (!targetConnector) {
					targetConnector = connectors.find(
						(c) =>
							c.name?.toLowerCase().includes(preferredConnector) ||
							c.id?.toLowerCase().includes(preferredConnector),
					);
				}
			}

			// Final fallback to first available connector
			if (!targetConnector && connectors.length > 0) {
				targetConnector = connectors[0];
			}

			if (targetConnector) {
				console.log(
					`Auto-connecting to ${preferredConnector} connector:`,
					targetConnector.name || 'unnamed',
					targetConnector.id || 'no-id',
				);
				try {
					connect({ connector: targetConnector });
				} catch (error) {
					console.error('Failed to connect to connector:', error);
					setDebugInfo(
						`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
					);
				}
			}
		}
	}, [
		wagmiConnected,
		isConnecting,
		manuallyDisconnected,
		connectors,
		connect,
		wallet,
		preferredConnector,
	]);

	useEffect(() => {
		if (wallet && !walletLoading && wagmiConnected) {
			const getWalletDetails = async () => {
				try {
					const [address, chainId] = await Promise.all([
						wallet.address(),
						wallet.getChainId(),
					]);
					setWalletAddress(address);
					setWalletChainId(chainId);
				} catch (error) {
					console.error('Error getting wallet details:', error);
					setWalletAddress('');
					setWalletChainId(null);
				}
			};

			getWalletDetails();
		} else if (!wagmiConnected || !wallet) {
			setWalletAddress('');
			setWalletChainId(null);
		}
	}, [wallet, walletLoading, wagmiConnected]);

	const getConnectionStatus = () => {
		if (isConnecting || walletLoading) {
			return { status: 'Connecting to Anvil...', color: '#f59e0b' };
		}

		// Show loading status if wallet instance isn't ready yet
		if (wagmiConnected && !wallet) {
			return {
				status: 'Wallet loading...',
				color: '#f59e0b',
			};
		}

		if (wallet && walletAddress && wagmiConnected) {
			const accountIndex = TEST_ACCOUNTS.findIndex(
				(acc) => acc.toLowerCase() === walletAddress.toLowerCase(),
			);
			const accountLabel =
				accountIndex >= 0 ? `Account ${accountIndex}` : 'Custom';

			return {
				status: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} (${accountLabel})`,
				color: '#10b981',
			};
		}

		if (walletError || connectError) {
			return {
				status: `Error: ${connectError?.message || 'Connection failed'}`,
				color: '#ef4444',
			};
		}

		return { status: 'Disconnected from Anvil', color: '#ef4444' };
	};

	const { status, color } = getConnectionStatus();

	const getWalletInfo = () => {
		if (!wallet) return null;

		const walletType = wallet.isWaaS ? 'WaaS' : 'External';
		const walletKind = wallet.walletKind || 'Unknown';
		return `${walletType} (${walletKind})`;
	};

	const getAnvilInfo = () => {
		if (!walletChainId && !wagmiConnected) return null;

		const displayChainId = walletChainId || 'Unknown';
		return `Anvil Chain: ${displayChainId}`;
	};

	const handleConnectorChange = (newConnector: ConnectorType) => {
		setPreferredConnector(newConnector);
		setManuallyDisconnected(false);
		if (wagmiConnected) {
			disconnect();
		}
		setWalletAddress('');
		setWalletChainId(null);
	};

	const handleDisconnect = () => {
		setManuallyDisconnected(true);
		disconnect();
		setWalletAddress('');
		setWalletChainId(null);
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

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					width: '100%',
				}}
			>
				<span style={{ fontSize: '10px', color: '#9ca3af' }}>Connector:</span>
				<select
					value={preferredConnector}
					onChange={(e) =>
						handleConnectorChange(e.target.value as ConnectorType)
					}
					style={{
						background: '#374151',
						color: 'white',
						border: '1px solid #4b5563',
						borderRadius: '4px',
						fontSize: '10px',
						padding: '2px 4px',
						flex: 1,
					}}
				>
					<option value="auto">Auto</option>
					<option value="mock">Mock</option>
					<option value="waas">WaaS</option>
					<option value="sequence">Sequence</option>
				</select>
			</div>

			{wagmiConnected && wallet && (
				<button
					type="button"
					onClick={handleDisconnect}
					style={{
						background: '#dc2626',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						fontSize: '10px',
						padding: '4px 8px',
						cursor: 'pointer',
						width: '100%',
						marginTop: '4px',
					}}
				>
					Disconnect
				</button>
			)}

			{getWalletInfo() && (
				<div style={{ fontSize: '10px', color: '#9ca3af' }}>
					Type: {getWalletInfo()}
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
