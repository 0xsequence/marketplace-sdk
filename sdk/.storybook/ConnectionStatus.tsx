'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

export const ConnectionStatus: React.FC = () => {
	const { address, isConnected, isConnecting, connector } = useAccount();
	const { connect, connectors } = useConnect();

	// Auto-connect to mock connector in Storybook
	useEffect(() => {
		if (!isConnected && !isConnecting && connectors.length > 0) {
			const mockConnector = connectors.find((c) => c.id === 'mock');
			if (mockConnector) {
				connect({ connector: mockConnector });
			}
		}
	}, [isConnected, isConnecting, connectors, connect]);

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
				alignItems: 'center',
				gap: '8px',
			}}
		>
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
	);
};
