'use client';

import { Image, Select, Text } from '@0xsequence/design-system';
import { useEffect } from 'react';
import { formatUnits, zeroAddress } from 'viem';
import type { FeeOption } from '../../../../../../types/waas-types';
import type { SelectItem } from '../../../../components/_internals/custom-select/CustomSelect';

const WaasFeeOptionsSelect = ({
	options,
	selectedFeeOption,
	onSelectedFeeOptionChange,
}: {
	options: FeeOption[];
	selectedFeeOption: FeeOption | undefined;
	onSelectedFeeOptionChange: (option: FeeOption | undefined) => void;
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

			return FeeOptionSelectItem({ value, option });
		});

		useEffect(() => {
			if (options.length > 0 && !selectedFeeOption) {
				onSelectedFeeOptionChange(options[0]);
			}
		}, [options, selectedFeeOption, onSelectedFeeOptionChange]);

		if (options.length === 0 || !selectedFeeOption?.token) return null;

		return (
			<Select
				name="fee-option"
				options={feeOptions.map((option) => ({
					label: option.content,
					value: option.value,
				}))}
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
}: {
	value: string;
	option: FeeOption;
}) {
	return {
		value,
		content: (
			<div className="flex items-center gap-2">
				<Image
					className="h-3 w-3"
					src={option.token.logoURL}
					alt={option.token.symbol}
				/>

				<div className="flex gap-1">
					<Text className="font-body text-sm" color="text100">
						Fee
					</Text>
					<Text
						className="font-body text-sm"
						color="text50"
						fontWeight="semibold"
					>
						(in {option.token.symbol})
					</Text>

					<Text className="font-body text-sm" color="text100">
						:
					</Text>
				</div>

				<Text className="font-body text-sm">
					{formatUnits(BigInt(option.value), option.token.decimals || 0)}
				</Text>
			</div>
		),
	} as SelectItem;
}

export default WaasFeeOptionsSelect;
