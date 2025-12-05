import { Button, Separator, Skeleton, Text } from '@0xsequence/design-system';
import {
	useCollectionActiveListingsCurrencies,
	useFilterState,
} from '@0xsequence/marketplace-sdk/react';
import { useEffect, useState } from 'react';
import { type Address, formatUnits, parseUnits } from 'viem';
import { CustomSelect } from '../../../../../sdk/src/react/ui/components/_internals/custom-select/CustomSelect';

export function PriceFilter({
	chainId,
	collectionAddress,
}: {
	chainId: number;
	collectionAddress: Address;
}) {
	const { data: listingCurrencies, isLoading: listingCurrenciesLoading } =
		useCollectionActiveListingsCurrencies({
			chainId,
			collectionAddress,
		});

	const { setPriceFilter, getPriceFilter } = useFilterState();

	const [selectedCurrency, setSelectedCurrency] = useState<string>('');
	const [minPrice, setMinPrice] = useState<string>('');
	const [maxPrice, setMaxPrice] = useState<string>('');
	const [validationError, setValidationError] = useState<string>('');

	// Initialize selected currency when currencies load
	useEffect(() => {
		if (
			listingCurrencies &&
			listingCurrencies.length > 0 &&
			!selectedCurrency
		) {
			setSelectedCurrency(listingCurrencies[0].contractAddress);
		}
	}, [listingCurrencies, selectedCurrency]);

	// Load existing price filter if it exists
	useEffect(() => {
		if (selectedCurrency && listingCurrencies) {
			const existingFilter = getPriceFilter(selectedCurrency);
			if (existingFilter) {
				const selectedCurrencyData = listingCurrencies.find(
					(c) => c.contractAddress === selectedCurrency,
				);
				const decimals = selectedCurrencyData?.decimals || 0;

				// Convert token amounts back to user-friendly decimal values using formatUnits
				const minDecimal = existingFilter.min
					? formatUnits(BigInt(existingFilter.min), decimals)
					: '';
				const maxDecimal = existingFilter.max
					? formatUnits(BigInt(existingFilter.max), decimals)
					: '';

				setMinPrice(minDecimal);
				setMaxPrice(maxDecimal);
			} else {
				setMinPrice('');
				setMaxPrice('');
			}
		}
	}, [selectedCurrency, listingCurrencies, getPriceFilter]);

	const validatePrices = (min: string, max: string): string => {
		if (min && max) {
			const minNum = Number.parseFloat(min);
			const maxNum = Number.parseFloat(max);

			if (Number.isNaN(minNum) || Number.isNaN(maxNum)) {
				return 'Please enter valid numbers';
			}

			if (minNum < 0 || maxNum < 0) {
				return 'Prices must be positive';
			}

			if (minNum > maxNum) {
				return 'Minimum price cannot be greater than maximum price';
			}
		}

		if (min && Number.isNaN(Number.parseFloat(min))) {
			return 'Please enter a valid minimum price';
		}

		if (max && Number.isNaN(Number.parseFloat(max))) {
			return 'Please enter a valid maximum price';
		}

		return '';
	};

	const handleApplyFilter = () => {
		const error = validatePrices(minPrice, maxPrice);

		if (error) {
			setValidationError(error);
			return;
		}

		setValidationError('');

		if (selectedCurrency && listingCurrencies) {
			const selectedCurrencyData = listingCurrencies.find(
				(c) => c.contractAddress === selectedCurrency,
			);
			const decimals = selectedCurrencyData?.decimals || 0;

			// Convert user-friendly decimal values to actual token amounts using parseUnits
			const minTokenAmount = minPrice
				? parseUnits(minPrice, decimals).toString()
				: undefined;
			const maxTokenAmount = maxPrice
				? parseUnits(maxPrice, decimals).toString()
				: undefined;

			setPriceFilter(selectedCurrency, minTokenAmount, maxTokenAmount);
		}
	};

	const handleCurrencyChange = (value: string) => {
		setSelectedCurrency(value);
		// Reset price inputs when currency changes
		setMinPrice('');
		setMaxPrice('');
		setValidationError('');
	};

	const handleMinPriceChange = (value: string) => {
		setMinPrice(value);
		setValidationError('');
	};

	const handleMaxPriceChange = (value: string) => {
		setMaxPrice(value);
		setValidationError('');
	};

	if (listingCurrenciesLoading) {
		return <Skeleton className="mr-3 h-7 w-20 rounded-2xl" />;
	}

	if (listingCurrencies && listingCurrencies.length > 0) {
		return (
			<>
				<div>
					<div className="flex items-center justify-between">
						<Text className="font-bold text-xs">Select currency</Text>
						<CustomSelect
							items={listingCurrencies.map((currency) => ({
								value: currency.contractAddress,
								content: (
									<div className="flex items-center gap-2">
										<img
											src={currency.imageUrl}
											alt={currency.symbol}
											className="h-4 w-4 rounded-full"
										/>
										<Text className="font-bold text-xs">{currency.symbol}</Text>
									</div>
								),
							}))}
							defaultValue={
								listingCurrencies.length > 0
									? {
											value: listingCurrencies[0].contractAddress,
											content: (
												<div className="flex items-center gap-2">
													<img
														src={listingCurrencies[0].imageUrl}
														alt={listingCurrencies[0].symbol}
														className="h-4 w-4 rounded-full"
													/>
													<Text className="font-bold text-xs">
														{listingCurrencies[0].symbol}
													</Text>
												</div>
											),
										}
									: undefined
							}
							onValueChange={handleCurrencyChange}
						/>
					</div>
					<div className="mt-4 flex items-center justify-between">
						<input
							type="number"
							placeholder="Min"
							value={minPrice}
							onChange={(e) => handleMinPriceChange(e.target.value)}
							min="0"
							step="any"
							className={`w-20 rounded-md border ${validationError ? 'border-red-500' : 'border-border-base'} bg-background-default px-4 py-2 font-bold text-text-100 text-xs placeholder-text-40 focus:outline-none`}
						/>

						<Text className="font-bold text-xs">to</Text>

						<input
							type="number"
							placeholder="Max"
							value={maxPrice}
							onChange={(e) => handleMaxPriceChange(e.target.value)}
							min="0"
							step="any"
							className={`w-20 rounded-md border ${validationError ? 'border-red-500' : 'border-border-base'} bg-background-default px-4 py-2 font-bold text-text-100 text-xs placeholder-text-40 focus:outline-none`}
						/>
					</div>

					{validationError && (
						<div className="mt-2">
							<Text className="text-red-500 text-xs">{validationError}</Text>
						</div>
					)}

					<Button
						variant="primary"
						size="sm"
						shape="square"
						className="mt-4 w-full"
						onClick={handleApplyFilter}
					>
						Apply
					</Button>
				</div>

				<Separator />
			</>
		);
	}

	return <Text>No currencies found</Text>;
}
