import type { Observable } from '@legendapp/state';
import {
	CustomSelect,
	type SelectItem,
} from '../../../../components/_internals/custom-select/CustomSelect';
import { Box, Image, Text } from '@0xsequence/design-system';
import { useEffect } from 'react';
import { observer } from '@legendapp/state/react';
import { formatUnits } from 'viem';

export type FeeOption = {
	gasLimit: number;
	to: string;
	token: {
		chainId: number;
		contractAddress: string | null;
		decimals: number;
		logoURL: string;
		name: string;
		symbol: string;
		tokenID: string | null;
		type: string;
	};
	value: string;
};

const WaasFeeOptionsSelect = observer(
	({
		options,
		selectedFeeOption$,
	}: {
		options: FeeOption[];
		selectedFeeOption$: Observable<FeeOption | undefined>;
	}) => {
		const feeOptions = options.map((option) => {
			if (!option.token.contractAddress) return null;
			const value = option.token.contractAddress;
			const feeOptionItem = FeeOptionSelectItem({ value, option });

			return feeOptionItem;
		});

		useEffect(() => {
			if (options.length > 0 && !selectedFeeOption$.get())
				selectedFeeOption$.set(options[0]);
		}, [options, selectedFeeOption$]);

		if (options.length === 0 || !selectedFeeOption$.get()?.token) return null;

		return (
			<CustomSelect
				items={feeOptions}
				onValueChange={(value) => {
					const selectedOption = options.find(
						(option) => option.token.contractAddress === value,
					);

					selectedFeeOption$.set(selectedOption);
				}}
				defaultValue={selectedFeeOption$.get()?.token.contractAddress ? 
					FeeOptionSelectItem({
						value: selectedFeeOption$.get()?.token.contractAddress ?? '',
						option: selectedFeeOption$.get() ?? options[0]
					}) : undefined
				}
			/>
		);
	},
);

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
			<Box display="flex" alignItems="center" gap="2">
				<Image
					src={option.token.logoURL}
					alt={option.token.symbol}
					width="3"
					height="3"
				/>

				<Box display="flex" gap="1">
					<Text color="text100" fontSize="small" fontFamily="body">
						Fee
					</Text>
					<Text
						color="text50"
						fontSize="small"
						fontFamily="body"
						fontWeight="semibold"
					>
						(in {option.token.symbol})
					</Text>

					<Text color="text100" fontSize="small" fontFamily="body">
						:
					</Text>
				</Box>

				<Text fontSize="small" fontFamily="body">
					{formatUnits(BigInt(option.value), option.token.decimals || 0)}
				</Text>
			</Box>
		),
	} as SelectItem;
}

export default WaasFeeOptionsSelect;
