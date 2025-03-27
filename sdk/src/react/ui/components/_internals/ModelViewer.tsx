import '@google/model-viewer';

const ModelViewer = ({
	posterSrc,
	src,
}: {
	posterSrc: string;
	src?: string;
}) => {
	return (
		<div className="bg-background-raised">
			{/* @ts-expect-error - This is a web component, somehow it's causing a type error */}
			<model-viewer
				alt="3d model"
				auto-rotate
				camera-controls
				loading="eager"
				reveal="auto"
				src={src}
				poster={posterSrc}
				autoplay
				shadow-intensity="1"
				touch-action="pan-y"
			/>
		</div>
	);
};

export default ModelViewer;
