import { Box, IconButton, Image, Text } from '@0xsequence/design-system';
import { formatUnits } from 'viem';
import { ContractType, Currency, Order } from '../../../_internal';
import Pill from '../_internals/pill/Pill';
import SvgBellIcon from '../../icons/Bell';
import { footer, offerBellButton } from './styles.css';
import { useAccount } from 'wagmi';

type FooterProps = {
	name: string;
	type?: ContractType;
	onOfferClick?: () => void;
	highestOffer?: Order;
	lowestListingPriceAmount?: string;
	lowestListingCurrency?: Currency;
	balance?: string;
	isAnimated?: boolean;
};

export const Footer = ({
	name,
	type,
	onOfferClick,
	highestOffer,
	lowestListingPriceAmount,
	lowestListingCurrency,
	balance,
	isAnimated,
}: FooterProps) => {
	const { address } = useAccount();

	if (name.length > 15 && highestOffer) {
		name = name.substring(0, 13) + '...';
	}
	if (name.length > 17 && !highestOffer) {
		name = name.substring(0, 17) + '...';
	}

	return (
		<Box
			display="flex"
			flexDirection="column"
			gap="2"
			padding="4"
			whiteSpace="nowrap"
			position="relative"
			className={!!address && isAnimated ? footer.animated : footer.static}
		>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				position="relative"
			>
				<Text
					color="text100"
					fontSize="normal"
					fontWeight="bold"
					textAlign="left"
				>
					{name}
				</Text>

				{highestOffer && onOfferClick && (
					<IconButton
						variant="primary"
						className={offerBellButton}
						onClick={(e) => {
							e.stopPropagation();
							onOfferClick?.();
						}}
						icon={(props) => <SvgBellIcon {...props} size={'xs'} />}
					/>
				)}
			</Box>

			{lowestListingPriceAmount && lowestListingCurrency && (
				<Box display="flex" alignItems="center" gap="1">
					<Image src={lowestListingCurrency?.imageUrl} width="3" height="3" />

					<Text
						color="text100"
						fontSize="small"
						fontWeight="bold"
						textAlign="left"
					>
						{formatUnits(
							BigInt(lowestListingPriceAmount),
							lowestListingCurrency.decimals,
						)}{' '}
					</Text>
				</Box>
			)}

			{!!balance && type !== ContractType.ERC721 && (
				<Pill text={`Owned: ${balance}`} />
			)}

			{type === ContractType.ERC721 && <Pill text="ERC-721" />}
		</Box>
	);
};
