import { useOpenConnectModal } from '@0xsequence/connect';
import {
	Button,
	CartIcon,
	Progress,
	Skeleton,
	Text,
	WalletIcon,
} from '@0xsequence/design-system';
import {
	useBuyModal,
	useCurrency,
	useERC721SaleMintedTokens,
	useList721ShopCardData,
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

export default function ERC721SaleControls({
	salesContractAddress,
	collectionAddress,
	chainId,
	tokenIds,
	isLoading,
}: ERC721SaleControlsProps) {
	const { address } = useAccount();
	const { setOpenConnectModal } = useOpenConnectModal();
	const [quantity, setQuantity] = useState(1);
	const { salePrice } = useList721ShopCardData({
		contractAddress: collectionAddress,
		chainId,
		tokenIds,
		salesContractAddress,
		enabled: !isLoading,
	});

	const { data: currency } = useCurrency({
		currencyAddress: salePrice?.currencyAddress,
		chainId,
		query: {
			enabled: !isLoading,
		},
	});

	const { ownedCount, remainingCount, totalSupplyCap } =
		useERC721SaleMintedTokens({
			chainId,
			contractAddress: collectionAddress,
			salesContractAddress,
			tokenIds,
			enabled: !isLoading,
		});

	const { show: showBuyModal } = useBuyModal();

	const handleBuy = () => {
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

	if (isLoading) {
		return <Skeleton className="h-[168px] w-full" />;
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex flex-col gap-2 rounded-sm bg-background-raised p-3">
				<div className="flex items-center justify-between px-1">
					<Text variant="small" className="text-text-50">
						{ownedCount}/{totalSupplyCap}
					</Text>
					<Text variant="small" className="text-text-50">
						{((ownedCount / totalSupplyCap) * 100).toFixed(1)}%
					</Text>
				</div>
				<Progress value={ownedCount / totalSupplyCap} />
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
