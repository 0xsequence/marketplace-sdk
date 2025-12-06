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
	useErc721SaleDetails,
	useOpenConnectModal,
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
	salePrice?: {
		amount?: bigint;
		currencyAddress?: Address;
	};
}

export function ERC721SaleControls({
	salesContractAddress,
	collectionAddress,
	chainId,
	isLoading,
	salePrice,
}: ERC721SaleControlsProps) {
	const { address } = useAccount();
	const { openConnectModal } = useOpenConnectModal();
	const [quantity, setQuantity] = useState(1);

	const {
		quantityMinted,
		quantityRemaining,
		quantityTotal,
		isLoading: erc721SaleLoading,
	} = useErc721SaleDetails({
		chainId,
		salesContractAddress,
		itemsContractAddress: collectionAddress,
		enabled: true,
	});
	const { data: currency, isLoading: currencyIsLoading } = useCurrency({
		chainId,
		currencyAddress: salePrice?.currencyAddress,
	});

	const loading = erc721SaleLoading || currencyIsLoading || isLoading;

	const { show: showBuyModal } = useBuyModal();

	const handleBuy = () => {
		showBuyModal({
			chainId,
			collectionAddress,
			salesContractAddress,
			cardType: 'shop',
			quantityRemaining: quantityRemaining ?? 0n,
			items: [
				{
					quantity: BigInt(quantity),
				},
			],
			salePrice: {
				amount: salePrice?.amount || 0n,
				currencyAddress: salePrice?.currencyAddress || ('0x' as Address),
			},
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
						{quantityMinted}/{quantityTotal}
					</Text>
					<Text variant="small" className="text-text-50">
						{((Number(quantityMinted) / Number(quantityTotal)) * 100).toFixed(
							1,
						)}
						%
					</Text>
				</div>
				<Progress value={Number(quantityMinted) / Number(quantityTotal)} />
				<div className="flex items-center justify-between px-1">
					<Text variant="small" className="text-text-50">
						{quantityRemaining} left
					</Text>
					<Text variant="small" className="text-text-50">
						{quantityMinted} minted
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
					max={Number(quantityRemaining)}
					value={quantity}
					onChange={(e) =>
						setQuantity(
							Math.min(
								Number(quantityRemaining),
								Math.max(1, Number.parseInt(e.target.value, 10) || 1),
							),
						)
					}
					placeholder="Enter quantity"
					className="w-24 rounded-md border border-border-base bg-background-default px-4 py-2 text-text-100 placeholder-text-40 focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
					disabled={Number(quantityRemaining) === 0}
				/>

				<Button
					variant="primary"
					onClick={address ? handleBuy : () => openConnectModal()}
					disabled={Number(quantityRemaining) === 0}
				>
					{address ? <CartIcon /> : <WalletIcon />}
					{address
						? Number(quantityRemaining) === 0
							? 'Sold out'
							: 'Buy'
						: 'Connect wallet'}
				</Button>

				<Text variant="small" className="text-text-50">
					(Total:{' '}
					{formatUnits(
						BigInt(salePrice?.amount || '0') * BigInt(quantity),
						currency?.decimals ?? 0,
					)}{' '}
					{currency?.symbol})
				</Text>
			</div>
		</div>
	);
}
