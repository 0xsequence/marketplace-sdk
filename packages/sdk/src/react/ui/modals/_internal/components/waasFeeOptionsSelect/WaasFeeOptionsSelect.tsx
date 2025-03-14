import { Image, Text } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useEffect } from 'react';
import { formatUnits, zeroAddress } from 'viem';
import {
	CustomSelect,
	type SelectItem,
} from '../../../../components/_internals/custom-select/CustomSelect';

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

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			if (options.length > 0 && !selectedFeeOption$.get())
				selectedFeeOption$.set(options[0]);
		}, [options]);

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
				defaultValue={
					selectedFeeOption$.get()?.token.contractAddress
						? FeeOptionSelectItem({
								value: selectedFeeOption$.get()?.token.contractAddress ?? '',
								option: selectedFeeOption$.get() ?? options[0],
							})
						: undefined
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
