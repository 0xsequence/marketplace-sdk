import {
	ChevronLeftIcon,
	ChevronRightIcon,
	IconButton,
	Image,
	Text,
} from '@0xsequence/design-system';
import { formatUnits } from 'viem';
import { ContractType, type Currency, type Order } from '../../../_internal';
import SvgBellIcon from '../../icons/Bell';

const OVERFLOW_PRICE = 100000000;
const UNDERFLOW_PRICE = 0.0001;

const formatPrice = (amount: string, currency: Currency): React.ReactNode => {
	const formattedPrice = formatUnits(BigInt(amount), currency.decimals);
	const numericPrice = Number.parseFloat(formattedPrice);

	if (numericPrice < UNDERFLOW_PRICE) {
		return (
			<div className="flex items-center">
				<ChevronLeftIcon className="w-3 h-3 text-text100" />
				<Text>{`${UNDERFLOW_PRICE} ${currency.symbol}`}</Text>
			</div>
		);
	}

	if (numericPrice > OVERFLOW_PRICE) {
		return (
			<div className="flex items-center">
				<ChevronRightIcon className="w-3 h-3 text-text100" />
				<Text>{`${OVERFLOW_PRICE.toLocaleString('en-US', {
					maximumFractionDigits: 2,
				})} ${currency.symbol}`}</Text>
			</div>
		);
	}

	const maxDecimals = numericPrice < 0.01 ? 6 : 4;

	const formattedNumber = numericPrice.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: maxDecimals,
	});

	return (
		<div className="flex items-center gap-1">
			<Text>
				{formattedNumber} {currency.symbol}
			</Text>
		</div>
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
		<div className="bg-background-primary flex flex-col items-start gap-2 p-4 whitespace-nowrap relative">
			<div className="flex items-center justify-between relative w-full">
				<Text
					className="text-base text-left font-body"
					color="text100"
					fontWeight="bold"
				>
					{name || 'Untitled'}
				</Text>

				{highestOffer && onOfferClick && (
					<IconButton
						className="w-[22px] h-[22px] absolute right-0 top-0"
						size="xs"
						variant="primary"
						onClick={(e) => {
							e.stopPropagation();
							onOfferClick?.();
						}}
						icon={(props) => <SvgBellIcon {...props} size={'xs'} />}
					/>
				)}
			</div>
			<div className="flex items-center gap-1">
				{listed && lowestListingCurrency.imageUrl && (
					<Image
						className="w-3 h-3"
						src={lowestListingCurrency.imageUrl}
						onError={(e) => {
							e.currentTarget.style.display = 'none';
						}}
					/>
				)}

				<Text
					className="text-sm text-left font-body"
					color={listed ? 'text100' : 'text50'}
					fontWeight="bold"
				>
					{listed &&
						formatPrice(lowestListingPriceAmount, lowestListingCurrency)}
					{!listed && 'Not listed yet'}
				</Text>
			</div>
			<TokenTypeBalancePill
				balance={balance}
				type={type as ContractType}
				decimals={decimals}
			/>
		</div>
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
			className="bg-background-secondary text-sm text-left font-body px-2 py-1 rounded-lg"
			color="text80"
		>
			{displayText}
		</Text>
	);
};
