import { ChainId, networks } from '@0xsequence/network';
import { truncateMiddle } from '../../../../../../utils';
import SvgPositiveCircleIcon from '../../../../icons/PositiveCircleIcon';
import { Box, Spinner, Text } from '@0xsequence/design-system';
import type { Hex } from 'viem';

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
					// TODO: Replace "polygonLight" with the actual color from design system
					color="polygonLight"
					textAlign="right"
					fontSize="normal"
					fontWeight="medium"
					fontFamily="body"
				>
					{transactionHash && truncateMiddle(transactionHash, 4, 4)}
				</Text>
			</Box>
		</Box>
	);
}
