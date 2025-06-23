'use client'

import type { FrameworkDependencies, LinkProps, ImageProps, RouterHook, SearchParamsHook } from '../di/types'
import NextLink from 'next/link'
import NextImage from 'next/image'
import { useRouter as useNextRouter, usePathname as useNextPathname, useSearchParams as useNextSearchParams } from 'next/navigation'
import React from 'react'

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
	({ href, children, className, onClick, target, rel, prefetch, replace, scroll, shallow, passHref, legacyBehavior, ...props }, ref) => {
		return (
			<NextLink
				ref={ref}
				href={href}
				className={className}
				onClick={onClick}
				target={target}
				rel={rel}
				prefetch={prefetch}
				replace={replace}
				scroll={scroll}
				shallow={shallow}
				passHref={passHref}
				legacyBehavior={legacyBehavior}
				{...props}
			>
				{children}
			</NextLink>
		)
	}
)
Link.displayName = 'NextLinkAdapter'

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
	({ src, alt, width, height, className, loading, priority, quality, placeholder, blurDataURL, onLoad, onError, sizes, fill, style, ...props }, ref) => {
		return (
			<NextImage
				ref={ref}
				src={src}
				alt={alt}
				width={width as number}
				height={height as number}
				className={className}
				loading={loading}
				priority={priority}
				quality={quality}
				placeholder={placeholder}
				blurDataURL={blurDataURL}
				onLoad={onLoad}
				onError={onError}
				sizes={sizes}
				fill={fill}
				style={style}
				{...props}
			/>
		)
	}
)
Image.displayName = 'NextImageAdapter'

function useRouter(): RouterHook {
	const router = useNextRouter()
	
	return {
		push: (href: string) => router.push(href),
		replace: (href: string) => router.replace(href),
		back: () => router.back(),
		forward: () => router.forward(),
		refresh: () => router.refresh(),
		prefetch: (href: string) => router.prefetch(href),
	}
}

function useSearchParams(): SearchParamsHook {
	const searchParams = useNextSearchParams()
	const router = useNextRouter()
	const pathname = useNextPathname()
	
	return {
		get: (key: string) => searchParams.get(key),
		getAll: (key: string) => searchParams.getAll(key),
		has: (key: string) => searchParams.has(key),
		set: (key: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(key, value)
			router.push(`${pathname}?${params.toString()}`)
		},
		delete: (key: string) => {
			const params = new URLSearchParams(searchParams.toString())
			params.delete(key)
			router.push(`${pathname}?${params.toString()}`)
		},
		toString: () => searchParams.toString(),
	}
}

function usePathname(): string {
	return useNextPathname()
}

export const nextjsDependencies: FrameworkDependencies = {
	Link,
	useRouter,
	useSearchParams,
	usePathname,
	Image,
}