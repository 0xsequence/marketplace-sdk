import { CheckmarkIcon, Spinner, Text } from '@0xsequence/design-system';
import { type ChainId, networks } from '@0xsequence/network';
import type { Hex } from 'viem';
import { truncateMiddle } from '../../../../../../utils';

type TransactionFooterProps = {
	transactionHash: Hex | undefined;
	orderId?: string;
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
	isTimeout: boolean;
	chainId: ChainId;
};

export default function TransactionFooter({
	transactionHash,
	orderId,
	isConfirming,
	isConfirmed,
	isFailed,
	isTimeout,
	chainId,
}: TransactionFooterProps) {
	const icon =
		((isConfirmed || orderId) && <PositiveCircle />) ||
		(isConfirming && <Spinner size="md" />);

	const title =
		((isConfirmed || orderId) && 'Transaction complete') ||
		(isConfirming && 'Processing transaction') ||
		(isFailed && 'Transaction failed') ||
		(isTimeout && 'Transaction took longer than expected');

	const transactionUrl = `${networks[chainId as unknown as ChainId]?.blockExplorer?.rootUrl}tx/${transactionHash}`;
	return (
		<div className="flex items-center">
			{icon}
			<Text
				className="text-base ml-2 font-body"
				color="text50"
				fontWeight="medium"
			>
				{title}
			</Text>
			<a
				className="grow ml-2 text-right no-underline"
				href={transactionUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Text
					className="text-right text-base font-body"
					fontWeight="medium"
					style={{
						color: 'hsla(247, 100%, 75%, 1)',
					}}
				>
					{transactionHash && truncateMiddle(transactionHash, 4, 4)}
				</Text>
			</a>
		</div>
	);
}

export const PositiveCircle = () => (
	<div className="w-5 h-5 bg-[#35a554] rounded-full flex items-center justify-center">
		<CheckmarkIcon size="xs" color="white" />
	</div>
);
