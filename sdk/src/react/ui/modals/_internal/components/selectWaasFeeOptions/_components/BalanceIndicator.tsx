import { Text, WarningIcon } from '@0xsequence/design-system';
import { CheckmarkIcon } from '@0xsequence/design-system';

const BalanceIndicator = ({
	insufficientBalance,
	currencyBalance,
	selectedFeeOption,
}: {
	insufficientBalance: boolean;
	currencyBalance?: { formatted: string };
	selectedFeeOption?: { token: { symbol: string } };
}) => (
	<div className="flex items-center gap-2">
		{insufficientBalance ? (
			<WarningIcon className="text-negative" size="xs" />
		) : (
			<CheckmarkIcon className="text-positive" size="xs" />
		)}

		<Text
			className="font-body font-medium text-xs"
			color={insufficientBalance ? 'negative' : 'text100'}
		>
			You have {currencyBalance?.formatted || '0'}{' '}
			{selectedFeeOption?.token.symbol}
		</Text>
	</div>
);

export default BalanceIndicator;
