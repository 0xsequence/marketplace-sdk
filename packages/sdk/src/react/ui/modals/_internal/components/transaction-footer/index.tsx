import { Box, Spinner, Text } from '@0xsequence/design-system';
import { type ChainId, networks } from '@0xsequence/network';
import type { Hex } from 'viem';
import { truncateMiddle } from '../../../../../../utils';
import SvgPositiveCircleIcon from '../../../../icons/PositiveCircleIcon';

type TransactionFooterProps = {
	transactionHash: Hex;
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
	isTimeout: boolean;
	chainId: ChainId;
};

export default function TransactionFooter({
	transactionHash,
	isConfirming,
	isConfirmed,
	isFailed,
	isTimeout,
	chainId,
}: TransactionFooterProps) {
	const icon =
		(isConfirming && <Spinner size="md" />) ||
		(isConfirmed && <SvgPositiveCircleIcon size="md" />);

	const title =
		(isConfirming && 'Processing transaction') ||
		(isConfirmed && 'Transaction complete') ||
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
					// TODO: Replace "polygonLight" with the actual color from design system
					color="polygonLight"
					textAlign="right"
					fontSize="normal"
					fontWeight="medium"
					fontFamily="body"
				>
					{truncateMiddle(transactionHash, 4, 4)}
				</Text>
			</Box>
		</Box>
	);
}
