export const isImage = (fileName: string | undefined) => {
	const isImage = /.*\.(png|jpg|jpeg|gif|svg|webp)$/.test(
		fileName?.toLowerCase() || '',
	);
	return isImage;
};

export const isHtml = (fileName: string | undefined) => {
	const isHtml = /.*\.(html\?.+|html)$/.test(fileName?.toLowerCase() || '');
	return isHtml;
};

export const isVideo = (fileName: string | undefined) => {
	const isVideo = /.*\.(mp4|ogg|webm)$/.test(fileName?.toLowerCase() || '');
	return isVideo;
};

export const is3dModel = (fileName: string | undefined) => {
	const is3dFile = /.*\.(gltf|glb|obj|fbx|stl|usdz)$/.test(
		fileName?.toLowerCase() || '',
	);
	return is3dFile;
};

export const getContentType = (
	url: string | undefined,
): Promise<'image' | 'video' | 'html' | '3d-model' | null> => {
	return new Promise((resolve, reject) => {
		const type = isHtml(url)
			? 'html'
			: isVideo(url)
				? 'video'
				: isImage(url)
					? 'image'
					: is3dModel(url)
						? '3d-model'
						: null;

		if (type) {
			resolve(type);
		} else {
			reject(new Error('Unsupported file type'));
		}
	});
};
