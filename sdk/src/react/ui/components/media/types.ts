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
	containerClassName?: string;
	mediaClassname?: string;
	isLoading?: boolean;
	fallbackContent?: ReactNode;
	shouldListenForLoad?: boolean;
};

export type { ContentType, ContentTypeState, MediaProps };
