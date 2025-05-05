import '@google/model-viewer';

const ModelViewer = ({
	posterSrc,
	src,
	onLoad,
	onError,
}: {
	posterSrc: string;
	src?: string;
	onLoad?: () => void;
	onError?: () => void;
}) => {
	return (
		<div className="h-full bg-background-raised">
			{/* @ts-expect-error - This is a web component */}
			<model-viewer
				alt="3d model"
				class="h-full w-full"
				auto-rotate
				camera-controls
				loading="eager"
				reveal="auto"
				src={src}
				poster={posterSrc}
				autoplay
				shadow-intensity="1"
				touch-action="pan-y"
				load={onLoad}
				error={onError}
			/>
		</div>
	);
};

export default ModelViewer;
