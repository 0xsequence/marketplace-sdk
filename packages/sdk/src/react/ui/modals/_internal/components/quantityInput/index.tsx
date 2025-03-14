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
	const min = decimals > 0 ? Number(`0.${'0'.repeat(decimals - 1)}1`) : 0;
	const dnMin = dn.from(min, decimals);

	const [dnQuantity, setDnQuantity] = useState(
		dn.from($quantity.get(), decimals),
	);

	function handleChangeQuantity(value: string) {
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
		let newValue = dnQuantity;
		if (dn.greaterThanOrEqual(dnQuantity, dnMaxQuantity)) {
			newValue = dnMaxQuantity;
			$quantity.set(maxQuantity);
		} else {
			newValue = dn.add(dnQuantity, dnOne);
			//TODO: Use dnum here too..
			$quantity.set(dn.toString(newValue, decimals));
		}
		setDnQuantity(newValue);
	}

	function handleDecrement() {
		let newValue = dnQuantity;
		if (dn.lessThanOrEqual(dnQuantity, dnMin)) {
			newValue = dn.from('0', decimals);
			$quantity.set('0');
		} else {
			newValue = dn.subtract(dnQuantity, dnOne);
			//TODO: Use dnum here too..
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
