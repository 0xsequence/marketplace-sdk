import { Box, IconButton, Image, Text } from '@0xsequence/design-system';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { ContractType, type Currency, type Order } from '../../../_internal';
import SvgBellIcon from '../../icons/Bell';
import { footer, offerBellButton } from './styles.css';

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
	const listed = !!lowestListingPriceAmount && !!lowestListingCurrency;

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
			alignItems="flex-start"
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
				width="full"
			>
				<Text
					color="text100"
					fontSize="normal"
					fontWeight="bold"
					textAlign="left"
					fontFamily="body"
				>
					{name}
				</Text>

				{highestOffer && onOfferClick && (
					<IconButton
						size="xs"
						variant="primary"
						className={offerBellButton}
						position="absolute"
						right="0"
						top="0"
						onClick={(e) => {
							e.stopPropagation();
							onOfferClick?.();
						}}
						icon={(props) => <SvgBellIcon {...props} size={'xs'} />}
					/>
				)}
			</Box>

			<Box display="flex" alignItems="center" gap="1">
				{listed && (
					<Image src={lowestListingCurrency?.imageUrl} width="3" height="3" />
				)}

				<Text
					color={listed ? 'text100' : 'text50'}
					fontSize="small"
					fontWeight="bold"
					textAlign="left"
					fontFamily="body"
				>
					{listed &&
						formatUnits(
							BigInt(lowestListingPriceAmount),
							lowestListingCurrency.decimals,
						) + ' ' + lowestListingCurrency.symbol}

					{!listed && 'Not listed yet'}
				</Text>
			</Box>

			<TokenTypeBalancePill balance={balance} type={type as ContractType} />
		</Box>
	);
};

const TokenTypeBalancePill = ({
	balance,
	type,
}: { balance?: string; type: ContractType }) => {
	const displayText =
		type === ContractType.ERC1155
			? !!balance
				? `Owned: ${balance}`
				: 'ERC-1155'
			: 'ERC-721';

	return (
		<Text
			background="backgroundSecondary"
			color="text80"
			fontSize="small"
			textAlign="left"
			fontFamily="body"
			paddingX="2"
			paddingY="1"
			borderRadius="sm"
		>
			{displayText}
		</Text>
	);
};
