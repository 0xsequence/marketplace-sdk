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

	const [localQuantity, setLocalQuantity] = useState($quantity.get());

	const setQuantity = ({
		value,
		isValid,
	}: {
		value: string;
		isValid: boolean;
	}) => {
		setLocalQuantity(value);
		if (isValid) {
			$quantity.set(value);
			setDnQuantity(dn.from(value, decimals));
			$invalidQuantity.set(false);
		} else {
			$invalidQuantity.set(true);
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
				value={localQuantity}
				onChange={(e) => handleChangeQuantity(e.target.value)}
				width={'full'}
			/>
			{$invalidQuantity.get() && (
				<Box color="negative" fontSize="small">
					Invalid quantity
				</Box>
			)}
		</Box>
	);
});
