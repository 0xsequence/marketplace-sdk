import { Box, IconButton, NumericInput } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import SvgMinusIcon from '../../../../icons/MinusIcon';
import SvgPlusIcon from '../../../../icons/PlusIcon';
import { quantityInputWrapper } from './styles.css';

type QuantityInputProps = {
	$quantity: Observable<string>;
	$invalidQuantity: Observable<boolean>;
	decimals: number;
	maxQuantity: string;
};

export default function QuantityInput({
	$quantity,
	$invalidQuantity,
	decimals,
	maxQuantity,
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
		<Box className={quantityInputWrapper}>
			<NumericInput
				name={'quantity'}
				decimals={decimals || 0}
				paddingLeft={'1'}
				label={'Enter quantity'}
				labelLocation="top"
				controls={
					<Box
						display={'flex'}
						alignItems={'center'}
						gap={'1'}
						marginRight={'2'}
					>
						<IconButton
							disabled={!quantity || Number(quantity) <= 0}
							onClick={handleDecrement}
							background={'buttonGlass'}
							size="xs"
							icon={SvgMinusIcon}
						/>

						<IconButton
							onClick={handleIncrement}
							background={'buttonGlass'}
							size="xs"
							icon={SvgPlusIcon}
						/>
					</Box>
				}
				numeric={true}
				value={quantity}
				onChange={(e) => handleChangeQuantity(e.target.value)}
				width={'full'}
			/>
			{invalidQuantity && (
				<Box color="negative" fontSize="small">
					{invalidQuantity}
				</Box>
			)}
		</Box>
	);
}
