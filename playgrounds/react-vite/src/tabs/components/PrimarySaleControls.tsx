import { useOpenConnectModal } from '@0xsequence/connect';
import {
	Button,
	CartIcon,
	Progress,
	Text,
	WalletIcon,
} from '@0xsequence/design-system';
import {
	useBuyModal,
	useCountOfPrimarySaleItems,
	useCurrency,
	usePrimarySaleShopCardData,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { type Address, formatUnits } from 'viem';
import { useAccount } from 'wagmi';

interface PrimarySaleControlsProps {
	salesContractAddress: Address;
	collectionAddress: Address;
	chainId: number;
}

export default function PrimarySaleControls({
	salesContractAddress,
	collectionAddress,
	chainId,
}: PrimarySaleControlsProps) {
	const { address } = useAccount();
	const { setOpenConnectModal } = useOpenConnectModal();
	const [quantity, setQuantity] = useState(1);

	const { salePrice, collectibleCards } = usePrimarySaleShopCardData({
		chainId,
		primarySaleContractAddress: salesContractAddress,
		collectionAddress,
	});

	const { data: totalCount } = useCountOfPrimarySaleItems({
		chainId,
		primarySaleContractAddress: salesContractAddress,
	});

	const { data: currency } = useCurrency({
		currencyAddress: salePrice?.currencyAddress,
		chainId,
	});

	// Calculate stats from the collectible cards
	const totalSupplyCap = totalCount || 0;
	const remainingCount = collectibleCards.reduce((sum, card) => {
		return sum + Number.parseInt(card.quantityRemaining || '0', 10);
	}, 0);
	const ownedCount = totalSupplyCap - remainingCount;

	const { show: showBuyModal } = useBuyModal();

	const handleBuy = () => {
		if (!salePrice) return;

		showBuyModal({
			chainId,
			collectionAddress,
			salesContractAddress,
			marketplaceType: 'shop',
			quantityDecimals: 0,
			quantityRemaining: remainingCount,
			items: [
				{
					quantity: quantity.toString(),
				},
			],
			salePrice,
		});
	};

	if (!salePrice) {
		return <div>Loading sale information...</div>;
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex flex-col gap-2 rounded-sm bg-background-raised p-3">
				<div className="flex items-center justify-between px-1">
					<Text variant="small" className="text-text-50">
						{ownedCount}/{totalSupplyCap}
					</Text>
					<Text variant="small" className="text-text-50">
						{totalSupplyCap > 0
							? ((ownedCount / totalSupplyCap) * 100).toFixed(1)
							: 0}
						%
					</Text>
				</div>
				<Progress
					value={totalSupplyCap > 0 ? ownedCount / totalSupplyCap : 0}
				/>
				<div className="flex items-center justify-between px-1">
					<Text variant="small" className="text-text-50">
						{remainingCount} left
					</Text>
					<Text variant="small" className="text-text-50">
						{ownedCount} minted
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
						{formatUnits(BigInt(salePrice.amount), currency?.decimals ?? 0)}
					</Text>
					<Text fontWeight="bold" className="text-text-100">
						{currency?.symbol}
					</Text>
				</div>

				<input
					type="number"
					min="1"
					max={remainingCount}
					value={quantity}
					onChange={(e) =>
						setQuantity(
							Math.min(
								remainingCount,
								Math.max(1, Number.parseInt(e.target.value) || 1),
							),
						)
					}
					placeholder="Enter quantity"
					className="w-24 rounded-md border border-border-base bg-background-default px-4 py-2 text-text-100 placeholder-text-40 focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
					disabled={remainingCount === 0}
				/>

				<Button
					variant="primary"
					label={
						address
							? remainingCount === 0
								? 'Sold out'
								: 'Buy'
							: 'Connect wallet'
					}
					leftIcon={address ? CartIcon : WalletIcon}
					onClick={address ? handleBuy : () => setOpenConnectModal(true)}
					disabled={remainingCount === 0}
				/>

				<Text variant="small" className="text-text-50">
					(Total:{' '}
					{formatUnits(
						BigInt(salePrice.amount) * BigInt(quantity),
						currency?.decimals ?? 0,
					)}{' '}
					{currency?.symbol})
				</Text>
			</div>
		</div>
	);
}
