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
	const isGltf = /.*\.gltf$/.test(fileName?.toLowerCase() || '');
	return isGltf;
};

export const getContentType = (
	url: string,
): Promise<'image' | 'video' | 'html' | null> => {
	return new Promise((resolve) => {
		const type = isHtml(url)
			? 'html'
			: isVideo(url)
				? 'video'
				: isImage(url)
					? 'image'
					: null;
		resolve(type);
	});
};
