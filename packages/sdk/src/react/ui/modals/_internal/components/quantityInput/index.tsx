import {
	AddIcon,
	Box,
	IconButton,
	NumericInput,
	SubtractIcon,
} from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import * as dn from 'dnum';
import { useState } from 'react';
import { quantityInputWrapper } from './styles.css';

type QuantityInputProps = {
	$quantity: Observable<string>;
	$invalidQuantity: Observable<boolean>;
	decimals: number;
	maxQuantity: string;
};

export default observer(function QuantityInput({
	$quantity,
	$invalidQuantity,
	decimals,
	maxQuantity,
}: QuantityInputProps) {
	const dnMaxQuantity = dn.from(maxQuantity, decimals);
	const dnOne = dn.from('1', decimals);
	const min = decimals > 0 ? Number(`0.${'1'.padStart(decimals, '0')}`) : 0;
	const dnMin = dn.from(min, decimals);

	const [dnQuantity, setDnQuantity] = useState(
		dn.from($quantity.get(), decimals),
	);

	function handleChangeQuantity(value: string) {
		if (!value || value === '') {
			return;
		}
		const dnValue = dn.from(value, decimals);
		const isBiggerThanOrEqualToMin = dn.greaterThan(dnValue, dnMin);
		const isLessThanOrEqualToMax = dn.lessThanOrEqual(dnValue, dnMaxQuantity);
		if (!isBiggerThanOrEqualToMin || !isLessThanOrEqualToMax) {
			$invalidQuantity.set(
				!isBiggerThanOrEqualToMin || !isLessThanOrEqualToMax,
			);
			return;
		}
		$quantity.set(dn.toString(dnValue, decimals));
	}

	function handleIncrement() {
		let newValue = dn.add(dnQuantity, dnOne);
		if (dn.greaterThanOrEqual(newValue, dnMaxQuantity)) {
			newValue = dnMaxQuantity;
			$quantity.set(maxQuantity);
		} else {
			$quantity.set(dn.toString(newValue, decimals));
		}
		setDnQuantity(newValue);
	}

	function handleDecrement() {
		let newValue = dn.subtract(dnQuantity, dnOne);
		if (dn.lessThanOrEqual(newValue, dnMin)) {
			newValue = dnMin;
			$quantity.set(dn.toString(newValue, decimals));
		} else {
			$quantity.set(dn.toString(newValue, decimals));
		}
		setDnQuantity(newValue);
	}

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
							disabled={dn.lessThanOrEqual(dnQuantity, dnMin)}
							onClick={handleDecrement}
							background={'buttonGlass'}
							size="xs"
							icon={SubtractIcon}
						/>

						<IconButton
							disabled={dn.greaterThanOrEqual(dnQuantity, dnMaxQuantity)}
							onClick={handleIncrement}
							background={'buttonGlass'}
							size="xs"
							icon={AddIcon}
						/>
					</Box>
				}
				numeric={true}
				value={$quantity.get()}
				onChange={(e) => handleChangeQuantity(e.target.value)}
				width={'full'}
			/>
			{$invalidQuantity.get() && (
				<Box color="negative" fontSize="small">
					{$invalidQuantity.get()}
				</Box>
			)}
		</Box>
	);
});
