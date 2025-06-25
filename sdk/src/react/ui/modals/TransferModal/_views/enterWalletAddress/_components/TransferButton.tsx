'use client';

import { Button, Spinner } from '@0xsequence/design-system';
import { NetworkType } from '@0xsequence/network';
import { observer } from '@legendapp/state/react';
import { getNetwork } from '../../../../../../../utils/network';
import { useWallet } from '../../../../../../_internal/wallet/useWallet';
import { transferModal$ } from '../../../_store';

const TransferButton = observer(
	({
		onClick,
		isDisabled,
		chainId,
	}: {
		onClick: () => Promise<void>;
		isDisabled: boolean | undefined;
		chainId: number;
	}) => {
		const { wallet } = useWallet();
		const network = getNetwork(chainId);
		const isWaaS = wallet?.isWaaS;
		const isTestnet = network.type === NetworkType.TESTNET;
		const isProcessing = transferModal$.state.transferIsBeingProcessed.get();
		const label = isProcessing ? (
			isWaaS && !isTestnet ? (
				<div className="flex items-center justify-center gap-2">
					<Spinner size="sm" className="text-white" />
					<span>Loading fee options</span>
				</div>
			) : (
				<div className="flex items-center justify-center gap-2">
					<Spinner size="sm" className="text-white" />
					<span>Transferring</span>
				</div>
			)
		) : (
			'Transfer'
		);

		return (
			<Button
				className="flex justify-self-end px-10"
				onClick={onClick}
				disabled={!!isDisabled}
				title="Transfer"
				label={label}
				variant="primary"
				shape="square"
				size="sm"
			/>
		);
	},
);

export default TransferButton;
