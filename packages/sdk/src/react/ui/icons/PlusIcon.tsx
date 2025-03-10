import type { IconProps } from '@0xsequence/design-system';
import type { SVGProps } from 'react';
import { cn } from '../../../utils';
import { iconVariants } from './iconVariants';

const Svg = (props: SVGProps<SVGSVGElement>) => (
	<svg
		className="w-16 h-16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-labelledby="plus-title"
		{...props}
	>
		<title id="plus-title">Plus Icon</title>
		<path
			d="M8.65529 7.45725V2.40039H7.45529V7.45724H2.39844V8.65725H7.45529V13.7141H8.65529V8.65725H13.7121V7.45725H8.65529Z"
			fill="white"
		/>
	</svg>
);

const SvgPlusIcon = ({ className, size = 'sm', ...props }: IconProps) => (
	<Svg
		className={cn(
			iconVariants({
				size,
			}),
			className,
		)}
		{...props}
	/>
);

export default SvgPlusIcon;
