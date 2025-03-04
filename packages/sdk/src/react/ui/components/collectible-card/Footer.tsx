import { Box, IconButton, Image, Text } from '@0xsequence/design-system';
import { formatUnits } from 'viem';
import { ContractType, type Currency, type Order } from '../../../_internal';
import SvgBellIcon from '../../icons/Bell';
import { footer, offerBellButton } from './styles.css';

const formatPrice = (amount: string, currency: Currency): string => {
	const formattedPrice = formatUnits(BigInt(amount), currency.decimals);
	const numericPrice = Number.parseFloat(formattedPrice);

	if (numericPrice < 0.0001) {
		return `< 0.0001 ${currency.symbol}`;
	}

	const maxDecimals = numericPrice < 0.01 ? 6 : 4;

	const formattedNumber = numericPrice.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: maxDecimals,
	});

	return `${formattedNumber} ${currency.symbol}`;
};

type FooterProps = {
	name: string;
	type?: ContractType;
	decimals?: number;
	onOfferClick?: () => void;
	highestOffer?: Order;
	lowestListingPriceAmount?: string;
	lowestListingCurrency?: Currency;
	balance?: string;
};

export const Footer = ({
	name,
	type,
	decimals,
	onOfferClick,
	highestOffer,
	lowestListingPriceAmount,
	lowestListingCurrency,
	balance,
}: FooterProps) => {
	const listed = !!lowestListingPriceAmount && !!lowestListingCurrency;

	if (name.length > 15 && highestOffer) {
		name = `${name.substring(0, 13)}...`;
	}
	if (name.length > 17 && !highestOffer) {
		name = `${name.substring(0, 17)}...`;
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
			className={footer}
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
					visibility={name ? 'visible' : 'hidden'}
				>
					{name || 'Untitled'}
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
				{listed && lowestListingCurrency.imageUrl && (
					<Image src={lowestListingCurrency.imageUrl} width="3" height="3" />
				)}

				<Text
					color={listed ? 'text100' : 'text50'}
					fontSize="small"
					fontWeight="bold"
					textAlign="left"
					fontFamily="body"
				>
					{listed &&
						formatPrice(lowestListingPriceAmount, lowestListingCurrency)}
					{!listed && 'Not listed yet'}
				</Text>
			</Box>

			<TokenTypeBalancePill
				balance={balance}
				type={type as ContractType}
				decimals={decimals}
			/>
		</Box>
	);
};

const TokenTypeBalancePill = ({
	balance,
	type,
	decimals,
}: {
	balance?: string;
	type: ContractType;
	decimals?: number;
}) => {
	const displayText =
		type === ContractType.ERC1155
			? balance
				? `Owned: ${formatUnits(BigInt(balance), decimals ?? 0)}`
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
