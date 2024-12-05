import { Box, IconButton, NumericInput, Text } from '@0xsequence/design-system';
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
		const formattedValue = formatQuantity(value);
		$quantity.set(formattedValue);
		validateQuantity(formattedValue);
	}

	function validateQuantity(value: string) {
		if (!value || value.trim() === '' || isNaN(Number(value))) {
			$invalidQuantity.set(true);
			return;
		}

		const numValue = Number(value);
		$invalidQuantity.set(numValue <= 0 || numValue > Number(maxQuantity));
	}

	function formatQuantity(value: string) {
		if (!value || isNaN(Number(value))) {
			return '0';
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
			<Text color="negative">{invalidQuantity ? 'Invalid quantity' : ' '}</Text>
		</Box>
	);
}
