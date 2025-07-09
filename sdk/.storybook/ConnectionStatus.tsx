'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';

export const ConnectionStatus: React.FC = () => {
	const { address, isConnected, isConnecting, connector } = useAccount();
	const { connect, connectors, error } = useConnect();
	const [debugInfo, setDebugInfo] = useState<string>('');

	// Auto-connect to mock connector in Storybook
	useEffect(() => {
		// Log available connectors for debugging
		if (connectors.length > 0) {
			const connectorInfo = connectors
				.map((c) => `${c.name} (${c.id})`)
				.join(', ');
			setDebugInfo(`Available: ${connectorInfo}`);
		}

		// Try to connect if not already connected and not in connecting state
		if (!isConnected && !isConnecting && connectors.length > 0) {
			// First, try to find a connector with id 'mock'
			let targetConnector = connectors.find((c) => c.id === 'mock');

			// If no 'mock' connector, try other likely mock connector names
			if (!targetConnector) {
				targetConnector = connectors.find(
					(c) =>
						c.name.toLowerCase().includes('mock') ||
						c.id.toLowerCase().includes('mock'),
				);
			}

			// If still no mock connector, use the first available connector (likely the mock one)
			if (!targetConnector && connectors.length > 0) {
				targetConnector = connectors[0];
			}

			if (targetConnector) {
				console.log(
					'Attempting to connect to:',
					targetConnector.name,
					targetConnector.id,
				);
				connect({ connector: targetConnector });
			}
		}
	}, [isConnected, isConnecting, connectors, connect]);

	// Add timeout to reset connecting state if it gets stuck
	useEffect(() => {
		if (isConnecting) {
			const timeout = setTimeout(() => {
				console.warn('Connection timeout - connection may have failed');
			}, 5000); // 5 second timeout

			return () => clearTimeout(timeout);
		}
	}, [isConnecting]);

	const getConnectionStatus = () => {
		if (isConnecting) {
			return { status: 'Connecting...', color: '#f59e0b' }; // amber
		}
		if (isConnected && address) {
			return {
				status: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
				color: '#10b981', // green
			};
		}
		if (error) {
			return { status: `Error: ${error.message}`, color: '#ef4444' }; // red
		}
		return { status: 'Disconnected', color: '#ef4444' }; // red
	};

	const { status, color } = getConnectionStatus();

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
				maxWidth: '300px',
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
				{connector && (
					<span style={{ color: '#9ca3af', fontSize: '10px' }}>
						({connector.name})
					</span>
				)}
			</div>
			{debugInfo && (
				<div style={{ fontSize: '10px', color: '#9ca3af' }}>{debugInfo}</div>
			)}
			{error && (
				<div
					style={{
						fontSize: '10px',
						color: '#ef4444',
						wordBreak: 'break-word',
					}}
				>
					{error.message}
				</div>
			)}
		</div>
	);
};
