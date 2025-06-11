'use client';

import {
	AddIcon,
	IconButton,
	NumericInput,
	SubtractIcon,
} from '@0xsequence/design-system';
import * as dn from 'dnum';
import { useState } from 'react';
import { cn } from '../../../../../../utils';

type QuantityInputBaseProps = {
	value: string;
	onChange: (value: string) => void;
	isInvalid: boolean;
	onInvalidChange: (isInvalid: boolean) => void;
	decimals: number;
	maxQuantity: string;
	className?: string;
	disabled?: boolean;
};

export function QuantityInputBase({
	value,
	onChange,
	isInvalid,
	onInvalidChange,
	decimals,
	maxQuantity,
	className,
	disabled,
}: QuantityInputBaseProps) {
	const dnMaxQuantity = dn.from(maxQuantity, decimals);
	const dnOne = dn.from('1', decimals);
	const min = decimals > 0 ? Number(`0.${'1'.padStart(decimals, '0')}`) : 0;
	const dnMin = dn.from(min, decimals);

	const [dnQuantity, setDnQuantity] = useState(dn.from(value, decimals));

	const [localQuantity, setLocalQuantity] = useState(value);

	const setQuantity = ({
		value,
		isValid,
	}: {
		value: string;
		isValid: boolean;
	}) => {
		setLocalQuantity(value);
		if (isValid) {
			onChange(value);
			setDnQuantity(dn.from(value, decimals));
			onInvalidChange(false);
		} else {
			onInvalidChange(true);
		}
	};

	function handleChangeQuantity(value: string) {
		if (!value || Number.isNaN(Number(value)) || value.endsWith('.')) {
			setQuantity({
				value: value,
				isValid: false,
			});
			return;
		}
		const dnValue = dn.from(value, decimals);
		const isBiggerThanMax = dn.greaterThan(dnValue, dnMaxQuantity);
		const isLessThanMin = dn.lessThan(dnValue, dnMin);

		if (isLessThanMin) {
			setQuantity({
				value: value, // Trying to enter fraction starting with 0
				isValid: false,
			});
			return;
		}

		if (isBiggerThanMax) {
			setQuantity({
				value: maxQuantity,
				isValid: true, // Is vaid is true because we override the value
			});
			return;
		}

		setQuantity({
			value: dn.toString(dnValue, decimals),
			isValid: true,
		});
	}

	function handleIncrement() {
		const newValue = dn.add(dnQuantity, dnOne);
		if (dn.greaterThanOrEqual(newValue, dnMaxQuantity)) {
			setQuantity({
				value: maxQuantity,
				isValid: true,
			});
		} else {
			setQuantity({
				value: dn.toString(newValue, decimals),
				isValid: true,
			});
		}
	}

	function handleDecrement() {
		const newValue = dn.subtract(dnQuantity, dnOne);
		if (dn.lessThanOrEqual(newValue, dnMin)) {
			setQuantity({
				value: String(min),
				isValid: true,
			});
		} else {
			setQuantity({
				value: dn.toString(newValue, decimals),
				isValid: true,
			});
		}
	}

	return (
		<div
			className={cn(
				'flex w-full flex-col [&>label>div>div>div:has(:disabled):hover]:opacity-100 [&>label>div>div>div:has(:disabled)]:opacity-100 [&>label>div>div>div>input]:text-xs [&>label>div>div>div]:h-9 [&>label>div>div>div]:rounded [&>label>div>div>div]:pr-0 [&>label>div>div>div]:pl-3 [&>label>div>div>div]:text-xs [&>label]:gap-[2px]',
				className,
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<NumericInput
				className="w-full pl-1"
				name={'quantity'}
				decimals={decimals || 0}
				label={'Enter quantity'}
				labelLocation="top"
				controls={
					<div className="mr-2 flex items-center gap-1">
						<IconButton
							disabled={dn.lessThanOrEqual(dnQuantity, dnMin)}
							onClick={handleDecrement}
							size="xs"
							icon={SubtractIcon}
						/>

						<IconButton
							disabled={dn.greaterThanOrEqual(dnQuantity, dnMaxQuantity)}
							onClick={handleIncrement}
							size="xs"
							icon={AddIcon}
						/>
					</div>
				}
				value={localQuantity}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleChangeQuantity(e.target.value)
				}
				width={'full'}
			/>
			{isInvalid && (
				<div className="text-negative text-sm">Invalid quantity</div>
			)}
		</div>
	);
}
