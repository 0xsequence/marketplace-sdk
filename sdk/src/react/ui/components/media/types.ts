import type { ReactNode } from 'react';

type ContentType = 'image' | 'video' | 'html' | '3d-model' | null;

type ContentTypeState = {
	type: ContentType;
	loading: boolean;
	failed: boolean;
};

type MediaProps = {
	name?: string;
	assets: (string | undefined)[];
	assetSrcPrefixUrl?: string;
	/**
	 * @deprecated Use containerClassName instead
	 */
	className?: string;
	containerClassName?: string;
	mediaClassname?: string;
	isLoading?: boolean;
	fallbackContent?: ReactNode;
};

export type { ContentType, ContentTypeState, MediaProps };
