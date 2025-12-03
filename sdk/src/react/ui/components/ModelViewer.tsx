import { Skeleton } from '@0xsequence/design-system';
import { lazy, Suspense } from 'react';

const ModelViewerComponent = lazy(() =>
	import('@google/model-viewer').then(() => ({
		default: ({
			posterSrc,
			src,
			onLoad,
			onError,
		}: {
			posterSrc: string;
			src?: string;
			onLoad?: () => void;
			onError?: () => void;
		}) => (
			<div className="h-full w-full bg-background-raised">
				{/* @ts-expect-error - This is a web component */}
				<model-viewer
					alt="3d model"
					auto-rotate
					autoplay
					camera-controls
					class="h-full w-full"
					error={onError}
					load={onLoad}
					loading="eager"
					poster={posterSrc}
					reveal="auto"
					shadow-intensity="1"
					src={src}
					touch-action="pan-y"
				/>
			</div>
		),
	})),
);

const ModelViewerLoading = () => <Skeleton className="h-full w-full" />;

const ModelViewer = (props: {
	posterSrc: string;
	src?: string;
	onLoad?: () => void;
	onError?: () => void;
}) => {
	return (
		<Suspense fallback={<ModelViewerLoading />}>
			<ModelViewerComponent {...props} />
		</Suspense>
	);
};

export default ModelViewer;
