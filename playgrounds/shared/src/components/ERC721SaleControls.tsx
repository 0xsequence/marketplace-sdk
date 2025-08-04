import {
	Button,
	CartIcon,
	Progress,
	Skeleton,
	Switch,
	Text,
	WalletIcon,
} from '@0xsequence/design-system';
import { ContractType } from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCurrency,
	useFilterState,
	useOpenConnectModal,
	useShopCollectibleSaleData,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { type Address, formatUnits } from 'viem';
import { useAccount } from 'wagmi';

interface ERC721SaleControlsProps {
	salesContractAddress: Address;
	collectionAddress: Address;
	chainId: number;
	tokenIds: string[];
	isLoading: boolean;
}

export function ERC721SaleControls({
	salesContractAddress,
	collectionAddress,
	chainId,
	isLoading,
}: ERC721SaleControlsProps) {
	const { address } = useAccount();
	const { openConnectModal } = useOpenConnectModal();
	const [quantity, setQuantity] = useState(1);
	const { setShowListedOnly, showListedOnly } = useFilterState();

	const {
		supplyCap,
		totalMinted,
		isLoading: shopCollectibleSaleDataIsLoading,
		salePrice,
	} = useShopCollectibleSaleData({
		chainId,
		salesContractAddress,
		collectionType: ContractType.ERC721,
		itemsContractAddress: collectionAddress,
		enabled: true,
	});
	const { data: currency, isLoading: currencyIsLoading } = useCurrency({
		chainId,
		currencyAddress: salePrice?.currencyAddress,
	});

	const loading =
		shopCollectibleSaleDataIsLoading || currencyIsLoading || isLoading;

	const remainingSupply = Math.max(0, Number(supplyCap) - Number(totalMinted));
	const { show: showBuyModal } = useBuyModal();

	const handleBuy = () => {
		showBuyModal({
			chainId,
			collectionAddress,
			salesContractAddress,
			marketplaceType: 'shop',
			quantityDecimals: 0,
			quantityRemaining: remainingSupply,
			items: [
				{
					quantity: quantity.toString(),
				},
			],
			salePrice: salePrice || { amount: '0', currencyAddress: '0x' as Address },
		});
	};

	if (loading) {
		return <Skeleton className="h-[168px] w-full" />;
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex flex-col gap-2 rounded-sm bg-background-raised p-3">
				<div className="flex items-center justify-between px-1">
					<Text variant="small" className="text-text-50">
						{totalMinted}/{supplyCap}
					</Text>
					<Text variant="small" className="text-text-50">
						{((Number(totalMinted) / Number(supplyCap)) * 100).toFixed(1)}%
					</Text>
				</div>
				<Progress value={Number(totalMinted) / Number(supplyCap)} />
				<div className="flex items-center justify-between px-1">
					<Text variant="small" className="text-text-50">
						{remainingSupply} left
					</Text>
					<Text variant="small" className="text-text-50">
						{totalMinted} minted
					</Text>
				</div>
			</div>

			<div className="flex w-full items-center gap-4 rounded-sm bg-background-raised p-4">
				<div className="flex items-center">
					<img
						src={currency?.imageUrl}
						alt={currency?.symbol}
						className="mr-2 h-4 w-4"
					/>

					<Text fontWeight="medium" className="mr-1 text-text-100">
						{formatUnits(
							BigInt(salePrice?.amount || '0'),
							currency?.decimals ?? 0,
						)}
					</Text>
					<Text fontWeight="bold" className="text-text-100">
						{currency?.symbol}
					</Text>
				</div>

				<input
					type="number"
					min="1"
					max={remainingSupply}
					value={quantity}
					onChange={(e) =>
						setQuantity(
							Math.min(
								remainingSupply,
								Math.max(1, Number.parseInt(e.target.value) || 1),
							),
						)
					}
					placeholder="Enter quantity"
					className="w-24 rounded-md border border-border-base bg-background-default px-4 py-2 text-text-100 placeholder-text-40 focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
					disabled={remainingSupply === 0}
				/>

				<Button
					variant="primary"
					label={
						address
							? remainingSupply === 0
								? 'Sold out'
								: 'Buy'
							: 'Connect wallet'
					}
					leftIcon={address ? CartIcon : WalletIcon}
					onClick={address ? handleBuy : () => openConnectModal()}
					disabled={remainingSupply === 0}
				/>

				<Text variant="small" className="text-text-50">
					(Total:{' '}
					{formatUnits(
						BigInt(salePrice?.amount || '0') * BigInt(quantity),
						currency?.decimals ?? 0,
					)}{' '}
					{currency?.symbol})
				</Text>

				<div className="flex flex-1 items-center justify-end gap-2">
					<Text variant="small" color="text80">
						Show Available Only
					</Text>
					<Switch
						checked={showListedOnly}
						onCheckedChange={() => setShowListedOnly(!showListedOnly)}
					/>
				</div>
			</div>
		</div>
	);
}
