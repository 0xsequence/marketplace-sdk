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
	className?: string;
	isLoading?: boolean;
};

export type { ContentType, ContentTypeState, MediaProps };
