import { truncateMiddle } from '../../../../../../utils';
import SvgPositiveCircleIcon from '../../../../icons/PositiveCircleIcon';
import { Box, Spinner, Text } from '@0xsequence/design-system';
import { Hex } from 'viem';

type TransactionFooterProps = {
	transactionHash: Hex;
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
};

export default function TransactionFooter({
	transactionHash,
	isConfirming,
	isConfirmed,
	isFailed,
}: TransactionFooterProps) {
	const icon =
		(isConfirming && <Spinner size="md" />) ||
		(isConfirmed && <SvgPositiveCircleIcon size="md" />);

	const title =
		(isConfirming && 'Processing transaction') ||
		(isConfirmed && 'Transaction complete') ||
		(isFailed && 'Transaction failed');
	return (
		<Box display="flex" alignItems="center">
			{icon}

			<Text color="text50" fontSize="normal" fontWeight="medium" marginLeft="2">
				{title}
			</Text>

			<Text
				// TODO: Replace "polygonLight" with the actual color from design system
				color="polygonLight"
				flexGrow="1"
				textAlign="right"
				fontSize="normal"
				fontWeight="medium"
				marginLeft="2"
			>
				{truncateMiddle(transactionHash, 4, 4)}
			</Text>
		</Box>
	);
}
