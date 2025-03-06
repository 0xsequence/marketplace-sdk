import {
	Box,
	ChevronLeftIcon,
	ChevronRightIcon,
	IconButton,
	Image,
	Text,
} from '@0xsequence/design-system';
import { formatUnits } from 'viem';
import { ContractType, type Currency, type Order } from '../../../_internal';
import SvgBellIcon from '../../icons/Bell';
import { footer, footerPriceChevron, offerBellButton } from './styles.css';

const OVERFLOW_PRICE = 1000000000;
const UNDERFLOW_PRICE = 0.0001;

const formatPrice = (amount: string, currency: Currency): React.ReactNode => {
	const formattedPrice = formatUnits(BigInt(amount), currency.decimals);
	const numericPrice = Number.parseFloat(formattedPrice);

	if (numericPrice < UNDERFLOW_PRICE) {
		return (
			<Box display="flex" alignItems="center" gap="1">
				<ChevronLeftIcon className={footerPriceChevron} />
				<Text>{`${UNDERFLOW_PRICE} ${currency.symbol}`}</Text>
			</Box>
		);
	}

	if (numericPrice > OVERFLOW_PRICE) {
		return (
			<Box display="flex" alignItems="center" gap="1">
				<ChevronRightIcon className={footerPriceChevron} />
				<Text>{`${OVERFLOW_PRICE.toLocaleString('en-US', {
					maximumFractionDigits: 2,
				})} ${currency.symbol}`}</Text>
			</Box>
		);
	}

	const maxDecimals = numericPrice < 0.01 ? 6 : 4;

	const formattedNumber = numericPrice.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: maxDecimals,
	});

	return (
		<Box display="flex" alignItems="center" gap="1">
			<Text>
				{formattedNumber} {currency.symbol}
			</Text>
		</Box>
	);
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
					<Image
						src={lowestListingCurrency.imageUrl}
						width="3"
						height="3"
						onError={(e) => {
							e.currentTarget.style.display = 'none';
						}}
					/>
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
