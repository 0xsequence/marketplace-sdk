'use client';

import { ChevronDownIcon, cn } from '@0xsequence/design-system';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';

const Accordion = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Root
		ref={ref}
		className={cn('flex w-full flex-col gap-2', className)}
		{...props}
	/>
));
Accordion.displayName = 'AccordionRoot';

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item
		ref={ref}
		className={cn(
			'py-2.5',
			'cursor-pointer rounded-md ring-offset-background-primary focus-within:outline-hidden',
			className,
		)}
		{...props}
	/>
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				'flex flex-1 cursor-pointer items-center justify-between transition-all [&[data-state=open]>svg]:rotate-180',
				'font-medium text-secondary text-xs outline-hidden focus:outline-hidden',
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDownIcon className="h-4 w-4 fill-inherit stroke-inherit transition-transform duration-200" />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className={cn(
			'overflow-hidden py-2 text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
			className,
		)}
		style={{
			maxHeight: 200,
			overflowY: 'auto',
		}}
		{...props}
	>
		<div className="py-0">{children}</div>
	</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
