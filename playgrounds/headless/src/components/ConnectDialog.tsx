import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { ModalShell } from './ui/ModalShell';

interface ConnectDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ConnectDialog({ isOpen, onClose }: ConnectDialogProps) {
	const { connectors, connect, isPending } = useConnect();
	const { isConnected } = useAccount();

	useEffect(() => {
		if (isConnected && isOpen) {
			onClose();
		}
	}, [isConnected, isOpen, onClose]);

	return (
		<ModalShell title="Connect Wallet" isOpen={isOpen} onClose={onClose}>
			<div className="space-y-2">
				{connectors.map((connector) => (
					<button
						key={connector.uid}
						onClick={() => connect({ connector })}
						disabled={isPending}
						className="flex w-full items-center gap-3 rounded-lg bg-gray-700 px-4 py-3 text-left text-white hover:bg-gray-600 disabled:opacity-50"
						type="button"
					>
						{connector.icon && (
							<img src={connector.icon} alt="" className="h-6 w-6" />
						)}
						<span>{connector.name}</span>
						{isPending && (
							<span className="ml-auto text-sm">Connecting...</span>
						)}
					</button>
				))}
			</div>

			{connectors.length === 0 && (
				<p className="py-4 text-center text-gray-400">
					No wallet detected. Please install MetaMask or another Web3 wallet.
				</p>
			)}
		</ModalShell>
	);
}
