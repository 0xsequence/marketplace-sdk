'use client';

import { cn, Image, Select, Text, Tooltip } from '@0xsequence/design-system';
import { useEffect } from 'react';
import { formatUnits, zeroAddress } from 'viem';
import type {
	FeeOption,
	FeeOptionExtended,
} from '../../../../../../types/waas-types';
import type { SelectItem } from '../../../../components/_internals/custom-select/CustomSelect';

const WaasFeeOptionsSelect = ({
	options,
	selectedFeeOption,
	onSelectedFeeOptionChange,
	currencyBalance,
}: {
	options: FeeOption[] | FeeOptionExtended[];
	selectedFeeOption: FeeOption | undefined;
	onSelectedFeeOptionChange: (option: FeeOption | undefined) => void;
	currencyBalance?: { value: bigint };
}) => {
	options = options.map((option) => ({
		...option,
		token: {
			...option.token,
			contractAddress: option.token.contractAddress || zeroAddress,
		},
	}));

	const feeOptions = options.map((option) => {
		const value = option.token.contractAddress ?? '';
		const canAfford = (() => {
			const extendedOption = option as FeeOptionExtended;
			if ('hasEnoughBalanceForFee' in extendedOption) {
				return extendedOption.hasEnoughBalanceForFee;
			}

			if (!currencyBalance || !option.value || !option.token.decimals) {
				return false;
			}
			try {
				const feeValue = BigInt(option.value);
				return currencyBalance.value >= feeValue;
			} catch {
				return false;
			}
		})();

		return FeeOptionSelectItem({ value, option, canAfford });
	});

	useEffect(() => {
		if (options.length > 0 && !selectedFeeOption) {
			onSelectedFeeOptionChange(options[0]);
		}
	}, [options, selectedFeeOption, onSelectedFeeOptionChange]);

	if (options.length === 0 || !selectedFeeOption?.token) return null;

	return (
		<Select.Helper
			id="fee-option"
			name="fee-option"
			options={feeOptions.map((option) => ({
				label: option.content,
				value: option.value,
			}))}
			className="w-full"
			onValueChange={(value) => {
				const selectedOption = options.find(
					(option) => option.token.contractAddress === value,
				);

				onSelectedFeeOptionChange(selectedOption);
			}}
			defaultValue={options[0].token.contractAddress ?? undefined}
		/>
	);
};

function FeeOptionSelectItem({
	value,
	option,
	canAfford,
}: {
	value: string;
	option: FeeOption;
	canAfford: boolean;
}) {
	const formattedFee = formatUnits(
		BigInt(option.value),
		option.token.decimals || 0,
	);
	const isTruncated = formattedFee.length > 11;
	const truncatedFee = isTruncated
		? `${formattedFee.slice(0, 11)}...`
		: formattedFee;

	const feeDisplay = isTruncated ? (
		<Tooltip message={formattedFee}>
			<Text
				className={cn(
					'font-body text-sm',
					canAfford ? 'text-positive' : 'text-text-50',
				)}
			>
				{truncatedFee}
			</Text>
		</Tooltip>
	) : (
		<Text
			className={cn(
				'font-body text-sm',
				canAfford ? 'text-positive' : 'text-text-50',
			)}
		>
			{truncatedFee}
		</Text>
	);

	return {
		value,
		content: (
			<div className="flex items-center gap-2">
				<Image
					className="h-3 w-3"
					src={option.token.logoURL}
					alt={option.token.symbol}
					style={{ opacity: canAfford ? 1 : 0.5 }}
				/>

				<div className="flex gap-1">
					<Text
						className={cn(
							'font-body text-sm',
							canAfford ? 'opacity-100' : 'opacity-50',
						)}
						color="text100"
					>
						Fee
					</Text>
					<Text
						className={cn(
							'font-body text-sm',
							canAfford ? 'opacity-100' : 'opacity-50',
						)}
						color="text50"
						fontWeight="semibold"
					>
						(in {option.token.symbol})
					</Text>

					<Text
						className={cn(
							'font-body text-sm',
							canAfford ? 'opacity-100' : 'opacity-50',
						)}
						color="text100"
					>
						:
					</Text>
				</div>

				{feeDisplay}
			</div>
		),
	} as SelectItem;
}

export default WaasFeeOptionsSelect;
