import { CheckmarkIcon, Spinner, Text } from '@0xsequence/design-system';
import { type ChainId, networks } from '@0xsequence/network';
import type { JSX } from 'react/jsx-runtime';
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
}: TransactionFooterProps): JSX.Element {
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
				className="ml-2 font-body text-base"
				color="text50"
				fontWeight="medium"
			>
				{title}
			</Text>
			<a
				className="ml-2 grow text-right no-underline"
				href={transactionUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Text
					className="text-right font-body text-base"
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

export const PositiveCircle = (): JSX.Element => (
	<div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#35a554]">
		<CheckmarkIcon size="xs" color="white" />
	</div>
);
