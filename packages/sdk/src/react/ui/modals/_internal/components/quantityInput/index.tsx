import {
	AddIcon,
	IconButton,
	NumericInput,
	SubtractIcon,
} from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { cn } from '../../../../../../utils';

type QuantityInputProps = {
	$quantity: Observable<string>;
	$invalidQuantity: Observable<boolean>;
	decimals: number;
	maxQuantity: string;
	className?: string;
};

export default function QuantityInput({
	$quantity,
	$invalidQuantity,
	decimals,
	maxQuantity,
	className,
}: QuantityInputProps) {
	function handleChangeQuantity(value: string) {
		const sanitizedValue = value.replace(/[^\d.]/g, '');
		const decimalParts = sanitizedValue.split('.');

		let formattedValue = sanitizedValue;
		if (decimalParts.length > 2) {
			formattedValue = `${decimalParts[0]}.${decimalParts[1]}`;
		}

		const finalValue = formatQuantity(formattedValue);
		$quantity.set(finalValue);
		validateQuantity(finalValue);
	}

	function validateQuantity(value: string) {
		if (!value || value.trim() === '' || Number.isNaN(Number(value))) {
			$invalidQuantity.set(true);
			return;
		}

		const numValue = Number(value);

		const decimalParts = value.split('.');
		if (decimalParts.length > 1 && decimalParts[1].length > decimals) {
			$invalidQuantity.set(true);
			return;
		}

		$invalidQuantity.set(numValue <= 0 || numValue > Number(maxQuantity));
	}

	function formatQuantity(value: string) {
		if (!value || Number.isNaN(Number(value))) {
			return '0';
		}

		const decimalParts = value.split('.');
		if (decimalParts.length > 1 && decimalParts[1].length > decimals) {
			return Number(value).toFixed(decimals);
		}

		if (Number(value) > Number(maxQuantity)) {
			return maxQuantity;
		}

		return value;
	}

	function handleIncrement() {
		const currentValue = Number(quantity) || 0;
		const maxValue = Number(maxQuantity);
		const newValue = Math.min(currentValue + 1, maxValue);
		handleChangeQuantity(newValue.toString());
		return newValue.toString();
	}

	function handleDecrement() {
		const minValue = decimals ? Number(`0.${'0'.repeat(decimals - 1)}1`) : 1;
		const currentValue = Number(quantity) || 0;
		const newValue = Math.max(currentValue - 1, minValue);
		const stringValue = newValue.toString();
		handleChangeQuantity(stringValue);
		return stringValue;
	}

	const quantity = $quantity.get();
	const invalidQuantity = $invalidQuantity.get();

	return (
		<div
			className={cn(
				'flex w-full flex-col [&>label>div>div:has(:disabled):hover]:opacity-100 [&>label>div>div:has(:disabled)]:opacity-100 [&>label>div>div>input]:text-xs [&>label>div>div]:h-9 [&>label>div>div]:rounded [&>label>div>div]:pr-0 [&>label>div>div]:pl-3 [&>label>div>div]:text-xs [&>label]:gap-[2px]',
				className,
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
							className="bg-button-glass"
							disabled={!quantity || Number(quantity) <= 1}
							onClick={handleDecrement}
							size="xs"
							icon={SubtractIcon}
						/>

						<IconButton
							className="bg-button-glass"
							disabled={!quantity || Number(quantity) >= Number(maxQuantity)}
							onClick={handleIncrement}
							size="xs"
							icon={AddIcon}
						/>
					</div>
				}
				numeric={true}
				value={quantity}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleChangeQuantity(e.target.value)
				}
			/>
			{invalidQuantity && (
				<div className="text-negative text-sm">{invalidQuantity}</div>
			)}
		</div>
	);
}
