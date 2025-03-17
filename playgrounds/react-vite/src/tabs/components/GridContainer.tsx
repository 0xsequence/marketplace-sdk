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
				className={`grid w-full pr-2 gap-2 items-start
          grid-cols-2 
          [@media(min-width:606px)]:grid-cols-3
          [@media(min-width:800px)]:grid-cols-4
          [&>*]:min-w-[175px]
          ${className || ''}`}
				style={style}
				ref={ref}
				{...otherProps}
			/>
		);
	},
);

GridContainer.displayName = 'GridContainer';
