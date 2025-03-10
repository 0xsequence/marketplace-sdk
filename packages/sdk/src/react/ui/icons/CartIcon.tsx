import type { IconProps } from '@0xsequence/design-system';
import type { SVGProps } from 'react';
import { cn } from '../../../utils';
import { iconVariants } from './iconVariants';

const Svg = (props: SVGProps<SVGSVGElement>) => (
	<svg
		className="w-20 h-20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-labelledby="cart-title"
		{...props}
	>
		<title id="cart-title">Cart Icon</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.5 3.46836C2.5 3.20969 2.72366 3 2.99955 3H5.16925C5.88938 3 6.5077 3.48022 6.64172 4.14359L8.33188 12.5093C8.37655 12.7304 8.58266 12.8905 8.8227 12.8905H16.987C17.2629 12.8905 17.4866 13.1002 17.4866 13.3589C17.4866 13.6175 17.2629 13.8272 16.987 13.8272H8.8227C8.10257 13.8272 7.48425 13.347 7.35023 12.6836L5.66007 4.31793C5.6154 4.0968 5.40929 3.93673 5.16925 3.93673H2.99955C2.72366 3.93673 2.5 3.72704 2.5 3.46836Z"
			fill="white"
		/>
		<path
			d="M18.0003 5.34182H6.40946L7.49564 10.8234H17.0736C17.3133 10.8234 17.5193 10.6637 17.5643 10.443L18.491 5.89813C18.5498 5.60942 18.3138 5.34182 18.0003 5.34182Z"
			fill="white"
		/>
		<path
			d="M10.0889 15.8559C10.0889 16.4878 9.54259 17 8.86866 17C8.19473 17 7.64841 16.4878 7.64841 15.8559C7.64841 15.2241 8.19473 14.7119 8.86866 14.7119C9.54259 14.7119 10.0889 15.2241 10.0889 15.8559Z"
			fill="white"
		/>
		<path
			d="M16.6268 15.8559C16.6268 16.4878 16.0804 17 15.4065 17C14.7326 17 14.1863 16.4878 14.1863 15.8559C14.1863 15.2241 14.7326 14.7119 15.4065 14.7119C16.0804 14.7119 16.6268 15.2241 16.6268 15.8559Z"
			fill="white"
		/>
	</svg>
);

const SvgCartIcon = ({ className, size = 'sm', ...props }: IconProps) => (
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

export default SvgCartIcon;
