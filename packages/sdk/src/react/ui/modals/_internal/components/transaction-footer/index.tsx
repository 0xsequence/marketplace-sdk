import { type ChainId, networks } from '@0xsequence/network';
import type { Hex } from 'viem';
import { Box, Text, Spinner } from '@0xsequence/design-system';
import { truncateMiddle } from '../../../../../../utils';
import SvgPositiveCircleIcon from '../../../../icons/PositiveCircleIcon';

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
		((isConfirmed || orderId) && <SvgPositiveCircleIcon size="md" />) ||
		(isConfirming && <Spinner size="md" />);

	const title =
		((isConfirmed || orderId) && 'Transaction complete') ||
		(isConfirming && 'Processing transaction') ||
		(isFailed && 'Transaction failed') ||
		(isTimeout && 'Transaction took longer than expected');

	const transactionUrl = `${networks[chainId as unknown as ChainId]?.blockExplorer?.rootUrl}tx/${transactionHash}`;
	return (
		<Box display="flex" alignItems="center">
			{icon}

			<Text
				color="text50"
				fontSize="normal"
				fontWeight="medium"
				marginLeft="2"
				fontFamily="body"
			>
				{title}
			</Text>

			<Box
				as="a"
				flexGrow="1"
				marginLeft="2"
				href={transactionUrl}
				target="_blank"
				rel="noopener noreferrer"
				textAlign="right"
				textDecoration="none"
			>
				<Text
					textAlign="right"
					fontSize="normal"
					fontWeight="medium"
					fontFamily="body"
					style={{
						color: 'hsla(247, 100%, 75%, 1)',
					}}
				>
					{transactionHash && truncateMiddle(transactionHash, 4, 4)}
				</Text>
			</Box>
		</Box>
	);
}
