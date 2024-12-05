import { Box, IconButton, NumericInput } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import SvgMinusIcon from '../../../../icons/MinusIcon';
import SvgPlusIcon from '../../../../icons/PlusIcon';
import { quantityInputWrapper } from './styles.css';

type QuantityInputProps = {
	$quantity: Observable<string>;
	decimals: number;
	maxQuantity: string;
};

export default function QuantityInput({
	$quantity,
	decimals,
	maxQuantity,
}: QuantityInputProps) {
	function handleChangeQuantity(value: string) {
		const formattedValue = formatQuantity(value);
		if (formattedValue !== null) {
			$quantity.set(formattedValue);
		}
	}

	function formatQuantity(value: string) {
		if (!value || isNaN(Number(value))) {
			return null;
		}
		if (Number(value) > Number(maxQuantity)) {
			return maxQuantity;
		}

		return value;
	}

	function handleIncrement() {
		const currentValue = Number(quantity);
		const maxValue = Number(maxQuantity);

		const newValue = Math.min(currentValue + 1, maxValue);
		return newValue.toString();
	}

	function handleDecrement() {
		const minValue = decimals ? Number(`0.${'0'.repeat(decimals - 1)}1`) : 1;

		const currentValue = Number(quantity);
		const newValue = Math.max(currentValue - 1, minValue);
		return newValue.toString();
	}

	const quantity = $quantity.get();

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
							disabled={Number.parseFloat(quantity) === 0 || !quantity}
							onClick={handleDecrement}
							background={'buttonGlass'}
							size="xs"
							icon={SvgMinusIcon}
						/>

						<IconButton
							disabled={Number.parseFloat(quantity) === Number(maxQuantity)}
							onClick={handleIncrement}
							background={'buttonGlass'}
							size="xs"
							icon={SvgPlusIcon}
						/>
					</Box>
				}
				numeric={true}
				value={$quantity.get()}
				onChange={(e) => handleChangeQuantity(e.target.value)}
				width={'full'}
			/>
		</Box>
	);
}
