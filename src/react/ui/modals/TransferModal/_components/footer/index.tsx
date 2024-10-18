import { truncateMiddle } from '../../../../../../utils';
import SvgPositiveCircleIcon from '../../../../icons/PositiveCircleIcon';
import { transferModal$ } from '../../_store';
import { Box, Spinner, Text } from '@0xsequence/design-system';

export default function TransactionViewFooter() {
	const transactionProcessing =
		transferModal$.state.isTransactionProcessing.get();
	const walletAddress = transferModal$.state.receiverWalletAddress.get();

	return (
		<Box display="flex" alignItems="center">
			{transactionProcessing ? (
				<Spinner size="md" />
			) : (
				<SvgPositiveCircleIcon size="sm" />
			)}

			<Text color="text50" fontSize="normal" fontWeight="medium" marginLeft="2">
				{transactionProcessing
					? 'Processing transaction'
					: 'Transaction complete'}
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
				{truncateMiddle(walletAddress, 4, 4)}
			</Text>
		</Box>
	);
}
