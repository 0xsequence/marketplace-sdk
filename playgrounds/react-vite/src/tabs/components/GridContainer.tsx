import {
	type ComponentPropsWithRef,
	type ForwardedRef,
	forwardRef,
} from 'react';

type VirtuosoGridListProps = ComponentPropsWithRef<'div'>;

export const GridContainer = forwardRef(
	(props: VirtuosoGridListProps, ref: ForwardedRef<HTMLDivElement>) => {
		const { className, style, ...otherProps } = props;

		return (
			<div
				className={`grid w-full grid-cols-2 items-start gap-2 pr-2 [&>*]:min-w-[175px] [@media(min-width:606px)]:grid-cols-3 [@media(min-width:800px)]:grid-cols-4 ${className || ''}`}
				style={style}
				ref={ref}
				{...otherProps}
			/>
		);
	},
);

GridContainer.displayName = 'GridContainer';
