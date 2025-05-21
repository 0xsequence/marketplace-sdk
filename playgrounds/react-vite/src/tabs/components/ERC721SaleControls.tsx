import { useOpenConnectModal } from '@0xsequence/connect';
import { Button, CartIcon, Text, WalletIcon } from '@0xsequence/design-system';
import { useState } from 'react';
import { type Address, formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import {
	useBuyModal,
	useCurrency,
	useList721ShopCardData,
} from '../../../../../sdk/src/react';

type ERC721SaleControlsProps = {
	salesContractAddress: Address;
	collectionAddress: Address;
	chainId: number;
};

export default function ERC721SaleControls({
	salesContractAddress,
	collectionAddress,
	chainId,
}: ERC721SaleControlsProps) {
	const { address } = useAccount();
	const { setOpenConnectModal } = useOpenConnectModal();
	const [quantity, setQuantity] = useState(1);
	const { salePrice } = useList721ShopCardData({
		contractAddress: collectionAddress,
		chainId,
		tokenIds: ['1'],
		salesContractAddress,
	});

	const { data: currency } = useCurrency({
		currencyAddress: salePrice?.currencyAddress,
		chainId,
	});
	const { show: showBuyModal } = useBuyModal();

	const handleBuy = () => {
		showBuyModal({
			chainId,
			collectionAddress,
			salesContractAddress,
			marketplaceType: 'shop',
			quantityDecimals: 0,
			quantityRemaining: 1,
			items: [
				{
					quantity: quantity.toString(),
				},
			],
			salePrice,
		});
	};

	return (
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
				value={quantity}
				onChange={(e) =>
					setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
				}
				placeholder="Enter quantity"
				className="w-24 rounded-md border border-border-base bg-background-default px-4 py-2 text-text-100 placeholder-text-40 focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
			/>

			<Button
				variant="primary"
				label={address ? 'Buy' : 'Connect wallet'}
				leftIcon={address ? CartIcon : WalletIcon}
				onClick={address ? handleBuy : () => setOpenConnectModal(true)}
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
	);
}
