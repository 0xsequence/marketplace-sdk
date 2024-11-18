import { Box, IconButton, NumericInput } from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { useCollectible } from '#react-hooks';
import type { Hex } from 'viem';
import SvgMinusIcon from '../../../../icons/MinusIcon';
import SvgPlusIcon from '../../../../icons/PlusIcon';
import { quantityInputWrapper } from './styles.css';

type QuantityInputProps = {
	$quantity: Observable<string>;
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
};

export default function QuantityInput({
	$quantity,
	chainId,
	collectionAddress,
	collectibleId,
}: QuantityInputProps) {
	const { data: collectable, isLoading: collectableLoading } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	const quantityDecimals =
		collectable && ((collectable.decimals || 0) as number | undefined);

	function handleChangeQuantity(value: string) {
		if (!isValidInput(value)) return;

		const formattedValue = formatQuantity(value);
		if (formattedValue !== null) {
			$quantity.set(formattedValue);
		}
	}

	function handleIncrement() {
		if (!isValidInput()) return;

		const newQuantity = incrementQuantity();
		if (newQuantity !== null) {
			$quantity.set(newQuantity);
		}
	}

	function handleDecrement() {
		if (!isValidInput()) return;

		const newQuantity = decrementQuantity();
		if (newQuantity !== null) {
			$quantity.set(newQuantity);
		}
	}

	function isValidInput(value?: string): boolean {
		return (
			collectable !== undefined &&
			quantityDecimals !== undefined &&
			(value === undefined || value !== '')
		);
	}

	function formatQuantity(value: string): string | null {
		if (quantityDecimals === 0 && value.includes('.')) {
			return null;
		}

		if (quantityDecimals && quantityDecimals > 0) {
			const decimalIndex = value.indexOf('.');
			if (
				decimalIndex !== -1 &&
				value.length - decimalIndex > quantityDecimals + 1
			) {
				return null;
			}
		}

		return value;
	}

	const quantity = $quantity.get();

	function incrementQuantity(): string | null {
		if (!isValidInput()) return null;

		if (!quantity) {
			return quantityDecimals === 0
				? '1'
				: `1.${'0'.repeat(quantityDecimals!)}`;
		}

		const newValue =
			quantityDecimals === 0
				? (Number.parseInt(quantity) + 1).toString()
				: (Number.parseFloat(quantity) + 1).toFixed(quantityDecimals);

		return newValue;
	}

	function decrementQuantity(): string | null {
		if (!quantity) {
			return '1';
		}

		const newValue = Number.parseFloat(quantity) - 1;
		if (newValue < 0) {
			return null;
		}

		return quantityDecimals === 0
			? newValue.toString()
			: newValue.toFixed(quantityDecimals);
	}

	function getPlaceholder(decimals: number) {
		if (decimals === 0) {
			return '0';
		} else {
			return '0.' + '0'.repeat(decimals);
		}
	}

	if (collectableLoading) {
		return null;
	}

	return (
		<Box className={quantityInputWrapper}>
			<NumericInput
				name={'quantity'}
				decimals={quantityDecimals || 0}
				paddingLeft={'1'}
				label={'Enter quantity'}
				labelLocation="top"
				placeholder={getPlaceholder(quantityDecimals || 0)}
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
