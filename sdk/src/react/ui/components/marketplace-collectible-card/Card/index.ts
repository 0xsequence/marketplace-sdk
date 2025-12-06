import { Card as CardRoot } from './card';
import { CardBadge } from './card-badge';
import { CardContent } from './card-content';
import { CardFooter } from './card-footer';
import { CardMedia } from './card-media';
import { CardPrice } from './card-price';
import { CardSaleDetails } from './card-sale-details';
import { CardSkeleton } from './card-skeleton';
import { CardTitle } from './card-title';

export const Card = Object.assign(CardRoot, {
	Media: CardMedia,
	Content: CardContent,
	Title: CardTitle,
	Price: CardPrice,
	Badge: CardBadge,
	Footer: CardFooter,
	SaleDetails: CardSaleDetails,
	Skeleton: CardSkeleton,
});

export type { CardProps } from './card';
export type { CardBadgeProps } from './card-badge';
export type { CardContentProps } from './card-content';
export type { CardFooterProps } from './card-footer';
export type { CardMediaProps } from './card-media';
export type { CardPriceProps } from './card-price';
export type { CardSaleDetailsProps } from './card-sale-details';
export type { CardSkeletonProps } from './card-skeleton';
export type { CardTitleProps } from './card-title';
