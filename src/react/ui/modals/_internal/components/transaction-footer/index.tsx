import { truncateMiddle } from '../../../../../../utils';
import SvgPositiveCircleIcon from '../../../../icons/PositiveCircleIcon';
import { Box, Spinner, Text } from '@0xsequence/design-system';
import { Address } from 'viem';

type TransactionFooterProps = {
	creatorAddress: Address;
	isConfirming: boolean;
	isConfirmed: boolean;
	isFailed: boolean;
};

export default function TransactionFooter({
	creatorAddress,
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
				{truncateMiddle(creatorAddress, 4, 4)}
			</Text>
		</Box>
	);
}
